// ─── Fixed Template Definitions ──────────────────────────────────────────────
// Each template maps to a pixel-accurate locked Fabric.js layout.
// Users pick a template → fill text/photos → canvas renders 80% complete.

export const TEMPLATES = [
  {
    id: 'speaker-event-sq',
    name: 'Sự kiện Diễn giả',
    desc: 'EP Lunch / Workshop — khách mời đặc biệt hai vùng trái phải',
    format: 'square',
    dims: { w: 1080, h: 1080 },
    badge: '1080 × 1080',
    defaultBgId: 'aura-03',
    defaultMode: 'aura',
    fields: {
      bg: { type: 'aura-or-futuristic', label: 'Nền', key: 'backgroundId' },
      content: [
        { key: 'programName',           label: 'Chương trình',    type: 'text',     placeholder: 'HAWEE Empower Lunch' },
        { key: 'headline',              label: 'Tiêu đề sự kiện', type: 'textarea', placeholder: 'Kỹ Năng Số Cho\nDoanh Nghiệp Nhỏ', required: true },
        { key: 'badgeText',             label: 'Badge text',      type: 'text',     placeholder: 'MIỄN PHÍ HỘI VIÊN' },
        { key: 'date',                  label: 'Ngày',            type: 'text',     placeholder: 'Thứ 6, 26/06/2026' },
        { key: 'time',                  label: 'Giờ',             type: 'text',     placeholder: '11:30 – 13:30' },
        { key: 'location',              label: 'Địa điểm',        type: 'text',     placeholder: 'Ambrosia Cafe Bistro' },
        { key: 'chiHoiId',              label: 'Chi hội',         type: 'chihoi' },
      ],
      media: [
        { key: 'speakers[0].photoUrl',     label: 'Ảnh diễn giả',  type: 'photo',   hint: 'Ảnh vuông, tối thiểu 400×400px' },
        { key: 'speakers[0].name',         label: 'Tên diễn giả',  type: 'text',    placeholder: 'Pepper Nguyễn' },
        { key: 'speakers[0].title',        label: 'Chức vụ',        type: 'text',    placeholder: 'CEO & Founder' },
        { key: 'speakers[0].organization', label: 'Công ty',        type: 'text',    placeholder: 'Digital Agency Vietnam' },
      ],
    },
  },
  {
    id: 'welcome-member',
    name: 'Chào mừng Hội viên',
    desc: 'Hội viên mới — ảnh chân dung toàn trang, gradient overlay',
    format: 'square',
    dims: { w: 1080, h: 1080 },
    badge: '1080 × 1080',
    defaultBgId: null,
    defaultMode: 'photo',
    fields: {
      bg: { type: 'photo-upload', label: 'Ảnh hội viên (nền toàn trang)', key: 'backgroundCustomUrl' },
      content: [
        { key: 'quarter',     label: 'Quý / Năm',    type: 'text',     placeholder: 'Q2 · 2026' },
        { key: 'memberName',  label: 'Tên hội viên', type: 'text',     placeholder: 'Nguyễn Thị Bình', required: true },
        { key: 'memberTitle', label: 'Chức vụ',      type: 'text',     placeholder: 'Giám đốc Điều hành' },
        { key: 'memberOrg',   label: 'Công ty',      type: 'text',     placeholder: 'ABC Corporation' },
        { key: 'chiHoiId',    label: 'Chi hội',      type: 'chihoi' },
      ],
      media: [],
    },
  },
  {
    id: 'event-photo-sq',
    name: 'Sự kiện Photo',
    desc: 'Banner sự kiện với ảnh nền thực tế — dark gradient overlay tự động',
    format: 'square',
    dims: { w: 1080, h: 1080 },
    badge: '1080 × 1080',
    defaultBgId: null,
    defaultMode: 'photo',
    fields: {
      bg: { type: 'photo-upload', label: 'Ảnh nền sự kiện', key: 'backgroundCustomUrl' },
      content: [
        { key: 'programName', label: 'Chương trình',    type: 'text',     placeholder: 'HAWEE Networking' },
        { key: 'headline',    label: 'Tiêu đề sự kiện', type: 'textarea', placeholder: 'Kết nối · Phát triển\n· Lan tỏa', required: true },
        { key: 'badgeText',   label: 'Badge',           type: 'text',     placeholder: 'FREE · RSVP' },
        { key: 'date',        label: 'Ngày',            type: 'text',     placeholder: 'Thứ 7, 27/06/2026' },
        { key: 'time',        label: 'Giờ',             type: 'text',     placeholder: '09:00 – 12:00' },
        { key: 'location',    label: 'Địa điểm',        type: 'text',     placeholder: 'Sofitel Saigon Plaza' },
        { key: 'chiHoiId',    label: 'Chi hội',         type: 'chihoi' },
      ],
      media: [],
    },
  },
  {
    id: 'coming-soon',
    name: 'Coming Soon',
    desc: 'Teaser bí ẩn — hé lộ ngày sự kiện sắp diễn ra',
    format: 'square',
    dims: { w: 1080, h: 1080 },
    badge: '1080 × 1080',
    defaultBgId: 'aura-07',
    defaultMode: 'aura',
    fields: {
      bg: { type: 'aura-or-futuristic', label: 'Nền', key: 'backgroundId' },
      content: [
        { key: 'bigDate',   label: 'Ngày lớn (VD: 26.06)',   type: 'text',     placeholder: '26.06', required: true },
        { key: 'headline',  label: 'Tiêu đề sự kiện',         type: 'textarea', placeholder: 'HAWEE SUMMIT', required: true },
        { key: 'tagline',   label: 'Tagline / Năm',            type: 'text',     placeholder: '2026' },
        { key: 'badgeText', label: 'Badge',                    type: 'text',     placeholder: 'HAWEE × CONNECT' },
        { key: 'chiHoiId',  label: 'Chi hội',                  type: 'chihoi' },
      ],
      media: [],
    },
  },
  {
    id: 'connect-landscape',
    name: 'Connect Landscape',
    desc: 'Banner 16:9 — YouTube Thumbnail / LinkedIn Cover',
    format: 'widescreen',
    dims: { w: 1280, h: 720 },
    badge: '1280 × 720',
    defaultBgId: 'aura-03',
    defaultMode: 'aura',
    fields: {
      bg: { type: 'aura-or-futuristic', label: 'Nền', key: 'backgroundId' },
      content: [
        { key: 'programName', label: 'Nhãn chương trình',   type: 'text',     placeholder: 'HAWEE CONNECT' },
        { key: 'headline',    label: 'Tiêu đề chính',        type: 'textarea', placeholder: 'Kết nối Nữ Lãnh đạo\nViệt Nam', required: true },
        { key: 'tag1',        label: 'Keyword 1',            type: 'text',     placeholder: '#Leadership' },
        { key: 'tag2',        label: 'Keyword 2',            type: 'text',     placeholder: '#Women' },
        { key: 'tag3',        label: 'Keyword 3',            type: 'text',     placeholder: '#Connect' },
        { key: 'date',        label: 'Ngày',                 type: 'text',     placeholder: '27/06/2026' },
        { key: 'time',        label: 'Giờ',                  type: 'text',     placeholder: '09:00 AM' },
        { key: 'location',    label: 'Địa điểm',             type: 'text',     placeholder: 'TP.HCM' },
        { key: 'chiHoiId',    label: 'Chi hội',              type: 'chihoi' },
      ],
      media: [],
    },
  },
]

export function getTemplate(id) {
  return TEMPLATES.find(t => t.id === id) ?? null
}
