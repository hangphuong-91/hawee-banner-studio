export default function FormatCard({ format, selected, onSelect }) {
  const aspectW = format.w / Math.max(format.w, format.h)
  const aspectH = format.h / Math.max(format.w, format.h)
  const previewW = Math.round(aspectW * 60)
  const previewH = Math.round(aspectH * 60)

  return (
    <button
      onClick={() => onSelect(format.id)}
      className={`
        flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-200
        ${selected
          ? 'border-[#C9187F] bg-[#C9187F15] shadow-lg shadow-[#C9187F22]'
          : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8'
        }
      `}
    >
      {/* Aspect ratio preview */}
      <div className="flex items-center justify-center w-16 h-16">
        <div
          className={`rounded border-2 transition-all ${selected ? 'border-[#C9187F] bg-[#C9187F22]' : 'border-white/30 bg-white/10'}`}
          style={{ width: previewW, height: previewH }}
        />
      </div>
      <div className="text-center">
        <div className={`text-sm font-semibold ${selected ? 'text-[#C9187F]' : 'text-white'}`}>
          {format.aspect}
        </div>
        <div className="text-xs text-white/50 mt-0.5">{format.label}</div>
        <div className="text-[10px] text-white/30 mt-1">{format.desc}</div>
      </div>
      {selected && (
        <div className="w-2 h-2 rounded-full bg-[#C9187F]" />
      )}
    </button>
  )
}
