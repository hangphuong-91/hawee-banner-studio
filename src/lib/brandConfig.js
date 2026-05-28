// ─── HAWEE Brand Configuration ─────────────────────────────────────────────
// Single source of truth for all brand values used in UI and Fabric.js canvas

export const COLORS = {
  primary:       '#C9187F',
  primaryDark:   '#50002F',
  primaryLight:  '#FFD4E5',
  secondary:     '#E83A78',
  accent:        '#FB6094',
  white:         '#FFFFFF',
  // Text colors (canvas headline, speaker name, etc.)
  // 4-family HAWEE palette: Hồng (Pink Bloom), Tím (Tâm), Đỏ (Nhiệt Huyết), Vàng (Trí)
  approvedTextColors: [
    // ── Hồng / Pink Bloom ──────────────────────────────────────
    { label: 'Trắng',          value: '#FFFFFF',  family: 'pink' },
    { label: 'Hồng Magenta',   value: '#C9187F',  family: 'pink' },
    { label: 'Hồng Accent',    value: '#FB6094',  family: 'pink' },
    { label: 'Rose',           value: '#E83A78',  family: 'pink' },
    { label: 'Blush',          value: '#FFD4E5',  family: 'pink' },
    { label: 'Burgundy',       value: '#50002F',  family: 'pink' },
    // ── Tím / Tâm (Purple family) ──────────────────────────────
    { label: 'Tím Tâm',        value: '#8B5CF6',  family: 'purple' },
    { label: 'Tím Đậm',        value: '#5B21B6',  family: 'purple' },
    { label: 'Tím Đêm',        value: '#2D0060',  family: 'purple' },
    // ── Đỏ / Nhiệt Huyết (Red family) ─────────────────────────
    { label: 'Đỏ Nhiệt',       value: '#EF4444',  family: 'red' },
    { label: 'Đỏ Đậm',         value: '#B91C1C',  family: 'red' },
    // ── Vàng / Trí (Gold family) ───────────────────────────────
    { label: 'Vàng Kim',       value: '#FBBF24',  family: 'gold' },
    { label: 'Vàng Đất',       value: '#B45309',  family: 'gold' },
    // ── Neutral ────────────────────────────────────────────────
    { label: 'Đen',            value: '#1A1A1A',  family: 'neutral' },
  ],
  // Fill colors for shapes (boxes, circles, etc.)
  brandFillColors: [
    // ── Trắng & Neutral ────────────────────────────────────────
    { label: 'Trắng',          value: '#FFFFFF',                    preview: '#FFFFFF' },
    { label: 'Trắng 80%',      value: 'rgba(255,255,255,0.8)',      preview: '#CCCCCC' },
    { label: 'Trắng 50%',      value: 'rgba(255,255,255,0.5)',      preview: '#AAAAAA' },
    { label: 'Trắng 20%',      value: 'rgba(255,255,255,0.2)',      preview: '#666666' },
    // ── Hồng / Pink Bloom ──────────────────────────────────────
    { label: 'Magenta',        value: '#C9187F',                    preview: '#C9187F' },
    { label: 'Magenta 60%',    value: 'rgba(201,24,127,0.6)',       preview: '#C9187F99' },
    { label: 'Magenta 25%',    value: 'rgba(201,24,127,0.25)',      preview: '#C9187F40' },
    { label: 'Rose',           value: '#E83A78',                    preview: '#E83A78' },
    { label: 'Pink Light',     value: '#FB6094',                    preview: '#FB6094' },
    { label: 'Blush',          value: '#FFD4E5',                    preview: '#FFD4E5' },
    { label: 'Burgundy',       value: '#50002F',                    preview: '#50002F' },
    // ── Tím / Tâm ──────────────────────────────────────────────
    { label: 'Tím Nhạt',       value: '#EDE9FE',                    preview: '#EDE9FE' },
    { label: 'Tím Tâm',        value: '#8B5CF6',                    preview: '#8B5CF6' },
    { label: 'Tím 25%',        value: 'rgba(139,92,246,0.25)',      preview: '#8B5CF640' },
    { label: 'Tím Đậm',        value: '#5B21B6',                    preview: '#5B21B6' },
    { label: 'Tím Đêm',        value: '#2D0060',                    preview: '#2D0060' },
    // ── Đỏ / Nhiệt Huyết ──────────────────────────────────────
    { label: 'Đỏ Nhạt',        value: '#FCA5A5',                    preview: '#FCA5A5' },
    { label: 'Đỏ Nhiệt',       value: '#EF4444',                    preview: '#EF4444' },
    { label: 'Đỏ Đậm',         value: '#B91C1C',                    preview: '#B91C1C' },
    // ── Vàng / Trí ─────────────────────────────────────────────
    { label: 'Vàng Nhạt',      value: '#FDE68A',                    preview: '#FDE68A' },
    { label: 'Vàng Kim',       value: '#FBBF24',                    preview: '#FBBF24' },
    { label: 'Vàng Đất',       value: '#B45309',                    preview: '#B45309' },
    // ── Tối & Transparent ──────────────────────────────────────
    { label: 'Đen 70%',        value: 'rgba(0,0,0,0.7)',            preview: '#484848' },
    { label: 'Đen 40%',        value: 'rgba(0,0,0,0.4)',            preview: '#999999' },
    { label: 'Trong suốt',     value: 'transparent',                preview: 'transparent' },
  ],
}

