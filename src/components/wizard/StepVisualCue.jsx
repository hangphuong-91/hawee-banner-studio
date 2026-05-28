// ── Step 5: Thêm Visual Cue ────────────────────────────────────────────────────
// Library of pre-made icons OR AI Generate via gpt-image-1 / DALL-E 3
import { useState } from 'react'
import { CUES_LIBRARY_BASE, CUE_CATEGORIES } from '../../lib/assetManifest.js'
import { useOpenAI } from '../../hooks/useOpenAI.js'
import { useBanner } from '../../context/BannerContext.jsx'
import SettingsModal from '../modals/SettingsModal.jsx'

// Only icon cues (no shapes — shapes are added in canvas editor)
const ICON_CUES = CUES_LIBRARY_BASE

const PROMPT_SUGGESTIONS = [
  'pink lotus flower floating, minimal 3D icon, transparent background',
  'golden trophy cup with sparkles, pink and gold palette, transparent bg',
  'woman silhouette in leadership pose, pink gradient, minimal',
  'abstract network nodes connecting, pink magenta colors, transparent bg',
  'rising sun over mountains, warm pink tones, minimal 3D',
  'butterfly transformation, pink to magenta gradient, transparent bg',
  'digital growth chart arrow up, neon pink, tech aesthetic',
  'crown with aura glow, pink magenta, isolated on transparent',
  'infinity symbol with light trail, pink purple gradient',
  'handshake icon, feminine style, pink magenta gradient',
]

