// Visual Cue Library — 20 pre-curated icons
// Each icon is an inline SVG data URL or path to public/cues/

// We define them as inline SVG strings to avoid HTTP requests and ensure
// they work reliably with Fabric.js Image.fromURL()

export const CUES_LIBRARY_BASE = [
  // ── Business ──────────────────────────────────────────────
  {
    id: 'briefcase',
    label: 'Briefcase',
    category: 'business',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <rect x="8" y="20" width="48" height="36" rx="6" fill="%23C9187F" opacity="0.9"/>
      <rect x="20" y="12" width="24" height="12" rx="4" stroke="%23C9187F" stroke-width="3" fill="none"/>
      <line x1="8" y1="38" x2="56" y2="38" stroke="white" stroke-width="2" opacity="0.4"/>
      <rect x="26" y="34" width="12" height="8" rx="2" fill="white" opacity="0.7"/>
    </svg>`,
  },
  {
    id: 'trophy',
    label: 'Trophy',
    category: 'business',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <path d="M20 8h24v24a12 12 0 01-24 0V8z" fill="%23E83A78" opacity="0.9"/>
      <path d="M20 18H8a8 8 0 008 8h4" stroke="%23FB6094" stroke-width="2.5" fill="none"/>
      <path d="M44 18h12a8 8 0 01-8 8h-4" stroke="%23FB6094" stroke-width="2.5" fill="none"/>
      <rect x="27" y="32" width="10" height="8" fill="%23C9187F"/>
      <rect x="20" y="40" width="24" height="5" rx="2" fill="%23E83A78"/>
    </svg>`,
  },
  {
    id: 'handshake',
    label: 'Handshake',
    category: 'business',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <path d="M4 28l16-8 8 4 8-4 16 8" stroke="%23C9187F" stroke-width="3" stroke-linecap="round"/>
      <path d="M4 28l16 12 8-4 8 4 16-12" stroke="%23E83A78" stroke-width="3" stroke-linecap="round" fill="none"/>
      <circle cx="20" cy="32" r="4" fill="%23FB6094"/>
      <circle cx="44" cy="32" r="4" fill="%23FB6094"/>
    </svg>`,
  },
  {
    id: 'crown',
    label: 'Crown',
    category: 'business',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <path d="M8 44L16 16l16 20L48 16l8 28H8z" fill="%23C9187F" opacity="0.9"/>
      <circle cx="16" cy="16" r="4" fill="%23FFD4E5"/>
      <circle cx="32" cy="36" r="4" fill="%23FFD4E5"/>
      <circle cx="48" cy="16" r="4" fill="%23FFD4E5"/>
      <rect x="8" y="44" width="48" height="6" rx="3" fill="%23E83A78"/>
    </svg>`,
  },
  {
    id: 'star-badge',
    label: 'Star Badge',
    category: 'business',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="%23C9187F" opacity="0.15" stroke="%23C9187F" stroke-width="2"/>
      <path d="M32 12l4.5 13.5H62l-11 8 4.5 13.5L32 40l-23.5 7L13 33l-11-8h25.5z" fill="%23E83A78"/>
    </svg>`,
  },

  // ── AI & Tech ─────────────────────────────────────────────
  {
    id: 'brain',
    label: 'AI Brain',
    category: 'ai-tech',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="28" rx="22" ry="18" fill="%23C9187F" opacity="0.8"/>
      <path d="M20 28c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="white" stroke-width="2" fill="none"/>
      <circle cx="22" cy="30" r="3" fill="white" opacity="0.8"/>
      <circle cx="32" cy="26" r="3" fill="white" opacity="0.8"/>
      <circle cx="42" cy="30" r="3" fill="white" opacity="0.8"/>
      <line x1="22" y1="30" x2="32" y2="26" stroke="white" stroke-width="1.5" opacity="0.6"/>
      <line x1="32" y1="26" x2="42" y2="30" stroke="white" stroke-width="1.5" opacity="0.6"/>
      <rect x="28" y="42" width="8" height="10" rx="2" fill="%23C9187F"/>
    </svg>`,
  },
  {
    id: 'circuit',
    label: 'Circuit',
    category: 'ai-tech',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <rect x="20" y="20" width="24" height="24" rx="4" fill="%23C9187F" opacity="0.9"/>
      <line x1="8" y1="32" x2="20" y2="32" stroke="%23E83A78" stroke-width="2"/>
      <line x1="44" y1="32" x2="56" y2="32" stroke="%23E83A78" stroke-width="2"/>
      <line x1="32" y1="8" x2="32" y2="20" stroke="%23E83A78" stroke-width="2"/>
      <line x1="32" y1="44" x2="32" y2="56" stroke="%23E83A78" stroke-width="2"/>
      <circle cx="8" cy="32" r="3" fill="%23FB6094"/>
      <circle cx="56" cy="32" r="3" fill="%23FB6094"/>
      <circle cx="32" cy="8" r="3" fill="%23FB6094"/>
      <circle cx="32" cy="56" r="3" fill="%23FB6094"/>
      <rect x="26" y="26" width="12" height="12" rx="2" fill="white" opacity="0.9"/>
    </svg>`,
  },
  {
    id: 'data-chart',
    label: 'Data Chart',
    category: 'ai-tech',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <rect x="8" y="40" width="10" height="16" rx="2" fill="%23C9187F"/>
      <rect x="22" y="28" width="10" height="28" rx="2" fill="%23E83A78"/>
      <rect x="36" y="16" width="10" height="40" rx="2" fill="%23FB6094"/>
      <rect x="50" y="24" width="10" height="32" rx="2" fill="%23C9187F" opacity="0.7"/>
      <line x1="4" y1="56" x2="60" y2="56" stroke="white" stroke-width="2" opacity="0.3"/>
    </svg>`,
  },
  {
    id: 'infinity',
    label: 'Infinity',
    category: 'ai-tech',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <path d="M32 32c-4-8-12-14-20-8s-8 20 0 24 20-8 20-16 8-22 20-16 8 20 0 24-16-8-20-16z"
        stroke="%23C9187F" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="32" cy="32" r="4" fill="%23E83A78"/>
    </svg>`,
  },

  // ── Growth ────────────────────────────────────────────────
  {
    id: 'arrow-growth',
    label: 'Growth Arrow',
    category: 'growth',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <path d="M8 52L28 28l12 12L56 8" stroke="%23C9187F" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M42 8h14v14" stroke="%23C9187F" stroke-width="4" stroke-linecap="round" fill="none"/>
    </svg>`,
  },
  {
    id: 'rocket',
    label: 'Rocket',
    category: 'growth',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <path d="M32 4C32 4 48 16 48 36l-16 8L16 36C16 16 32 4 32 4z" fill="%23C9187F" opacity="0.9"/>
      <circle cx="32" cy="28" r="6" fill="white" opacity="0.8"/>
      <path d="M16 44l-8 8 4-2 2 4 8-8" fill="%23E83A78"/>
      <path d="M48 44l8 8-4-2-2 4-8-8" fill="%23E83A78"/>
      <path d="M26 44l-4 8h20l-4-8H26z" fill="%23FB6094" opacity="0.7"/>
    </svg>`,
  },
  {
    id: 'compass',
    label: 'Compass',
    category: 'growth',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="26" stroke="%23C9187F" stroke-width="3" fill="%23C9187F" opacity="0.1"/>
      <path d="M32 14l4 14-4 4-4-4 4-14z" fill="%23E83A78"/>
      <path d="M32 50l-4-14 4-4 4 4-4 14z" fill="white" opacity="0.5"/>
      <circle cx="32" cy="32" r="4" fill="white"/>
    </svg>`,
  },

  // ── Network ───────────────────────────────────────────────
  {
    id: 'network',
    label: 'Network',
    category: 'network',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="6" fill="%23C9187F"/>
      <circle cx="12" cy="16" r="5" fill="%23E83A78"/>
      <circle cx="52" cy="16" r="5" fill="%23E83A78"/>
      <circle cx="12" cy="48" r="5" fill="%23E83A78"/>
      <circle cx="52" cy="48" r="5" fill="%23E83A78"/>
      <line x1="17" y1="19" x2="27" y2="28" stroke="%23C9187F" stroke-width="2" opacity="0.7"/>
      <line x1="47" y1="19" x2="37" y2="28" stroke="%23C9187F" stroke-width="2" opacity="0.7"/>
      <line x1="17" y1="45" x2="27" y2="36" stroke="%23C9187F" stroke-width="2" opacity="0.7"/>
      <line x1="47" y1="45" x2="37" y2="36" stroke="%23C9187F" stroke-width="2" opacity="0.7"/>
    </svg>`,
  },
  {
    id: 'people',
    label: 'People',
    category: 'network',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="18" r="10" fill="%23C9187F" opacity="0.9"/>
      <path d="M12 52c0-11 9-20 20-20s20 9 20 20H12z" fill="%23E83A78" opacity="0.8"/>
      <circle cx="52" cy="22" r="7" fill="%23C9187F" opacity="0.6"/>
      <path d="M38 52c0-8 6-14 14-14" stroke="%23C9187F" stroke-width="2" fill="none" opacity="0.5"/>
      <circle cx="12" cy="22" r="7" fill="%23C9187F" opacity="0.6"/>
      <path d="M26 52c0-8-6-14-14-14" stroke="%23C9187F" stroke-width="2" fill="none" opacity="0.5"/>
    </svg>`,
  },

  // ── Education ─────────────────────────────────────────────
  {
    id: 'lightbulb',
    label: 'Lightbulb',
    category: 'education',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="26" r="16" fill="%23C9187F" opacity="0.9"/>
      <path d="M24 40h16" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
      <rect x="26" y="44" width="12" height="4" rx="2" fill="%23E83A78"/>
      <rect x="28" y="50" width="8" height="4" rx="2" fill="%23C9187F"/>
      <line x1="32" y1="6" x2="32" y2="2" stroke="%23FB6094" stroke-width="2"/>
      <line x1="16" y1="14" x2="12" y2="10" stroke="%23FB6094" stroke-width="2"/>
      <line x1="48" y1="14" x2="52" y2="10" stroke="%23FB6094" stroke-width="2"/>
    </svg>`,
  },

  // ── Decoration ────────────────────────────────────────────
  {
    id: 'sparkle',
    label: 'Sparkle',
    category: 'decoration',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <path d="M32 4v14M32 46v14M4 32h14M46 32h14" stroke="%23C9187F" stroke-width="3" stroke-linecap="round"/>
      <path d="M32 4l4 28-4 0-4 0z" fill="%23C9187F" opacity="0.7"/>
      <path d="M32 60l-4-28 4 0 4 0z" fill="%23C9187F" opacity="0.7"/>
      <circle cx="32" cy="32" r="6" fill="%23E83A78"/>
    </svg>`,
  },
  {
    id: 'star-4',
    label: '4-Point Star',
    category: 'decoration',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <path d="M32 4L38 26 60 32 38 38 32 60 26 38 4 32 26 26z" fill="%23C9187F" opacity="0.9"/>
      <path d="M32 14L36 28 50 32 36 36 32 50 28 36 14 32 28 28z" fill="%23FFD4E5" opacity="0.7"/>
    </svg>`,
  },
  {
    id: 'ring',
    label: 'Ring Circle',
    category: 'decoration',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" stroke="%23C9187F" stroke-width="4" fill="none"/>
      <circle cx="32" cy="32" r="20" stroke="%23E83A78" stroke-width="2" fill="none" opacity="0.5"/>
      <circle cx="32" cy="32" r="4" fill="%23C9187F"/>
    </svg>`,
  },
  {
    id: 'wave',
    label: 'Wave Line',
    category: 'decoration',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <path d="M4 32 C12 20 20 44 32 32 C44 20 52 44 60 32"
        stroke="%23C9187F" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M4 40 C12 28 20 52 32 40 C44 28 52 52 60 40"
        stroke="%23E83A78" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
    </svg>`,
  },
  {
    id: 'hexagon',
    label: 'Hexagon',
    category: 'decoration',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <path d="M32 4l24 14v28L32 60 8 46V18z" fill="%23C9187F" opacity="0.8"/>
      <path d="M32 12l18 10.5v21L32 54 14 43.5v-21z" fill="%23E83A78" opacity="0.5"/>
      <circle cx="32" cy="32" r="6" fill="white" opacity="0.8"/>
    </svg>`,
  },
]

