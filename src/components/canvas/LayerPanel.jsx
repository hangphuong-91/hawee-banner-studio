import { useState, useEffect } from 'react'

const LOCKED_NAMES = ['background', 'bg-overlay', 'divider', 'hawee-logo']

export default function LayerPanel({ canvas }) {
  const [objects, setObjects] = useState([])

  useEffect(() => {
    if (!canvas) return
    function refresh() {
      const objs = canvas.getObjects() ?? []
      setObjects([...objs].reverse()) // top-first
    }
    refresh()
    canvas.on('object:added',   refresh)
    canvas.on('object:removed', refresh)
    canvas.on('object:modified', refresh)
    return () => {
      canvas.off('object:added',   refresh)
      canvas.off('object:removed', refresh)
      canvas.off('object:modified', refresh)
    }
  }, [canvas])

  function toggleVisible(obj) {
    obj.set('visible', !obj.visible)
    canvas?.renderAll()
    setObjects(prev => [...prev]) // force re-render
  }

  function bringForward(obj) {
    canvas?.bringForward(obj)
    canvas?.renderAll()
    setObjects([...canvas.getObjects()].reverse())
  }

  function sendBackward(obj) {
    canvas?.sendBackwards(obj)
    canvas?.renderAll()
    setObjects([...canvas.getObjects()].reverse())
  }

  return (
    <div className="h-full flex flex-col glass-dark border-r border-white/10">
      <div className="panel-header">
        <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Layers</span>
        <span className="text-xs text-white/30">{objects.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {objects.length === 0 ? (
          <div className="text-center text-white/25 text-xs py-8 px-4">
            Canvas trống
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {objects.map((obj, i) => {
              const isLocked = LOCKED_NAMES.includes(obj.name)
              const label = obj.name ?? obj.type ?? `Layer ${i}`
              const isVisible = obj.visible !== false

              return (
                <li
                  key={`${obj.name ?? i}-${i}`}
                  className={`flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 transition-colors ${
                    !isVisible ? 'opacity-40' : ''
                  }`}
                >
                  {/* Visibility */}
                  <button
                    onClick={() => toggleVisible(obj)}
                    className="text-white/40 hover:text-white transition-colors shrink-0"
                  >
                    {isVisible
                      ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    }
                  </button>

                  {/* Name */}
                  <span className={`flex-1 truncate ${isLocked ? 'text-white/40' : 'text-white/70'}`}>
                    {label}
                  </span>

                  {/* Lock indicator */}
                  {isLocked && (
                    <svg className="w-3 h-3 text-white/20 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                  )}

                  {/* Layer order buttons */}
                  {!isLocked && (
                    <div className="flex gap-0.5 shrink-0">
                      <button onClick={() => bringForward(obj)} className="text-white/20 hover:text-white/60 transition-colors p-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                        </svg>
                      </button>
                      <button onClick={() => sendBackward(obj)} className="text-white/20 hover:text-white/60 transition-colors p-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
