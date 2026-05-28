// ─── Fabric.js Banner Templates ─────────────────────────────────────────────
import { COLORS, FONTS, FORMATS, AURAS, FUTURISTIC_BACKGROUNDS, HAWEE_LOGOS, CHI_HOI } from './brandConfig.js'

// ─── Font preload ─────────────────────────────────────────────────────────────
export async function loadBrandFonts() {
  try {
    const f600 = new FontFace('MonaSans', 'url(/brand/fonts/MonaSans_Condensed-SemiBold.ttf)', { weight: '600' })
    const f400 = new FontFace('MonaSans', 'url(/brand/fonts/MonaSans_SemiExpanded-Medium.ttf)', { weight: '400' })
    const loaded = await Promise.race([
      Promise.all([f600.load(), f400.load()]),
      new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 5000)),
    ]).catch(() => null)
    if (loaded) { document.fonts.add(loaded[0]); document.fonts.add(loaded[1]) }
  } catch { console.warn('[HAWEE] MonaSans failed — using fallback') }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function loadFabricImage(fabric, url, options = {}) {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(url, (img) => {
      if (img) { Object.assign(img, options); resolve(img) }
      else reject(new Error(`Failed: ${url}`))
    }, { crossOrigin: 'anonymous' })
  })
}

function zoneLocked(overrides = {}) {
  return { lockMovementX: true, lockMovementY: true, lockRotation: true,
           lockScalingX: true, lockScalingY: true, hasControls: false,
           hasBorders: false, hoverCursor: 'default', ...overrides }
}

function bgLocked() {
  return { ...zoneLocked(), selectable: false, evented: false }
}

function sf(dims) { return { x: dims.w / 1080, y: dims.h / 1080 } }

// ─── Pre-crop image to circle using Canvas 2D API ────────────────────────────
async function cropToCircle(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const size = Math.min(img.width, img.height)
      const offscreen = document.createElement('canvas')
      offscreen.width = size
      offscreen.height = size
      const ctx = offscreen.getContext('2d')
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(img, -(img.width - size) / 2, -(img.height - size) / 2, img.width, img.height)
      resolve(offscreen.toDataURL('image/png'))
    }
    img.onerror = () => resolve(null)
    img.src = dataUrl
  })
}

// ─── Gradient background (futuristic) ────────────────────────────────────────
function buildFuturisticGradient(fabric, bgConfig, dims) {
  const objects = []

  // Base solid color
  objects.push(new fabric.Rect({
    name: 'background', left: 0, top: 0, width: dims.w, height: dims.h,
    fill: bgConfig.base ?? '#050010',
    ...bgLocked(),
  }))

  // Layered gradient overlays
  for (let i = 0; i < (bgConfig.layers ?? []).length; i++) {
    const layer = bgConfig.layers[i]
    let gradCoords
    let fabricGradient

    if (layer.type === 'radial') {
      const cx = layer.coords.cx * dims.w
      const cy = layer.coords.cy * dims.h
      const r  = layer.coords.r  * Math.max(dims.w, dims.h)
      fabricGradient = new fabric.Gradient({
        type: 'radial', gradientUnits: 'pixels',
        coords: { r1: 0, r2: r, x1: cx, y1: cy, x2: cx, y2: cy },
        colorStops: layer.stops,
      })
    } else {
      // linear
      fabricGradient = new fabric.Gradient({
        type: 'linear', gradientUnits: 'pixels',
        coords: {
          x1: layer.coords.x1 * dims.w, y1: layer.coords.y1 * dims.h,
          x2: layer.coords.x2 * dims.w, y2: layer.coords.y2 * dims.h,
        },
        colorStops: layer.stops,
      })
    }

    objects.push(new fabric.Rect({
      name: i === 0 ? 'bg-overlay' : `bg-layer-${i}`,
      left: 0, top: 0, width: dims.w, height: dims.h,
      fill: fabricGradient,
      ...bgLocked(),
    }))
  }

  return objects
}

// ─── Background (returns array) ───────────────────────────────────────────────
async function buildBackground(fabric, config, dims) {
  const { mode, backgroundId, backgroundCustomUrl } = config

  if (mode === 'futuristic') {
    const found = FUTURISTIC_BACKGROUNDS.find(b => b.id === backgroundId)
      ?? FUTURISTIC_BACKGROUNDS[0]

    // Image-type futuristic backgrounds (Freepik photos)
    if (found.type === 'image' && found.src) {
      try {
        const img = await loadFabricImage(fabric, found.src, { name: 'background', left: 0, top: 0, ...bgLocked() })
        const scale = Math.max(dims.w / img.width, dims.h / img.height)
        img.set({ scaleX: scale, scaleY: scale })
        img.set({ left: (dims.w - img.width * scale) / 2, top: (dims.h - img.height * scale) / 2 })

        // Dark vignette overlay — improves text readability on photos
        const overlay = new fabric.Rect({
          name: 'bg-overlay', left: 0, top: 0, width: dims.w, height: dims.h,
          fill: new fabric.Gradient({
            type: 'radial', gradientUnits: 'pixels',
            coords: { r1: 0, r2: Math.max(dims.w, dims.h) * 0.75,
                      x1: dims.w * 0.5, y1: dims.h * 0.5,
                      x2: dims.w * 0.5, y2: dims.h * 0.5 },
            colorStops: [
              { offset: 0,   color: 'rgba(0,0,0,0.10)' },
              { offset: 0.5, color: 'rgba(0,0,0,0.30)' },
              { offset: 1,   color: 'rgba(0,0,0,0.62)' },
            ],
          }),
          ...bgLocked(),
        })
        return [img, overlay]
      } catch {
        // Fallback: use solid dark background
        return [new fabric.Rect({
          name: 'background', left: 0, top: 0, width: dims.w, height: dims.h,
          fill: '#0a0612', ...bgLocked(),
        })]
      }
    }

    // Gradient-type futuristic (legacy fallback)
    return buildFuturisticGradient(fabric, found, dims)
  }

  let url = null
  if (mode === 'aura') {
    url = (AURAS.find(a => a.id === backgroundId) ?? AURAS[0]).src
  } else if (mode === 'photo') {
    url = backgroundCustomUrl ?? AURAS[0].src
  }

  if (!url) return []

  try {
    const img = await loadFabricImage(fabric, url, { name: 'background', left: 0, top: 0, ...bgLocked() })
    const scale = Math.max(dims.w / img.width, dims.h / img.height)
    img.set({ scaleX: scale, scaleY: scale })
    // center if needed
    img.set({ left: (dims.w - img.width * scale) / 2, top: (dims.h - img.height * scale) / 2 })
    return [img]
  } catch {
    // Fallback gradient rect
    return [new fabric.Rect({
      name: 'background', left: 0, top: 0, width: dims.w, height: dims.h,
      fill: new fabric.Gradient({
        type: 'radial', gradientUnits: 'pixels',
        coords: { r1: 0, r2: dims.w, x1: dims.w * 0.3, y1: dims.h * 0.3, x2: dims.w * 0.3, y2: dims.h * 0.3 },
        colorStops: [
          { offset: 0, color: '#E83A78' }, { offset: 0.5, color: '#C9187F' }, { offset: 1, color: '#50002F' },
        ],
      }),
      ...bgLocked(),
    })]
  }
}