// ── Shapes / Blocks — native Fabric.js objects (no SVG loading) ──────────────
// fabricType: 'rect' | 'circle'
// aspectRatio: width/height (only for rect; circle is always 1)
// previewBg: CSS background for thumbnail
// previewBorder: CSS border for thumbnail
// previewRadius: CSS border-radius for thumbnail
// fabricConfig: props passed directly to new fabric.Rect() / new fabric.Circle()
const SHAPES = [
  // ── Solid rectangles
  { id: 'rect-white', label: 'Box trắng', category: 'shapes',
    fabricType: 'rect', aspectRatio: 1.5,
    previewBg: '#FFFFFF', previewBorder: 'none', previewRadius: '2px',
    fabricConfig: { fill: '#FFFFFF' } },

  { id: 'rect-white-80', label: 'Box trắng 80%', category: 'shapes',
    fabricType: 'rect', aspectRatio: 1.5,
    previewBg: 'rgba(255,255,255,0.8)', previewBorder: 'none', previewRadius: '2px',
    fabricConfig: { fill: 'rgba(255,255,255,0.8)' } },

  { id: 'rect-white-50', label: 'Box trắng 50%', category: 'shapes',
    fabricType: 'rect', aspectRatio: 1.5,
    previewBg: 'rgba(255,255,255,0.5)', previewBorder: 'none', previewRadius: '2px',
    fabricConfig: { fill: 'rgba(255,255,255,0.5)' } },

  { id: 'rect-white-20', label: 'Box trắng 20%', category: 'shapes',
    fabricType: 'rect', aspectRatio: 1.5,
    previewBg: 'rgba(255,255,255,0.2)', previewBorder: '1px solid rgba(255,255,255,0.4)', previewRadius: '2px',
    fabricConfig: { fill: 'rgba(255,255,255,0.2)' } },

  { id: 'rect-dark-50', label: 'Box đen 50%', category: 'shapes',
    fabricType: 'rect', aspectRatio: 1.5,
    previewBg: 'rgba(0,0,0,0.5)', previewBorder: 'none', previewRadius: '2px',
    fabricConfig: { fill: 'rgba(0,0,0,0.5)' } },

  { id: 'rect-pink-25', label: 'Box hồng 25%', category: 'shapes',
    fabricType: 'rect', aspectRatio: 1.5,
    previewBg: 'rgba(201,24,127,0.25)', previewBorder: '1px solid rgba(201,24,127,0.6)', previewRadius: '2px',
    fabricConfig: { fill: 'rgba(201,24,127,0.25)', stroke: 'rgba(201,24,127,0.6)', strokeWidth: 2 } },

  // ── Rounded rectangles
  { id: 'rect-round-white', label: 'Bo góc trắng', category: 'shapes',
    fabricType: 'rect', aspectRatio: 1.5,
    previewBg: '#FFFFFF', previewBorder: 'none', previewRadius: '10px',
    fabricConfig: { fill: '#FFFFFF', rx: 20, ry: 20 } },

  { id: 'rect-round-white-70', label: 'Bo góc 70%', category: 'shapes',
    fabricType: 'rect', aspectRatio: 1.5,
    previewBg: 'rgba(255,255,255,0.7)', previewBorder: 'none', previewRadius: '10px',
    fabricConfig: { fill: 'rgba(255,255,255,0.7)', rx: 20, ry: 20 } },

  { id: 'rect-round-dark', label: 'Bo góc tối', category: 'shapes',
    fabricType: 'rect', aspectRatio: 1.5,
    previewBg: 'rgba(10,6,18,0.8)', previewBorder: '1px solid rgba(255,255,255,0.2)', previewRadius: '10px',
    fabricConfig: { fill: 'rgba(10,6,18,0.8)', stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, rx: 20, ry: 20 } },

  { id: 'rect-gradient-pink', label: 'Gradient hồng', category: 'shapes',
    fabricType: 'rect', aspectRatio: 1.5,
    previewBg: 'linear-gradient(135deg, #C9187F, #E83A78)', previewBorder: 'none', previewRadius: '10px',
    fabricConfig: { fill: '#C9187F', rx: 12, ry: 12 } },

  // ── Circles
  { id: 'circle-white', label: 'Tròn trắng', category: 'shapes',
    fabricType: 'circle', aspectRatio: 1,
    previewBg: '#FFFFFF', previewBorder: 'none', previewRadius: '50%',
    fabricConfig: { fill: '#FFFFFF' } },

  { id: 'circle-white-50', label: 'Tròn 50%', category: 'shapes',
    fabricType: 'circle', aspectRatio: 1,
    previewBg: 'rgba(255,255,255,0.5)', previewBorder: 'none', previewRadius: '50%',
    fabricConfig: { fill: 'rgba(255,255,255,0.5)' } },

  { id: 'circle-outline-white', label: 'Tròn viền trắng', category: 'shapes',
    fabricType: 'circle', aspectRatio: 1,
    previewBg: 'transparent', previewBorder: '2px solid #FFFFFF', previewRadius: '50%',
    fabricConfig: { fill: 'transparent', stroke: '#FFFFFF', strokeWidth: 4 } },

  { id: 'circle-outline-pink', label: 'Tròn viền hồng', category: 'shapes',
    fabricType: 'circle', aspectRatio: 1,
    previewBg: 'transparent', previewBorder: '2px solid #C9187F', previewRadius: '50%',
    fabricConfig: { fill: 'transparent', stroke: '#C9187F', strokeWidth: 4 } },

  // ── Bars / Lines
  { id: 'bar-white', label: 'Thanh trắng', category: 'shapes',
    fabricType: 'rect', aspectRatio: 6,
    previewBg: '#FFFFFF', previewBorder: 'none', previewRadius: '4px',
    fabricConfig: { fill: '#FFFFFF', rx: 8, ry: 8 } },

  { id: 'bar-pink', label: 'Thanh hồng', category: 'shapes',
    fabricType: 'rect', aspectRatio: 6,
    previewBg: '#C9187F', previewBorder: 'none', previewRadius: '4px',
    fabricConfig: { fill: '#C9187F', rx: 8, ry: 8 } },

  { id: 'bar-white-outline', label: 'Thanh viền', category: 'shapes',
    fabricType: 'rect', aspectRatio: 6,
    previewBg: 'transparent', previewBorder: '2px solid rgba(255,255,255,0.7)', previewRadius: '4px',
    fabricConfig: { fill: 'transparent', stroke: 'rgba(255,255,255,0.7)', strokeWidth: 3, rx: 8, ry: 8 } },
]

