import { useRef } from 'react'
import { useBanner } from '../../context/BannerContext.jsx'
import { AURAS, FUTURISTIC_BACKGROUNDS } from '../../lib/brandConfig.js'
import AuraThumbnail from '../ui/AuraThumbnail.jsx'
import ChiHoiSelector from '../ui/ChiHoiSelector.jsx'

export default function Step2Background() {
  const { config, updateConfig, bumpCanvasVersion } = useBanner()
  const fileRef = useRef(null)

  function selectBackground(id) {
    updateConfig({ backgroundId: id })
    bumpCanvasVersion()
  }

  function selectChiHoi(id) {
    updateConfig({ chiHoiId: id })
    bumpCanvasVersion()
  }

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    updateConfig({ backgroundCustomUrl: url, backgroundId: null })
    bumpCanvasVersion()
  }

  return (
    <div className="space-y-7">
      {/* Background picker based on mode */}
      <div>
        <h3 className="text-base font-semibold text-white mb-1">
          {config.mode === 'aura' ? '🌸 Chọn nền Aura' :
           config.mode === 'futuristic' ? '🌆 Chọn nền Futuristic' :
           '📸 Upload ảnh nền'}
        </h3>
        <p className="text-sm text-white/50 mb-4">
          {config.mode === 'aura' ? 'Chọn từ thư viện gradient HAWEE' :
           config.mode === 'futuristic' ? 'Ảnh thành phố + overlay holographic' :
           'Upload ảnh thực tế của sự kiện'}
        </p>

        {config.mode === 'aura' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3">
            {AURAS.map(a => (
              <AuraThumbnail
                key={a.id}
                aura={a}
                selected={config.backgroundId === a.id}
                onSelect={selectBackground}
              />
            ))}
          </div>
        )}

        {config.mode === 'futuristic' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {FUTURISTIC_BACKGROUNDS.map(bg => (
              <button
                key={bg.id}
                onClick={() => selectBackground(bg.id)}
                className={`
                  relative rounded-xl overflow-hidden aspect-square transition-all duration-200
                  ${config.backgroundId === bg.id
                    ? 'ring-2 ring-[#C9187F] ring-offset-2 ring-offset-[#0f0a14]'
                    : 'hover:ring-1 hover:ring-white/30'
                  }
                `}
              >
                {/* CSS gradient preview — no broken img src */}
                <div
                  className="w-full h-full"
                  style={{ background: bg.cssGradient }}
                />
                {config.backgroundId === bg.id && (
                  <div className="absolute inset-0 bg-[#C9187F22] flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-[#C9187F] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-[8px] leading-tight">{bg.label}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {config.mode === 'photo' && (
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            {config.backgroundCustomUrl ? (
              <div className="relative rounded-xl overflow-hidden aspect-video max-w-sm">
                <img src={config.backgroundCustomUrl} alt="bg" className="w-full h-full object-cover" />
                <button
                  onClick={() => { updateConfig({ backgroundCustomUrl: null }); bumpCanvasVersion() }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white/70 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full aspect-video max-w-sm rounded-xl border-2 border-dashed border-white/20 hover:border-[#C9187F] flex flex-col items-center justify-center gap-2 transition-all"
              >
                <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span className="text-sm text-white/40">Click để upload ảnh</span>
                <span className="text-xs text-white/25">JPG, PNG, WebP — tối đa 10MB</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Chi hội selector */}
      <ChiHoiSelector selected={config.chiHoiId} onSelect={selectChiHoi} />
    </div>
  )
}