// ─── Zone panels (semi-transparent overlay for text legibility) ───────────────
function buildLeftPanel(fabric, dims, widthFrac = 0.52) {
  const w = Math.round(dims.w * widthFrac)
  return new fabric.Rect({
    name: 'left-panel', left: 0, top: 0, width: w, height: dims.h,
    fill: new fabric.Gradient({
      type: 'linear', gradientUnits: 'pixels',
      coords: { x1: 0, y1: 0, x2: w, y2: 0 },
      colorStops: [
        { offset: 0,   color: 'rgba(0,0,0,0.55)' },
        { offset: 0.6, color: 'rgba(0,0,0,0.3)' },
        { offset: 1,   color: 'rgba(0,0,0,0)' },
      ],
    }),
    ...bgLocked(),
  })
}

function buildRightPanel(fabric, dims, xStart = 0.52) {
  const left = Math.round(dims.w * xStart)
  const w    = dims.w - left
  return new fabric.Rect({
    name: 'right-panel', left, top: 0, width: w, height: dims.h,
    fill: new fabric.Gradient({
      type: 'linear', gradientUnits: 'pixels',
      coords: { x1: 0, y1: 0, x2: w, y2: 0 },
      colorStops: [
        { offset: 0,   color: 'rgba(0,0,0,0)' },
        { offset: 0.4, color: 'rgba(0,0,0,0.2)' },
        { offset: 1,   color: 'rgba(0,0,0,0.45)' },
      ],
    }),
    ...bgLocked(),
  })
}

// ─── HAWEE logo ───────────────────────────────────────────────────────────────
async function buildHaweeLogo(fabric, config, dims) {
  const s  = sf(dims)
  const lg = HAWEE_LOGOS.find(l => l.id === (config.logoId ?? 'horizontal-en')) ?? HAWEE_LOGOS[0]
  try {
    const img = await loadFabricImage(fabric, lg.src, {
      name: 'hawee-logo', left: Math.round(60 * s.x), top: Math.round(60 * s.y),
      ...zoneLocked({ hasControls: true, hasBorders: false, lockScalingX: false, lockScalingY: false }),
    })
    img.scaleToHeight(Math.round(52 * s.y))
    return img
  } catch {
    return new fabric.Text('HAWEE', {
      name: 'hawee-logo', left: Math.round(60 * s.x), top: Math.round(60 * s.y),
      fontSize: Math.round(40 * s.y), fontFamily: 'MonaSans', fontWeight: '600',
      fill: '#FFFFFF', ...zoneLocked(),
    })
  }
}

// ─── Chi hội logo (use PNG for Fabric.js reliability) ────────────────────────
async function buildChiHoiLogo(fabric, config, dims, topOffset = 128) {
  if (config.chiHoiId === 'none') return null
  const s  = sf(dims)
  const ch = CHI_HOI.find(c => c.id === config.chiHoiId)
  // Prefer PNG over SVG — Fabric.js v5 has issues with external SVGs
  const logoSrc = ch?.logoPng ?? ch?.logo
  if (!logoSrc) return null
  try {
    const img = await loadFabricImage(fabric, logoSrc, {
      name: 'chihoi-logo', left: Math.round(60 * s.x), top: Math.round(topOffset * s.y),
      lockMovementX: false, lockMovementY: false, lockRotation: false,
      lockScalingX: false, lockScalingY: false, hasControls: true,
      hasBorders: true, hoverCursor: 'move',
    })
    img.scaleToHeight(Math.round(40 * s.y))
    return img
  } catch { return null }
}

// ─── Badge pill ───────────────────────────────────────────────────────────────
function buildBadgePill(fabric, config, dims, top = 185) {
  if (!config.badgeText && !config.programName) return null
  const s     = sf(dims)
  const label = (config.badgeText || config.programName).toUpperCase()
  const fontSize = Math.round(15 * s.y)
  const text = new fabric.Text(label, {
    fontFamily: 'MonaSans', fontWeight: '600', fontSize, fill: COLORS.accent, charSpacing: 80,
  })
  const pad = Math.round(14 * s.x)
  const rect = new fabric.Rect({
    width: text.width + pad * 2, height: text.height + pad,
    rx: Math.round(20 * s.y), ry: Math.round(20 * s.y),
    fill: 'rgba(201,24,127,0.18)', stroke: 'rgba(201,24,127,0.55)', strokeWidth: 1.5, left: 0, top: 0,
  })
  text.set({ left: pad, top: pad / 2 })
  return new fabric.Group([rect, text], {
    name: 'badge-pill', left: Math.round(60 * s.x), top: Math.round(top * s.y),
    ...zoneLocked({ hasControls: true }),
  })
}

// ─── Headline ─────────────────────────────────────────────────────────────────
function buildHeadline(fabric, config, dims, top = 240, width = 470) {
  const s = sf(dims)
  return new fabric.Textbox(config.headline || 'Tên sự kiện', {
    name: 'headline',
    left: Math.round(60 * s.x), top: Math.round(top * s.y),
    width: Math.round(width * s.x),
    fontSize: Math.round(64 * s.y), fontFamily: 'MonaSans', fontWeight: '600',
    fill: COLORS.white, lineHeight: 1.18, charSpacing: -15,
    lockMovementX: false, lockMovementY: false, hasControls: true, hoverCursor: 'text',
  })
}

// ─── Tagline ──────────────────────────────────────────────────────────────────
function buildTagline(fabric, config, dims, top, width = 470) {
  if (!config.tagline) return null
  const s = sf(dims)
  return new fabric.Textbox(config.tagline, {
    name: 'tagline',
    left: Math.round(60 * s.x), top: Math.round(top * s.y),
    width: Math.round(width * s.x),
    fontSize: Math.round(22 * s.y), fontFamily: 'MonaSans', fontWeight: '400',
    fill: 'rgba(255,212,229,0.85)', lineHeight: 1.3,
    lockMovementX: false, lockMovementY: false, hasControls: true, hoverCursor: 'text',
  })
}

