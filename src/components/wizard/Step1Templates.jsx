import { TEMPLATES } from '../../lib/templateConfig.js'
import { useBanner } from '../../context/BannerContext.jsx'

// CSS-only mini layout sketches for each template
function TemplateSketch({ id }) {
  if (id === 'speaker-event-sq') return (
    <div className="w-full aspect-square bg-[#1a0520] rounded-lg overflow-hidden relative flex">
      {/* Left zone */}
      <div className="flex-1 p-2 flex flex-col gap-1">
        <div className="w-8 h-1 bg-white/50 rounded-full" />
        <div className="w-6 h-1 bg-[#C9187F]/60 rounded-full mt-0.5" />
        <div className="mt-1 space-y-0.5">
          <div className="w-11 h-1.5 bg-white/80 rounded-sm" />
          <div className="w-9 h-1.5 bg-white/80 rounded-sm" />
          <div className="w-10 h-1.5 bg-white/70 rounded-sm" />
        </div>
        <div className="mt-auto space-y-0.5">
          <div className="w-10 h-1 bg-white/40 rounded-full" />
          <div className="w-9 h-1 bg-white/40 rounded-full" />
        </div>
      </div>
      {/* Divider */}
      <div className="w-px bg-[#C9187F]/40 mx-0.5 self-stretch" />
      {/* Right zone */}
      <div className="flex-1 p-2 flex flex-col items-center gap-1">
        <div className="w-10 h-0.5 bg-[#FB6094]/50 rounded-full" />
        <div className="w-8 h-8 rounded-full bg-[#C9187F]/30 border border-[#C9187F]/50 mt-1 shadow-[0_0_8px_rgba(201,24,127,0.5)]" />
        <div className="mt-1 space-y-0.5 w-full items-center flex flex-col">
          <div className="w-10 h-1 bg-white/70 rounded-full" />
          <div className="w-7 h-0.5 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  )

  if (id === 'welcome-member') return (
    <div className="w-full aspect-square bg-[#2a1510] rounded-lg overflow-hidden relative">
      {/* Photo bg suggestion */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4a2520]/40 to-[#0a0612]/95" />
      <div className="absolute inset-0 flex flex-col justify-end p-2">
        <div className="space-y-0.5 mb-1">
          <div className="w-12 h-2.5 bg-white/90 rounded-sm" />
          <div className="w-9 h-1 bg-white/60 rounded-full" />
          <div className="w-8 h-1 bg-[#C9187F]/70 rounded-full" />
        </div>
        <div className="w-full h-0.5 bg-[#C9187F] rounded-full" />
      </div>
      <div className="absolute top-2 left-2">
        <div className="w-10 h-0.5 bg-[#FB6094]/60 rounded-full" />
      </div>
      <div className="absolute top-1.5 right-2">
        <div className="w-4 h-0.5 bg-white/30 rounded-full" />
      </div>
    </div>
  )

  if (id === 'event-photo-sq') return (
    <div className="w-full aspect-square bg-[#1a1510] rounded-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0612]/60 to-[#0a0612]/98" />
      <div className="absolute top-1.5 left-1.5">
        <div className="w-8 h-1 bg-white/50 rounded-full" />
      </div>
      <div className="absolute bottom-3 left-2 right-2 space-y-0.5">
        <div className="w-12 h-1.5 bg-white/90 rounded-sm" />
        <div className="w-11 h-1.5 bg-white/80 rounded-sm" />
        <div className="w-8 h-1 bg-white/40 rounded-full mt-1" />
        <div className="w-10 h-1 bg-white/40 rounded-full" />
        <div className="w-7 h-1 bg-[#C9187F]/60 rounded-full mt-0.5" />
      </div>
    </div>
  )

  if (id === 'coming-soon') return (
    <div className="w-full aspect-square bg-[#0a0518] rounded-lg overflow-hidden relative flex flex-col items-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,24,127,0.3)_0%,transparent_70%)]" />
      <div className="relative z-10 flex flex-col items-center pt-2 w-full px-2">
        <div className="w-7 h-1 bg-white/50 rounded-full" />
        <div className="w-10 h-px bg-[#C9187F]/40 mt-1.5" />
        <div className="text-[18px] font-bold text-white/80 leading-none mt-1" style={{ fontFamily: 'monospace' }}>26.06</div>
        <div className="w-12 h-px bg-[#C9187F]/40 mt-1" />
        <div className="w-11 h-1.5 bg-white/70 rounded-sm mt-1" />
        <div className="w-6 h-1 bg-[#C9187F]/70 rounded-sm mt-0.5" />
      </div>
    </div>
  )

  if (id === 'connect-landscape') return (
    <div className="w-full aspect-video bg-[#0a0518] rounded-lg overflow-hidden relative flex">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(201,24,127,0.2)_0%,transparent_60%)]" />
      <div className="absolute left-0 top-0 bottom-0 w-[65%] bg-gradient-to-r from-[#050010]/90 to-transparent" />
      {/* Left text */}
      <div className="relative z-10 p-2 w-[62%] flex flex-col justify-center gap-0.5">
        <div className="w-5 h-0.5 bg-white/50 rounded-full" />
        <div className="w-12 h-2 bg-white/85 rounded-sm mt-0.5" />
        <div className="w-11 h-2 bg-white/75 rounded-sm" />
        <div className="flex gap-1 mt-1">
          <div className="w-5 h-0.5 bg-white/30 rounded-full border border-white/20 px-0.5" />
          <div className="w-4 h-0.5 bg-white/30 rounded-full border border-white/20 px-0.5" />
        </div>
        <div className="w-8 h-0.5 bg-white/30 rounded-full mt-0.5" />
      </div>
      {/* Divider */}
      <div className="w-px bg-[#C9187F]/30 self-stretch" />
      {/* Right zone */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-[#C9187F]/20 border border-[#C9187F]/30" />
      </div>
    </div>
  )

  return <div className="w-full aspect-square bg-white/5 rounded-lg" />
}

export default function Step1Templates() {
  const { config, updateConfig } = useBanner()

  function selectTemplate(tpl) {
    updateConfig({
      templateId:  tpl.id,
      format:      tpl.format,
      mode:        tpl.defaultMode ?? 'aura',
      backgroundId: tpl.defaultBgId ?? config.backgroundId,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Chọn template</h2>
        <p className="text-sm text-white/50 leading-relaxed">
          Mỗi template là layout chuẩn từ ref HAWEE — bạn chỉ cần điền text và upload ảnh.
          Canvas tự render 80% hoàn chỉnh.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEMPLATES.map(tpl => {
          const selected = config.templateId === tpl.id
          return (
            <button
              key={tpl.id}
              onClick={() => selectTemplate(tpl)}
              className={`text-left glass rounded-2xl p-4 transition-all duration-200 border-2 ${
                selected
                  ? 'border-[#C9187F] bg-[#C9187F0E] shadow-[0_0_24px_rgba(201,24,127,0.2)]'
                  : 'border-white/8 hover:border-[#C9187F]/40 hover:bg-white/[0.04]'
              }`}
            >
              {/* Preview sketch */}
              <div className="mb-3 overflow-hidden rounded-xl">
                <TemplateSketch id={tpl.id} />
              </div>

              {/* Info */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white leading-tight">{tpl.name}</span>
                    {selected && (
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#C9187F] flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/40 leading-snug">{tpl.desc}</p>
                </div>
                <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${
                  selected ? 'border-[#C9187F]/50 bg-[#C9187F]/15 text-[#C9187F]' : 'border-white/10 bg-white/5 text-white/40'
                }`}>
                  {tpl.badge}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {!config.templateId && (
        <p className="text-xs text-white/30 text-center">← Chọn một template để tiếp tục</p>
      )}
    </div>
  )
}
