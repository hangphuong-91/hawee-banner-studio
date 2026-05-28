import { useBanner } from '../../context/BannerContext.jsx'
import { FORMATS, MODES } from '../../lib/brandConfig.js'
import FormatCard from '../ui/FormatCard.jsx'
import ModeCard from '../ui/ModeCard.jsx'

export default function Step1Format() {
  const { config, updateConfig, bumpCanvasVersion } = useBanner()

  function selectFormat(id) {
    updateConfig({ format: id })
    bumpCanvasVersion()
  }

  function selectMode(id) {
    updateConfig({ mode: id })
    bumpCanvasVersion()
  }

  return (
    <div className="space-y-8">
      {/* Format */}
      <div>
        <h3 className="text-base font-semibold text-white mb-1">Kích thước banner</h3>
        <p className="text-sm text-white/50 mb-4">Chọn định dạng phù hợp với nơi bạn đăng</p>
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {FORMATS.map(f => (
            <FormatCard
              key={f.id}
              format={f}
              selected={config.format === f.id}
              onSelect={selectFormat}
            />
          ))}
        </div>
      </div>

      {/* Mode */}
      <div>
        <h3 className="text-base font-semibold text-white mb-1">Phong cách thiết kế</h3>
        <p className="text-sm text-white/50 mb-4">Chọn vibe phù hợp với sự kiện của bạn</p>
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {MODES.map(m => (
            <ModeCard
              key={m.id}
              mode={m}
              selected={config.mode === m.id}
              onSelect={selectMode}
            />
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="glass rounded-xl p-3 flex items-center gap-3 text-sm">
        <div className="w-8 h-8 rounded-lg bg-[#C9187F22] flex items-center justify-center text-[#C9187F]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <span className="text-white/70">
          Đã chọn: <span className="text-[#C9187F] font-semibold">
            {FORMATS.find(f => f.id === config.format)?.label}
          </span> · <span className="text-[#C9187F] font-semibold">
            {MODES.find(m => m.id === config.mode)?.label}
          </span>
        </span>
      </div>
    </div>
  )
}