// ─── CTA Button ───────────────────────────────────────────────────────────────
function buildCTAButton(fabric, config, dims, left = 60, top = 570, width = 220) {
  if (!config.ctaText) return null
  const s        = sf(dims)
  const fontSize = Math.round(18 * s.y)
  const text     = new fabric.Text(config.ctaText, {
    fontFamily: 'MonaSans', fontWeight: '600', fontSize,
    fill: '#FFFFFF', charSpacing: 20, left: 0, top: 0,
  })
  const btnW  = Math.max(text.width + Math.round(36 * s.x), Math.round(width * s.x))
  const btnH  = text.height + Math.round(20 * s.y)
  const rect  = new fabric.Rect({
    width: btnW, height: btnH, rx: btnH / 2, ry: btnH / 2,
    fill: COLORS.primary,
    shadow: new fabric.Shadow({ color: 'rgba(201,24,127,0.5)', blur: Math.round(20 * s.x), offsetX: 0, offsetY: Math.round(4 * s.y) }),
    left: 0, top: 0,
  })
  text.set({ left: (btnW - text.width) / 2, top: Math.round(10 * s.y) })
  // Arrow indicator
  const arrow = new fabric.Text('→', {
    fontFamily: 'Arial', fontWeight: '700', fontSize: Math.round(16 * s.y),
    fill: 'rgba(255,255,255,0.7)',
    left: btnW - Math.round(30 * s.x), top: Math.round(10 * s.y),
  })
  return new fabric.Group([rect, text, arrow], {
    name: 'cta-button',
    left: Math.round(left * s.x), top: Math.round(top * s.y),
    ...zoneLocked({ hasControls: true, hasBorders: false, lockScalingX: false, lockScalingY: false }),
  })
}