export const FONTS = {
  semibold: { family: 'MonaSans', weight: '600' },
  medium:   { family: 'MonaSans', weight: '400' },
}

export const FORMATS = [
  // ── 3 primary formats requested by HAWEE ──────────────────────────────────
  // w/h = canvas render size; exported at 2× → output size in label
  { id: 'square-2k',  label: '2048 × 2048', w: 1024, h: 1024,  exportScale: 2, aspect: '1:1',  desc: 'Square — Post / LED Wall / Screen',       icon: '▣' },
  { id: 'widescreen', label: '1920 × 1080', w:  960, h:  540,  exportScale: 2, aspect: '16:9', desc: 'Widescreen — YouTube / Projector / Cover',  icon: '▭' },
  { id: 'portrait',   label: '1080 × 1350', w: 1080, h: 1350,  exportScale: 1, aspect: '4:5',  desc: 'Portrait — Instagram 4:5 / Facebook Feed',  icon: '▮' },
  // ── Legacy / bonus formats ─────────────────────────────────────────────────
  { id: 'square',     label: '1080 × 1080', w: 1080, h: 1080,  exportScale: 2, aspect: '1:1',  desc: 'Square — Facebook / Instagram Post',        icon: '▣', legacy: true },
  { id: 'story',      label: '1080 × 1920', w: 1080, h: 1920,  exportScale: 1, aspect: '9:16', desc: 'Story — Instagram / Facebook Reels',         icon: '▮', legacy: true },
]

export const MODES = [
  { id: 'aura',        label: 'Aura',        icon: '🌸', desc: 'Gradient hồng/tím nền mờ, nữ tính, premium',        preview: '/brand/aura/aura-03.png' },
  { id: 'futuristic',  label: 'Futuristic',  icon: '💫', desc: 'Abstract gradient đêm, thanh lịch, quyền lực',       preview: null },
  { id: 'photo',       label: 'Photo',       icon: '📸', desc: 'Upload ảnh thực sự kiện + gradient overlay',          preview: null },
]

