// Vercel Serverless Function — Google Gemini API Proxy
// Free tier: 15 RPM / 1500 RPD — get key at https://aistudio.google.com/
export const config = { maxDuration: 60 }

// ── HAWEE Brand Compliance Prompt ─────────────────────────────────────────────
const BRAND_CHECK_PROMPT = `Bạn là Creative Director cấp cao cho HAWEE (Hội Nữ Doanh Nhân TP.HCM).
Triết lý thương hiệu: "Giao hưởng của hào quang" — nữ tính hiện đại, mạnh mẽ, tự tin, kết nối, tỏa sáng.

Đánh giá ấn phẩm theo 8 hạng mục (tổng 100 điểm):

1. Logo & nhận diện (15đ): Logo HAWEE đúng, không méo (4đ); đúng phiên bản (3đ); có safe space (3đ); tương phản tốt (3đ); lockup đúng ngữ cảnh (2đ)
2. Bố cục & thị giác (15đ): Phân cấp 3 giây nhận ra chủ đề (4đ); khoảng trắng hợp lý (3đ); cân bằng ảnh-chữ (3đ); bố cục đúng định dạng (2đ); điểm nhấn brand (3đ)
3. Kích thước & đọc được (10đ): Đúng tỷ lệ (3đ); safe zone (2đ); đọc tốt mọi size (3đ); độ phân giải rõ (2đ)
4. Màu sắc (15đ): Pink Bloom là chủ đạo #C9187F #E83A78 #A70061 #50002F (4đ); màu phụ đúng (3đ); đúng mã màu (3đ); tương phản chữ-nền (3đ); không dùng màu lạc brand (2đ)
5. Font & typography (15đ): Mona Sans font chính (4đ); headline SemiBold line-height 120% (3đ); body Medium 140-150% (3đ); phân cấp chữ rõ (3đ); không lỗi chính tả (2đ)
6. Hình ảnh & chất lượng (15đ): Ảnh tự tin chuyên nghiệp (3đ); cut-out/nền đúng (3đ); masking đội nhóm đẹp (3đ); chất lượng ảnh tốt (3đ); thể hiện cộng đồng HAWEE (3đ)
7. Mood & tone (10đ): Tinh thần Aura (3đ); nữ tính hiện đại (2đ); lãnh đạo chuyên nghiệp (2đ); cảm xúc tích cực (2đ); nhất quán HAWEE (1đ)
8. Thông điệp (15đ): Đúng định vị kết nối nâng tầm (4đ); headline sắc có lực (3đ); thông tin đầy đủ ai-làm gì-khi nào-CTA (3đ); giọng văn HAWEE (3đ); không quá tải chữ (2đ)

FAIL NGAY nếu: sai logo, sai font (không Mona Sans), màu lạc brand >50% diện tích, ảnh phản cảm, thông điệp lệch định vị nữ lãnh đạo.

Sau khi chấm điểm, đưa ra đề xuất như Creative Director thực sự:
- Với mỗi hạng mục điểm thấp: nêu cụ thể VẤN ĐỀ + HƯỚNG SỬA + GỢI Ý THỰC HIỆN
- Đề xuất cải tiến về bố cục, màu sắc, typography, hình ảnh theo chuẩn HAWEE
- Nếu có thể dùng Studio: gợi ý user làm gì trong canvas editor để fix

Trả về JSON hợp lệ (không kèm markdown, không giải thích ngoài JSON):
{
  "score": <0-100>,
  "breakdown": [
    {"id":"logo","label":"Logo & nhận diện","max":15,"score":<0-15>,"issues":["vấn đề cụ thể nếu có"]},
    {"id":"layout","label":"Bố cục & thị giác","max":15,"score":<0-15>,"issues":[]},
    {"id":"dimensions","label":"Kích thước & đọc được","max":10,"score":<0-10>,"issues":[]},
    {"id":"colors","label":"Màu sắc","max":15,"score":<0-15>,"issues":[]},
    {"id":"typography","label":"Font & typography","max":15,"score":<0-15>,"issues":[]},
    {"id":"images","label":"Hình ảnh & chất lượng","max":15,"score":<0-15>,"issues":[]},
    {"id":"mood","label":"Mood & tone","max":10,"score":<0-10>,"issues":[]},
    {"id":"message","label":"Thông điệp & nội dung","max":15,"score":<0-15>,"issues":[]}
  ],
  "fail_flags": [],
  "verdict": "pass|can-chinh|khong-dat|fail-ngay",
  "suggestions": [
    "🎨 [Màu sắc] Hướng sửa cụ thể...",
    "📐 [Bố cục] Hướng sửa cụ thể..."
  ]
}
Verdict: pass≥85, can-chinh 70-84, khong-dat<70, fail-ngay nếu có fail_flags.`

export default async function handler(req, res) {
  const origin = process.env.ALLOWED_ORIGIN ?? '*'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Gemini-Key')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = req.headers['x-gemini-key']
  if (!apiKey) return res.status(401).json({ error: 'Gemini API key required (X-Gemini-Key header)' })

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const { action, payload } = body ?? {}

  // ── Brand compliance check via Gemini 1.5 Flash (Vision) ──────────────────
  if (action === 'check-compliance') {
    const { imageDataURL } = payload ?? {}
    if (!imageDataURL) return res.status(400).json({ error: 'imageDataURL required' })

    // Extract base64 data and MIME type from data URL
    const commaIdx = imageDataURL.indexOf(',')
    const header   = imageDataURL.slice(0, commaIdx)
    const b64Data  = imageDataURL.slice(commaIdx + 1)
    const mimeType = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg'

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  inline_data: { mime_type: mimeType, data: b64Data },
                },
                {
                  text: BRAND_CHECK_PROMPT + '\n\nĐánh giá banner này theo rubric. Trả về JSON hợp lệ — không markdown, không giải thích ngoài JSON.',
                },
              ],
            }],
            generationConfig: {
              temperature:     0.2,
              maxOutputTokens: 2400,
            },
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            ],
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        return res.status(response.status).json({
          error: data.error?.message ?? `Gemini error ${response.status}`,
        })
      }

      // Gemini → wrap in OpenAI-compatible envelope so frontend parsing stays unchanged
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      return res.status(200).json({
        choices: [{ message: { content: text } }],
        _model: 'gemini-1.5-flash',
      })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(400).json({ error: `Unknown action: ${action}` })
}