// ── Decorative Lines — SVG-based, wide aspect, for banner dividers/accents ────
const LINES = [
  {
    id: 'line-gradient-glow',
    label: 'Gradient Glow',
    category: 'lines',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 40" fill="none">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="%23C9187F" stop-opacity="0"/>
          <stop offset="0.5" stop-color="%23C9187F"/>
          <stop offset="1" stop-color="%23C9187F" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect x="0" y="14" width="300" height="12" rx="6" fill="url(%23lg1)" opacity="0.9"/>
      <rect x="40" y="17" width="220" height="6" rx="3" fill="white" opacity="0.25"/>
    </svg>`,
  },
  {
    id: 'line-double-pink',
    label: 'Double Hồng',
    category: 'lines',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 40" fill="none">
      <line x1="10" y1="14" x2="290" y2="14" stroke="%23C9187F" stroke-width="3" stroke-linecap="round"/>
      <line x1="10" y1="24" x2="290" y2="24" stroke="%23E83A78" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
    </svg>`,
  },
  {
    id: 'line-dashed-white',
    label: 'Dashed Trắng',
    category: 'lines',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 40" fill="none">
      <line x1="10" y1="20" x2="290" y2="20" stroke="white" stroke-width="2"
        stroke-linecap="round" stroke-dasharray="16,10" opacity="0.6"/>
    </svg>`,
  },
  {
    id: 'line-dot-accent',
    label: 'Dot Accent',
    category: 'lines',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 40" fill="none">
      <line x1="10" y1="20" x2="290" y2="20" stroke="%23C9187F" stroke-width="1.5" opacity="0.4"/>
      <circle cx="10"  cy="20" r="4" fill="%23C9187F"/>
      <circle cx="290" cy="20" r="4" fill="%23C9187F"/>
      <circle cx="150" cy="20" r="7" fill="%23E83A78"/>
      <circle cx="150" cy="20" r="3" fill="white" opacity="0.8"/>
    </svg>`,
  },
  {
    id: 'line-zigzag',
    label: 'Zigzag',
    category: 'lines',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 40" fill="none">
      <path d="M0,20 L25,10 L50,30 L75,10 L100,30 L125,10 L150,30 L175,10 L200,30 L225,10 L250,30 L275,10 L300,20"
        stroke="%23C9187F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    id: 'line-wave',
    label: 'Wave',
    category: 'lines',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 40" fill="none">
      <path d="M0,20 C37,8 75,32 112,20 S187,8 225,20 S262,32 300,20"
        stroke="%23C9187F" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M0,27 C37,15 75,39 112,27 S187,15 225,27 S262,39 300,27"
        stroke="white" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.25"/>
    </svg>`,
  },
  {
    id: 'line-diamond-center',
    label: 'Diamond',
    category: 'lines',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 40" fill="none">
      <line x1="10" y1="20" x2="130" y2="20" stroke="%23C9187F" stroke-width="2" stroke-linecap="round"/>
      <line x1="170" y1="20" x2="290" y2="20" stroke="%23C9187F" stroke-width="2" stroke-linecap="round"/>
      <path d="M150,10 L168,20 L150,30 L132,20 Z" fill="%23C9187F"/>
      <path d="M150,14 L163,20 L150,26 L137,20 Z" fill="%23E83A78"/>
      <circle cx="150" cy="20" r="3" fill="white" opacity="0.8"/>
    </svg>`,
  },
  {
    id: 'line-triple',
    label: 'Triple Lines',
    category: 'lines',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 40" fill="none">
      <line x1="10" y1="12" x2="290" y2="12" stroke="%23C9187F" stroke-width="1" stroke-linecap="round" opacity="0.35"/>
      <line x1="10" y1="20" x2="290" y2="20" stroke="%23C9187F" stroke-width="3" stroke-linecap="round"/>
      <line x1="10" y1="28" x2="290" y2="28" stroke="%23C9187F" stroke-width="1" stroke-linecap="round" opacity="0.35"/>
    </svg>`,
  },
  {
    id: 'line-fade-right',
    label: 'Fade Right',
    category: 'lines',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 40" fill="none">
      <defs>
        <linearGradient id="lgr" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="%23C9187F" stop-opacity="1"/>
          <stop offset="0.7" stop-color="%23C9187F" stop-opacity="0.6"/>
          <stop offset="1" stop-color="%23C9187F" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect x="0" y="15" width="300" height="5" rx="2.5" fill="url(%23lgr)"/>
      <rect x="0" y="19" width="280" height="3" rx="1.5" fill="url(%23lgr)" opacity="0.4"/>
    </svg>`,
  },
  {
    id: 'line-dots-row',
    label: 'Dots Row',
    category: 'lines',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 40" fill="none">
      <line x1="0" y1="20" x2="300" y2="20" stroke="white" stroke-width="1" opacity="0.15"/>
      <circle cx="20"  cy="20" r="3" fill="%23C9187F" opacity="0.6"/>
      <circle cx="50"  cy="20" r="3" fill="%23C9187F" opacity="0.6"/>
      <circle cx="80"  cy="20" r="3" fill="%23C9187F" opacity="0.6"/>
      <circle cx="110" cy="20" r="3" fill="%23C9187F" opacity="0.6"/>
      <circle cx="150" cy="20" r="5" fill="%23E83A78"/>
      <circle cx="190" cy="20" r="3" fill="%23C9187F" opacity="0.6"/>
      <circle cx="220" cy="20" r="3" fill="%23C9187F" opacity="0.6"/>
      <circle cx="250" cy="20" r="3" fill="%23C9187F" opacity="0.6"/>
      <circle cx="280" cy="20" r="3" fill="%23C9187F" opacity="0.6"/>
    </svg>`,
  },
]

// Merge shapes into main library
export const CUES_LIBRARY = [
  ...CUES_LIBRARY_BASE,
  ...SHAPES,
  ...LINES,
]

// Group by category
export const CUES_BY_CATEGORY = CUES_LIBRARY.reduce((acc, cue) => {
  if (!acc[cue.category]) acc[cue.category] = []
  acc[cue.category].push(cue)
  return acc
}, {})

export const CUE_CATEGORIES = [
  { id: 'shapes',     label: 'Hình khối',    icon: '⬜' },
  { id: 'lines',      label: 'Đường Line',   icon: '〰️' },
  { id: 'business',   label: 'Kinh doanh',   icon: '💼' },
  { id: 'ai-tech',    label: 'AI & Công nghệ', icon: '🤖' },
  { id: 'growth',     label: 'Tăng trưởng',  icon: '📈' },
  { id: 'network',    label: 'Kết nối',       icon: '🤝' },
  { id: 'education',  label: 'Đào tạo',       icon: '🎓' },
  { id: 'decoration', label: 'Trang trí',     icon: '✨' },
]
