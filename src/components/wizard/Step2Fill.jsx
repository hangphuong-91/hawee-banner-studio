import { useRef, useState } from 'react'
import { useBanner } from '../../context/BannerContext.jsx'
import { getTemplate } from '../../lib/templateConfig.js'
import { AURAS, FUTURISTIC_BACKGROUNDS, CHI_HOI } from '../../lib/brandConfig.js'

// ── Background picker component ───────────────────────────────────────────────
function BgPicker({ type }) {
  const { config, updateConfig } = useBanner()
  const fileRef = useRef(null)
  const [bgTab, setBgTab] = useState(config.mode === 'futuristic' ? 'futuristic' : 'aura')

  if (type === 'photo-upload') {
    return (
      <div className="space-y-3">
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => {
            const file = e.target.files?.[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = evt => updateConfig({
              backgroundCustomUrl: evt.target.result, mode: 'photo', canvasVersion: config.canvasVersion + 1,
            })
            reader.readAsDataURL(file)
          }}
        />
        {config.backgroundCustomUrl ? (
          <div className="space-y-2">
            <div className="rounded-xl overflow-hidden aspect-video glass">
              <img src={config.backgroundCustomUrl} alt="bg" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()} className="btn-ghost flex-1 justify-center text-xs">
                Đổi ảnh
              </button>
              <button
                onClick={() => updateConfig({ backgroundCustomUrl: null, canvasVersion: config.canvasVersion + 1 })}
                className="btn-ghost text-xs text-rose-400 hover:text-rose-300"
              >
                Xóa
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full aspect-video glass rounded-xl border-2 border-dashed border-white/20
                       hover:border-[#C9187F66] hover:bg-[#C9187F08] transition-all
                       flex flex-col items-center justify-center gap-2 text-white/40"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span className="text-sm font-medium">Click để chọn ảnh</span>
            <span className="text-xs text-white/25">JPG, PNG, WebP · Tối thiểu 1080×1080px</span>
          </button>
        )}
      </div>
    )
  }

  // aura-or-futuristic
  return (
    <div className="space-y-3">
      {/* Tab: Aura | Futuristic */}
      <div className="flex gap-1 p-0.5 glass rounded-xl">
        {['aura', 'futuristic'].map(t => (
          <button key={t} onClick={() => { setBgTab(t); updateConfig({ mode: t }) }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              bgTab === t ? 'bg-[#C9187F22] text-[#C9187F] border border-[#C9187F]/30' : 'text-white/40'
            }`}
          >
            {t === 'aura' ? '🌸 Aura' : '💫 Futuristic'}
          </button>
        ))}
      </div>

      {bgTab === 'aura' && (
        <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
          {AURAS.map(a => (
            <button key={a.id} onClick={() => updateConfig({ backgroundId: a.id, mode: 'aura', canvasVersion: config.canvasVersion + 1 })}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                config.backgroundId === a.id && config.mode === 'aura'
                  ? 'border-[#C9187F] shadow-[0_0_12px_rgba(201,24,127,0.4)]'
                  : 'border-transparent hover:border-[#C9187F]/40'
              }`}
              title={a.label}
            >
              <img src={a.src} alt={a.label} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {bgTab === 'futuristic' && (
        <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
          {FUTURISTIC_BACKGROUNDS.map(b => (
            <button key={b.id} onClick={() => updateConfig({ backgroundId: b.id, mode: 'futuristic', canvasVersion: config.canvasVersion + 1 })}
              className={`aspect-square rounded-xl border-2 transition-all ${
                config.backgroundId === b.id && config.mode === 'futuristic'
                  ? 'border-[#C9187F] shadow-[0_0_12px_rgba(201,24,127,0.4)]'
                  : 'border-transparent hover:border-[#C9187F]/40'
              }`}
              title={b.label}
              style={{ background: b.cssGradient }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Chi hoi selector ──────────────────────────────────────────────────────────
function ChiHoiPicker() {
  const { config, updateConfig } = useBanner()
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {CHI_HOI.map(ch => (
        <button key={ch.id} onClick={() => updateConfig({ chiHoiId: ch.id })}
          className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border text-xs transition-all ${
            config.chiHoiId === ch.id
              ? 'border-[#C9187F] bg-[#C9187F22] text-[#C9187F]'
              : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
          }`}
        >
          {ch.logoPng && <img src={ch.logoPng} alt="" className="w-4 h-4 object-contain" />}
          <span className="truncate">{ch.label}</span>
        </button>
      ))}
    </div>
  )
}

// ── Photo upload field ────────────────────────────────────────────────────────
function PhotoField({ hint, onUpload, currentUrl }) {
  const fileRef = useRef(null)

  function handleChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => onUpload(evt.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      {currentUrl ? (
        <div className="flex gap-3 items-center">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-[#C9187F]/50">
            <img src={currentUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1.5">
            <button onClick={() => fileRef.current?.click()} className="btn-ghost text-xs py-1.5 px-3">
              Đổi ảnh
            </button>
            {hint && <p className="text-[10px] text-white/30">{hint}</p>}
          </div>
        </div>
      ) : (
        <button onClick={() => fileRef.current?.click()}
          className="w-full flex items-center gap-3 glass rounded-xl p-3 border-2 border-dashed border-white/15
                     hover:border-[#C9187F]/40 hover:bg-[#C9187F08] transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-[#C9187F]/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#C9187F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm text-white/70">Click để upload ảnh</p>
            {hint && <p className="text-xs text-white/30">{hint}</p>}
          </div>
        </button>
      )}
    </div>
  )
}

// ── Collapsible section wrapper ───────────────────────────────────────────────
function Section({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-white">
          <span>{icon}</span> {title}
        </span>
        <svg className={`w-4 h-4 text-white/40 transition-transform ${open ? '' : '-rotate-90'}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && <div className="px-5 pb-5 pt-1 space-y-4 border-t border-white/5">{children}</div>}
    </div>
  )
}

// ── Main Step2Fill component ──────────────────────────────────────────────────
export default function Step2Fill() {
  const { config, updateConfig } = useBanner()
  const tpl = getTemplate(config.templateId)

  if (!tpl) return (
    <div className="text-center text-white/40 py-8">
      Vui lòng chọn template ở bước trước.
    </div>
  )

  // Get value for a config field (handles nested like 'speakers[0].name')
  function getValue(key) {
    if (key.startsWith('speakers[0].')) {
      const prop = key.replace('speakers[0].', '')
      return config.speakers?.[0]?.[prop] ?? ''
    }
    return config[key] ?? ''
  }

  // Set value for a config field
  function setValue(key, value) {
    if (key.startsWith('speakers[0].')) {
      const prop = key.replace('speakers[0].', '')
      updateConfig({ speakers: [{ ...config.speakers[0], [prop]: value }] })
    } else {
      updateConfig({ [key]: value })
    }
  }

  // Render a single form field
  function renderField(field) {
    if (field.type === 'chihoi') {
      return (
        <div key={field.key}>
          <label className="label-brand">{field.label}</label>
          <ChiHoiPicker />
        </div>
      )
    }

    if (field.type === 'photo') {
      return (
        <div key={field.key}>
          <label className="label-brand">{field.label}</label>
          <PhotoField
            hint={field.hint}
            currentUrl={getValue(field.key)}
            onUpload={url => {
              setValue(field.key, url)
              updateConfig({ canvasVersion: config.canvasVersion + 1 })
            }}
          />
        </div>
      )
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.key}>
          <label className="label-brand">
            {field.label}
            {field.required && <span className="text-[#C9187F] ml-1">*</span>}
          </label>
          <textarea
            value={getValue(field.key)}
            onChange={e => setValue(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="input-brand resize-none"
            rows={3}
          />
        </div>
      )
    }

    return (
      <div key={field.key}>
        <label className="label-brand">
          {field.label}
          {field.required && <span className="text-[#C9187F] ml-1">*</span>}
        </label>
        <input
          type="text"
          value={getValue(field.key)}
          onChange={e => setValue(field.key, e.target.value)}
          placeholder={field.placeholder}
          className="input-brand"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Template name badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="tag-pill text-xs">
          {tpl.name}
        </span>
        <span className="text-xs text-white/30">{tpl.badge}</span>
      </div>

      {/* Section 1: Background */}
      <Section title="Nền" icon="🎨" defaultOpen>
        <BgPicker type={tpl.fields.bg.type} />
      </Section>

      {/* Section 2: Content (text fields) */}
      {tpl.fields.content.length > 0 && (
        <Section title="Nội dung" icon="✏️" defaultOpen>
          {tpl.fields.content.map(renderField)}
        </Section>
      )}

      {/* Section 3: Media (photos + speaker info) */}
      {tpl.fields.media.length > 0 && (
        <Section title="Ảnh & Diễn giả" icon="📷" defaultOpen>
          {tpl.fields.media.map(renderField)}
        </Section>
      )}

      {/* Hint */}
      <p className="text-xs text-white/25 text-center px-4 leading-relaxed">
        💡 Bạn có thể chỉnh thêm text trực tiếp trên canvas sau khi nhấn "Mở Canvas"
      </p>
    </div>
  )
}
