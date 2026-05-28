import { useEffect, useRef, useState, useCallback } from 'react'
import { FORMATS } from '../lib/brandConfig.js'
import { loadBrandFonts, getSpeakerBannerObjects } from '../lib/fabricTemplates.js'

const HISTORY_LIMIT = 30

export function useFabricCanvas(canvasRef, config, onCanvasReady) {
  const fabricRef    = useRef(null)  // fabric.Canvas instance
  const fabricLib    = useRef(null)  // fabric module
  const [ready, setReady]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const historyRef   = useRef([])
  const historyIdx   = useRef(-1)
  const isRebuildRef = useRef(false)

  const dims = FORMATS.find(f => f.id === config.format) ?? FORMATS[0]

  // ── Initialize Fabric.js ──────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return

    let cancelled = false

    async function init() {
      try {
        // Dynamic import keeps Fabric.js in its own chunk
        const fabric = (await import('fabric')).fabric
        fabricLib.current = fabric

        await loadBrandFonts()

        if (cancelled) return

        const canvas = new fabric.Canvas(canvasRef.current, {
          width:              dims.w,
          height:             dims.h,
          selection:          true,
          preserveObjectStacking: true,
          backgroundColor:    '#1a0a20',
        })

        // Enforce lock rules on move
        canvas.on('object:moving', (e) => {
          const obj = e.target
          if (obj?.lockMovementX && obj?.lockMovementY) {
            obj.left = obj._stateProperties?.left ?? obj.oCoords?.tl?.x ?? obj.left
            obj.top  = obj._stateProperties?.top  ?? obj.oCoords?.tl?.y ?? obj.top
          }
        })

        // Block background click → will trigger BackgroundModal via event
        canvas.on('mouse:down', (e) => {
          if (e.target?.name === 'background') {
            canvas.discardActiveObject()
            canvas.fire('background:clicked')
          }
        })

        // Save history on modify
        canvas.on('object:modified', () => saveHistory(canvas))
        canvas.on('object:added',    () => {})

        fabricRef.current = canvas
        if (!cancelled) {
          setReady(true)
          onCanvasReady?.(canvas)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }

    init()
    return () => {
      cancelled = true
      if (fabricRef.current) {
        fabricRef.current.dispose()
        fabricRef.current = null
      }
      setReady(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef])

  // ── Rebuild canvas when canvasVersion changes ──────────────────────────
  useEffect(() => {
    if (!ready || !fabricRef.current || !fabricLib.current) return
    rebuildCanvas()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, config.canvasVersion])

  // ── Partial live updates (no full rebuild) ─────────────────────────────
  useEffect(() => {
    if (!ready || !fabricRef.current || isRebuildRef.current) return
    const canvas = fabricRef.current
    const updateText = (name, text) => {
      const obj = canvas.getObjects().find(o => o.name === name)
      if (obj && (obj.type === 'textbox' || obj.type === 'text') && obj.set) {
        obj.set({ text: text || ' ' })
        canvas.renderAll()
      }
    }
    // Common fields
    updateText('headline',        config.headline)
    updateText('tagline',         config.tagline)
    updateText('big-date',        config.bigDate)
    // Speaker info
    updateText('speaker-name-0',  config.speakers?.[0]?.name)
    updateText('speaker-title-0', config.speakers?.[0]?.title)
    updateText('speaker-org-0',   config.speakers?.[0]?.organization)
    // Member info
    updateText('member-name',     config.memberName)
    updateText('member-title',    config.memberTitle)
    updateText('member-org',      config.memberOrg)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, config.headline, config.tagline, config.bigDate, config.speakers,
      config.memberName, config.memberTitle, config.memberOrg])

  // ── Full canvas rebuild ────────────────────────────────────────────────
  const rebuildCanvas = useCallback(async () => {
    const canvas = fabricRef.current
    const fabric = fabricLib.current
    if (!canvas || !fabric) return

    isRebuildRef.current = true
    setLoading(true)

    try {
      canvas.clear()
      const objects = await getSpeakerBannerObjects(fabric, config, { w: dims.w, h: dims.h })
      for (const obj of objects) {
        if (obj) canvas.add(obj)
      }
      canvas.renderAll()
      saveHistory(canvas)
    } catch (err) {
      console.error('[Canvas] Rebuild error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
      isRebuildRef.current = false
    }
  }, [config, dims])

  // ── History (undo/redo) ────────────────────────────────────────────────
  const saveHistory = useCallback((canvas) => {
    if (!canvas) return
    const json = JSON.stringify(canvas.toJSON(['name', 'lockMovementX', 'lockMovementY', 'hasControls', 'hoverCursor']))
    // Truncate forward history
    historyRef.current = historyRef.current.slice(0, historyIdx.current + 1)
    historyRef.current.push(json)
    if (historyRef.current.length > HISTORY_LIMIT) historyRef.current.shift()
    historyIdx.current = historyRef.current.length - 1
  }, [])

  const undo = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas || historyIdx.current <= 0) return
    historyIdx.current -= 1
    canvas.loadFromJSON(historyRef.current[historyIdx.current], () => canvas.renderAll())
  }, [])

  const redo = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas || historyIdx.current >= historyRef.current.length - 1) return
    historyIdx.current += 1
    canvas.loadFromJSON(historyRef.current[historyIdx.current], () => canvas.renderAll())
  }, [])

  // ── Add a cue element to canvas ────────────────────────────────────────
  const addCue = useCallback(async (cueSrc) => {
    const canvas = fabricRef.current
    const fabric = fabricLib.current
    if (!canvas || !fabric) return
    try {
      // data: URLs are same-origin — crossOrigin header causes failures in some browsers
      const opts = cueSrc.startsWith('data:') ? {} : { crossOrigin: 'anonymous' }
      const img = await new Promise((resolve, reject) => {
        fabric.Image.fromURL(cueSrc, (i) => i ? resolve(i) : reject(new Error('Image load failed')), opts)
      })
      const size = Math.round(Math.min(dims.w, dims.h) * 0.18)
      img.scaleToWidth(size)
      img.set({
        name: `cue-${Date.now()}`,
        left: dims.w / 2 - (img.width * img.scaleX) / 2,
        top:  dims.h / 2 - (img.height * img.scaleY) / 2,
        lockMovementX: false, lockMovementY: false, hasControls: true,
      })
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
      saveHistory(canvas)
    } catch (err) { console.error('[Canvas] addCue failed:', err) }
  }, [dims, saveHistory])

  // ── Add image with optional shape clip ───────────────────────────────────
  const addImageWithShape = useCallback(async (src, shape = 'free') => {
    const canvas = fabricRef.current
    const fabric = fabricLib.current
    if (!canvas || !fabric) return
    try {
      const opts = src.startsWith('data:') ? {} : { crossOrigin: 'anonymous' }
      const img = await new Promise((resolve, reject) => {
        fabric.Image.fromURL(src, (i) => i ? resolve(i) : reject(new Error('Image load failed')), opts)
      })
      const maxSide = Math.round(Math.min(dims.w, dims.h) * 0.35)
      const scale   = maxSide / Math.max(img.width, img.height)
      img.set({ scaleX: scale, scaleY: scale })
      const w = img.width  * scale
      const h = img.height * scale

      if (shape === 'circle') {
        const r = Math.min(w, h) / (2 * scale)
        img.set({ clipPath: new fabric.Circle({ radius: r, originX: 'center', originY: 'center' }) })
      } else if (shape === 'rounded') {
        img.set({ clipPath: new fabric.Rect({
          width: img.width, height: img.height,
          rx: 24 / scale, ry: 24 / scale, originX: 'center', originY: 'center',
        }) })
      } else if (shape === 'square') {
        const side = Math.min(img.width, img.height)
        img.set({ clipPath: new fabric.Rect({
          width: side, height: side, originX: 'center', originY: 'center',
        }) })
      }

      img.set({
        name: `image-${Date.now()}`,
        left: dims.w / 2 - w / 2,
        top:  dims.h / 2 - h / 2,
        lockMovementX: false, lockMovementY: false, hasControls: true,
      })
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
      saveHistory(canvas)
    } catch (err) { console.error('[Canvas] addImageWithShape failed:', err) }
  }, [dims, saveHistory])

  // ── Add native Fabric.js shape ────────────────────────────────────────────
  const addShape = useCallback((shapeDef) => {
    const canvas = fabricRef.current
    const fabric = fabricLib.current
    if (!canvas || !fabric) return

    const baseH = Math.round(Math.min(dims.w, dims.h) * 0.22)
    const ar    = shapeDef.aspectRatio ?? 1
    const w     = Math.min(Math.round(baseH * ar), Math.round(dims.w * 0.55))
    const h     = baseH

    let obj
    if (shapeDef.fabricType === 'circle') {
      obj = new fabric.Circle({ radius: Math.round(baseH / 2), ...shapeDef.fabricConfig })
    } else if (shapeDef.fabricType === 'rect') {
      obj = new fabric.Rect({ width: w, height: h, ...shapeDef.fabricConfig })
    }
    if (!obj) return

    const objW = shapeDef.fabricType === 'circle' ? baseH : w
    const objH = baseH
    obj.set({
      name: `shape-${Date.now()}`,
      left: Math.round(dims.w / 2 - objW / 2),
      top:  Math.round(dims.h / 2 - objH / 2),
      lockMovementX: false, lockMovementY: false, lockRotation: false,
      lockScalingX: false, lockScalingY: false, hasControls: true,
    })
    canvas.add(obj)
    canvas.setActiveObject(obj)
    canvas.renderAll()
    saveHistory(canvas)
  }, [dims, saveHistory])

  // ── Delete selected element ────────────────────────────────────────────
  const deleteSelected = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (!obj) return
    // Don't delete locked structural elements
    const locked = ['background', 'bg-overlay', 'hawee-logo', 'divider']
    if (locked.includes(obj.name)) return
    canvas.remove(obj)
    canvas.discardActiveObject()
    canvas.renderAll()
    saveHistory(canvas)
  }, [saveHistory])

  return {
    canvas:    fabricRef.current,
    fabricRef,
    ready,
    loading,
    error,
    dims,
    undo,
    redo,
    addCue,
    addImageWithShape,
    addShape,
    deleteSelected,
    rebuildCanvas,
    canUndo: historyIdx.current > 0,
    canRedo: historyRef.current.length > 0 && historyIdx.current < historyRef.current.length - 1,
  }
}
