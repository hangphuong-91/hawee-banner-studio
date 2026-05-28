// Vercel Serverless Function — OpenAI API Proxy
export const config = { maxDuration: 60 }

// ── HAWEE Brand Compliance Prompt (server-side — never sent over the wire) ─────
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

Sau khi chấm điểm, hãy đưa ra đề xuất như một Creative Director thực sự:
- Với mỗi hạng mục điểm thấp: nêu cụ thể VẤN ĐỀ + HƯỚNG SỬA + GỢI Ý THỰC HIỆN
- Đề xuất cải tiến về bố cục, màu sắc, typography, hình ảnh theo chuẩn HAWEE
- Nếu có thể dùng Studio: gợi ý user làm gì trong canvas editor để fix

Trả về JSON hợp lệ (không kèm markdown):
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
    "📐 [Bố cục] Hướng sửa cụ thể...",
    "✍️ [Typography] Hướng sửa cụ thể..."
  ]
}
Verdict: pass≥85, can-chinh 70-84, khong-dat<70, fail-ngay nếu có fail_flags.`

export default async function handler(req, res) {
  const origin = process.env.ALLOWED_ORIGIN ?? '*'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-OpenAI-Key')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = req.headers['x-openai-key']
  if (!apiKey || !apiKey.startsWith('sk-')) {
    return res.status(401).json({ error: 'Valid OpenAI API key required (X-OpenAI-Key header)' })
  }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const { action, payload } = body ?? {}

  // ── Image generation: DALL-E 3 standard quality (fast, ~10-15s) ─────────────
  if (action === 'generate-cue') {
    const { prompt } = payload ?? {}
    if (!prompt) return res.status(400).json({ error: 'prompt required' })

    try {
      const r = await fetch('https://api.openai.com/v1/images/generations', {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model:           'dall-e-3',
          prompt:          prompt.slice(0, 1000),
          n:               1,
          size:            '1024x1024',
          response_format: 'url',
          quality:         'standard',   // standard ~10-15s; hd can hit 60s timeout
          style:           'vivid',
        }),
      })
      const d = await r.json()
      if (!r.ok) return res.status(r.status).json({ error: d.error?.message ?? 'Image generation failed' })
      return res.status(200).json({ ...d, _model: 'dall-e-3' })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // ── GPT-4o Vision: Brand compliance check ────────────────────────────────────
  if (action === 'check-compliance') {
    const { imageDataURL } = payload ?? {}
    if (!imageDataURL) return res.status(400).json({ error: 'imageDataURL required' })

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model:      'gpt-4o',
          max_tokens: 2400,
          temperature: 0.2,
          messages: [
            {
              role: 'system',
              content: BRAND_CHECK_PROMPT,
            },
            {
              role: 'user',
              content: [
                {
                  type:      'image_url',
                  image_url: { url: imageDataURL, detail: 'auto' },
                },
                {
                  type: 'text',
                  text: 'Đánh giá banner này theo rubric. Trả về JSON hợp lệ — không markdown, không giải thích ngoài JSON.',
                },
              ],
            },
          ],
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        return res.status(response.status).json({
          error: data.error?.message ?? `OpenAI error ${response.status}`,
        })
      }
      return res.status(200).json(data)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(400).json({ error: `Unknown action: ${action}` })
}
