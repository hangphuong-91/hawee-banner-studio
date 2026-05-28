// ── Step 3: Chọn Background ─────────────────────────────────────────────────
import { useState } from 'react'
import { AURAS, FUTURISTIC_BACKGROUNDS } from '../../lib/brandConfig.js'
import { useBanner } from '../../context/BannerContext.jsx'

// Metaphor labels for futuristic backgrounds
const METAPHORS = [
  'Phát triển',  'Lãnh đạo',   'Năng lực',    'Dẫn dắt',
  'Bền vững',    'Chuyển hóa', 'E-commerce',  'Kết nối',
  'Tỏa sáng',   'Đổi mới',    'Khát vọng',   'Sang trọng',
  'Quyền lực',  'Kiên định',  'Tầm nhìn',    'Cảm hứng',
  'Tiên phong', 'Hợp tác',    'Sứ mệnh',     'Hào quang',
]

export default function StepBgPicker() {
  const { config, updateConfig } = useBanner()
  const [tab, setTab] = useState(config.mode === 'futuristic' ? 'futuristic' : 'aura')

  function selectAura(id) {
    updateConfig({ backgroundId: id, mode: 'aura', canvasVersion: config.canvasVersion + 1 })
  }

  function selectFuturistic(id) {
    updateConfig({ backgroundId: id, mode: 'futuristic', canvasVersion: config.canvasVersion + 1 })
  }

  const isAuraSelected = (id) => config.mode === 'aura' && config.backgroundId === id
  const isFutSelected  = (id) => config.mode === 'futuristic' && config.backgroundId === id

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 glass rounded-xl p-1">
        {[
          { id: 'aura',       label: '🌸 Aura HAWEE',     desc: 'Gradient hồng / tím thương hiệu' },
          { id: 'futuristic', label: '💫 Futuristic',      desc: 'Abstract tối, tech, quyền lực' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all text-left ${
              tab === t.id
                ? 'bg-[#C9187F] text-white shadow-sm'
                : 'text-white/50 hover:text-white/75 hover:bg-white/5'
            }`}
          >
            <div>{t.label}</div>
            <div className={`text-[10px] font-normal mt-0.5 ${tab === t.id ? 'text-white/70' : 'text-white/30'}`}>{t.desc}</div>
          </button>
        ))}
      </div>

      {/* Aura grid */}
      {tab === 'aura' && (
        <div>
          <p className="text-xs text-white/35 mb-3">
            {AURAS.length} nền Aura HAWEE — gradient hồng/tím chính thức từ bộ nhận diện thương hiệu
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-96 overflow-y-auto pr-1">
            {AURAS.map(a => (
              <button
                key={a.id}
                onClick={() => selectAura(a.id)}
                title={a.label}
                className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                  isAuraSelected(a.id)
                    ? 'border-[#C9187F] shadow-[0_0_16px_rgba(201,24,127,0.5)] scale-105'
                    : 'border-transparent hover:border-[#C9187F]/50 hover:scale-102'
                }`}
              >
                <img
                  src={a.src}
                  alt={a.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="hidden absolute inset-0 items-center justify-center"
                  style={{ background: 'radial-gradient(circle, #C9187F, #50002F)' }}>
                  <span className="text-white/50 text-[8px]">{a.id}</span>
                </div>
                {isAuraSelected(a.id) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-5 h-5 rounded-full bg-[#C9187F] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Futuristic grid */}
      {tab === 'futuristic' && (
        <div>
          <p className="text-xs text-white/35 mb-3">
            {FUTURISTIC_BACKGROUNDS.length} nền ảnh thực — geometric, city, abstract, premium
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
            {FUTURISTIC_BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => selectFuturistic(bg.id)}
                title={bg.label}
                className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                  isFutSelected(bg.id)
                    ? 'border-[#C9187F] shadow-[0_0_16px_rgba(201,24,127,0.5)] scale-105'
                    : 'border-transparent hover:border-[#C9187F]/50 hover:scale-102'
                }`}
              >
                {bg.type === 'image' ? (
                  <img
                    src={bg.src}
                    alt={bg.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                ) : null}
                {/* CSS gradient fallback or overlay */}
                <div
                  className={`${bg.type === 'image' ? 'hidden' : ''} absolute inset-0`}
                  style={{ background: bg.cssGradient }}
                />
                <div className="absolute inset-x-0 bottom-0 py-1 px-1.5 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-[8px] text-white/80 truncate font-medium">{bg.label}</p>
                </div>
                {isFutSelected(bg.id) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="w-5 h-5 rounded-full bg-[#C9187F] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected indicator */}
      {config.backgroundId && (
        <div className="flex items-center gap-2 text-xs text-white/40 px-1">
          <span className="text-emerald-400">✓</span>
          <span>
            Đã chọn:{' '}
            <span className="text-white/70">
              {tab === 'aura'
                ? AURAS.find(a => a.id === config.backgroundId)?.label
                : FUTURISTIC_BACKGROUNDS.find(b => b.id === config.backgroundId)?.label
              } {tab === 'futuristic' && config.backgroundId
                ? `— ${METAPHORS[FUTURISTIC_BACKGROUNDS.findIndex(b => b.id === config.backgroundId)] ?? ''}`
                : ''}
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
