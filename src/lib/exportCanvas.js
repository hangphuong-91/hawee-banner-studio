// ─── Canvas Export ───────────────────────────────────────────────────────────
import { FORMATS } from './brandConfig.js'

/**
 * Export Fabric canvas as PNG download.
 * Uses each format's exportScale (default 2×).
 * @param {fabric.Canvas} fabricCanvas
 * @param {string}        formatId  matches FORMATS[].id
 */
export async function exportToPNG(fabricCanvas, formatId = 'square-2k') {
  if (!fabricCanvas) return

  const fmt        = FORMATS.find(f => f.id === formatId) ?? FORMATS[0]
  const multiplier = fmt.exportScale ?? 2

  // Deselect all objects before export (hide selection handles)
  fabricCanvas.discardActiveObject()
  fabricCanvas.renderAll()

  const dataURL = fabricCanvas.toDataURL({
    format:     'png',
    multiplier,
    quality:    1,
  })

  const timestamp = Date.now()
  // e.g. hawee-banner-2048x2048-1716800000000.png
  const sizeTag  = fmt.label.replace(' × ', 'x').replace(/\s/g, '')
  const filename = `hawee-banner-${sizeTag}-${timestamp}.png`

  const link    = document.createElement('a')
  link.download = filename
  link.href     = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  return { filename, dataURL }
}

/**
 * Get canvas screenshot as data URL for AI compliance check.
 * Smaller size (0.5×) to reduce token cost.
 */
export function getCanvasScreenshot(fabricCanvas) {
  if (!fabricCanvas) return null
  fabricCanvas.discardActiveObject()
  fabricCanvas.renderAll()
  return fabricCanvas.toDataURL({ format: 'jpeg', multiplier: 0.5, quality: 0.85 })
}
