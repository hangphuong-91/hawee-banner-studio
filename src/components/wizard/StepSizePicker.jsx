// ── Step 2: Chọn kích thước banner ────────────────────────────────────────────
import { FORMATS } from '../../lib/brandConfig.js'
import { useBanner } from '../../context/BannerContext.jsx'

const PRIMARY_FORMATS = FORMATS.filter(f => !f.legacy)

// Visual ratio preview using CSS aspect-ratio
function AspectPreview({ w, h }) {
  const ratio = w / h
  // Normalize to a max dimension of 56px for preview box
  const maxDim = 56
  const pw = ratio >= 1 ? maxDim : Math.round(maxDim * ratio)
  const ph = ratio <= 1 ? maxDim : Math.round(maxDim / ratio)

  return (
    <div className="flex items-center justify-center" style={{ width: 64, height: 64 }}>
      <div
        className="rounded border-2 border-current flex items-center justify-center"
        style={{ width: pw, height: ph, opacity: 0.8 }}
      >
        <div className="w-1/2 h-1/2 rounded-sm bg-current opacity-30" />
      </div>
    </div>
  )
}

export default function StepSizePicker() {
  const { config, updateConfig } = useBanner()

  function select(fmtId) {
    updateConfig({ format: fmtId, canvasVersion: config.canvasVersion + 1 })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PRIMARY_FORMATS.map(fmt => {
          const selected = config.format === fmt.id
          const outputW  = fmt.w * fmt.exportScale
          const outputH  = fmt.h * fmt.exportScale
          return (
            <button
              key={fmt.id}
              onClick={() => select(fmt.id)}
              className={`group rounded-2xl p-5 text-left border-2 transition-all duration-200
                ${selected
                  ? 'border-[#C9187F] bg-[#C9187F14] shadow-[0_0_24px_rgba(201,24,127,0.25)]'
                  : 'border-white/10 bg-white/[0.04] hover:border-[#C9187F]/40 hover:bg-white/[0.07]'}`}
            >
              <div className={`mb-3 transition-colors ${selected ? 'text-[#C9187F]' : 'text-white/30 group-hover:text-[#C9187F]/60'}`}>
                <AspectPreview w={fmt.w} h={fmt.h} />
              </div>

              <div className="font-semibold text-white mb-0.5 flex items-center gap-2">
                {fmt.label}
                {selected && <span className="text-[10px] bg-[#C9187F] text-white px-1.5 py-0.5 rounded-full font-medium">Đã chọn</span>}
              </div>
              <div className="text-xs text-white/40 mb-1">{fmt.aspect} · {fmt.desc}</div>
              <div className="text-[11px] text-white/25">
                Output: {outputW} × {outputH}px
              </div>
            </button>
          )
        })}
      </div>

      {/* Use case guide */}
      <div className="glass rounded-xl p-4">
        <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3">Hướng dẫn chọn kích thước</p>
        <div className="space-y-2">
          {[
            { fmt: '2048 × 2048', icon: '▣', uses: 'Facebook Post, Instagram Square, LED Wall, màn hình sự kiện' },
            { fmt: '1920 × 1080', icon: '▭', uses: 'YouTube Thumbnail, LinkedIn Cover, Backdrop hội trường, Slide' },
            { fmt: '1080 × 1350', icon: '▮', uses: 'Instagram Feed 4:5, Facebook Feed, mobile-first content' },
          ].map(({ fmt, icon, uses }) => (
            <div key={fmt} className="flex items-start gap-2.5 text-xs">
              <span className="text-white/30 shrink-0 mt-0.5">{icon}</span>
              <span className="text-[#C9187F]/80 shrink-0 w-24">{fmt}</span>
              <span className="text-white/40">{uses}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
