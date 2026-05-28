import { useState, useCallback } from 'react'
import { useOpenAI } from './useOpenAI.js'

// ─── Zone-based pixel analysis ───────────────────────────────────────────────
function analyzeZones(ctx, cw, ch) {
  // Sample top-left 20% × 20% = potential logo zone
  const zW = Math.max(1, Math.floor(cw * 0.22))
  const zH = Math.max(1, Math.floor(ch * 0.22))
  const { data } = ctx.getImageData(0, 0, zW, zH)
  let pinkInZone = 0, total = 0
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3]
    if (a < 40) continue
    total++
    const rN = r/255, gN = g/255, bN = b/255
    const mx = Math.max(rN,gN,bN), mn = Math.min(rN,gN,bN)
    const l = (mx+mn)/2
    const s = mx===mn ? 0 : l<0.5 ? (mx-mn)/(mx+mn) : (mx-mn)/(2-mx-mn)
    let h = 0
    if (mx !== mn) {
      if      (mx===rN) h = ((gN-bN)/(mx-mn)+6)%6*60
      else if (mx===gN) h = ((bN-rN)/(mx-mn)+2)*60
      else              h = ((rN-gN)/(mx-mn)+4)*60
    }
    if ((h>=285||h<=25) && s>0.25 && l>0.1 && l<0.92) pinkInZone++
  }
  return { logoZonePinkRatio: total > 0 ? pinkInZone / total : 0 }
}

// ─── Sharpness via Laplacian variance ────────────────────────────────────────
function measureSharpness(ctx, cw, ch) {
  const { data } = ctx.getImageData(0, 0, cw, ch)
  // Grayscale + simple Laplacian on every 4th pixel for speed
  let sumSq = 0, count = 0
  for (let y = 1; y < ch - 1; y += 2) {
    for (let x = 1; x < cw - 1; x += 2) {
      const idx = (y * cw + x) * 4
      const gray = (data[idx] * 0.299 + data[idx+1] * 0.587 + data[idx+2] * 0.114) / 255
      const top  = ((data[((y-1)*cw+x)*4]*0.299 + data[((y-1)*cw+x)*4+1]*0.587 + data[((y-1)*cw+x)*4+2]*0.114) / 255)
      const bot  = ((data[((y+1)*cw+x)*4]*0.299 + data[((y+1)*cw+x)*4+1]*0.587 + data[((y+1)*cw+x)*4+2]*0.114) / 255)
      const lap  = gray*2 - top - bot
      sumSq += lap * lap
      count++
    }
  }
  return count > 0 ? Math.sqrt(sumSq / count) : 0
}

// ─── Enhanced pixel-level color + zone analysis ───────────────────────────────
function analyzeImageColors(imgEl) {
  const MAX = 320
  const scale = Math.min(MAX / imgEl.naturalWidth, MAX / imgEl.naturalHeight, 1)
  const cw = Math.round(imgEl.naturalWidth  * scale)
  const ch = Math.round(imgEl.naturalHeight * scale)

  const canvas = document.createElement('canvas')
  canvas.width = cw; canvas.height = ch
  const ctx = canvas.getContext('2d')
  ctx.drawImage(imgEl, 0, 0, cw, ch)
  const { data } = ctx.getImageData(0, 0, cw, ch)

  let pinkCount = 0, darkCount = 0, lightCount = 0
  let veryLightCount = 0, colorfulCount = 0, warmCount = 0, totalPixels = 0

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
    if (a < 40) continue
    totalPixels++

    // RGB → HSL
    const rN = r / 255, gN = g / 255, bN = b / 255
    const mx = Math.max(rN, gN, bN), mn = Math.min(rN, gN, bN)
    const l = (mx + mn) / 2
    const s = mx === mn ? 0
      : l < 0.5 ? (mx - mn) / (mx + mn)
                : (mx - mn) / (2 - mx - mn)
    let h = 0
    if (mx !== mn) {
      if      (mx === rN) h = ((gN - bN) / (mx - mn) + 6) % 6 * 60
      else if (mx === gN) h = ((bN - rN) / (mx - mn) + 2) * 60
      else                h = ((rN - gN) / (mx - mn) + 4) * 60
    }

    // Pink Bloom hue: 285–360° OR 0–25°
    if ((h >= 285 || h <= 25) && s > 0.28 && l > 0.15 && l < 0.90) pinkCount++
    // Warm tones (red/orange/pink/yellow: 0–60° or 285–360°)
    if ((h <= 60 || h >= 285) && s > 0.2 && l > 0.1) warmCount++
    if (l < 0.22) darkCount++
    if (l > 0.75) lightCount++
    if (l > 0.88) veryLightCount++
    if (s > 0.25 && l > 0.15 && l < 0.85) colorfulCount++
  }

  const sharpness = measureSharpness(ctx, cw, ch)
  const zones     = analyzeZones(ctx, cw, ch)

  if (totalPixels === 0) return {
    pinkRatio: 0, darkRatio: 0, lightRatio: 0, veryLightRatio: 0,
    colorfulRatio: 0, warmRatio: 0, sharpness: 0, ...zones,
  }
  return {
    pinkRatio:      pinkCount      / totalPixels,
    darkRatio:      darkCount      / totalPixels,
    lightRatio:     lightCount     / totalPixels,
    veryLightRatio: veryLightCount / totalPixels,
    colorfulRatio:  colorfulCount  / totalPixels,
    warmRatio:      warmCount      / totalPixels,
    sharpness,
    ...zones,
  }
}

