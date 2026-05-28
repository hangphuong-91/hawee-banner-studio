import { useRef, useState } from 'react'
import { useImageAudit } from '../hooks/useImageAudit.js'
import { getVerdict } from '../lib/complianceRules.js'
import SettingsModal from '../components/modals/SettingsModal.jsx'

// ── Category meta ──────────────────────────────────────────────────────────────
const CAT_META = {
  logo:       { label: 'Logo & nhận diện',       emoji: '🏷️', max: 15 },
  layout:     { label: 'Bố cục & thị giác',      emoji: '📐', max: 15 },
  dimensions: { label: 'Kích thước & đọc được',   emoji: '📏', max: 10 },
  colors:     { label: 'Màu sắc',                 emoji: '🎨', max: 15 },
  typography: { label: 'Font & typography',        emoji: '✍️', max: 15 },
  images:     { label: 'Hình ảnh & chất lượng',   emoji: '📷', max: 15 },
  mood:       { label: 'Mood & tone',              emoji: '✨', max: 10 },
  message:    { label: 'Thông điệp & nội dung',   emoji: '💬', max: 15 },
}

function scoreColor(score, max) {
  const p = score / max
  if (p >= 0.85) return 'text-emerald-400'
  if (p >= 0.70) return 'text-amber-400'
  return 'text-rose-400'
}
function barColor(score, max) {
  const p = score / max
  if (p >= 0.85) return 'bg-emerald-500'
  if (p >= 0.70) return 'bg-amber-500'
  return 'bg-rose-500'
}

// ── AI Verdict badge (only shows when AI result exists) ───────────────────────
function VerdictBadge({ verdict, score, failFlags }) {
  const flags = failFlags ?? []
  const isFailNgay = flags.length > 0 || verdict === 'fail-ngay'
  if (isFailNgay) return (
    <div className="rounded-2xl p-5 bg-rose-500/15 border-2 border-rose-500/40 text-center">
      <div className="text-4xl mb-1">🚫</div>
      <div className="text-2xl font-bold text-rose-400 mb-0.5">FAIL NGAY</div>
      <div className="text-xs text-rose-300/70">Vi phạm tiêu chí cứng</div>
      {score != null && <div className="text-sm text-white/40 mt-1">{score}/100 điểm</div>}
    </div>
  )
  if (score == null) return null
  const v = getVerdict(score)
  const c = {
    emerald: { bg: 'bg-emerald-500/12', border: 'border-emerald-500/35', text: 'text-emerald-400', sub: 'text-emerald-300/60' },
    amber:   { bg: 'bg-amber-500/12',   border: 'border-amber-500/35',   text: 'text-amber-400',   sub: 'text-amber-300/60' },
    rose:    { bg: 'bg-rose-500/12',     border: 'border-rose-500/35',     text: 'text-rose-400',   sub: 'text-rose-300/60' },
  }[v.color] ?? { bg:'bg-rose-500/12', border:'border-rose-500/35', text:'text-rose-400', sub:'text-rose-300/60' }
  return (
    <div className={`rounded-2xl p-5 ${c.bg} border-2 ${c.border} text-center`}>
      <div className="text-3xl mb-1">{v.emoji}</div>
      <div className={`text-3xl font-bold ${c.text} mb-0.5`}>{score}/100</div>
      <div className={`text-sm font-semibold ${c.text} mb-1`}>{v.label}</div>
      <div className={`text-xs ${c.sub}`}>
        {score >= 85 ? 'Đạt chuẩn Brand Guideline HAWEE 2026'
          : score >= 70 ? 'Cần chỉnh sửa trước khi publish'
          : 'Không đạt — cần thiết kế lại đáng kể'}
      </div>
    </div>
  )
}

