// ─── HAWEE Brand Compliance Rules v2 ─────────────────────────────────────────
// Canvas-level instant checks aligned with the 8-category scoring rubric.
// Thang điểm 100 — Pass ≥85 / Cần chỉnh 70-84 / Không đạt <70
// Fail ngay: sai logo, sai font, màu ngoài hệ nhiều, nội dung lệch định vị

// ── Approved colors ──────────────────────────────────────────────────────────
const PINK_BLOOM_HEX = [
  '#FFE3F3','#ffe3f3',
  '#FFB1DF','#ffb1df',
  '#E83BA0','#e83ba0',
  '#E83A78','#e83a78',
  '#C9187F','#c9187f',
  '#A70061','#a70061',
  '#50002F','#50002f',
  '#33001E','#33001e',
]
const APPROVED_TEXT = [
  '#FFFFFF','#ffffff',
  '#C9187F','#c9187f',
  '#E83A78','#e83a78',
  '#E83BA0','#e83ba0',
  '#FB6094','#fb6094',
  '#FFB1DF','#ffb1df',
  '#FFD4E5','#ffd4e5',
  '#50002F','#50002f',
  '#1A1A1A','#1a1a1a',
]

// ── Category 1: Logo & nhận diện (15pts) ─────────────────────────────────────
const CAT_LOGO = [
  {
    id: 'hawee-logo-present',
    category: 'logo',
    label: 'Logo HAWEE có mặt',
    desc:  'Banner phải hiển thị logo HAWEE mới — không dùng logo cũ, không bóp méo, không đổi màu tùy tiện.',
    severity: 'error',
    points: 4,
    check: (canvas) => {
      const obj = canvas?.getObjects?.().find(o => o.name === 'hawee-logo')
      return !!obj && obj.visible !== false && (obj.opacity ?? 1) > 0.3
    },
  },
  {
    id: 'hawee-logo-not-distorted',
    category: 'logo',
    label: 'Logo HAWEE không bị méo',
    desc:  'Tỷ lệ scaleX/scaleY phải trong khoảng 0.85–1.15 để logo không bị kéo giãn.',
    severity: 'warning',
    points: 3,
    check: (canvas) => {
      const obj = canvas?.getObjects?.().find(o => o.name === 'hawee-logo')
      if (!obj) return true
      const ratio = (obj.scaleX ?? 1) / Math.max(obj.scaleY ?? 1, 0.001)
      return ratio >= 0.82 && ratio <= 1.18
    },
  },
  {
    id: 'chihoi-logo-visible',
    category: 'logo',
    label: 'Logo chi hội hiển thị (nếu chọn)',
    desc:  'Khi chọn chi hội, logo phải hiển thị đúng vị trí — không xâm lấn safe space logo HAWEE.',
    severity: 'info',
    points: 3,
    check: (canvas, config) => {
      if (!config || config.chiHoiId === 'none') return true
      const obj = canvas?.getObjects?.().find(o => o.name === 'chihoi-logo')
      return !!obj && obj.visible !== false
    },
  },
]

// ── Category 4: Màu sắc (15pts) ──────────────────────────────────────────────
const CAT_COLORS = [
  {
    id: 'headline-color-approved',
    category: 'colors',
    label: 'Màu tiêu đề đúng palette HAWEE',
    desc:  'Headline phải dùng màu từ bảng Pink Bloom (#C9187F, #E83A78, #FFFFFF, #50002F...) — không dùng xanh, cam neon, pastel ngoài hệ.',
    severity: 'error',
    points: 3,
    check: (canvas) => {
      const obj = canvas?.getObjects?.().find(o => o.name === 'headline')
      if (!obj || !obj.fill) return true
      return APPROVED_TEXT.includes(obj.fill)
    },
  },
  {
    id: 'background-present',
    category: 'colors',
    label: 'Nền từ hệ thống HAWEE',
    desc:  'Background phải là nền aura, futuristic gradient hoặc ảnh upload — không để trắng/trống.',
    severity: 'error',
    points: 4,
    check: (canvas) => {
      const obj = canvas?.getObjects?.().find(o => o.name === 'background')
      return !!obj && obj.visible !== false
    },
  },
]