// ─── Comprehensive checks — no API key needed ─────────────────────────────────
// Covers categories 3 (Kích thước), 4 (Màu sắc), 6 (Hình ảnh)
// Categories 1,2,5,7,8 require human/AI review (can't detect from pixels)
function runQuickChecks(file, imgEl, colors) {
  const { naturalWidth: w, naturalHeight: h } = imgEl
  const ratio = w / h

  // Closest known banner format
  const knownRatios = [
    { name: '1:1 (Square post)',     r: 1 },
    { name: '4:5 (Portrait post)',   r: 4 / 5 },
    { name: '16:9 (YouTube/Cover)',  r: 16 / 9 },
    { name: '1.9:1 (Link preview)',  r: 1200 / 628 },
    { name: '9:16 (Story/Reel)',     r: 9 / 16 },
  ]
  const closest = knownRatios.reduce((a, b) =>
    Math.abs(a.r - ratio) < Math.abs(b.r - ratio) ? a : b
  )
  const isKnownRatio = Math.abs(closest.r - ratio) < 0.08

  const hasBrandColors  = colors.pinkRatio > 0.04
  const isWhiteHeavy    = colors.veryLightRatio > 0.60
  const hasWarmPalette  = colors.warmRatio > 0.12
  const isSharp         = colors.sharpness > 0.018     // empirical threshold
  const hasDarkBase     = colors.darkRatio > 0.15
  const hasLogoZonePink = colors.logoZonePinkRatio > 0.03

  return [
    // ── Cat 3: Kích thước ──────────────────────────────────────────────────
    {
      id: 'resolution',
      category: 'dimensions',
      label: 'Độ phân giải tối thiểu (≥ 1080px)',
      desc: 'Đọc tốt ở LED, standee, thumbnail — cạnh ngắn phải ≥ 1080px',
      detail: `${w} × ${h}px`,
      pass: Math.min(w, h) >= 1080,
      severity: 'warning',
      weight: 8,
    },
    {
      id: 'aspect',
      category: 'dimensions',
      label: 'Tỷ lệ khung chuẩn HAWEE',
      desc: 'Cần khớp một trong: 1:1, 4:5, 16:9, 1.9:1, 9:16',
      detail: isKnownRatio ? `${closest.name} ✓` : `${ratio.toFixed(2)}:1 — không khớp format chuẩn`,
      pass: isKnownRatio,
      severity: 'info',
      weight: 4,
    },
    {
      id: 'filesize',
      category: 'dimensions',
      label: 'Dung lượng file (< 10 MB)',
      desc: 'File quá nặng ảnh hưởng tốc độ tải — nên xuất PNG/JPG tối ưu',
      detail: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      pass: file.size < 10 * 1024 * 1024,
      severity: 'warning',
      weight: 5,
    },
    {
      id: 'high-res',
      category: 'dimensions',
      label: 'Xuất 2× retina (≥ 1800px)',
      desc: 'Xuất 2× để màn retina sắc nét — cạnh ngắn lý tưởng ≥ 2160px',
      detail: `${Math.min(w, h) >= 1800 ? '✓ Đủ nét' : 'Nên xuất 2×'}`,
      pass: Math.min(w, h) >= 1800,
      severity: 'info',
      weight: 3,
    },
    // ── Cat 4: Màu sắc ─────────────────────────────────────────────────────
    {
      id: 'brand-color',
      category: 'colors',
      label: 'Màu hồng Pink Bloom xuất hiện',
      desc: 'Ít nhất 4% diện tích có màu hồng/magenta (#C9187F, #E83A78...)',
      detail: `${Math.round(colors.pinkRatio * 100)}% pixels`,
      pass: hasBrandColors,
      severity: 'error',
      weight: 18,
    },
    {
      id: 'not-white-bg',
      category: 'colors',
      label: 'Nền tối/gradient, không trắng thuần',
      desc: 'Banner HAWEE dùng nền tối aura hoặc gradient — tránh nền trắng corporate',
      detail: isWhiteHeavy ? `${Math.round(colors.veryLightRatio * 100)}% quá sáng` : 'Nền phù hợp',
      pass: !isWhiteHeavy,
      severity: 'error',
      weight: 12,
    },
    {
      id: 'warm-palette',
      category: 'colors',
      label: 'Bảng màu ấm — hồng/đỏ/cam chủ đạo',
      desc: 'HAWEE dùng tông ấm: pink, magenta, amber — không xanh lạnh corporate',
      detail: `${Math.round(colors.warmRatio * 100)}% tông ấm`,
      pass: hasWarmPalette,
      severity: 'warning',
      weight: 8,
    },
    {
      id: 'color-variety',
      category: 'colors',
      label: 'Màu sắc đa dạng, không đơn sắc',
      desc: 'Nên có hỗn hợp màu đậm + sáng — không phải ảnh xám/bản thảo',
      detail: colors.colorfulRatio > 0.08 ? 'Phong phú' : 'Đơn điệu',
      pass: colors.colorfulRatio > 0.08,
      severity: 'warning',
      weight: 7,
    },
    // ── Cat 6: Hình ảnh & chất lượng ──────────────────────────────────────
    {
      id: 'sharpness',
      category: 'images',
      label: 'Ảnh sắc nét, không mờ',
      desc: 'Phát hiện edge density — ảnh mờ/noise thấp sẽ không đạt',
      detail: isSharp ? 'Sắc nét' : 'Có thể bị mờ',
      pass: isSharp,
      severity: 'warning',
      weight: 9,
    },
    {
      id: 'dark-base',
      category: 'images',
      label: 'Nền đủ tối — tạo độ tương phản',
      desc: 'Nền tối tạo chiều sâu và nổi bật text trắng — brand HAWEE',
      detail: `${Math.round(colors.darkRatio * 100)}% vùng tối`,
      pass: hasDarkBase,
      severity: 'warning',
      weight: 8,
    },
    {
      id: 'logo-zone',
      category: 'images',
      label: 'Góc logo có màu brand (pink)',
      desc: 'Phát hiện màu thương hiệu vùng góc trên-trái — vị trí logo HAWEE',
      detail: `${Math.round(colors.logoZonePinkRatio * 100)}% pink ở góc TL`,
      pass: hasLogoZonePink,
      severity: 'info',
      weight: 6,
    },
  ]
}

