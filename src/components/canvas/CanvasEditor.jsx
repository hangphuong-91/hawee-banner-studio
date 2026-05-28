import { useRef, useEffect, useState } from 'react'
import { useBanner } from '../../context/BannerContext.jsx'
import { useFabricCanvas } from '../../hooks/useFabricCanvas.js'
import { exportToPNG } from '../../lib/exportCanvas.js'
import CanvasToolbar from './CanvasToolbar.jsx'
import ElementPanel from './ElementPanel.jsx'
import VisualCueLibrary from './VisualCueLibrary.jsx'
import ComplianceChecker from './ComplianceChecker.jsx'

export default function CanvasEditor({ onBack, onSettings }) {
  const { config } = useBanner()
  const canvasRef = useRef(null)
  const wrapRef   = useRef(null)
  const [scale, setScale]           = useState(1)
  const [canvas, setCanvas]         = useState(null)
  const [activeDrawer, setActiveDrawer] = useState('cues') // desktop: 'cues' | 'compliance' | null — open by default
  const [mobilePanel, setMobilePanel]   = useState(null) // mobile: 'cues' | 'element' | 'compliance' | null

  const {
    fabricRef, loading, error,
    dims, undo, redo, addCue, addImageWithShape, addShape, deleteSelected,
    canUndo, canRedo,
  } = useFabricCanvas(canvasRef, config, (c) => setCanvas(c))

  // Scale canvas to fit available space
  useEffect(() => {
    function calcScale() {
      if (!wrapRef.current) return
      const maxW = wrapRef.current.clientWidth  - 32
      const maxH = wrapRef.current.clientHeight - 64
      setScale(Math.min(maxW / dims.w, maxH / dims.h, 1))
    }
    calcScale()
    const ro = new ResizeObserver(calcScale)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [dims])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); undo() }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') { e.preventDefault(); redo() }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const tag = document.activeElement?.tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') deleteSelected()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo, deleteSelected])

  function toggleDrawer(name) {
    setActiveDrawer(prev => prev === name ? null : name)
  }

  function toggleMobilePanel(name) {
    setMobilePanel(prev => prev === name ? null : name)
  }

  async function handleExport() {
    await exportToPNG(fabricRef.current, config.format)
  }

  return (
    <div
      className="flex bg-[#0a0612] overflow-hidden flex-col md:flex-row"
      style={{ height: '100dvh' }}
    >

      {/* ── DESKTOP LEFT: cues drawer ── */}
      <div className={`hidden md:flex flex-shrink-0 transition-all duration-300 overflow-hidden ${
        activeDrawer === 'cues' ? 'w-72' : 'w-12'
      }`}>
        {activeDrawer === 'cues' ? (
          <VisualCueLibrary
            onAddCue={addCue}
            onAddImage={addImageWithShape}
            onAddShape={addShape}
            onClose={() => setActiveDrawer(null)}
          />
        ) : (
          <div className="h-full flex flex-col items-center pt-4 gap-2">
            <button
              onClick={() => toggleDrawer('cues')}
              className="btn-ghost w-8 h-8 p-0 flex items-center justify-center rounded-lg"
              title="Visual Cues"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ── CANVAS COLUMN ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Toolbar */}
        <CanvasToolbar
          onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo}
          onCues={() => toggleDrawer('cues')}
          onCompliance={() => toggleDrawer('compliance')}
          onExport={handleExport}
          loading={loading}
          onBack={onBack}
          onSettings={onSettings}
        />

        {/* Canvas container */}
        <div
          ref={wrapRef}
          className="flex-1 flex items-center justify-center p-4 overflow-hidden relative"
          style={{ background: 'radial-gradient(ellipse at center, #1a0a20 0%, #0a0612 70%)' }}
        >
          {error && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs px-4 py-2 rounded-xl">
              ⚠ {error}
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#C9187F] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-white/60">Đang tạo banner...</span>
              </div>
            </div>
          )}

          <div style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            boxShadow: '0 0 80px rgba(201,24,127,0.15), 0 25px 50px rgba(0,0,0,0.8)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <canvas ref={canvasRef} style={{ display: 'block' }} />
          </div>
        </div>

        {/* Size info — desktop only */}
        <div className="hidden md:flex items-center justify-center py-1.5 text-xs text-white/25 gap-3">
          <span>{dims.w} × {dims.h}px</span>
          <span>·</span>
          <span>Export: {dims.w * 2} × {dims.h * 2}px (2×)</span>
          {scale < 1 && <><span>·</span><span>Preview: {Math.round(scale * 100)}%</span></>}
        </div>
      </div>

      {/* ── DESKTOP RIGHT: element props / compliance ── */}
      <div className="hidden md:flex flex-shrink-0 w-72 overflow-hidden">
        {activeDrawer === 'compliance'
          ? <ComplianceChecker canvas={canvas} onClose={() => setActiveDrawer(null)} />
          : <ElementPanel canvas={canvas} />
        }
      </div>

      {/* ── MOBILE: Bottom sheet ── */}
      {mobilePanel && (
        <div
          className="md:hidden fixed inset-x-0 z-50 flex flex-col"
          style={{
            bottom: '3rem',
            height: '62vh',
            background: '#130b1c',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Sheet header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 flex-shrink-0">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              {mobilePanel === 'cues' && 'Thư viện cues'}
              {mobilePanel === 'element' && 'Element'}
              {mobilePanel === 'compliance' && 'Kiểm tra brand'}
            </span>
            <button
              onClick={() => setMobilePanel(null)}
              className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Sheet content */}
          <div className="flex-1 overflow-hidden">
            {mobilePanel === 'cues' && (
              <VisualCueLibrary
                onAddCue={addCue}
                onAddImage={addImageWithShape}
                onAddShape={addShape}
                onClose={() => setMobilePanel(null)}
              />
            )}
            {mobilePanel === 'element' && <ElementPanel canvas={canvas} />}
            {mobilePanel === 'compliance' && (
              <ComplianceChecker canvas={canvas} onClose={() => setMobilePanel(null)} />
            )}
          </div>
        </div>
      )}

      {/* ── MOBILE: Bottom tab bar ── */}
      <div
        className="md:hidden flex-shrink-0 flex items-stretch border-t border-white/10 bg-black/50 backdrop-blur-md"
        style={{ height: '3rem' }}
      >
        {[
          {
            id: 'cues', label: 'Cues',
            icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
            </svg>,
          },
          {
            id: 'element', label: 'Element',
            icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/>
            </svg>,
          },
          {
            id: 'compliance', label: 'Check',
            icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>,
          },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => toggleMobilePanel(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${
              mobilePanel === tab.id
                ? 'text-[#C9187F]'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}

        {/* Export tab */}
        <button
          onClick={handleExport}
          disabled={loading}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${
            loading ? 'text-white/20' : 'text-[#C9187F] hover:text-[#E83A78]'
          }`}
        >
          {loading ? (
            <div className="w-[18px] h-[18px] border-2 border-[#C9187F]/30 border-t-[#C9187F] rounded-full animate-spin" />
          ) : (
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          )}
          Export
        </button>
      </div>

    </div>
  )
}
