import { useRef } from 'react'

export default function SpeakerCard({ speaker, index, onUpdate, onRemove, canRemove }) {
  const fileRef = useRef(null)

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    // Convert to base64 — blob URLs don't cross-origin into Fabric.js canvas
    const reader = new FileReader()
    reader.onload = (evt) => onUpdate(speaker.id, 'photoUrl', evt.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="glass rounded-2xl p-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="tag-pill">Diễn giả {index + 1}</span>
        {canRemove && (
          <button
            onClick={() => onRemove(speaker.id)}
            className="text-white/30 hover:text-rose-400 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      <div className="flex gap-4">
        {/* Photo upload */}
        <div className="shrink-0">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          <button
            onClick={() => fileRef.current?.click()}
            className={`
              w-20 h-20 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1
              transition-all duration-200 overflow-hidden
              ${speaker.photoUrl
                ? 'border-[#C9187F] p-0'
                : 'border-white/20 hover:border-[#C9187F] bg-white/5'
              }
            `}
          >
            {speaker.photoUrl ? (
              <img src={speaker.photoUrl} alt="speaker" className="w-full h-full object-cover" />
            ) : (
              <>
                <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span className="text-[9px] text-white/30">Upload ảnh</span>
              </>
            )}
          </button>
          {speaker.photoUrl && (
            <button
              onClick={() => onUpdate(speaker.id, 'photoUrl', null)}
              className="text-[9px] text-white/30 hover:text-white/60 w-full text-center mt-1"
            >
              Xóa ảnh
            </button>
          )}
        </div>

        {/* Info fields */}
        <div className="flex-1 space-y-2">
          <div>
            <label className="label-brand">Họ và tên</label>
            <input
              type="text"
              value={speaker.name}
              onChange={e => onUpdate(speaker.id, 'name', e.target.value)}
              placeholder="Nguyễn Thị A"
              className="input-brand"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label-brand">Chức danh</label>
              <input
                type="text"
                value={speaker.title}
                onChange={e => onUpdate(speaker.id, 'title', e.target.value)}
                placeholder="CEO"
                className="input-brand"
              />
            </div>
            <div>
              <label className="label-brand">Tổ chức</label>
              <input
                type="text"
                value={speaker.organization}
                onChange={e => onUpdate(speaker.id, 'organization', e.target.value)}
                placeholder="Công ty ABC"
                className="input-brand"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
