import { useState } from 'react'
import WizardShell from '../components/wizard/WizardShell.jsx'
import Step5Canvas from '../components/wizard/Step5Canvas.jsx'
import AuditPage   from './AuditPage.jsx'
import { useBanner } from '../context/BannerContext.jsx'

// mode: 'home' | 'design' | 'canvas' | 'audit'
export default function Studio() {
  const [mode, setMode] = useState('home')
  const { config } = useBanner()

  if (mode === 'canvas') return <Step5Canvas onBack={() => setMode('design')} />
  if (mode === 'design') return <WizardShell onDone={() => setMode('canvas')} onHome={() => setMode('home')} />
  if (mode === 'audit')  return <AuditPage onBack={() => setMode('home')} />

  /* ── Home screen ── */
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at top left, #200a30 0%, #0a0612 55%)' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src="/brand/logos/hawee-horizontal-en.svg" alt="HAWEE" className="h-8"
            onError={e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block' }}
          />
          <span className="hidden text-white font-semibold text-lg">HAWEE</span>
          <div className="w-px h-6 bg-white/15" />
          <span className="text-sm text-white/50 font-medium">Banner Studio</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 tag-pill mb-5 text-xs">
            ✨ HAWEE Banner Studio
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-3">
            Tạo banner đúng Brand Guideline
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Chọn kích thước → nền HAWEE → điền text → AI visual cue → xuất PNG chất lượng cao.
          </p>
        </div>

        {/* 2 primary options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">

          {/* Thiết kế mới — PRIMARY */}
          <button
            onClick={() => setMode('design')}
            className="group glass rounded-2xl p-8 text-left border border-[#C9187F]/30 bg-[#C9187F08]
                       hover:bg-[#C9187F14] hover:border-[#C9187F]/55 transition-all duration-300
                       hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(201,24,127,0.2)]"
          >
            {/* Animated icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#C9187F20] flex items-center justify-center mb-5
                            group-hover:bg-[#C9187F30] transition-colors">
              <svg className="w-7 h-7 text-[#C9187F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-xl font-semibold text-white">Thiết kế mới</h2>
              <span className="flex-shrink-0 text-[10px] bg-[#C9187F] text-white px-2 py-0.5 rounded-full font-semibold mt-1">
                6 bước
              </span>
            </div>
            <p className="text-sm text-white/45 leading-relaxed mb-5">
              Chọn phong cách → kích thước → nền HAWEE → điền text → AI visual cue → canvas editor.
            </p>
            {/* Mini step preview */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Phong cách','Kích thước','Nền','Text','Logo','Cue'].map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#C9187F]/70 px-2 py-0.5 rounded-full border border-[#C9187F]/25 bg-[#C9187F]/8">
                    {s}
                  </span>
                  {i < 5 && <span className="text-white/20 text-[10px]">›</span>}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-5 text-[#C9187F] text-xs font-semibold">
              Bắt đầu thiết kế
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          {/* Audit banner */}
          <button
            onClick={() => setMode('audit')}
            className="group glass rounded-2xl p-8 text-left hover:bg-white/[0.06] hover:border-[#C9187F]/35
                       border border-white/10 transition-all duration-300 hover:-translate-y-1
                       hover:shadow-[0_0_32px_rgba(201,24,127,0.12)]"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#C9187F18] flex items-center justify-center mb-5
                            group-hover:bg-[#C9187F25] transition-colors">
              <svg className="w-7 h-7 text-[#C9187F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">AI Brand Audit</h2>
            <p className="text-sm text-white/45 leading-relaxed mb-5">
              Upload banner đã thiết kế — GPT-4o Vision chấm điểm 8 hạng mục theo Brand Guideline 2026 và đề xuất hướng sửa.
            </p>
            {/* Score preview */}
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: '≥85 Pass',   color: 'text-emerald-400/80' },
                { label: '70-84 Sửa', color: 'text-amber-400/80' },
                { label: '<70 Không đạt', color: 'text-rose-400/80' },
              ].map(({ label, color }) => (
                <span key={label} className={`text-[10px] ${color}`}>{label}</span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-5 text-[#C9187F] text-xs font-semibold">
              Upload & Kiểm tra
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        </div>

        {/* Sizes badge strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <span className="text-xs text-white/20">Kích thước hỗ trợ:</span>
          {['2048×2048', '1920×1080', '1080×1350'].map(f => (
            <span key={f} className="tag-pill text-[10px] px-2.5 py-0.5">{f}</span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-[11px] text-white/15">
        HAWEE Banner Studio · xuất PNG 2× · Brand Guideline 2026 · Không lưu dữ liệu
      </footer>
    </div>
  )
}
