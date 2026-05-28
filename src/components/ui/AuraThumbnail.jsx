export default function AuraThumbnail({ aura, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(aura.id)}
      className={`
        relative rounded-xl overflow-hidden transition-all duration-200 aspect-square
        ${selected
          ? 'ring-2 ring-[#C9187F] ring-offset-2 ring-offset-[#0f0a14] scale-105'
          : 'hover:scale-105 hover:ring-1 hover:ring-white/30'
        }
      `}
      title={aura.label}
    >
      <img
        src={aura.src}
        alt={aura.label}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {selected && (
        <div className="absolute inset-0 bg-[#C9187F22] flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-[#C9187F] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-white text-[9px] font-medium truncate">{aura.label}</p>
      </div>
    </button>
  )
}
