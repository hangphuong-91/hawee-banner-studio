export default function ModeCard({ mode, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(mode.id)}
      className={`
        flex flex-col items-start gap-2 p-4 rounded-2xl border text-left transition-all duration-200 w-full
        ${selected
          ? 'border-[#C9187F] bg-[#C9187F15] shadow-lg shadow-[#C9187F22]'
          : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8'
        }
      `}
    >
      {mode.preview && (
        <div className="w-full h-16 rounded-lg overflow-hidden mb-1">
          <img src={mode.preview} alt={mode.label} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-xl">{mode.icon}</span>
        <span className={`font-semibold text-sm ${selected ? 'text-[#C9187F]' : 'text-white'}`}>
          {mode.label}
        </span>
      </div>
      <p className="text-xs text-white/50 leading-relaxed">{mode.desc}</p>
      {selected && (
        <div className="flex items-center gap-1 text-[#C9187F] text-xs font-medium">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          Đã chọn
        </div>
      )}
    </button>
  )
}