// ─── Event info row ───────────────────────────────────────────────────────────
async function buildEventInfoRow(fabric, iconSvg, textContent, dims, left, top) {
  if (!textContent) return null
  const s        = sf(dims)
  const fontSize = Math.round(20 * s.y)

  const textObj = new fabric.Text(textContent, {
    left: Math.round(28 * s.x), top: 0,
    fontSize, fontFamily: 'MonaSans', fontWeight: '400', fill: 'rgba(255,255,255,0.88)',
  })
  let objects = [textObj]
  try {
    const icon = await loadFabricImage(fabric, iconSvg, { left: 0, top: 0 })
    icon.scaleToHeight(Math.round(20 * s.y))
    icon.set({ top: (textObj.height - icon.height * icon.scaleY) / 2 })
    objects = [icon, textObj]
    textObj.set({ left: Math.round((icon.width * icon.scaleX + 10) * s.x) })
  } catch { /* text-only fallback */ }

  return new fabric.Group(objects, {
    left: Math.round(left * s.x), top: Math.round(top * s.y),
    ...zoneLocked({ hasControls: true }),
  })
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function buildDivider(fabric, dims, x = 545) {
  const s = sf(dims)
  const xPx = Math.round(x * s.x)
  return new fabric.Line(
    [xPx, Math.round(70 * s.y), xPx, Math.round(1010 * s.y)],
    {
      name: 'divider',
      stroke: new fabric.Gradient({
        type: 'linear', gradientUnits: 'pixels',
        coords: { x1: 0, y1: Math.round(70 * s.y), x2: 0, y2: Math.round(1010 * s.y) },
        colorStops: [
          { offset: 0,   color: 'rgba(201,24,127,0)' },
          { offset: 0.15, color: 'rgba(201,24,127,0.5)' },
          { offset: 0.85, color: 'rgba(201,24,127,0.5)' },
          { offset: 1,   color: 'rgba(201,24,127,0)' },
        ],
      }),
      strokeWidth: 1,
      selectable: false, evented: false,
    }
  )
}

// ─── Speaker photo with glow frame ───────────────────────────────────────────
async function buildSpeakerPhoto(fabric, speaker, index, dims, cx, cy, radius) {
  const s  = sf(dims)
  const r  = Math.round(radius * Math.min(s.x, s.y))
  const cx_ = Math.round(cx * s.x)
  const cy_ = Math.round(cy * s.y)

  const glow = new fabric.Circle({
    radius: r + Math.round(12 * s.x), fill: 'transparent',
    shadow: new fabric.Shadow({ color: 'rgba(201,24,127,0.65)', blur: Math.round(55 * s.x), offsetX: 0, offsetY: 0 }),
    left: -(r + Math.round(12 * s.x)), top: -(r + Math.round(12 * s.x)),
  })

  const ring = new fabric.Circle({
    radius: r + Math.round(6 * s.x), fill: 'transparent',
    stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1.5,
    left: -(r + Math.round(6 * s.x)), top: -(r + Math.round(6 * s.x)),
  })

  const ring2 = new fabric.Circle({
    radius: r + Math.round(18 * s.x), fill: 'transparent',
    stroke: 'rgba(201,24,127,0.35)', strokeWidth: 1,
    strokeDashArray: [4, 6],
    left: -(r + Math.round(18 * s.x)), top: -(r + Math.round(18 * s.x)),
  })

  let photoObj = null
  if (speaker?.photoUrl) {
    try {
      // Pre-crop to circle via Canvas 2D — avoids unreliable clipPath-in-group behavior
      const croppedUrl = await cropToCircle(speaker.photoUrl)
      if (croppedUrl) {
        const img = await loadFabricImage(fabric, croppedUrl, {})
        const scale = (r * 2) / Math.max(img.width, img.height)
        img.set({ scaleX: scale, scaleY: scale, left: -r, top: -r })
        photoObj = img
      }
    } catch (err) {
      console.warn('[HAWEE] Speaker photo failed:', err)
      photoObj = null
    }
  }

  const placeholder = new fabric.Circle({
    radius: r, fill: 'rgba(201,24,127,0.22)',
    stroke: 'rgba(255,255,255,0.18)', strokeWidth: 1.5,
    left: -r, top: -r,
  })

  const group = new fabric.Group(
    [ring2, glow, ring, photoObj ?? placeholder].filter(Boolean), {
      name: `speaker-photo-${index}`,
      left: cx_ - r, top: cy_ - r,
      lockMovementX: false, lockMovementY: false, hasControls: true, hoverCursor: 'move',
    }
  )
  return group
}

// ─── Speaker label ────────────────────────────────────────────────────────────
function buildSpeakerLabel(fabric, text, dims, left, top, width = 360) {
  const s = sf(dims)
  return new fabric.Text(text, {
    name: 'speaker-label',
    left: Math.round(left * s.x), top: Math.round(top * s.y),
    width: Math.round(width * s.x),
    fontSize: Math.round(13 * s.y), fontFamily: 'MonaSans', fontWeight: '600',
    fill: 'rgba(251,96,148,0.85)', charSpacing: 250, textAlign: 'center',
    ...zoneLocked({ hasControls: true }),
  })
}

// ─── Speaker text ─────────────────────────────────────────────────────────────
function buildSpeakerText(fabric, speaker, index, dims, left, top, width = 400) {
  const s = sf(dims)
  const name = new fabric.Textbox(speaker.name || 'Tên diễn giả', {
    name: `speaker-name-${index}`,
    left: Math.round(left * s.x), top: Math.round(top * s.y),
    width: Math.round(width * s.x),
    fontSize: Math.round(26 * s.y), fontFamily: 'MonaSans', fontWeight: '600',
    fill: COLORS.white, textAlign: 'center',
    ...zoneLocked({ hasControls: true }),
  })
  const title = new fabric.Textbox(speaker.title || '', {
    name: `speaker-title-${index}`,
    left: Math.round(left * s.x), top: Math.round((top + 38) * s.y),
    width: Math.round(width * s.x),
    fontSize: Math.round(18 * s.y), fontFamily: 'MonaSans', fontWeight: '400',
    fill: 'rgba(255,255,255,0.75)', textAlign: 'center',
    ...zoneLocked({ hasControls: true }),
  })
  const org = new fabric.Textbox(speaker.organization || '', {
    name: `speaker-org-${index}`,
    left: Math.round(left * s.x), top: Math.round((top + 64) * s.y),
    width: Math.round(width * s.x),
    fontSize: Math.round(15 * s.y), fontFamily: 'MonaSans', fontWeight: '400',
    fill: 'rgba(255,212,229,0.85)', textAlign: 'center',
    ...zoneLocked({ hasControls: true }),
  })
  return [name, title, org]
}

// ─── Icon SVG strings (inline data URLs) ─────────────────────────────────────
const ICON_CALENDAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(251,96,148,0.9)" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
const ICON_CLOCK    = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(251,96,148,0.9)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
const ICON_MAP      = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(251,96,148,0.9)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`

// ─── SQUARE LAYOUT (1080×1080) ────────────────────────────────────────────────
async function squareLayout(fabric, config, dims) {
  const objects = []
  const speaker = config.speakers?.[0] ?? {}

  const hasBadge    = !!(config.badgeText || config.programName)
  const hasChiHoi   = config.chiHoiId !== 'none'
  const badgeTop    = hasChiHoi ? 186 : 138
  const headlineTop = badgeTop + (hasBadge ? 62 : 8)
  const taglineTop  = headlineTop + 200
  const ctaTop      = 560

  // 1. Background
  objects.push(...(await buildBackground(fabric, config, dims)))

  // 2. HAWEE logo
  const logo = await buildHaweeLogo(fabric, config, dims)
  if (logo) objects.push(logo)

  // 4. Chi hội logo
  const chiHoi = await buildChiHoiLogo(fabric, config, dims, 128)
  if (chiHoi) objects.push(chiHoi)

  // 5. Badge
  const badge = buildBadgePill(fabric, config, dims, badgeTop)
  if (badge) objects.push(badge)

  // 6. Headline
  objects.push(buildHeadline(fabric, config, dims, headlineTop, 460))

  // 7. Tagline
  const tagline = buildTagline(fabric, config, dims, taglineTop, 460)
  if (tagline) objects.push(tagline)

  // 8. Event info rows
  const infoTop = config.tagline ? taglineTop + 42 : headlineTop + 210
  const dateRow = await buildEventInfoRow(fabric, ICON_CALENDAR,
    config.date ? `${config.date}${config.time ? '  ·  ' + config.time : ''}` : null,
    dims, 60, infoTop)
  if (dateRow) { dateRow.name = 'event-date'; objects.push(dateRow) }

  const locRow = await buildEventInfoRow(fabric, ICON_MAP, config.location || null, dims, 60, infoTop + 40)
  if (locRow) { locRow.name = 'event-location'; objects.push(locRow) }

  // 9. CTA Button
  const cta = buildCTAButton(fabric, config, dims, 60, ctaTop, 230)
  if (cta) objects.push(cta)

  // 10. Divider
  objects.push(buildDivider(fabric, dims, 550))

  // 11. Speaker label
  objects.push(buildSpeakerLabel(fabric, 'KHÁCH MỜI ĐẶC BIỆT', dims, 570, 148, 460))

  // 12. Speaker photo
  const speakerPhoto = await buildSpeakerPhoto(fabric, speaker, 0, dims, 790, 385, 182)
  if (speakerPhoto) objects.push(speakerPhoto)

  // 13. Speaker info
  const speakerTexts = buildSpeakerText(fabric, speaker, 0, dims, 560, 610, 470)
  objects.push(...speakerTexts)

  return objects
}

// ─── LANDSCAPE LAYOUT (1200×628) ─────────────────────────────────────────────
async function landscapeLayout(fabric, config, dims) {
  const objects = []
  const speaker = config.speakers?.[0] ?? {}

  objects.push(...(await buildBackground(fabric, config, dims)))

  const logo = await buildHaweeLogo(fabric, config, dims)
  if (logo) objects.push(logo)

  const chiHoi = await buildChiHoiLogo(fabric, config, dims, 88)
  if (chiHoi) objects.push(chiHoi)

  const hasBadge = !!(config.badgeText || config.programName)
  const hasChiHoi = config.chiHoiId !== 'none'
  const badgeTop = hasChiHoi ? 140 : 110

  const badge = buildBadgePill(fabric, config, dims, badgeTop)
  if (badge) objects.push(badge)

  objects.push(buildHeadline(fabric, config, dims, badgeTop + (hasBadge ? 54 : 8), 490))

  // Event info at bottom-left
  const dateRow = await buildEventInfoRow(fabric, ICON_CALENDAR,
    config.date ? `${config.date}${config.time ? '  ·  ' + config.time : ''}` : null,
    dims, 48, 490)
  if (dateRow) { dateRow.name = 'event-date'; objects.push(dateRow) }

  const locRow = await buildEventInfoRow(fabric, ICON_MAP, config.location || null, dims, 48, 536)
  if (locRow) { locRow.name = 'event-location'; objects.push(locRow) }

  const cta = buildCTAButton(fabric, config, dims, 48, 570, 200)
  if (cta) objects.push(cta)

  objects.push(buildDivider(fabric, dims, 635))

  // Right zone
  objects.push(buildSpeakerLabel(fabric, 'KHÁCH MỜI ĐẶC BIỆT', dims, 660, 48, 500))
  const speakerPhoto = await buildSpeakerPhoto(fabric, speaker, 0, dims, 875, 310, 190)
  if (speakerPhoto) objects.push(speakerPhoto)
  const speakerTexts = buildSpeakerText(fabric, speaker, 0, dims, 645, 500, 500)
  objects.push(...speakerTexts)

  return objects
}

// ─── STORY LAYOUT (1080×1920) ─────────────────────────────────────────────────
async function storyLayout(fabric, config, dims) {
  const objects = []
  const speaker = config.speakers?.[0] ?? {}

  objects.push(...(await buildBackground(fabric, config, dims)))

  const logo = await buildHaweeLogo(fabric, config, dims)
  if (logo) objects.push(logo)

  const chiHoi = await buildChiHoiLogo(fabric, config, dims, 128)
  if (chiHoi) objects.push(chiHoi)

  // Speaker centered
  objects.push(buildSpeakerLabel(fabric, 'KHÁCH MỜI ĐẶC BIỆT', dims, 50, 210, 980))
  const speakerPhoto = await buildSpeakerPhoto(fabric, speaker, 0, dims, 540, 540, 238)
  if (speakerPhoto) objects.push(speakerPhoto)
  const speakerTexts = buildSpeakerText(fabric, speaker, 0, dims, 40, 820, 1000)
  objects.push(...speakerTexts)

  // Event info
  const hasBadge = !!(config.badgeText || config.programName)
  const badge = buildBadgePill(fabric, config, dims, 1050)
  if (badge) objects.push(badge)
  objects.push(buildHeadline(fabric, config, dims, hasBadge ? 1110 : 1060, 980))

  const dateRow = await buildEventInfoRow(fabric, ICON_CALENDAR,
    config.date ? `${config.date}${config.time ? '  ·  ' + config.time : ''}` : null,
    dims, 60, 1720)
  if (dateRow) { dateRow.name = 'event-date'; objects.push(dateRow) }

  const locRow = await buildEventInfoRow(fabric, ICON_MAP, config.location || null, dims, 60, 1776)
  if (locRow) { locRow.name = 'event-location'; objects.push(locRow) }

  const cta = buildCTAButton(fabric, config, dims, 60, 1840, 300)
  if (cta) objects.push(cta)

  return objects
}

// ─── Fixed Template Helpers ──────────────────────────────────────────────────
// For fixed templates: everything locked, only text inline-editable + photo slots clickable

function ftLocked() {
  // Structural/decorative — completely non-interactive
  return { selectable: false, evented: false }
}

function ftText(overrides = {}) {
  // Inline-editable text — locked in position, user can double-click to type
  return {
    selectable: true, evented: true,
    lockMovementX: true, lockMovementY: true, lockRotation: true,
    lockScalingX: true, lockScalingY: true,
    hasControls: false, hasBorders: false,
    editable: true, hoverCursor: 'text',
    ...overrides
  }
}

function ftPhotoSlot() {
  // Photo slot — locked in position, click to trigger swap via ElementPanel
  return {
    selectable: true, evented: true,
    lockMovementX: true, lockMovementY: true, lockRotation: true,
    lockScalingX: true, lockScalingY: true,
    hasControls: false, hasBorders: false,
    hoverCursor: 'pointer',
  }
}

// ─── Template 1: Speaker Event Square (1080×1080) ────────────────────────────
// EP Lunch / Workshop style — left zone info, right zone speaker
async function templateSpeakerEventSq(fabric, config, dims) {
  const objects = []
  const speaker = config.speakers?.[0] ?? {}

  // 1. Background
  objects.push(...(await buildBackground(fabric, config, dims)))

  // 2. HAWEE logo (top-left, locked)
  try {
    const logo = await buildHaweeLogo(fabric, config, dims)
    if (logo) { logo.set(ftLocked()); objects.push(logo) }
  } catch { /**/ }

  // 3. Chi hoi logo (locked)
  const chiHoi = await buildChiHoiLogo(fabric, config, dims, 125)
  if (chiHoi) { chiHoi.set(ftLocked()); objects.push(chiHoi) }

  // 4. Badge pill (locked)
  const badge = buildBadgePill(fabric, config, dims, 170)
  if (badge) { badge.set(ftLocked()); objects.push(badge) }

  // 5. Headline — inline editable
  objects.push(new fabric.Textbox(config.headline || 'Tiêu đề sự kiện', {
    name: 'headline',
    left: 55, top: 228, width: 462,
    fontSize: 64, fontFamily: 'MonaSans', fontWeight: '600',
    fill: COLORS.white, lineHeight: 1.18, charSpacing: -15,
    ...ftText(),
  }))

  // 6. Date + time row (locked)
  const dateStr = config.date ? `${config.date}${config.time ? '  ·  ' + config.time : ''}` : null
  const dateRow = await buildEventInfoRow(fabric, ICON_CALENDAR, dateStr, dims, 55, 570)
  if (dateRow) { dateRow.name = 'event-date'; dateRow.set(ftLocked()); objects.push(dateRow) }

  // 7. Location row (locked)
  const locRow = await buildEventInfoRow(fabric, ICON_MAP, config.location || null, dims, 55, 616)
  if (locRow) { locRow.name = 'event-location'; locRow.set(ftLocked()); objects.push(locRow) }

  // 8. Vertical divider
  objects.push(buildDivider(fabric, dims, 543))

  // 9. Speaker label (locked)
  const lbl = buildSpeakerLabel(fabric, 'KHÁCH MỜI ĐẶC BIỆT', dims, 572, 148, 452)
  lbl.set(ftLocked())
  objects.push(lbl)

  // 10. Speaker photo slot (click to swap)
  const photoGroup = await buildSpeakerPhoto(fabric, speaker, 0, dims, 790, 385, 182)
  if (photoGroup) {
    photoGroup.set({ name: 'photo-slot-speaker-0', ...ftPhotoSlot() })
    objects.push(photoGroup)
  }

  // 11–13. Speaker text (inline editable)
  objects.push(new fabric.Textbox(speaker.name || 'Tên diễn giả', {
    name: 'speaker-name-0', left: 562, top: 618, width: 462, textAlign: 'center',
    fontSize: 26, fontFamily: 'MonaSans', fontWeight: '600', fill: COLORS.white,
    ...ftText(),
  }))
  objects.push(new fabric.Textbox(speaker.title || '', {
    name: 'speaker-title-0', left: 562, top: 658, width: 462, textAlign: 'center',
    fontSize: 18, fontFamily: 'MonaSans', fontWeight: '400', fill: 'rgba(255,255,255,0.75)',
    ...ftText(),
  }))
  objects.push(new fabric.Textbox(speaker.organization || '', {
    name: 'speaker-org-0', left: 562, top: 686, width: 462, textAlign: 'center',
    fontSize: 15, fontFamily: 'MonaSans', fontWeight: '400', fill: 'rgba(255,212,229,0.85)',
    ...ftText(),
  }))

  return objects
}

// ─── Template 2: Welcome Member (1080×1080) ──────────────────────────────────
// Full-bleed portrait photo, bottom gradient overlay, member info
async function templateWelcomeMember(fabric, config, dims) {
  const objects = []
  const W = dims.w, H = dims.h

  // 1. Background (photo or aura fallback)
  objects.push(...(await buildBackground(fabric, config, dims)))

  // 2. Dark gradient overlay — bottom 65%
  objects.push(new fabric.Rect({
    name: 'bg-overlay',
    left: 0, top: Math.round(H * 0.32),
    width: W, height: Math.round(H * 0.68),
    fill: new fabric.Gradient({
      type: 'linear', gradientUnits: 'pixels',
      coords: { x1: 0, y1: 0, x2: 0, y2: Math.round(H * 0.68) },
      colorStops: [
        { offset: 0,   color: 'rgba(0,0,0,0)' },
        { offset: 0.3, color: 'rgba(0,0,0,0.55)' },
        { offset: 1,   color: 'rgba(0,0,0,0.92)' },
      ],
    }),
    selectable: false, evented: false,
  }))

  // 3. Pink accent line at bottom
  objects.push(new fabric.Rect({
    name: 'accent-line', left: 0, top: H - 8, width: W, height: 8,
    fill: COLORS.primary, selectable: false, evented: false,
  }))

  // 4. "Chào mừng hội viên mới" top-left label (locked)
  objects.push(new fabric.Text('CHÀO MỪNG HỘI VIÊN MỚI', {
    name: 'welcome-label', left: 55, top: 48,
    fontSize: 16, fontFamily: 'MonaSans', fontWeight: '600',
    fill: 'rgba(251,96,148,0.90)', charSpacing: 200,
    ...ftLocked(),
  }))

  // 5. Quarter / Year top-right (locked)
  if (config.quarter) {
    objects.push(new fabric.Text(config.quarter, {
      name: 'quarter-text', left: W - 55, top: 48,
      fontSize: 16, fontFamily: 'MonaSans', fontWeight: '400', fill: 'rgba(255,255,255,0.6)',
      textAlign: 'right', originX: 'right',
      ...ftLocked(),
    }))
  }

  // 6. HAWEE logo (bottom-right small, locked)
  try {
    const logo = await buildHaweeLogo(fabric, config, dims)
    if (logo) {
      logo.scaleToHeight(30)
      logo.set({ left: W - 55 - logo.width * logo.scaleX, top: H - 52, ...ftLocked() })
      objects.push(logo)
    }
  } catch { /**/ }

  // 7. Chi hoi logo (top-right below quarter, locked)
  const chiHoi = await buildChiHoiLogo(fabric, config, dims, 76)
  if (chiHoi) {
    chiHoi.scaleToHeight(32)
    chiHoi.set({ left: W - 55 - chiHoi.width * chiHoi.scaleX, top: 76, ...ftLocked() })
    objects.push(chiHoi)
  }

  // 8. Member name (editable)
  objects.push(new fabric.Textbox(config.memberName || 'Tên hội viên', {
    name: 'member-name', left: 55, top: 760, width: W - 110,
    fontSize: 68, fontFamily: 'MonaSans', fontWeight: '600',
    fill: COLORS.white, lineHeight: 1.12, charSpacing: -10,
    ...ftText(),
  }))

  // 9. Member title (editable)
  objects.push(new fabric.Textbox(config.memberTitle || '', {
    name: 'member-title', left: 55, top: 858, width: Math.round(W * 0.65),
    fontSize: 22, fontFamily: 'MonaSans', fontWeight: '400',
    fill: 'rgba(255,255,255,0.75)',
    ...ftText(),
  }))

  // 10. Member org (editable)
  objects.push(new fabric.Textbox(config.memberOrg || '', {
    name: 'member-org', left: 55, top: 892, width: Math.round(W * 0.65),
    fontSize: 18, fontFamily: 'MonaSans', fontWeight: '400',
    fill: 'rgba(251,96,148,0.85)',
    ...ftText(),
  }))

  return objects
}

// ─── Template 3: Event Photo Square (1080×1080) ──────────────────────────────
// Photo background with gradient overlay, event info stacked
async function templateEventPhotoSq(fabric, config, dims) {
  const objects = []
  const W = dims.w, H = dims.h

  // 1. Background (photo)
  objects.push(...(await buildBackground(fabric, config, dims)))

  // 2. Dark gradient overlay — bottom 58%
  objects.push(new fabric.Rect({
    name: 'bg-overlay',
    left: 0, top: Math.round(H * 0.38),
    width: W, height: Math.round(H * 0.62),
    fill: new fabric.Gradient({
      type: 'linear', gradientUnits: 'pixels',
      coords: { x1: 0, y1: 0, x2: 0, y2: Math.round(H * 0.62) },
      colorStops: [
        { offset: 0,   color: 'rgba(0,0,0,0)' },
        { offset: 0.25, color: 'rgba(10,6,18,0.65)' },
        { offset: 1,   color: 'rgba(10,6,18,0.96)' },
      ],
    }),
    selectable: false, evented: false,
  }))

  // 3. Top-left HAWEE logo (locked)
  try {
    const logo = await buildHaweeLogo(fabric, config, dims)
    if (logo) { logo.set(ftLocked()); objects.push(logo) }
  } catch { /**/ }

  // 4. Program badge pill (locked)
  const badge = buildBadgePill(fabric, config, dims, 55)
  if (badge) { badge.set(ftLocked()); objects.push(badge) }

  // 5. Headline (editable)
  objects.push(new fabric.Textbox(config.headline || 'Tiêu đề sự kiện', {
    name: 'headline', left: 55, top: 482, width: 900,
    fontSize: 58, fontFamily: 'MonaSans', fontWeight: '600',
    fill: COLORS.white, lineHeight: 1.2, charSpacing: -10,
    ...ftText(),
  }))

  // 6. Date + time row (locked)
  const dateStr = config.date ? `${config.date}${config.time ? '  ·  ' + config.time : ''}` : null
  const dateRow = await buildEventInfoRow(fabric, ICON_CALENDAR, dateStr, dims, 55, 668)
  if (dateRow) { dateRow.name = 'event-date'; dateRow.set(ftLocked()); objects.push(dateRow) }

  // 7. Location row (locked)
  const locRow = await buildEventInfoRow(fabric, ICON_MAP, config.location || null, dims, 55, 712)
  if (locRow) { locRow.name = 'event-location'; locRow.set(ftLocked()); objects.push(locRow) }

  // 8. Badge pill (registration info, locked)
  if (config.badgeText) {
    const regBadge = buildBadgePill(fabric, { ...config, programName: '', badgeText: config.badgeText }, dims, 760)
    if (regBadge) { regBadge.set(ftLocked()); objects.push(regBadge) }
  }

  // 9. Chi hoi logo (locked)
  const chiHoi = await buildChiHoiLogo(fabric, config, dims, 128)
  if (chiHoi) {
    chiHoi.set({ left: W - 55 - chiHoi.width * chiHoi.scaleX, top: 55, ...ftLocked() })
    objects.push(chiHoi)
  }

  return objects
}

// ─── Template 4: Coming Soon (1080×1080) ─────────────────────────────────────
// Teaser — centered big date, minimal composition
async function templateComingSoon(fabric, config, dims) {
  const objects = []
  const W = dims.w, H = dims.h
  const CX = W / 2

  // 1. Background (aura or futuristic)
  objects.push(...(await buildBackground(fabric, config, dims)))

  // 2. HAWEE logo centered top (locked)
  try {
    const logo = await buildHaweeLogo(fabric, config, dims)
    if (logo) {
      logo.scaleToHeight(50)
      logo.set({ left: CX - (logo.width * logo.scaleX) / 2, top: 55, ...ftLocked() })
      objects.push(logo)
    }
  } catch { /**/ }

  // 3. Chi hoi logo (right of HAWEE logo, locked)
  const chiHoi = await buildChiHoiLogo(fabric, config, dims, 62)
  if (chiHoi) {
    chiHoi.scaleToHeight(38)
    chiHoi.set({ left: W - 55 - chiHoi.width * chiHoi.scaleX, top: 62, ...ftLocked() })
    objects.push(chiHoi)
  }

  // 4. Horizontal separator below logo
  objects.push(new fabric.Line([CX - 180, 132, CX + 180, 132], {
    name: 'separator-top', stroke: 'rgba(201,24,127,0.45)', strokeWidth: 1,
    selectable: false, evented: false,
  }))

  // 5. Big date (centered, editable)
  objects.push(new fabric.Textbox(config.bigDate || '00.00', {
    name: 'big-date', left: 55, top: 240, width: W - 110, textAlign: 'center',
    fontSize: 192, fontFamily: 'MonaSans', fontWeight: '600',
    fill: COLORS.white, lineHeight: 1, charSpacing: -20,
    ...ftText(),
  }))

  // 6. Second separator
  objects.push(new fabric.Line([CX - 220, 538, CX + 220, 538], {
    name: 'separator-mid', stroke: 'rgba(201,24,127,0.45)', strokeWidth: 1,
    selectable: false, evented: false,
  }))

  // 7. Headline (centered, editable)
  objects.push(new fabric.Textbox(config.headline || 'Tên sự kiện', {
    name: 'headline', left: 55, top: 562, width: W - 110, textAlign: 'center',
    fontSize: 60, fontFamily: 'MonaSans', fontWeight: '600',
    fill: COLORS.white, lineHeight: 1.15, charSpacing: 80,
    ...ftText(),
  }))

  // 8. Tagline (centered, editable)
  objects.push(new fabric.Textbox(config.tagline || '', {
    name: 'tagline', left: 55, top: 644, width: W - 110, textAlign: 'center',
    fontSize: 52, fontFamily: 'MonaSans', fontWeight: '400',
    fill: COLORS.primary, lineHeight: 1.2,
    ...ftText(),
  }))

  // 9. Badge pill (bottom-left, locked)
  const badge = buildBadgePill(fabric, config, dims, 890)
  if (badge) { badge.set(ftLocked()); objects.push(badge) }

  return objects
}

// ─── Template 5: Connect Landscape (1280×720 or 1200×628) ───────────────────
// Widescreen banner — left text zone, right decorative zone
async function templateConnectLandscape(fabric, config, dims) {
  const objects = []
  const W = dims.w, H = dims.h
  const ML = Math.round(W * 0.043)   // left margin ≈ 55px at 1280
  const TW = Math.round(W * 0.52)    // text zone width ≈ 665px at 1280

  // 1. Background
  objects.push(...(await buildBackground(fabric, config, dims)))

  // 2. Left gradient overlay for readability
  objects.push(new fabric.Rect({
    name: 'left-overlay', left: 0, top: 0, width: Math.round(W * 0.72), height: H,
    fill: new fabric.Gradient({
      type: 'linear', gradientUnits: 'pixels',
      coords: { x1: 0, y1: 0, x2: Math.round(W * 0.72), y2: 0 },
      colorStops: [
        { offset: 0,   color: 'rgba(5,0,16,0.88)' },
        { offset: 0.55, color: 'rgba(5,0,16,0.6)' },
        { offset: 1,   color: 'rgba(5,0,16,0)' },
      ],
    }),
    selectable: false, evented: false,
  }))

  // 3. HAWEE logo (top-left, locked)
  try {
    const logo = await buildHaweeLogo(fabric, config, dims)
    if (logo) {
      logo.scaleToHeight(Math.round(H * 0.052))  // ≈38px at 720
      logo.set({ left: ML, top: Math.round(H * 0.048), ...ftLocked() })
      objects.push(logo)
    }
  } catch { /**/ }

  // 4. Program badge (right of logo, locked)
  if (config.programName) {
    const progFontSize = Math.round(H * 0.022)
    const progText = new fabric.Text(config.programName.toUpperCase(), {
      fontFamily: 'MonaSans', fontWeight: '600', fontSize: progFontSize,
      fill: COLORS.accent, charSpacing: 80,
    })
    const padX = Math.round(H * 0.018), padY = Math.round(H * 0.010)
    const progRect = new fabric.Rect({
      width: progText.width + padX * 2, height: progText.height + padY * 2,
      rx: 20, ry: 20,
      fill: 'rgba(201,24,127,0.18)', stroke: 'rgba(201,24,127,0.55)', strokeWidth: 1.5,
      left: 0, top: 0,
    })
    progText.set({ left: padX, top: padY })
    const progLogoH = Math.round(H * 0.052)
    objects.push(new fabric.Group([progRect, progText], {
      name: 'program-badge',
      left: ML + Math.round(W * 0.16),
      top:  Math.round(H * 0.048) + (progLogoH - (progText.height + padY * 2)) / 2,
      ...ftLocked(),
    }))
  }

  // 5. Headline (editable)
  const headlineTop = Math.round(H * 0.155)  // ≈112px at 720
  objects.push(new fabric.Textbox(config.headline || 'Tiêu đề chính', {
    name: 'headline', left: ML, top: headlineTop, width: TW,
    fontSize: Math.round(H * 0.115),  // ≈83px at 720
    fontFamily: 'MonaSans', fontWeight: '600',
    fill: COLORS.white, lineHeight: 1.15, charSpacing: -15,
    ...ftText(),
  }))

  // 6. Keyword pills row (locked)
  const tags = [config.tag1, config.tag2, config.tag3].filter(Boolean)
  if (tags.length > 0) {
    const tagTop = Math.round(H * 0.615)
    let tagLeft = ML
    for (const tag of tags) {
      const tFontSize = Math.round(H * 0.025)
      const tText = new fabric.Text(tag, {
        fontFamily: 'MonaSans', fontWeight: '600', fontSize: tFontSize,
        fill: COLORS.white, charSpacing: 40,
      })
      const tPad = Math.round(H * 0.018)
      const tRect = new fabric.Rect({
        width: tText.width + tPad * 2, height: tText.height + tPad,
        rx: 20, ry: 20,
        fill: 'rgba(255,255,255,0.12)', stroke: 'rgba(255,255,255,0.25)', strokeWidth: 1,
        left: 0, top: 0,
      })
      tText.set({ left: tPad, top: tPad / 2 })
      objects.push(new fabric.Group([tRect, tText], {
        name: `tag-pill-${tag}`, left: tagLeft, top: tagTop, ...ftLocked(),
      }))
      tagLeft += tText.width + tPad * 2 + Math.round(H * 0.014)
    }
  }

  // 7. Date + time row (locked)
  const infoTop1 = Math.round(H * 0.72)
  const dateStr = config.date ? `${config.date}${config.time ? '  ·  ' + config.time : ''}` : null
  if (dateStr) {
    const dr = await buildEventInfoRow(fabric, ICON_CALENDAR, dateStr, dims, ML / (dims.w / 1080), infoTop1 / (dims.h / 1080))
    if (dr) { dr.name = 'event-date'; dr.set(ftLocked()); objects.push(dr) }
  }

  // 8. Location row (locked)
  const infoTop2 = Math.round(H * 0.78)
  if (config.location) {
    const lr = await buildEventInfoRow(fabric, ICON_MAP, config.location, dims, ML / (dims.w / 1080), infoTop2 / (dims.h / 1080))
    if (lr) { lr.name = 'event-location'; lr.set(ftLocked()); objects.push(lr) }
  }

  // 9. Decorative vertical pink line (right side of text zone)
  objects.push(new fabric.Line(
    [TW + ML + Math.round(W * 0.02), Math.round(H * 0.1), TW + ML + Math.round(W * 0.02), Math.round(H * 0.9)],
    {
      name: 'divider', stroke: 'rgba(201,24,127,0.35)', strokeWidth: 1,
      selectable: false, evented: false,
    }
  ))

  // 10. Chi hoi logo (right zone, locked)
  const chiHoi = await buildChiHoiLogo(fabric, config, dims, H / 2 / (dims.h / 1080) - 30)
  if (chiHoi) {
    chiHoi.scaleToHeight(Math.round(H * 0.1))
    chiHoi.set({
      left: W - ML - chiHoi.width * chiHoi.scaleX,
      top: (H - chiHoi.height * chiHoi.scaleY) / 2,
      ...ftLocked(),
    })
    objects.push(chiHoi)
  }

  return objects
}

// ─── Unlock all non-background elements for free-edit wizard mode ─────────────
// Templates use ftLocked()/ftText()/ftPhotoSlot() — wizard mode unlocks everything
function unlockForFreeEdit(objects) {
  const BG_NAMES = new Set(['background', 'bg-overlay', 'left-panel', 'right-panel'])
  return objects.map(obj => {
    if (!obj) return obj
    const n = obj.name ?? ''
    // Background/panels — keep locked & non-selectable
    if (BG_NAMES.has(n) || n.startsWith('bg-layer-')) return obj
    // Everything else: fully interactive
    const isText = obj.type === 'textbox' || obj.type === 'text'
    obj.set({
      selectable:    true,
      evented:       true,
      lockMovementX: false,
      lockMovementY: false,
      lockRotation:  false,
      lockScalingX:  false,
      lockScalingY:  false,
      hasControls:   true,
      hasBorders:    true,
      hoverCursor:   isText ? 'text' : 'move',
    })
    if (isText) obj.set({ editable: true })
    return obj
  })
}

// ─── Entry ────────────────────────────────────────────────────────────────────
export async function getSpeakerBannerObjects(fabric, config, dims) {
  // Fixed template system — check templateId first
  if (config.templateId) {
    switch (config.templateId) {
      case 'speaker-event-sq':  return templateSpeakerEventSq(fabric, config, dims)
      case 'welcome-member':    return templateWelcomeMember(fabric, config, dims)
      case 'event-photo-sq':    return templateEventPhotoSq(fabric, config, dims)
      case 'coming-soon':       return templateComingSoon(fabric, config, dims)
      case 'connect-landscape': return templateConnectLandscape(fabric, config, dims)
    }
  }
  // Wizard / free-edit mode — build layout then unlock all non-background elements
  let objects
  switch (config.format) {
    case 'landscape':
    case 'widescreen': objects = await landscapeLayout(fabric, config, dims); break
    case 'story':      objects = await storyLayout(fabric, config, dims);     break
    default:           objects = await squareLayout(fabric, config, dims)
  }
  return unlockForFreeEdit(objects)
}