// ─── Auto score from pixel checks ────────────────────────────────────────────
export function computeAutoScore(checks) {
  if (!checks.length) return null
  const total  = checks.reduce((s, c) => s + (c.weight ?? 5), 0)
  const passed = checks.filter(c => c.pass).reduce((s, c) => s + (c.weight ?? 5), 0)
  // Scale to 60 (pixel checks cover ~60% of the 8-category rubric)
  const raw = Math.round((passed / total) * 60)
  return Math.min(60, Math.max(0, raw))
}

// ─── Resize image to data URL for AI ─────────────────────────────────────────
async function resizeToDataURL(src, maxPx = 1024) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(maxPx / img.naturalWidth, maxPx / img.naturalHeight, 1)
      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(img.naturalWidth  * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.90))
    }
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useImageAudit() {
  const [file,         setFile]         = useState(null)
  const [previewUrl,   setPreviewUrl]   = useState(null)
  const [quickChecks,  setQuickChecks]  = useState([])
  const [analyzing,    setAnalyzing]    = useState(false)
  const [aiResult,     setAiResult]     = useState(null)
  const [aiLoading,    setAiLoading]    = useState(false)
  const [aiError,      setAiError]      = useState(null)
  const { checkCompliance, hasKey, hasGeminiKey } = useOpenAI()
  const hasAnyKey = hasKey || hasGeminiKey

  // ── Load file & run instant pixel checks ────────────────────────────────
  const loadFile = useCallback((newFile) => {
    if (!newFile) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(newFile)
    setQuickChecks([])
    setAiResult(null)

    const url = URL.createObjectURL(newFile)
    setPreviewUrl(url)
    setAnalyzing(true)

    const img = new Image()
    img.onload = () => {
      const colors = analyzeImageColors(img)
      setQuickChecks(runQuickChecks(newFile, img, colors))
      setAnalyzing(false)
    }
    img.onerror = () => setAnalyzing(false)
    img.src = url
  }, [previewUrl])

  // ── AI deep check — Gemini direct (free) or OpenAI GPT-4o ──────────────
  // checkCompliance now THROWS on error (not setError), so catch always fires
  const runAICheck = useCallback(async () => {
    if (!previewUrl) return
    setAiLoading(true)
    setAiResult(null)
    setAiError(null)
    try {
      const dataURL = await resizeToDataURL(previewUrl)
      if (!dataURL) throw new Error('Không resize được ảnh — thử upload lại')
      const result = await checkCompliance(dataURL)
      // result is always valid here (checkCompliance throws on failure)
      setAiResult(result)
    } catch (e) {
      setAiError(e.message)
      console.error('[Audit] AI check error:', e)
    } finally {
      setAiLoading(false)
    }
  }, [previewUrl, checkCompliance])

  // ── Reset ────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setQuickChecks([])
    setAiResult(null)
    setAiError(null)
    setAnalyzing(false)
  }, [previewUrl])

  const summary = {
    total:    quickChecks.length,
    passed:   quickChecks.filter(c => c.pass).length,
    errors:   quickChecks.filter(c => !c.pass && c.severity === 'error').length,
    warnings: quickChecks.filter(c => !c.pass && c.severity === 'warning').length,
  }

  // Auto score from pixel checks (out of 60 — covers cats 3,4,6 only)
  const autoScore = computeAutoScore(quickChecks)

  return {
    file, previewUrl, quickChecks, summary, autoScore,
    analyzing,
    aiResult, aiLoading, aiError,
    loadFile, runAICheck, reset,
    hasKey, hasGeminiKey, hasAnyKey,
  }
}
