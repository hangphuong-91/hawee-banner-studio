// ── Step 5: Chọn logo HAWEE + Chi hội ────────────────────────────────────────
import { useBanner } from '../../context/BannerContext.jsx'
import { HAWEE_LOGOS, CHI_HOI } from '../../lib/brandConfig.js'

function CheckMark() {
  return (
    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#C9187F] rounded-full
                    flex items-center justify-center shadow-lg">
      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
      </svg>
    </div>
  )
}

export default function StepLogoSelector() {
  const { config, updateConfig } = useBanner()

  const selectedLogoId = config.logoId  ?? 'horizontal-en'
  const selectedChiHoi = config.chiHoiId ?? 'none'

  return (
    <div className="space-y-5">

      {/* ── HAWEE Logo ── */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-baseline justify-between">
          <p className="text-xs text-white/35 uppercase tracking-wider font-semibold">Logo HAWEE</p>
          <span className="text-[10px] text-white/25">Chọn 1 phiên bản</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {HAWEE_LOGOS.map(logo => (
            <button
              key={logo.id}
              type="button"
              onClick={() => updateConfig({ logoId: logo.id })}
              className={`relative rounded-xl p-3 border transition-all text-left ${
                selectedLogoId === logo.id
                  ? 'border-[#C9187F]/70 bg-[#C9187F]/12 shadow-[0_0_12px_rgba(201,24,127,0.2)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
              }`}
            >
              {selectedLogoId === logo.id && <CheckMark />}
              {/* Logo preview on dark swatch */}
              <div
                className="h-10 flex items-center justify-center mb-2 rounded-lg overflow-hidden"
                style={{ background: logo.bg === 'light' ? 'rgba(255,255,255,0.92)' : 'rgba(10,6,18,0.85)' }}
              >
                <img
                  src={logo.src}
                  alt={logo.label}
                  className="max-h-7 max-w-full object-contain"
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
              <p className="text-[11px] text-white/50 text-center leading-tight">{logo.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Chi hội ── */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-baseline justify-between">
          <p className="text-xs text-white/35 uppercase tracking-wider font-semibold">Chi hội</p>
          <span className="text-[10px] text-white/25">Tùy chọn</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {CHI_HOI.map(ch => (
            <button
              key={ch.id}
              type="button"
              onClick={() => updateConfig({ chiHoiId: ch.id })}
              className={`relative rounded-xl p-2.5 border transition-all ${
                selectedChiHoi === ch.id
                  ? 'border-[#C9187F]/70 bg-[#C9187F]/12 shadow-[0_0_10px_rgba(201,24,127,0.15)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
              }`}
            >
              {selectedChiHoi === ch.id && <CheckMark />}
              <div className="h-9 flex items-center justify-center mb-1.5">
                {ch.logoPng ? (
                  <img
                    src={ch.logoPng}
                    alt={ch.label}
                    className="max-h-full max-w-full object-contain"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                )}
              </div>
              <p className="text-[10px] text-center text-white/45 leading-tight">
                {ch.id === 'none' ? 'Không có' : ch.label.replace('Chi hội ', '')}
              </p>
            </button>
          ))}
        </div>

        {/* Info note */}
        {selectedChiHoi !== 'none' && (
          <div className="flex items-start gap-2 bg-[#C9187F]/8 rounded-lg p-2.5 mt-1">
            <span className="text-[#C9187F] text-sm mt-0.5">ℹ</span>
            <p className="text-[11px] text-white/45 leading-relaxed">
              Logo chi hội sẽ xuất hiện bên dưới logo HAWEE. Bạn có thể di chuyển cả hai trên canvas.
            </p>
          </div>
        )}
      </div>

      <p className="text-[11px] text-white/20 text-center">
        Logo HAWEE bắt buộc — không thể xóa, chỉ thay đổi phiên bản.
      </p>
    </div>
  )
}