// ─── ALL aura backgrounds (aura-01 through aura-41) ──────────────────────────
export const AURAS = [
  // Original HAWEE-branded auras (most on-brand, shown first)
  { id: 'aura-01', src: '/brand/aura/aura-01.png', label: 'Aura Hồng I' },
  { id: 'aura-02', src: '/brand/aura/aura-02.png', label: 'Aura Hồng II' },
  { id: 'aura-03', src: '/brand/aura/aura-03.png', label: 'Magenta Glow' },
  { id: 'aura-04', src: '/brand/aura/aura-04.png', label: 'Rose Burst' },
  { id: 'aura-05', src: '/brand/aura/aura-05.png', label: 'Soft Haze' },
  { id: 'aura-06', src: '/brand/aura/aura-06.png', label: 'Deep Aura' },
  { id: 'aura-07', src: '/brand/aura/aura-07.png', label: 'Purple Dream' },
  { id: 'aura-08', src: '/brand/aura/aura-08.png', label: 'Warm Sunset' },
  { id: 'aura-26', src: '/brand/aura/aura-26.png', label: 'Aura Pearl' },
  { id: 'aura-27', src: '/brand/aura/aura-27.png', label: 'Aura Silk' },
  { id: 'aura-28', src: '/brand/aura/aura-28.png', label: 'Aura Mist' },
  { id: 'aura-29', src: '/brand/aura/aura-29.png', label: 'Aura Cloud' },
  { id: 'aura-30', src: '/brand/aura/aura-30.png', label: 'Aura Dawn' },
  // Abstract blossom & light series
  { id: 'aura-09', src: '/brand/aura/aura-09.png',  label: 'Fine Art I' },
  { id: 'aura-10', src: '/brand/aura/aura-10.png',  label: 'Fine Art II' },
  { id: 'aura-11', src: '/brand/aura/aura-11.png',  label: 'Fine Art III' },
  { id: 'aura-12', src: '/brand/aura/aura-12.png',  label: 'Fine Art IV' },
  { id: 'aura-13', src: '/brand/aura/aura-13.png',  label: 'Fine Art V' },
  { id: 'aura-14', src: '/brand/aura/aura-14.png',  label: 'Fine Art VI' },
  { id: 'aura-15', src: '/brand/aura/aura-15.png',  label: 'Fine Art VII' },
  { id: 'aura-16', src: '/brand/aura/aura-16.png',  label: 'Blossom I' },
  { id: 'aura-17', src: '/brand/aura/aura-17.png',  label: 'Blossom II' },
  { id: 'aura-18', src: '/brand/aura/aura-18.png',  label: 'Blossom III' },
  { id: 'aura-19', src: '/brand/aura/aura-19.png',  label: 'Blossom IV' },
  { id: 'aura-20', src: '/brand/aura/aura-20.png',  label: 'Blossom V' },
  { id: 'aura-21', src: '/brand/aura/aura-21.png',  label: 'Orange Light' },
  { id: 'aura-22', src: '/brand/aura/aura-22.png',  label: 'Floral Bloom' },
  { id: 'aura-23', src: '/brand/aura/aura-23.png',  label: 'Star Light I' },
  { id: 'aura-24', src: '/brand/aura/aura-24.png',  label: 'Star Light II' },
  { id: 'aura-25', src: '/brand/aura/aura-25.png',  label: 'Star Light III' },
  // Image series
  { id: 'aura-31', src: '/brand/aura/aura-31.png',  label: 'Luxe Pink I' },
  { id: 'aura-32', src: '/brand/aura/aura-32.png',  label: 'Luxe Pink II' },
  { id: 'aura-33', src: '/brand/aura/aura-33.png',  label: 'Luxe Pink III' },
  { id: 'aura-34', src: '/brand/aura/aura-34.png',  label: 'Luxe Rose I' },
  { id: 'aura-35', src: '/brand/aura/aura-35.png',  label: 'Luxe Rose II' },
  { id: 'aura-36', src: '/brand/aura/aura-36.png',  label: 'Dreamy I' },
  { id: 'aura-37', src: '/brand/aura/aura-37.png',  label: 'Dreamy II' },
  { id: 'aura-38', src: '/brand/aura/aura-38.png',  label: 'Dreamy III' },
  { id: 'aura-39', src: '/brand/aura/aura-39.png',  label: 'Dreamy IV' },
  { id: 'aura-40', src: '/brand/aura/aura-40.png',  label: 'Ethereal I' },
  { id: 'aura-41', src: '/brand/aura/aura-41.png',  label: 'Ethereal II' },
]

