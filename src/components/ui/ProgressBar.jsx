const STEPS = [
  { n: 1, label: 'Format' },
  { n: 2, label: 'Nền & Chi hội' },
  { n: 3, label: 'Thông tin' },
  { n: 4, label: 'Diễn giả' },
  { n: 5, label: 'Canvas & Xuất' },
]

export default function ProgressBar({ current }) {
  return (
    <div className="flex items-center gap-0 w-full max-w-2xl mx-auto">
      {STEPS.map((step, i) => {
        const state = step.n < current ? 'done' : step.n === current ? 'active' : 'pending'
        return (
          <div key={step.n} className="flex items-center flex-1 min-w-0">
            {/* Node */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                ${state === 'done'    ? 'bg-[#C9187F22] text-[#C9187F] border border-[#C9187F44]' : ''}
                ${state === 'active'  ? 'bg-[#C9187F] text-white shadow-lg shadow-[#C9187F44]' : ''}
                ${state === 'pending' ? 'bg-white/5 text-white/30 border border-white/10' : ''}
              `}>
                {state === 'done'
                  ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  : step.n
                }
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${
                state === 'active' ? 'text-[#C9187F]' : 'text-white/40'
              }`}>{step.label}</span>
            </div>
            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 transition-all ${
                step.n < current ? 'bg-[#C9187F44]' : 'bg-white/10'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
