import { CHI_HOI } from '../../lib/brandConfig.js'

export default function ChiHoiSelector({ selected, onSelect }) {
  return (
    <div>
      <label className="label-brand">Chi hội</label>
      <div className="grid grid-cols-4 gap-2">
        {CHI_HOI.map(ch => (
          <button
            key={ch.id}
            onClick={() => onSelect(ch.id)}
            className={`
              flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs transition-all duration-200
              ${selected === ch.id
                ? 'border-[#C9187F] bg-[#C9187F15] text-[#C9187F]'
                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white'
              }
            `}
          >
            {ch.logo ? (
              <img src={ch.logo} alt={ch.label} className="h-6 w-auto object-contain" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xs">–</span>
              </div>
            )}
            <span className="font-medium text-center leading-tight" style={{ fontSize: '10px' }}>
              {ch.id === 'none' ? 'Không có' : ch.id.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