export default function StepVisualCue() {
  const { config, updateConfig } = useBanner()
  const { generateCue, loading: aiLoading, error: aiError, hasKey } = useOpenAI()
  const [tab, setTab] = useState('library')
  const [catFilter, setCatFilter] = useState('business')
  const [prompt, setPrompt] = useState('')
  const [generatedUrl, setGeneratedUrl] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  const selected = config.cueUrl ?? null

  const iconCategories = CUE_CATEGORIES.filter(c => c.id !== 'shapes')

  function selectCue(src) {
    updateConfig({ cueUrl: selected === src ? null : src })
  }

  async function handleGenerate() {
    if (!prompt.trim()) return
    const enhancedPrompt = `${prompt.trim()}, minimal icon, pink and magenta color palette (#C9187F, #E83A78), transparent background, women empowerment aesthetic, isolated object, no text, high quality`
    const url = await generateCue(enhancedPrompt)
    if (url) {
      setGeneratedUrl(url)
      updateConfig({ cueUrl: url })
    }
  }

  const filteredCues = ICON_CUES.filter(c => c.category === catFilter)

  return (
    <div className="space-y-4">
      {/* Skip hint */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40">Tùy chọn — có thể bỏ qua và thêm sau trên canvas</p>
        {selected && (
          <button onClick={() => updateConfig({ cueUrl: null })} className="text-xs text-white/30 hover:text-white/60 transition-colors">
            ✕ Bỏ chọn
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-xl p-1">
        <button
          onClick={() => setTab('library')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            tab === 'library' ? 'bg-[#C9187F] text-white' : 'text-white/50 hover:text-white/75'
          }`}
        >
          📦 Thư viện icon
        </button>
        <button
          onClick={() => setTab('ai')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            tab === 'ai' ? 'bg-[#C9187F] text-white' : 'text-white/50 hover:text-white/75'
          }`}
        >
          🤖 AI Generate
        </button>
      </div>

      {/* Library tab */}
      {tab === 'library' && (
        <div className="space-y-3">
          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            {iconCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCatFilter(cat.id)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  catFilter === cat.id
                    ? 'border-[#C9187F] bg-[#C9187F22] text-[#C9187F]'
                    : 'border-white/10 bg-white/5 text-white/45 hover:border-white/25'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Icon grid */}
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
            {filteredCues.map(cue => (
              <button
                key={cue.id}
                onClick={() => selectCue(cue.src)}
                title={cue.label}
                className={`aspect-square rounded-xl p-2 border-2 transition-all ${
                  selected === cue.src
                    ? 'border-[#C9187F] bg-[#C9187F15] shadow-[0_0_12px_rgba(201,24,127,0.4)] scale-105'
                    : 'border-white/8 bg-white/4 hover:border-[#C9187F]/40 hover:bg-white/8'
                }`}
              >
                <img src={cue.src} alt={cue.label} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Generate tab */}
      {tab === 'ai' && (
        <div className="space-y-4">
          {!hasKey ? (
            <div className="glass rounded-xl p-4 text-center space-y-3">
              <p className="text-sm text-amber-400/80 font-semibold">⚡ Cần OpenAI API key</p>
              <p className="text-xs text-white/40 leading-relaxed">
                AI sẽ dùng <span className="text-white/70">gpt-image-1</span> (model của ChatGPT) để tạo
                visual element chất lượng cao, transparent background, theo palette HAWEE.
              </p>
              <button onClick={() => setShowSettings(true)} className="btn-outline text-xs py-1.5 px-4">
                Thêm API key
              </button>
            </div>
          ) : (
            <>
              {/* Model badge */}
              <div className="flex items-center gap-2 text-[11px] text-white/40">
                <span className="px-2 py-0.5 rounded-full bg-[#C9187F]/15 border border-[#C9187F]/30 text-[#C9187F]/80">
                  gpt-image-1
                </span>
                <span>ChatGPT-quality image generation · transparent background</span>
              </div>

              {/* Prompt input */}
              <div>
                <label className="text-xs font-semibold text-white/70 mb-1.5 block">
                  Mô tả visual cue bạn muốn
                </label>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="VD: pink lotus flower floating, minimal 3D icon, transparent background"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white
                             placeholder-white/25 focus:outline-none focus:border-[#C9187F]/60 resize-none"
                />
                <p className="text-[10px] text-white/25 mt-1">
                  Style HAWEE (hồng, magenta, transparent bg) sẽ tự động được thêm vào prompt.
                </p>
              </div>

              {/* Prompt suggestions */}
              <div>
                <p className="text-[10px] text-white/30 mb-1.5">💡 Gợi ý nhanh:</p>
                <div className="flex flex-wrap gap-1.5">
                  {PROMPT_SUGGESTIONS.slice(0, 6).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(s)}
                      className="text-[10px] text-white/40 border border-white/10 rounded-full px-2 py-0.5
                                 hover:border-[#C9187F]/40 hover:text-white/65 transition-colors text-left"
                    >
                      {s.slice(0, 36)}...
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={aiLoading || !prompt.trim()}
                className="btn-primary w-full justify-center py-3 gap-2 disabled:opacity-40"
              >
                {aiLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    AI đang tạo hình...
                  </>
                ) : '✨ Generate với AI'}
              </button>

              {aiError && (
                <p className="text-xs text-rose-400/80 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                  {aiError}
                </p>
              )}

              {/* Generated result */}
              {generatedUrl && (
                <div className="glass rounded-xl p-3 flex items-start gap-3">
                  <img
                    src={generatedUrl}
                    alt="Generated cue"
                    className="w-20 h-20 object-contain rounded-lg flex-shrink-0"
                    style={{ background: 'repeating-conic-gradient(#333 0% 25%, #444 0% 50%) 0 0 / 10px 10px' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-emerald-400 font-semibold mb-1">✓ Đã tạo xong</p>
                    <p className="text-[11px] text-white/50 leading-relaxed mb-2">
                      Visual cue đã được chọn và sẽ thêm vào canvas. Có thể generate lại với prompt khác.
                    </p>
                    <button
                      onClick={() => { setGeneratedUrl(null); updateConfig({ cueUrl: null }); setPrompt('') }}
                      className="text-[10px] text-white/30 hover:text-white/55 transition-colors"
                    >
                      ↺ Generate lại
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Selected cue preview */}
      {selected && !generatedUrl && (
        <div className="flex items-center gap-3 glass rounded-xl p-3">
          <img
            src={selected}
            alt="Selected cue"
            className="w-12 h-12 object-contain flex-shrink-0"
          />
          <div>
            <p className="text-xs text-emerald-400 font-semibold">✓ Đã chọn visual cue</p>
            <p className="text-[11px] text-white/40">Sẽ được thêm tự động khi mở canvas editor</p>
          </div>
        </div>
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}
