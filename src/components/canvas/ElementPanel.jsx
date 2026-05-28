import { useState, useEffect, useRef } from 'react'
import { COLORS } from '../../lib/brandConfig.js'
import { useBanner } from '../../context/BannerContext.jsx'

const LOCKED_ELEMENTS = ['background', 'bg-overlay', 'bg-layer-1', 'bg-layer-2',
  'hawee-logo', 'chihoi-logo', 'badge-pill', 'event-date', 'event-time',
  'event-location', 'speaker-label', 'accent-line', 'separator-top', 'separator-mid',
  'welcome-label', 'quarter-text', 'left-overlay', 'program-badge', 'tag-pill-.*',
  'left-panel', 'right-panel']

function isLockedName(name) {
  if (!name) return false
  return LOCKED_ELEMENTS.some(pat => {
    if (pat.includes('*')) return new RegExp('^' + pat + '$').test(name)
    return name === pat
  })
}

export default function ElementPanel({ canvas }) {
  const { config, updateConfig } = useBanner()
  const [selected, setSelected] = useState(null)
  const [refresh, setRefresh]   = useState(0)
  const photoInputRef = useRef(null)

  useEffect(() => {
    if (!canvas) return
    const onSelect = (e) => setSelected(e.selected?.[0] ?? e.target ?? null)
    const onClear  = ()  => setSelected(null)
    const onModify = ()  => setRefresh(r => r + 1)
    canvas.on('selection:created', onSelect)
    canvas.on('selection:updated', onSelect)
    canvas.on('selection:cleared', onClear)
    canvas.on('object:modified',   onModify)
    return () => {
      canvas.off('selection:created', onSelect)
      canvas.off('selection:updated', onSelect)
      canvas.off('selection:cleared', onClear)
      canvas.off('object:modified',   onModify)
    }
  }, [canvas])

  function setProp(key, value) {
    if (!selected) return
    selected.set(key, value)
    canvas?.renderAll()
    setRefresh(r => r + 1)
  }

  function deleteSelected() {
    if (!selected || isLockedName(selected.name)) return
    canvas?.remove(selected)
    canvas?.discardActiveObject()
    canvas?.renderAll()
    setSelected(null)
  }

  // Photo swap handler — triggered from photo-slot-* element click
  function handlePhotoSwap(e) {
    const file = e.target.files?.[0]
    if (!file || !selected) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const dataUrl = evt.target.result
      const slotName = selected.name  // e.g. 'photo-slot-speaker-0'

      if (slotName === 'photo-slot-speaker-0') {
        updateConfig({
          speakers: [{ ...config.speakers[0], photoUrl: dataUrl }],
          canvasVersion: config.canvasVersion + 1,
        })
      }
      // Reset file input for re-use
      if (photoInputRef.current) photoInputRef.current.value = ''
    }
    reader.readAsDataURL(file)
  }

  const isLocked    = isLockedName(selected?.name)
  const isPhotoSlot = selected?.name?.startsWith('photo-slot-')
  const isText      = selected?.type === 'textbox' || selected?.type === 'text'
  const isImage     = selected?.type === 'image' && !isPhotoSlot
  const isGroup     = selected?.type === 'group' && !isPhotoSlot
  const isCue       = selected?.name?.startsWith('cue-') || selected?.name?.startsWith('image-')
  const isShape     = !isLocked && !isPhotoSlot && (selected?.type === 'rect' || selected?.type === 'circle')
  const isLine      = !isLocked && selected?.type === 'line'
  const canDelete   = selected && !isLocked && !isPhotoSlot

  return (
    <div className="h-full flex flex-col glass-dark border-l border-white/10">
      <div className="panel-header">
        <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Element</span>
        {canDelete && (
          <button onClick={deleteSelected} className="text-white/30 hover:text-rose-400 transition-colors" title="Delete (Del)">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!selected ? (
          <div className="text-center text-white/25 text-sm py-8">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/>
            </svg>
            Click vào một phần tử để chỉnh sửa
          </div>
        ) : (
          <div className="space-y-4">
            {/* Element name */}
            <div>
              <div className="text-xs text-white/40 mb-1">Phần tử</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white truncate">{selected.name ?? selected.type}</span>
                {isLocked && <span className="tag-pill text-[9px] px-2 py-0.5 flex-shrink-0">🔒 Khóa</span>}
                {isPhotoSlot && <span className="tag-pill text-[9px] px-2 py-0.5 flex-shrink-0">📷 Ảnh</span>}
              </div>
            </div>

            {/* Photo slot swap UI */}
            {isPhotoSlot && (
              <div className="space-y-3">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSwap}
                />
                <div className="glass rounded-xl p-3 space-y-2">
                  <p className="text-xs text-white/50 leading-relaxed">
                    Click để đổi ảnh. Canvas sẽ rebuild với ảnh mới.
                  </p>
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="btn-primary w-full justify-center text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                    Đổi ảnh diễn giả
                  </button>
                </div>
              </div>
            )}

            {/* Text properties */}
            {isText && !isLocked && (
              <div className="space-y-3">
                <div>
                  <label className="label-brand">Font size</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min="12" max="120" step="2"
                      value={Math.round(selected.fontSize ?? 40)}
                      onChange={e => setProp('fontSize', Number(e.target.value))}
                      className="flex-1 accent-[#C9187F]"
                    />
                    <span className="text-xs text-white/60 w-10 text-right">{Math.round(selected.fontSize ?? 40)}px</span>
                  </div>
                </div>

                <div>
                  <label className="label-brand">Màu chữ</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {COLORS.approvedTextColors.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setProp('fill', c.value)}
                        className={`h-7 rounded-lg border-2 transition-all ${
                          selected.fill === c.value ? 'border-[#C9187F] scale-110' : 'border-transparent'
                        }`}
                        style={{
                          backgroundColor: c.value === '#FFFFFF' ? '#ffffff' : c.value,
                          boxShadow: c.value === '#FFFFFF' ? 'inset 0 0 0 1px rgba(255,255,255,0.3)' : 'none',
                        }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label-brand">Độ đậm</label>
                  <div className="flex gap-2">
                    {['400', '600'].map(w => (
                      <button
                        key={w}
                        onClick={() => setProp('fontWeight', w)}
                        className={`flex-1 py-1.5 rounded-lg text-sm border transition-all ${
                          (selected.fontWeight ?? '600') === w
                            ? 'border-[#C9187F] bg-[#C9187F22] text-[#C9187F]'
                            : 'border-white/10 bg-white/5 text-white/60'
                        }`}
                        style={{ fontWeight: w }}
                      >
                        {w === '400' ? 'Normal' : 'SemiBold'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label-brand">Opacity</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min="0" max="1" step="0.05"
                      value={selected.opacity ?? 1}
                      onChange={e => setProp('opacity', Number(e.target.value))}
                      className="flex-1 accent-[#C9187F]"
                    />
                    <span className="text-xs text-white/60 w-10 text-right">
                      {Math.round((selected.opacity ?? 1) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Image/cue properties */}
            {(isImage || isCue) && !isLocked && (
              <div className="space-y-3">
                <div>
                  <label className="label-brand">Opacity</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min="0" max="1" step="0.05"
                      value={selected.opacity ?? 1}
                      onChange={e => setProp('opacity', Number(e.target.value))}
                      className="flex-1 accent-[#C9187F]"
                    />
                    <span className="text-xs text-white/60 w-10 text-right">
                      {Math.round((selected.opacity ?? 1) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Shape properties */}
            {isShape && (
              <div className="space-y-3">
                <div>
                  <label className="label-brand">Màu nền</label>
                  <div className="grid grid-cols-5 gap-1.5 mb-2">
                    {COLORS.brandFillColors.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setProp('fill', c.value)}
                        className={`h-7 rounded-lg border-2 transition-all ${
                          selected.fill === c.value ? 'border-[#C9187F] scale-110' : 'border-white/10'
                        }`}
                        style={{
                          background: c.preview === 'transparent'
                            ? 'repeating-conic-gradient(#555 0% 25%, #333 0% 50%) 0 0 / 8px 8px'
                            : c.preview,
                        }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label-brand">Opacity</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min="0" max="1" step="0.05"
                      value={selected.opacity ?? 1}
                      onChange={e => setProp('opacity', Number(e.target.value))}
                      className="flex-1 accent-[#C9187F]"
                    />
                    <span className="text-xs text-white/60 w-10 text-right">
                      {Math.round((selected.opacity ?? 1) * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <label className="label-brand">Viền</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: 'Không', stroke: '', sw: 0 },
                      { label: 'Trắng', stroke: 'rgba(255,255,255,0.7)', sw: 2 },
                      { label: 'Hồng',  stroke: '#C9187F', sw: 2 },
                      { label: 'Đen',   stroke: 'rgba(0,0,0,0.5)', sw: 2 },
                    ].map(opt => (
                      <button
                        key={opt.label}
                        onClick={() => { setProp('stroke', opt.stroke); setProp('strokeWidth', opt.sw) }}
                        className={`py-1.5 rounded-lg text-[10px] border transition-all ${
                          (selected.stroke || '') === opt.stroke
                            ? 'border-[#C9187F] bg-[#C9187F22] text-[#C9187F]'
                            : 'border-white/10 bg-white/5 text-white/60'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Line / divider properties */}
            {isLine && (
              <div className="space-y-3">
                <div>
                  <label className="label-brand">Màu đường kẻ</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { label: 'Trắng',      value: '#FFFFFF' },
                      { label: 'Trắng 60%',  value: 'rgba(255,255,255,0.6)' },
                      { label: 'Hồng',       value: '#C9187F' },
                      { label: 'Rose',       value: '#E83A78' },
                      { label: 'Blush',      value: '#FFD4E5' },
                      { label: 'Burgundy',   value: '#50002F' },
                      { label: 'Đen',        value: '#1A1A1A' },
                    ].map(c => (
                      <button
                        key={c.value}
                        onClick={() => { setProp('stroke', c.value); canvas?.renderAll() }}
                        className={`h-7 rounded-lg border-2 transition-all ${
                          selected.stroke === c.value ? 'border-[#C9187F] scale-110' : 'border-transparent'
                        }`}
                        style={{
                          backgroundColor: c.value.startsWith('rgba') ? c.value : c.value,
                          boxShadow: c.value === '#FFFFFF' ? 'inset 0 0 0 1px rgba(255,255,255,0.3)' : 'none',
                        }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label-brand">Độ dày ({Math.round(selected.strokeWidth ?? 2)}px)</label>
                  <input
                    type="range" min="1" max="20" step="1"
                    value={selected.strokeWidth ?? 2}
                    onChange={e => setProp('strokeWidth', Number(e.target.value))}
                    className="w-full accent-[#C9187F]"
                  />
                </div>
                <div>
                  <label className="label-brand">Opacity</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min="0" max="1" step="0.05"
                      value={selected.opacity ?? 1}
                      onChange={e => setProp('opacity', Number(e.target.value))}
                      className="flex-1 accent-[#C9187F]"
                    />
                    <span className="text-xs text-white/60 w-10 text-right">
                      {Math.round((selected.opacity ?? 1) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Position info */}
            <div>
              <label className="label-brand">Vị trí</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'X', value: Math.round(selected.left ?? 0) },
                  { label: 'Y', value: Math.round(selected.top ?? 0) },
                  { label: 'W', value: Math.round((selected.width ?? 0) * (selected.scaleX ?? 1)) },
                  { label: 'H', value: Math.round((selected.height ?? 0) * (selected.scaleY ?? 1)) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-1.5 glass rounded-lg px-2 py-1.5">
                    <span className="text-xs text-white/40 w-4">{label}</span>
                    <span className="text-xs text-white/80">{value}px</span>
                  </div>
                ))}
              </div>
            </div>

            {isLocked && (
              <div className="glass rounded-xl p-3 text-xs text-white/40 leading-relaxed">
                🔒 Phần tử này được khóa vị trí để đảm bảo brand guideline.
              </div>
            )}

            {isText && !isLocked && (
              <div className="glass rounded-xl p-3 text-xs text-white/40 leading-relaxed">
                💡 Double-click trực tiếp trên canvas để chỉnh text.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
