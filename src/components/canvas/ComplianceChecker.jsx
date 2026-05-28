import { useCompliance } from '../../hooks/useCompliance.js'
import { useBanner } from '../../context/BannerContext.jsx'

const SEVERITY_STYLE = {
  error:   'compliance-fail',
  warning: 'compliance-warn',
  info:    'compliance-info',
}

export default function ComplianceChecker({ canvas, onClose }) {
  const { config }                                      = useBanner()
  const { ruleResults, summary, aiResult, aiLoading, runAICheck } = useCompliance(canvas, config)

  return (
    <div className="h-full flex flex-col glass-dark border-l border-white/10">
      {/* Header */}
      <div className="panel-header">
        <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Brand Check</span>
        <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Summary */}
        <div className={`rounded-xl p-3 text-center ${
          summary.errors === 0
            ? 'bg-emerald-500/10 border border-emerald-500/20'
            : 'bg-rose-500/10 border border-rose-500/20'
        }`}>
          <div className={`text-2xl font-bold ${summary.errors === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {summary.passed}/{summary.total}
          </div>
          <div className="text-xs text-white/50 mt-0.5">
            {summary.errors === 0
              ? '✅ Đạt brand guideline'
              : `❌ ${summary.errors} lỗi · ${summary.warnings} cảnh báo`
            }
          </div>
        </div>

        {/* Rule results */}
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">Kiểm tra tự động</p>
          <div className="space-y-1.5">
            {ruleResults.map(r => (
              <div
                key={r.id}
                className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${SEVERITY_STYLE[r.severity] ?? ''}`}
              >
                <span className="shrink-0 text-base">
                  {r.pass ? '✅' : r.severity === 'error' ? '❌' : r.severity === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <span className="flex-1">{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Check */}
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">AI Deep Check</p>
          <p className="text-xs text-white/30 mb-3">
            GPT-4o Vision phân tích toàn bộ banner về thẩm mỹ, phân cấp thông tin và tính nhất quán brand.
          </p>

          {aiResult ? (
            <div className="space-y-3">
              {/* Score */}
              <div className={`rounded-xl p-3 text-center ${
                aiResult.score >= 80 ? 'bg-emerald-500/10 border border-emerald-500/20' :
                aiResult.score >= 60 ? 'bg-amber-500/10 border border-amber-500/20' :
                                       'bg-rose-500/10 border border-rose-500/20'
              }`}>
                <div className={`text-3xl font-bold ${
                  aiResult.score >= 80 ? 'text-emerald-400' :
                  aiResult.score >= 60 ? 'text-amber-400' :
                                        'text-rose-400'
                }`}>{aiResult.score}/100</div>
                <div className="text-xs text-white/50 mt-0.5">AI Brand Score</div>
              </div>

              {/* Issues */}
              {aiResult.issues?.length > 0 && (
                <div>
                  <p className="text-xs text-rose-400/80 font-semibold mb-1.5">Vấn đề</p>
                  <ul className="space-y-1">
                    {aiResult.issues.map((issue, i) => (
                      <li key={i} className="text-xs text-white/60 flex gap-1.5">
                        <span className="text-rose-400 shrink-0">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {aiResult.suggestions?.length > 0 && (
                <div>
                  <p className="text-xs text-emerald-400/80 font-semibold mb-1.5">Đề xuất</p>
                  <ul className="space-y-1">
                    {aiResult.suggestions.map((s, i) => (
                      <li key={i} className="text-xs text-white/60 flex gap-1.5">
                        <span className="text-emerald-400 shrink-0">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={runAICheck}
                disabled={aiLoading}
                className="btn-ghost text-xs w-full justify-center"
              >
                Kiểm tra lại
              </button>
            </div>
          ) : (
            <button
              onClick={runAICheck}
              disabled={aiLoading}
              className="btn-outline w-full justify-center text-sm py-2.5"
            >
              {aiLoading ? (
                <><div className="w-4 h-4 border-2 border-[#C9187F] border-t-transparent rounded-full animate-spin" /> Đang phân tích...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg> Chạy AI Check</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