// ── Category 5: Font & typography (15pts) ────────────────────────────────────
const CAT_TYPOGRAPHY = [
  {
    id: 'headline-present',
    category: 'typography',
    label: 'Tiêu đề không trống',
    desc:  'Banner phải có tiêu đề sự kiện — ngắn, rõ, có lực; ưu tiên insight nữ lãnh đạo.',
    severity: 'error',
    points: 4,
    check: (canvas) => {
      const obj = canvas?.getObjects?.().find(o => o.name === 'headline')
      return !!obj && (obj.text ?? '').trim().length > 2
    },
  },
  {
    id: 'headline-font',
    category: 'typography',
    label: 'Headline dùng Mona Sans',
    desc:  'Font chính của HAWEE là Mona Sans — SemiBold cho headline, Medium cho body.',
    severity: 'error',
    points: 4,
    check: (canvas) => {
      const obj = canvas?.getObjects?.().find(o => o.name === 'headline')
      if (!obj) return true
      return (obj.fontFamily ?? '').toLowerCase().includes('mona')
    },
  },
  {
    id: 'headline-size',
    category: 'typography',
    label: 'Tiêu đề đủ lớn (≥ 36px effective)',
    desc:  'Font size × scaleX phải ≥ 36px — đọc rõ ở thumbnail, LED, standee.',
    severity: 'warning',
    points: 3,
    check: (canvas) => {
      const obj = canvas?.getObjects?.().find(o => o.name === 'headline')
      if (!obj) return true
      return (obj.fontSize ?? 40) * (obj.scaleX ?? 1) >= 36
    },
  },
]

// ── Category 6: Hình ảnh (15pts) ─────────────────────────────────────────────
const CAT_IMAGES = [
  {
    id: 'speaker-photo-present',
    category: 'images',
    label: 'Ảnh diễn giả đã upload',
    desc:  'Ảnh chân dung nữ lãnh đạo tự tin, chuyên nghiệp — không dùng ảnh quá casual hay thiếu chỉn chu.',
    severity: 'warning',
    points: 3,
    check: (canvas) => {
      // photo-slot exists (for fixed templates) or speaker-photo (for custom)
      const slot   = canvas?.getObjects?.().find(o => o.name?.startsWith('photo-slot-speaker'))
      const legacy = canvas?.getObjects?.().find(o => o.name === 'speaker-photo-0')
      return !!(slot || legacy)
    },
  },
  {
    id: 'speaker-name-present',
    category: 'images',
    label: 'Thông tin diễn giả điền đủ',
    desc:  'Phải có tên diễn giả để banner đầy đủ thông tin — tên, chức vụ, tổ chức.',
    severity: 'error',
    points: 3,
    check: (canvas) => {
      const obj = canvas?.getObjects?.().find(o => o.name === 'speaker-name-0')
      return !!obj && (obj.text ?? '').trim().length > 0
    },
  },
]

// ─── All rules combined ───────────────────────────────────────────────────────
export const COMPLIANCE_RULES = [
  ...CAT_LOGO,
  ...CAT_COLORS,
  ...CAT_TYPOGRAPHY,
  ...CAT_IMAGES,
]

// ─── Run all checks ───────────────────────────────────────────────────────────
export function runComplianceChecks(canvas, config) {
  return COMPLIANCE_RULES.map(rule => {
    let pass = false
    try { pass = rule.check(canvas, config) } catch { pass = false }
    return {
      id:       rule.id,
      category: rule.category,
      label:    rule.label,
      desc:     rule.desc,
      severity: rule.severity,
      points:   rule.points ?? 1,
      pass,
    }
  })
}

// ─── Summary ──────────────────────────────────────────────────────────────────
export function getComplianceSummary(results) {
  const errors   = results.filter(r => !r.pass && r.severity === 'error').length
  const warnings = results.filter(r => !r.pass && r.severity === 'warning').length
  const passed   = results.filter(r => r.pass).length
  const total    = results.length
  const maxPts   = results.reduce((s, r) => s + (r.points ?? 1), 0)
  const earnedPts= results.filter(r => r.pass).reduce((s, r) => s + (r.points ?? 1), 0)
  // Scale to partial category score (canvas covers ~30% of full rubric)
  return { errors, warnings, passed, total, maxPts, earnedPts, ok: errors === 0 }
}

// ─── Verdict label ────────────────────────────────────────────────────────────
export function getVerdict(score) {
  if (score >= 85) return { label: 'Đạt chuẩn HAWEE', color: 'emerald', emoji: '✅' }
  if (score >= 70) return { label: 'Cần chỉnh sửa',   color: 'amber',   emoji: '⚠️' }
  return              { label: 'Không đạt',            color: 'rose',    emoji: '❌' }
}
