import { useState, useRef } from 'react'
import { CUES_LIBRARY, CUES_BY_CATEGORY, CUE_CATEGORIES } from '../../lib/assetManifest.js'
import { useOpenAI } from '../../hooks/useOpenAI.js'
import { useBanner } from '../../context/BannerContext.jsx'

const IMAGE_SHAPES = [
  { id: 'free',    label: 'Tự do',     icon: '▭' },
  { id: 'circle',  label: 'Tròn',      icon: '○' },
  { id: 'rounded', label: 'Bo góc',    icon: '▢' },
  { id: 'square',  label: 'Vuông',     icon: '□' },
]

// ── Collapsible section wrapper ───────────────────────────────────────────────
function Section({ title, icon, badge, open, onToggle, children }) {
  return (
    <div className="border-b border-white/8 last:border-b-0">
      {/* Section header — click to toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/4 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm leading-none">{icon}</span>
          <span className="text-xs font-semibold text-white/70">{title}</span>
          {badge && (
            <span className="text-[9px] bg-white/8 text-white/35 px-1.5 py-0.5 rounded-full">{badge}</span>
          )}
        </div>
        <svg
          className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {/* Section body */}
      {open && <div className="pb-2">{children}</div>}
    </div>
  )
}

export default function VisualCueLibrary({ onAddCue, onAddImage, onAddShape, onClose }) {
  const { config } = useBanner()
  const [open, setOpen]                  = useState({ library: true, shapes: true, image: true, ai: true })
  const [activeCategory, setActiveCategory] = useState('all')
  const [aiPrompt, setAiPrompt]          = useState('')
  const [generatedUrl, setGeneratedUrl]  = useState(null)
  const [imageData, setImageData]        = useState(null)
  const [imageShape, setImageShape]      = useState('free')
  const fileRef                          = useRef(null)
  const { generateCue, loading, error, hasKey } = useOpenAI()

  const displayCues = activeCategory === 'all'
    ? CUES_LIBRARY.filter(c => c.category !== 'shapes')
    : (CUES_BY_CATEGORY[activeCategory] ?? [])

  function toggle(key) {
    setOpen(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleGenerate() {
    if (!aiPrompt.trim()) return
    const url = await generateCue(aiPrompt, config.mode)
    if (url) setGeneratedUrl(url)
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => setImageData(evt.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="h-full flex flex-col glass-dark border-r border-white/10">

      {/* ── Header ── */}
      <div className="panel-header">
        <span className="text-xs font-semibold text-white/60 uppercase tracking-wider leading-tight">
          Thêm Thành Phần Thiết Kế
        </span>
        <button onClick={onClose} className="text-white/30 hover:text-white transition-colors flex-shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* ── All sections stacked, each collapsible ── */}
      <div className="flex-1 overflow-y-auto">

        {/* ─── 1. Cues library ──────────────────────────────────── */}
        <Section
          title="Cues"
          icon="📚"
          badge={`${displayCues.length}`}
          open={open.library}
          onToggle={() => toggle('library')}
        >
          {/* Category filter */}
          <div className="flex gap-1 px-3 pt-1 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 text-[10px] px-2 py-1 rounded-full border transition-all ${
                activeCategory === 'all'
                  ? 'border-[#C9187F] bg-[#C9187F22] text-[#C9187F]'
                  : 'border-white/10 bg-white/5 text-white/40'
              }`}
            >Tất cả</button>
            {CUE_CATEGORIES.filter(c => c.id !== 'shapes').map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 text-[10px] px-2 py-1 rounded-full border transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'border-[#C9187F] bg-[#C9187F22] text-[#C9187F]'
                    : 'border-white/10 bg-white/5 text-white/40'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Cue grid */}
          <div className="grid grid-cols-4 gap-1.5 px-3">
            {displayCues.map(cue => (
              <button
                key={cue.id}
                onClick={() => onAddCue(cue.src)}
                className="aspect-square glass rounded-xl p-1.5 hover:border-[#C9187F55] hover:bg-[#C9187F11] transition-all duration-150 flex items-center justify-center"
                title={cue.label}
              >
                <img
                  src={cue.src}
                  alt={cue.label}
                  className="w-full h-full object-contain"
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.nextSibling?.style && (e.target.nextSibling.style.display = 'flex')
                  }}
                />
                <span className="hidden w-full h-full items-center justify-center text-[#C9187F] opacity-40 text-xs">✦</span>
              </button>
            ))}
          </div>
        </Section>

        {/* ─── 2. Hình khối ─────────────────────────────────────── */}
        <Section
          title="Hình Khối"
          icon="⬜"
          badge={`${(CUES_BY_CATEGORY['shapes'] ?? []).length}`}
          open={open.shapes}
          onToggle={() => toggle('shapes')}
        >
          <div className="grid grid-cols-3 gap-1.5 px-3">
            {(CUES_BY_CATEGORY['shapes'] ?? []).map(shape => (
              <button
                key={shape.id}
                onClick={() => shape.fabricType ? onAddShape?.(shape) : onAddCue(shape.src)}
                className="flex flex-col items-center gap-1 glass rounded-xl p-2 hover:border-[#C9187F55] hover:bg-[#C9187F11] transition-all"
                title={shape.label}
              >
                <div
                  className="w-full h-7 flex items-center justify-center overflow-hidden"
                  style={{ padding: shape.aspectRatio > 3 ? '5px 3px' : '3px' }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      background:    shape.previewBg,
                      border:        shape.previewBorder || 'none',
                      borderRadius:  shape.previewRadius || '2px',
                    }}
                  />
                </div>
                <span className="text-[9px] text-white/45 text-center leading-tight">{shape.label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* ─── 3. Hình ảnh ──────────────────────────────────────── */}
        <Section
          title="Hình Ảnh"
          icon="🖼"
          open={open.image}
          onToggle={() => toggle('image')}
        >
          <div className="px-3 space-y-3">
            {/* Shape selector — compact 2×2 */}
            <div className="grid grid-cols-2 gap-1.5">
              {IMAGE_SHAPES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setImageShape(s.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] transition-all ${
                    imageShape === s.id
                      ? 'border-[#C9187F] bg-[#C9187F22] text-[#C9187F]'
                      : 'border-white/10 bg-white/5 text-white/45'
                  }`}
                >
                  <span className="text-base leading-none">{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

            {imageData ? (
              <div className="space-y-2">
                <div className="glass rounded-xl overflow-hidden aspect-video">
                  <img
                    src={imageData} alt="preview"
                    className={`w-full h-full object-cover ${
                      imageShape === 'circle'  ? 'rounded-full' :
                      imageShape === 'rounded' ? 'rounded-2xl' : ''
                    }`}
                  />
                </div>
                <button
                  onClick={() => { onAddImage(imageData, imageShape); setImageData(null) }}
                  className="btn-primary w-full justify-center text-xs py-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                  Thêm vào canvas
                </button>
                <button
                  onClick={() => { setImageData(null); fileRef.current && (fileRef.current.value = '') }}
                  className="btn-ghost w-full justify-center text-[11px] py-1.5"
                >
                  Chọn ảnh khác
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full aspect-video glass rounded-xl border-2 border-dashed border-white/15
                           hover:border-[#C9187F55] hover:bg-[#C9187F06] transition-all
                           flex flex-col items-center justify-center gap-1.5 text-white/35 hover:text-white/55"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span className="text-xs">Click để chọn ảnh</span>
                <span className="text-[10px] text-white/25">JPG · PNG · WebP</span>
              </button>
            )}
          </div>
        </Section>

        {/* ─── 4. AI Generate ───────────────────────────────────── */}
        <Section
          title="AI Generate"
          icon="✨"
          open={open.ai}
          onToggle={() => toggle('ai')}
        >
          <div className="px-3 space-y-3">
            {/* Engine badge */}
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400">
                {hasKey ? 'DALL-E 3 · OpenAI' : 'Pollinations AI · Miễn phí'}
              </span>
            </div>

            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Bông hoa anh đào, biểu tượng AI, biểu đồ tăng trưởng..."
              className="input-brand resize-none text-xs"
              rows={2}
            />
            <p className="text-[10px] text-white/25 -mt-1">
              Match mode <span className="text-[#C9187F]">{config.mode}</span>
            </p>

            <button
              onClick={handleGenerate}
              disabled={loading || !aiPrompt.trim()}
              className="btn-primary w-full justify-center text-xs py-2"
            >
              {loading
                ? <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
                    Đang tạo... (~15s)
                  </>
                : <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    {hasKey ? 'Tạo với DALL-E 3' : 'Tạo AI (miễn phí)'}
                  </>
              }
            </button>

            {error && (
              <div className="text-[11px] text-rose-400/80 bg-rose-400/8 border border-rose-400/20 rounded-lg px-2.5 py-2">
                {error}
              </div>
            )}

            {generatedUrl && (
              <div className="space-y-2">
                <div className="glass rounded-xl overflow-hidden aspect-square">
                  <img src={generatedUrl} alt="AI generated" className="w-full h-full object-contain" />
                </div>
                <button
                  onClick={() => { onAddCue(generatedUrl); setGeneratedUrl(null); setAiPrompt('') }}
                  className="btn-primary w-full justify-center text-xs py-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                  Thêm vào canvas
                </button>
                <button onClick={handleGenerate} className="btn-ghost w-full justify-center text-[11px] py-1.5">
                  ↻ Tạo lại
                </button>
              </div>
            )}

            {!hasKey && !generatedUrl && (
              <p className="text-[10px] text-white/20 leading-relaxed">
                Thêm OpenAI key trong ⚙ để dùng DALL-E 3 chất lượng cao hơn
              </p>
            )}
          </div>
        </Section>

      </div>
    </div>
  )
}
