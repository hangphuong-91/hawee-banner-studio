// ── Step 4: Nhập nội dung văn bản ────────────────────────────────────────────
import { useRef } from 'react'
import { useBanner } from '../../context/BannerContext.jsx'

// ── Speaker photo uploader ──────────────────────────────────────────────────
function PhotoUploader({ photoUrl, onChange }) {
  const inputRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => onChange(evt.target.result)
    reader.readAsDataURL(file)
    // reset input so same file can be re-selected
    e.target.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-20 h-20 rounded-full border-2 border-dashed transition-all overflow-hidden
                   flex items-center justify-center bg-white/[0.04] relative group
                   border-white/20 hover:border-[#C9187F]/70"
      >
        {photoUrl ? (
          <>
            <img src={photoUrl} alt="Speaker" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                            flex items-center justify-center transition-opacity">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-white/25 group-hover:text-[#C9187F]/70 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="text-[9px] font-medium">Ảnh</span>
          </div>
        )}
      </button>
      {photoUrl && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-[10px] text-white/25 hover:text-rose-400 transition-colors"
        >
          Xóa ảnh
        </button>
      )}
      {!photoUrl && (
        <span className="text-[10px] text-white/20 text-center leading-tight">
          Tùy<br />chọn
        </span>
      )}
    </div>
  )
}

function Field({ label, hint, value, onChange, placeholder, maxLen, multiline }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-semibold text-white/70">{label}</label>
        {hint && <span className="text-[10px] text-white/25">{hint}</span>}
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLen}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white
                     placeholder-white/25 focus:outline-none focus:border-[#C9187F]/60 focus:bg-white/8
                     resize-none transition-colors"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLen}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white
                     placeholder-white/25 focus:outline-none focus:border-[#C9187F]/60 focus:bg-white/8
                     transition-colors"
        />
      )}
      {maxLen && value && (
        <div className="text-right text-[10px] text-white/25 mt-1">{value.length}/{maxLen}</div>
      )}
    </div>
  )
}

export default function StepTextInput() {
  const { config, updateConfig } = useBanner()

  const set = (key) => (val) => updateConfig({ [key]: val })
  const setSpeaker0 = (key) => (val) => {
    const sp = [...(config.speakers ?? [])]
    sp[0] = { ...(sp[0] ?? {}), [key]: val }
    updateConfig({ speakers: sp })
  }

  return (
    <div className="space-y-5">
      {/* Tên chương trình + Tiêu đề */}
      <div className="glass rounded-xl p-4 space-y-4">
        <p className="text-xs text-white/35 uppercase tracking-wider font-semibold">Thông tin chương trình</p>

        <Field
          label="Tên chương trình / Dòng kéo"
          hint="Nhỏ — dùng làm badge hoặc eyebrow text"
          value={config.programName ?? ''}
          onChange={set('programName')}
          placeholder="VD: HAWEE Empower Lunch · Q2 2026"
          maxLen={60}
        />

        <Field
          label="Tiêu đề chính (Headline)"
          hint="Nổi bật nhất — 2-3 dòng, có lực"
          value={config.headline ?? ''}
          onChange={set('headline')}
          placeholder="VD: Kỹ Năng Số Cho Nữ Lãnh Đạo"
          maxLen={100}
          multiline
        />

        <Field
          label="Tagline / Subheadline"
          hint="Tùy chọn"
          value={config.tagline ?? ''}
          onChange={set('tagline')}
          placeholder="VD: Cùng nhau bứt phá — Lan tỏa giá trị"
          maxLen={80}
        />
      </div>

      {/* Ngày giờ địa điểm */}
      <div className="glass rounded-xl p-4 space-y-4">
        <p className="text-xs text-white/35 uppercase tracking-wider font-semibold">Thời gian & Địa điểm</p>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Ngày tổ chức"
            value={config.date ?? ''}
            onChange={set('date')}
            placeholder="VD: Thứ 6 · 26/06/2026"
            maxLen={40}
          />
          <Field
            label="Giờ"
            value={config.time ?? ''}
            onChange={set('time')}
            placeholder="VD: 11:30 – 13:30"
            maxLen={30}
          />
        </div>

        <Field
          label="Địa điểm"
          value={config.location ?? ''}
          onChange={set('location')}
          placeholder="VD: Ambrosia Cafe Bistro, TP.HCM"
          maxLen={80}
        />
      </div>

      {/* Diễn giả */}
      <div className="glass rounded-xl p-4 space-y-4">
        <div className="flex items-baseline justify-between">
          <p className="text-xs text-white/35 uppercase tracking-wider font-semibold">Diễn giả / Nhân vật chính</p>
          <span className="text-[10px] text-white/25">Tùy chọn</span>
        </div>

        <div className="flex items-start gap-4">
          {/* Photo upload */}
          <PhotoUploader
            photoUrl={config.speakers?.[0]?.photoUrl ?? null}
            onChange={(url) => {
              const sp = [...(config.speakers ?? [])]
              sp[0] = { ...(sp[0] ?? {}), photoUrl: url }
              updateConfig({ speakers: sp, canvasVersion: (config.canvasVersion ?? 0) + 1 })
            }}
          />

          {/* Text fields */}
          <div className="flex-1 space-y-3">
            <Field
              label="Họ và tên"
              value={config.speakers?.[0]?.name ?? ''}
              onChange={setSpeaker0('name')}
              placeholder="VD: Nguyễn Thị A"
              maxLen={50}
            />
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Chức vụ"
                value={config.speakers?.[0]?.title ?? ''}
                onChange={setSpeaker0('title')}
                placeholder="CEO & Founder"
                maxLen={40}
              />
              <Field
                label="Công ty"
                value={config.speakers?.[0]?.organization ?? ''}
                onChange={setSpeaker0('organization')}
                placeholder="HAWEE Group"
                maxLen={50}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Badge / CTA */}
      <div className="glass rounded-xl p-4 space-y-4">
        <p className="text-xs text-white/35 uppercase tracking-wider font-semibold">Badge & CTA</p>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Badge pill"
            hint="Tùy chọn"
            value={config.badgeText ?? ''}
            onChange={set('badgeText')}
            placeholder="VD: Miễn phí hội viên"
            maxLen={30}
          />
          <Field
            label="Call to Action"
            hint="Tùy chọn"
            value={config.ctaText ?? ''}
            onChange={set('ctaText')}
            placeholder="VD: Đăng ký ngay"
            maxLen={30}
          />
        </div>
      </div>

      <p className="text-[11px] text-white/25 text-center">
        Tất cả nội dung có thể chỉnh trực tiếp trên canvas sau bước này.
      </p>
    </div>
  )
}
