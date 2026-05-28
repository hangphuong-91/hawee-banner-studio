// ── WizardShell — 6-step design flow ─────────────────────────────────────────
import { useState } from 'react'
import SettingsModal     from '../modals/SettingsModal.jsx'
import StepStyleGallery  from './StepStyleGallery.jsx'
import StepSizePicker    from './StepSizePicker.jsx'
import StepBgPicker      from './StepBgPicker.jsx'
import StepTextInput     from './StepTextInput.jsx'
import StepLogoSelector  from './StepLogoSelector.jsx'
import StepVisualCue     from './StepVisualCue.jsx'
import { useBanner }     from '../../context/BannerContext.jsx'

const STEPS = [
  { n: 1, title: 'Phong cách thiết kế',  subtitle: 'Xem các style HAWEE để lấy cảm hứng',       skip: false },
  { n: 2, title: 'Kích thước banner',    subtitle: 'Chọn tỷ lệ phù hợp với kênh xuất bản',       skip: false },
  { n: 3, title: 'Chọn nền banner',      subtitle: 'Aura HAWEE hoặc Futuristic abstract',         skip: false },
  { n: 4, title: 'Nội dung & text',      subtitle: 'Điền tên chương trình, ngày giờ, địa điểm',  skip: false },
  { n: 5, title: 'Logo & Chi hội',       subtitle: 'Chọn phiên bản logo HAWEE và chi hội',        skip: false },
  { n: 6, title: 'Visual Cue',           subtitle: 'Thêm icon từ thư viện hoặc AI Generate',     skip: true  },
]

export default function WizardShell({ onDone, onHome }) {
  const { config } = useBanner()
  const [step, setStep]               = useState(1)
  const [showSettings, setShowSettings] = useState(false)

  const maxStep = STEPS.length
  const info    = STEPS.find(s => s.n === step) ?? STEPS[0]

  function next() {
    if (step < maxStep) setStep(s => s + 1)
    else onDone()
  }

  function back() {
    if (step > 1) setStep(s => s - 1)
    else onHome?.()
  }

  // Step 2 requires a format to be selected (has default so always ok)
  // Step 3 requires a background (has default aura-03)
  const canProceed = !(step === 3 && !config.backgroundId)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse at top, #1a0a20 0%, #0a0612 60%)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {onHome && (
            <>
              <button onClick={onHome} className="btn-ghost py-1.5 px-2.5 text-xs flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span className="hidden sm:inline">Home</span>
              </button>
              <div className="w-px h-5 bg-white/10" />
            </>
          )}
          <img src="/brand/logos/hawee-final-white-en.svg" alt="HAWEE" className="h-8"
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
          <span className="hidden text-white font-semibold">HAWEE</span>
          <div className="w-px h-6 bg-white/15" />
          <span className="text-sm text-white/50 font-medium hidden sm:inline">Banner Studio</span>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="btn-ghost w-8 h-8 p-0 flex items-center justify-center"
          title="Cài đặt"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
      </header>

      {/* Progress */}
      <div className="px-4 md:px-6 pt-4 pb-3">
        <div className="flex items-center gap-1.5">
          {STEPS.map(s => (
            <div key={s.n} className="flex items-center gap-1.5">
              <button
                onClick={() => s.n < step && setStep(s.n)}
                disabled={s.n > step}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  step === s.n ? 'bg-[#C9187F] text-white ring-2 ring-[#C9187F]/30' :
                  step > s.n   ? 'bg-[#C9187F]/20 text-[#C9187F] border border-[#C9187F]/40 cursor-pointer hover:bg-[#C9187F]/30' :
                                 'bg-white/5 text-white/25 border border-white/10 cursor-default'
                }`}
              >
                {step > s.n ? '✓' : s.n}
              </button>
              {s.n < maxStep && (
                <div className={`h-px flex-1 w-6 md:w-12 transition-all ${step > s.n ? 'bg-[#C9187F]/50' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
          <span className="text-xs text-white/25 ml-1">{step}/{maxStep}</span>
        </div>
      </div>

      {/* Step content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-4">
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-white">{info.title}</h1>
              {info.skip && (
                <span className="text-[10px] text-white/30 border border-white/15 rounded-full px-2 py-0.5">
                  Tùy chọn
                </span>
              )}
            </div>
            <p className="text-sm text-white/50">{info.subtitle}</p>
          </div>

          {step === 1 && <StepStyleGallery />}
          {step === 2 && <StepSizePicker />}
          {step === 3 && <StepBgPicker />}
          {step === 4 && <StepTextInput />}
          {step === 5 && <StepLogoSelector />}
          {step === 6 && <StepVisualCue />}
        </div>
      </main>

      {/* Footer navigation */}
      <footer className="px-4 md:px-6 py-3 md:py-4 border-t border-white/10 flex items-center justify-between">
        <button onClick={back} className="btn-ghost">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          {step === 1 ? 'Home' : 'Quay lại'}
        </button>

        <div className="flex items-center gap-2">
          {/* Skip button for optional steps */}
          {info.skip && step < maxStep && (
            <button onClick={next} className="btn-ghost text-sm text-white/40 hover:text-white/65">
              Bỏ qua
            </button>
          )}

          <button
            onClick={next}
            disabled={!canProceed}
            className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {step < maxStep ? (
              <>
                Tiếp theo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </>
            ) : (
              <>
                Mở Canvas Editor
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </footer>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}