// ─── Futuristic backgrounds — 9 Freepik images (photo-based, real scenes) ──────
// type: 'image' → buildBackground() loads as Fabric.Image + dark overlay
// cssGradient: CSS value used for Step3 thumbnail preview
export const FUTURISTIC_BACKGROUNDS = [
  { id: 'futuristic-01', label: 'Abstract Bloom',
    type: 'image', src: '/brand/freepik/fp-01.jpg',
    cssGradient: 'url(/brand/freepik/fp-01.jpg) center/cover' },
  { id: 'futuristic-02', label: 'Crystal Geometry',
    type: 'image', src: '/brand/freepik/fp-02.jpg',
    cssGradient: 'url(/brand/freepik/fp-02.jpg) center/cover' },
  { id: 'futuristic-03', label: 'Modern Abstract',
    type: 'image', src: '/brand/freepik/fp-03.jpg',
    cssGradient: 'url(/brand/freepik/fp-03.jpg) center/cover' },
  { id: 'futuristic-04', label: 'Sacred Geometry',
    type: 'image', src: '/brand/freepik/fp-04.jpg',
    cssGradient: 'url(/brand/freepik/fp-04.jpg) center/cover' },
  { id: 'futuristic-05', label: 'Dreamy Vision',
    type: 'image', src: '/brand/freepik/fp-05.jpg',
    cssGradient: 'url(/brand/freepik/fp-05.jpg) center/cover' },
  { id: 'futuristic-06', label: 'HK Power',
    type: 'image', src: '/brand/freepik/fp-06.jpg',
    cssGradient: 'url(/brand/freepik/fp-06.jpg) center/cover' },
  { id: 'futuristic-07', label: 'City Heights',
    type: 'image', src: '/brand/freepik/fp-07.jpg',
    cssGradient: 'url(/brand/freepik/fp-07.jpg) center/cover' },
  { id: 'futuristic-08', label: 'Financial Hub',
    type: 'image', src: '/brand/freepik/fp-08.jpg',
    cssGradient: 'url(/brand/freepik/fp-08.jpg) center/cover' },
  { id: 'futuristic-09', label: 'Pink Strategy',
    type: 'image', src: '/brand/freepik/fp-09.jpg',
    cssGradient: 'url(/brand/freepik/fp-09.jpg) center/cover' },
]
export const CHI_HOI = [
  { id: 'bd',   label: 'Chi hội Bình Dương',  logo: '/brand/chi-hoi/ch-bd.svg',  logoPng: '/brand/chi-hoi/ch-bd.png' },
  { id: 'kn',   label: 'Chi hội Khánh Hòa',  logo: '/brand/chi-hoi/ch-kn.svg',  logoPng: '/brand/chi-hoi/ch-kn.png' },
  { id: 'pt',   label: 'Chi hội Phú Thọ',    logo: '/brand/chi-hoi/ch-pt.svg',  logoPng: '/brand/chi-hoi/ch-pt.png' },
  { id: 'ts',   label: 'Chi hội Tiền Giang', logo: '/brand/chi-hoi/ch-ts.svg',  logoPng: '/brand/chi-hoi/ch-ts.png' },
  { id: 'tt',   label: 'Chi hội Thừa Thiên', logo: '/brand/chi-hoi/ch-tt.svg',  logoPng: '/brand/chi-hoi/ch-tt.png' },
  { id: 'vt',   label: 'Chi hội Vũng Tàu',   logo: '/brand/chi-hoi/ch-vt.svg',  logoPng: '/brand/chi-hoi/ch-vt.png' },
  { id: 'yt',   label: 'Chi hội Yên Tỉnh',   logo: '/brand/chi-hoi/ch-yt.svg',  logoPng: '/brand/chi-hoi/ch-yt.png' },
  { id: 'none', label: 'Không có chi hội',   logo: null,                         logoPng: null },
]

export const HAWEE_LOGOS = [
  { id: 'horizontal-en',    src: '/brand/logos/hawee-horizontal-en.svg',    label: 'Ngang — EN',       bg: 'dark' },
  { id: 'horizontal-vni',   src: '/brand/logos/hawee-horizontal-vni.svg',   label: 'Ngang — VNI',      bg: 'dark' },
  { id: 'final-white-en',   src: '/brand/logos/hawee-final-white-en.svg',   label: 'Vuông trắng — EN', bg: 'dark' },
  { id: 'final-default-en', src: '/brand/logos/hawee-final-default-en.svg', label: 'Vuông màu — EN',   bg: 'light' },
  { id: 'vertical',         src: '/brand/logos/hawee-vertical.svg',         label: 'Dọc',               bg: 'any' },
]

export const DEFAULT_CONFIG = {
  format:              'square',
  mode:                'aura',
  backgroundId:        'aura-03',
  backgroundCustomUrl: null,
  chiHoiId:            'none',
  logoId:              'horizontal-en',
  programName:         '',
  headline:            '',
  tagline:             '',
  date:                '',
  time:                '',
  location:            '',
  badgeText:           '',
  ctaText:             '',      // CTA button text, e.g. "Đăng ký ngay"
  speakers: [
    { id: 'sp1', photoUrl: null, name: '', title: '', organization: '' },
  ],
  // ── Fixed template system ──────────────────────────────────────────────
  templateId:          null,   // null = legacy wizard, string = fixed template id
  // Template: welcome-member
  memberName:          '',
  memberTitle:         '',
  memberOrg:           '',
  quarter:             '',     // e.g. "Q2 · 2026"
  // Template: coming-soon
  bigDate:             '',     // e.g. "26.06"
  // Template: connect-landscape
  tag1:                '',
  tag2:                '',
  tag3:                '',
  // ──────────────────────────────────────────────────────────────────────
  // ── Visual cue pre-selected in wizard ────────────────────────────────────
  cueUrl:        null,   // src string — SVG data URL or AI-generated image URL
  // ──────────────────────────────────────────────────────────────────────────
  canvasJSON:    null,
  canvasVersion: 0,
}