// ── Category score bar ─────────────────────────────────────────────────────────
function CategoryRow({ cat }) {
  const meta  = CAT_META[cat.id] ?? { label: cat.label, emoji: '📋', max: cat.max }
  const score = cat.score ?? 0
  const max   = cat.max ?? meta.max
  const pct   = Math.min(score / max, 1) * 100
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/70 flex items-center gap-1.5">
          <span>{meta.emoji}</span>
          <span>{cat.label ?? meta.label}</span>
        </span>
        <span className={`font-semibold tabular-nums ${scoreColor(score, max)}`}>{score}/{max}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${barColor(score, max)}`} style={{ width: `${pct}%` }} />
      </div>
      {cat.issues?.length > 0 && (
        <ul className="space-y-0.5 pt-0.5">
          {cat.issues.map((issue, i) => (
            <li key={i} className="text-[11px] text-rose-300/70 flex gap-1.5 leading-relaxed">
              <span className="text-rose-400 shrink-0 mt-0.5">•</span>{issue}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Auto score donut-style pill ────────────────────────────────────────────────
function AutoScorePill({ autoScore, summary, analyzing }) {
  if (analyzing) return (
    <div className="flex items-center gap-2 text-xs text-white/40">
      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      Đang phân tích...
    </div>
  )
  if (autoScore == null) return null

  const pct  = autoScore / 60
  const color = pct >= 0.85 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/8'
              : pct >= 0.70 ? 'text-amber-400 border-amber-500/40 bg-amber-500/8'
              : 'text-rose-400 border-rose-500/40 bg-rose-500/8'
  const label = pct >= 0.85 ? 'Tốt' : pct >= 0.70 ? 'Cần cải thiện' : 'Nhiều vấn đề'
  const errors = summary.errors

  return (
    <div className={`rounded-xl border px-4 py-3 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold tabular-nums">{autoScore}<span className="text-sm font-normal opacity-60">/60</span></div>
          <div className="text-xs opacity-70 mt-0.5">Tự động — kỹ thuật + màu sắc + ảnh</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold">{label}</div>
          <div className="text-[10px] opacity-60 mt-0.5">{summary.passed}/{summary.total} checks passed</div>
          {errors > 0 && (
            <div className="text-[10px] text-rose-400/80 mt-0.5">{errors} lỗi quan trọng</div>
          )}
        </div>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            pct >= 0.85 ? 'bg-emerald-500' : pct >= 0.70 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${Math.round(pct * 100)}%` }}
        />
      </div>
      <p className="text-[10px] opacity-40 mt-1.5">
        +40 điểm còn lại cần AI hoặc kiểm tra thủ công (logo, font, nội dung, mood)
      </p>
    </div>
  )
}

// ── Fix suggestions ────────────────────────────────────────────────────────────
function FixSuggestions({ aiResult, quickChecks }) {
  const fixes = { critical: [], high: [], medium: [], low: [] }
  if (aiResult?.fail_flags?.length > 0) aiResult.fail_flags.forEach(f => fixes.critical.push({ text: f }))
  if (aiResult?.breakdown?.length > 0) {
    const sorted = [...aiResult.breakdown].sort((a, b) =>
      (a.score ?? 0) / (a.max ?? 1) - (b.score ?? 0) / (b.max ?? 1)
    )
    sorted.forEach(cat => cat.issues?.forEach(issue =>
      fixes.high.push({ category: cat.label ?? CAT_META[cat.id]?.label, text: issue })
    ))
  }
  if (aiResult?.suggestions?.length > 0) aiResult.suggestions.forEach(s => fixes.medium.push({ text: s }))
  quickChecks.filter(c => !c.pass).forEach(c =>
    fixes.low.push({ category: 'Kỹ thuật', text: `${c.label}: ${c.desc}` })
  )
  const hasAny = Object.values(fixes).some(arr => arr.length > 0)
  if (!hasAny) return null
  return (
    <div className="space-y-4">
      {fixes.critical.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">🚫 Vi phạm cứng — sửa ngay</p>
          <ul className="space-y-2">
            {fixes.critical.map((f, i) => (
              <li key={i} className="flex gap-2.5 text-xs leading-relaxed bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2.5">
                <span className="text-rose-400 shrink-0 font-bold">!</span>
                <span className="text-rose-200/80">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {fixes.high.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">⚠️ Cần sửa</p>
          <ul className="space-y-1.5">
            {fixes.high.map((f, i) => (
              <li key={i} className="flex gap-2.5 text-xs leading-relaxed">
                <span className="text-amber-400 shrink-0 mt-0.5">→</span>
                <span className="text-white/65">
                  {f.category && <span className="text-white/30">[{f.category}] </span>}
                  {f.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {fixes.medium.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-sky-400/80 uppercase tracking-wider mb-2">💡 Đề xuất nâng cao</p>
          <ul className="space-y-1.5">
            {fixes.medium.map((f, i) => (
              <li key={i} className="flex gap-2.5 text-xs leading-relaxed">
                <span className="text-sky-400 shrink-0 mt-0.5">→</span>
                <span className="text-white/55">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {fixes.low.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">📋 Lưu ý kỹ thuật</p>
          <ul className="space-y-1.5">
            {fixes.low.map((f, i) => (
              <li key={i} className="flex gap-2.5 text-xs leading-relaxed">
                <span className="text-white/30 shrink-0 mt-0.5">·</span>
                <span className="text-white/40">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AuditPage({ onBack }) {
  const fileRef = useRef(null)
  const [showSettings, setShowSettings] = useState(false)
  const {
    file, previewUrl, quickChecks, summary, autoScore,
    analyzing, aiResult, aiLoading, aiError,
    loadFile, runAICheck, reset, hasKey, hasGeminiKey, hasAnyKey,
  } = useImageAudit()

  function handleDrop(e) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f && f.type.startsWith('image/')) loadFile(f)
  }
  function handleInput(e) {
    const f = e.target.files?.[0]
    if (f) loadFile(f)
    e.target.value = ''
  }

  const hasAIResult  = !!aiResult
  const hasFailFlags = (aiResult?.fail_flags?.length ?? 0) > 0

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at top, #1a0a20 0%, #0a0612 60%)' }}
    >
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn-ghost py-1.5 px-2.5 text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Quay lại
          </button>
          <div className="w-px h-5 bg-white/10" />
          <img src="/brand/logos/hawee-final-white-en.svg" alt="HAWEE" className="h-7"
            onError={e => { e.target.style.display = 'none' }} />
          <div className="w-px h-5 bg-white/10 hidden sm:block" />
          <span className="text-sm text-white/50 font-medium hidden sm:block">Brand Audit</span>
        </div>
        <button onClick={() => setShowSettings(true)}
          className="btn-ghost w-8 h-8 p-0 flex items-center justify-center" title="Cài đặt API key">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">

          {!previewUrl ? (
            /* ── Upload screen ── */
            <div>
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 tag-pill mb-4">
                  <span>🔍</span> HAWEE Brand Audit
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                  Kiểm tra Banner theo Brand Guideline 2026
                </h1>
                <p className="text-white/50 text-sm max-w-lg mx-auto leading-relaxed">
                  Upload banner → phân tích pixel tức thì (không cần API key) +
                  tùy chọn AI Gemini để chấm điểm đầy đủ 8 hạng mục.
                </p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleInput} />
              <div
                onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-2xl border-2 border-dashed border-white/20
                           hover:border-[#C9187F] hover:bg-[#C9187F06] transition-all duration-300
                           flex flex-col items-center gap-4 py-14 px-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#C9187F18] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#C9187F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-lg">Kéo thả hoặc click để upload</p>
                  <p className="text-white/40 text-sm mt-1">JPG, PNG, WebP — tối đa 10 MB</p>
                </div>
              </div>

              {/* Two-tier audit explanation */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">⚡</span>
                    <span className="text-sm font-semibold text-white/80">Tự động — Không cần key</span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Phân tích pixel tức thì: màu sắc, độ phân giải, tỷ lệ khung, độ sắc nét, bảng màu brand.
                    11 checks — chạy ngay khi upload.
                  </p>
                </div>
                <div className="glass rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#C9187F]">🤖</span>
                    <span className="text-sm font-semibold text-white/80">AI Gemini — Tùy chọn</span>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">Miễn phí</span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Thêm Gemini key (free từ aistudio.google.com) để chấm điểm đầy đủ 8 hạng mục:
                    logo, bố cục, font, mood & tone, thông điệp.
                  </p>
                </div>
              </div>

              <div className="mt-4 glass rounded-2xl p-4">
                <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-3">Thang điểm 8 hạng mục</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(CAT_META).map(([id, m]) => (
                    <div key={id} className="flex items-center gap-2 text-xs text-white/50">
                      <span>{m.emoji}</span>
                      <span className="truncate">{m.label}</span>
                      <span className="text-white/25 shrink-0">{m.max}đ</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          ) : (
            /* ── Results screen ── */
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Kết quả Brand Audit</h2>
                <button onClick={reset} className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Upload banner khác
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* ─ Left: image + quick checklist ─ */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30">
                    <img src={previewUrl} alt="Banner" className="w-full object-contain max-h-72 md:max-h-96" />
                  </div>
                  {file && (
                    <p className="text-[11px] text-white/25 text-center">
                      {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  )}

                  {/* AI verdict (only when AI result exists) */}
                  {hasAIResult && (
                    <VerdictBadge
                      verdict={aiResult.verdict}
                      score={aiResult.score}
                      failFlags={aiResult.fail_flags}
                    />
                  )}

                  {/* Quick pixel checks — always shown */}
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">
                        ⚡ Kiểm tra tự động ({summary.passed}/{summary.total})
                      </p>
                      {summary.errors > 0 && (
                        <span className="text-[10px] text-rose-400/80">{summary.errors} lỗi quan trọng</span>
                      )}
                    </div>
                    {analyzing ? (
                      <div className="flex items-center gap-2 text-xs text-white/40 py-3">
                        <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                        Đang phân tích pixel...
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {/* Group by category */}
                        {['dimensions', 'colors', 'images'].map(cat => {
                          const catChecks = quickChecks.filter(c => c.category === cat)
                          if (!catChecks.length) return null
                          const catMeta = { dimensions: '📏 Kích thước', colors: '🎨 Màu sắc', images: '📷 Hình ảnh' }
                          return (
                            <div key={cat}>
                              <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1 mt-2 first:mt-0">
                                {catMeta[cat]}
                              </p>
                              {catChecks.map(c => (
                                <div key={c.id} className="flex items-start gap-2 text-[11px] py-1">
                                  <span className="shrink-0 mt-0.5 text-sm leading-none">
                                    {c.pass ? '✅' : c.severity === 'error' ? '❌' : c.severity === 'warning' ? '⚠️' : 'ℹ️'}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <span className={c.pass ? 'text-white/50' : c.severity === 'error' ? 'text-rose-300/90' : 'text-amber-300/80'}>
                                      {c.label}
                                    </span>
                                    {c.detail && (
                                      <span className="text-white/25 text-[10px] ml-1.5">{c.detail}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* ─ Right: auto score + manual checklist + optional AI ─ */}
                <div className="lg:col-span-3 space-y-5">

                  {/* ── Auto score (always shown) ── */}
                  {!analyzing && quickChecks.length > 0 && (
                    <AutoScorePill autoScore={autoScore} summary={summary} analyzing={analyzing} />
                  )}

                  {/* ── Manual review checklist (always shown) ── */}
                  {!analyzing && (
                    <div className="glass rounded-xl p-4 space-y-2.5">
                      <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">
                        👁 Cần kiểm tra thủ công hoặc AI
                      </p>
                      <p className="text-xs text-white/30 leading-relaxed">
                        Pixel analysis không thể kiểm tra 5 hạng mục sau — cần quan sát trực tiếp hoặc dùng AI Gemini:
                      </p>
                      {[
                        { emoji: '🏷️', label: 'Logo HAWEE đúng phiên bản, không bóp méo, đủ safe zone' },
                        { emoji: '📐', label: 'Bố cục — phân cấp thông tin rõ, cân bằng ảnh–chữ' },
                        { emoji: '✍️', label: 'Font Mona Sans, phân cấp chữ đúng, không lỗi dấu' },
                        { emoji: '✨', label: 'Mood & tone — tinh thần HAWEE: tỏa sáng, nữ tính hiện đại' },
                        { emoji: '💬', label: 'Thông điệp — headline sắc, đúng định vị nữ lãnh đạo' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs">
                          <span className="text-white/30 shrink-0 mt-0.5">{item.emoji}</span>
                          <span className="text-white/40 leading-relaxed">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── AI analysis section (optional, never blocks) ── */}
                  {!analyzing && (
                    <div className="glass rounded-xl p-4 space-y-3">

                      {!hasAIResult ? (
                        <>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-white/70 font-semibold flex items-center gap-2">
                              🤖 AI Brand Audit
                              <span className="text-xs font-normal text-white/30">— Tùy chọn</span>
                            </p>
                            {hasGeminiKey && (
                              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                Gemini · Free
                              </span>
                            )}
                            {!hasGeminiKey && hasKey && (
                              <span className="text-[10px] bg-[#C9187F]/15 text-[#C9187F] border border-[#C9187F]/30 px-2 py-0.5 rounded-full">
                                GPT-4o
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/35 leading-relaxed">
                            Chấm điểm đầy đủ 8 hạng mục (100 điểm): logo, bố cục, font, mood, thông điệp — kèm đề xuất cụ thể.
                          </p>

                          {/* Error state (if previous attempt failed) */}
                          {aiError && (
                            <div className="rounded-lg px-3 py-2.5 bg-rose-500/15 border border-rose-500/30 space-y-1">
                              <p className="text-xs font-semibold text-rose-300">Lỗi khi gọi AI</p>
                              <p className="text-[11px] text-rose-300/65 leading-relaxed break-words">{aiError}</p>
                            </div>
                          )}

                          {!hasAnyKey ? (
                            /* ── No key: soft prompt (never blocking) ── */
                            <div className="space-y-2">
                              <p className="text-[11px] text-white/35 leading-relaxed">
                                Thêm <span className="text-emerald-400 font-medium">Gemini API key miễn phí</span> để nhận phân tích AI đầy đủ.
                                Lấy key tại{' '}
                                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                                  className="text-emerald-400 underline">aistudio.google.com</a>{' '}
                                (1,500 lượt/ngày, không cần thẻ).
                              </p>
                              <button onClick={() => setShowSettings(true)} className="btn-outline text-xs py-2 px-4">
                                ⚙ Thêm Gemini key
                              </button>
                            </div>
                          ) : (
                            /* ── Has key: show run button ── */
                            <button
                              onClick={runAICheck}
                              disabled={aiLoading}
                              className="btn-primary w-full justify-center py-3 gap-2"
                            >
                              {aiLoading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  AI đang phân tích... (~15-20s)
                                </>
                              ) : (
                                <>{aiError ? '↻ Thử lại AI Brand Audit' : '🤖 Chạy AI Brand Audit (8 hạng mục)'}</>
                              )}
                            </button>
                          )}
                        </>

                      ) : (
                        /* ── AI result exists ── */
                        <>
                          {hasFailFlags && (
                            <div className="rounded-xl p-3 bg-rose-500/15 border-2 border-rose-500/40">
                              <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">🚫 Vi phạm cứng (FAIL NGAY)</p>
                              <ul className="space-y-1">
                                {aiResult.fail_flags.map((f, i) => (
                                  <li key={i} className="text-xs text-rose-200/80 flex gap-2">
                                    <span className="text-rose-400 shrink-0">✗</span>{f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="space-y-3">
                            <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">Chi tiết 8 hạng mục</p>
                            {aiResult.breakdown?.length > 0
                              ? aiResult.breakdown.map(cat => <CategoryRow key={cat.id} cat={cat} />)
                              : <p className="text-xs text-white/30">Không có dữ liệu breakdown.</p>
                            }
                          </div>
                          <button onClick={runAICheck} disabled={aiLoading}
                            className="btn-ghost text-xs w-full justify-center py-2 gap-1.5">
                            {aiLoading
                              ? <><div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /> Đang kiểm tra lại...</>
                              : '↻ Kiểm tra lại'}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* ── Fix suggestions (from AI or quick checks) ── */}
                  {(hasAIResult || quickChecks.some(c => !c.pass)) && (
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-3">
                        🛠 Hướng sửa cụ thể
                      </p>
                      <FixSuggestions aiResult={aiResult} quickChecks={quickChecks} />
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}
