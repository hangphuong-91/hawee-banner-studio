import { useState, useEffect } from 'react'
import {
  getStoredApiKey,    saveApiKey,
  getStoredGeminiKey, saveGeminiKey,
  useOpenAI,
} from '../../hooks/useOpenAI.js'

export default function SettingsModal({ onClose }) {
  const [openaiKey, setOpenaiKey]   = useState('')
  const [geminiKey, setGeminiKey]   = useState('')
  const [saved, setSaved]           = useState(false)
  const { refreshKeyStatus }        = useOpenAI()

  useEffect(() => {
    setOpenaiKey(getStoredApiKey())
    setGeminiKey(getStoredGeminiKey())
  }, [])

  function handleSave() {
    saveApiKey(openaiKey.trim())
    saveGeminiKey(geminiKey.trim())
    refreshKeyStatus?.()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleClearOpenai() { saveApiKey(''); setOpenaiKey(''); refreshKeyStatus?.() }
  function handleClearGemini() { saveGeminiKey(''); setGeminiKey(''); refreshKeyStatus?.() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-md p-6 space-y-5 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Cài đặt API</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Gemini (FREE — recommended) ── */}
        <div className="glass rounded-xl p-4 space-y-3 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-sm font-semibold">✦ Google Gemini</span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              MIỄN PHÍ · Khuyên dùng
            </span>
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            Dùng cho <strong className="text-white/60">AI Brand Audit</strong>. Gemini 1.5 Flash — miễn phí 1,500 lượt/ngày, chất lượng tương đương GPT-4o Vision.
          </p>
          <div className="relative">
            <input
              type="password"
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
              placeholder="AIza..."
              className="input-brand pr-10"
              autoComplete="off"
            />
            {geminiKey && (
              <button
                onClick={handleClearGemini}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-emerald-400 hover:underline"
          >
            Lấy key miễn phí tại aistudio.google.com →
          </a>
        </div>

        {/* ── OpenAI (optional — DALL-E 3 + GPT-4o fallback) ── */}
        <div className="glass rounded-xl p-4 space-y-3 border border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-sm font-semibold">OpenAI</span>
            <span className="text-[10px] bg-white/5 text-white/30 border border-white/10 px-2 py-0.5 rounded-full">
              Tùy chọn
            </span>
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            Dùng cho <strong className="text-white/60">DALL-E 3</strong> (tạo visual cue chất lượng cao) và GPT-4o Vision (backup audit nếu Gemini lỗi).
          </p>
          <div className="relative">
            <input
              type="password"
              value={openaiKey}
              onChange={e => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="input-brand pr-10"
              autoComplete="off"
            />
            {openaiKey && (
              <button
                onClick={handleClearOpenai}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[#C9187F] hover:underline"
          >
            Lấy key tại platform.openai.com →
          </a>
        </div>

        {/* Info note */}
        <p className="text-[10px] text-white/20 text-center leading-relaxed">
          Keys được lưu trong trình duyệt của bạn (localStorage) — không gửi về bất kỳ server nào ngoài API tương ứng.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center text-sm">
            Hủy
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 justify-center text-sm ${saved ? 'btn-outline' : 'btn-primary'}`}
          >
            {saved ? '✅ Đã lưu!' : 'Lưu cài đặt'}
          </button>
        </div>
      </div>
    </div>
  )
}
