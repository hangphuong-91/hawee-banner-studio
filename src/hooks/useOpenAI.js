import { useState, useCallback } from 'react'

const PROXY_OPENAI  = '/api/openai'
const PROXY_GEMINI  = '/api/gemini'
const KEY_STORAGE        = 'hawee_openai_key'
const GEMINI_KEY_STORAGE = 'hawee_gemini_key'

// ── OpenAI key helpers ────────────────────────────────────────────────────────
export function getStoredApiKey() {
  return localStorage.getItem(KEY_STORAGE) ?? ''
}
export function saveApiKey(key) {
  if (key) localStorage.setItem(KEY_STORAGE, key)
  else localStorage.removeItem(KEY_STORAGE)
}

// ── Gemini key helpers ────────────────────────────────────────────────────────
export function getStoredGeminiKey() {
  return localStorage.getItem(GEMINI_KEY_STORAGE) ?? ''
}
export function saveGeminiKey(key) {
  if (key) localStorage.setItem(GEMINI_KEY_STORAGE, key)
  else localStorage.removeItem(GEMINI_KEY_STORAGE)
}

// ─── Pollinations.ai — free image generation, no API key needed ───────────────
// https://image.pollinations.ai/prompt/{encoded_prompt}
async function generateWithPollinations(prompt) {
  const encoded = encodeURIComponent(prompt)
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true&model=flux`
  // Fetch and convert to data URL so Fabric.js can load it without CORS issues
  const res = await fetch(url, { mode: 'cors' })
  if (!res.ok) throw new Error(`Pollinations ${res.status}`)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// ─── HAWEE Brand Compliance Prompt v2 ────────────────────────────────────────
// Based on Brand Guidelines 2026 — "Giao hưởng của hào quang"
// Thang điểm 100 | Pass ≥85 | Cần chỉnh 70-84 | Không đạt <70
const BRAND_CHECK_PROMPT = `Bạn là chuyên gia kiểm duyệt thương hiệu cấp cao cho HAWEE (Hội Nữ Doanh Nhân TP.HCM).
Nền tảng nhận diện: "Giao hưởng của hào quang" — mỗi nữ lãnh đạo là một nguồn sáng riêng, cộng hưởng thành sức mạnh chung.
Tinh thần: nữ tính hiện đại, mạnh mẽ, tự tin, kết nối, tỏa sáng.

Đánh giá ấn phẩm này theo 8 hạng mục (tổng 100 điểm):

1. Logo & nhận diện thương hiệu (15đ)
   - Đúng logo HAWEE mới, không bóp méo, không đổi màu (4đ)
   - Đúng phiên bản (horizontal/vertical, VNI/EN) (3đ)
   - Có safe space — không để nội dung xâm lấn khoảng thở (3đ)
   - Tương phản logo với nền tốt (3đ)
   - Lockup đúng ngữ cảnh (chi hội/product) (2đ)

2. Bố cục & hệ thống thị giác (15đ)
   - Phân cấp rõ: 3 giây thấy chủ đề chính, ai tổ chức, thời gian/CTA (4đ)
   - Khoảng trắng hợp lý, không nhồi thông tin (3đ)
   - Cân bằng ảnh–chữ, không phủ lên vùng mặt/chủ thể (3đ)
   - Bố cục phù hợp định dạng (social, poster, banner...) (2đ)
   - Có điểm nhấn thương hiệu (aura/gradient/block hồng có chủ đích) (3đ)

3. Kích thước & khả năng đọc (10đ)
   - Đúng tỷ lệ xuất bản (1:1, 4:5, 9:16, 16:9...) (3đ)
   - Safe zone nền tảng (tránh UI che, sát mép) (2đ)
   - Đọc tốt ở kích thước thực: thumbnail, LED, standee (3đ)
   - Độ phân giải rõ nét, không vỡ (2đ)

4. Màu sắc (15đ)
   - Hồng Pink Bloom là chủ đạo (#C9187F, #E83A78, #A70061, #50002F) (4đ)
   - Màu phụ dùng đúng: cam=thân/năng lượng, tím=tâm/thấu cảm, vàng=trí/sáng tạo (3đ)
   - Đúng mã màu Pink Bloom (3đ)
   - Tương phản chữ–nền rõ ràng, không dùng hồng nhạt trên nền sáng (3đ)
   - Không dùng màu "lạc brand": xanh corporate, neon, pastel ngoài hệ (2đ)

5. Font chữ & typography (15đ)
   - Dùng Mona Sans làm font chính (4đ)
   - Headline: Mona Sans SemiBold, line-height ~120%, letter-spacing -2% (3đ)
   - Body text: Mona Sans Medium, line-height 140-150% (3đ)
   - Phân cấp chữ rõ (headline, subhead, body, CTA, caption) (3đ)
   - Không lỗi chính tả/dấu tiếng Việt, thuật ngữ HAWEE nhất quán (2đ)

6. Hình ảnh, xử lý ảnh & chất lượng (15đ)
   - Ảnh phụ nữ lãnh đạo: tự tin, sáng, chuyên nghiệp, có khí chất (3đ)
   - Cut-out/tách nền đúng — đặt trên nền aura/gradient hồng branding (3đ)
   - Masking đội nhóm: frame bo góc, mềm mại, khoảng trắng hợp lý (3đ)
   - Chất lượng ảnh: nét, ánh sáng tốt, da tự nhiên, không filter quá tay (3đ)
   - Thể hiện cộng đồng HAWEE: bản lĩnh, gắn kết, không giải trí đại trà (3đ)

7. Mood & tone (10đ)
   - Tinh thần "Aura": tỏa sáng, cộng hưởng, giàu năng lượng (3đ)
   - Nữ tính hiện đại: mềm nhưng không yếu, sang nhưng không xa cách (2đ)
   - Lãnh đạo & chuyên nghiệp: phù hợp quản lý cấp cao, doanh nhân (2đ)
   - Cảm xúc tích cực: kết nối, nâng tầm, truyền cảm hứng (2đ)
   - Nhất quán hệ sinh thái HAWEE (1đ)

8. Thông điệp & nội dung (15đ)
   - Đúng định vị: kết nối & nâng tầm ảnh hưởng nữ doanh nhân (4đ)
   - Headline sắc: ngắn, rõ, có lực; insight nữ lãnh đạo không chung chung (3đ)
   - Thông tin đầy đủ: ai–làm gì–khi nào–ở đâu–vì sao–CTA (3đ)
   - Giọng văn HAWEE: tự tin, tinh tế, truyền cảm hứng, chuyên nghiệp (3đ)
   - Không quá tải chữ — social post chỉ giữ thông tin chính (2đ)

FAIL NGAY (đánh dấu trong fail_flags, bất kể tổng điểm):
- Sai logo / thiếu logo HAWEE
- Sai font chính (không phải Mona Sans)
- Dùng màu ngoài hệ quá nhiều (>50% diện tích không hồng/brand)
- Hình ảnh phản cảm / thiếu chuyên nghiệp / kém chất lượng
- Thông điệp lệch định vị nữ lãnh đạo

Chỉ trả về JSON hợp lệ, không kèm markdown hay giải thích:
{
  "score": <tổng 0-100>,
  "breakdown": [
    {"id": "logo",       "label": "Logo & nhận diện",        "max": 15, "score": <0-15>, "issues": ["..."]},
    {"id": "layout",     "label": "Bố cục & thị giác",       "max": 15, "score": <0-15>, "issues": []},
    {"id": "dimensions", "label": "Kích thước & đọc được",    "max": 10, "score": <0-10>, "issues": []},
    {"id": "colors",     "label": "Màu sắc",                  "max": 15, "score": <0-15>, "issues": []},
    {"id": "typography", "label": "Font & typography",         "max": 15, "score": <0-15>, "issues": []},
    {"id": "images",     "label": "Hình ảnh & chất lượng",    "max": 15, "score": <0-15>, "issues": []},
    {"id": "mood",       "label": "Mood & tone",               "max": 10, "score": <0-10>, "issues": []},
    {"id": "message",    "label": "Thông điệp & nội dung",    "max": 15, "score": <0-15>, "issues": []}
  ],
  "fail_flags": [],
  "verdict": "<pass|can-chinh|khong-dat|fail-ngay>",
  "suggestions": ["..."]
}
Verdict: "pass"≥85, "can-chinh" 70-84, "khong-dat" <70, "fail-ngay" nếu có fail_flags.
Tất cả text bằng tiếng Việt. Nhận xét cụ thể, mang tính xây dựng.`

export function useOpenAI() {
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [hasKey, setHasKey]           = useState(!!getStoredApiKey())
  const [hasGeminiKey, setHasGeminiKey] = useState(!!getStoredGeminiKey())

  const refreshKeyStatus = useCallback(() => {
    setHasKey(!!getStoredApiKey())
    setHasGeminiKey(!!getStoredGeminiKey())
  }, [])

  // ── Generate visual cue: DALL-E 3 (with key) or Pollinations.ai (free) ───
  const generateCue = useCallback(async (userPrompt, mode = 'aura') => {
    const key = getStoredApiKey()

    const stylePrompt = mode === 'futuristic'
      ? `${userPrompt}, holographic 3D element, blue-purple neon glow, glass morphism, transparent background, isolated object, no text`
      : `${userPrompt}, minimal 3D icon, pink and magenta pastel color palette, soft shadows, transparent background, women empowerment aesthetic, isolated object, no text`

    setLoading(true)
    setError(null)

    // ── No API key → Pollinations.ai (free, no key needed) ───────────────
    if (!key) {
      try {
        return await generateWithPollinations(stylePrompt)
      } catch (err) {
        setError(`Tạo ảnh thất bại: ${err.message}`)
        return null
      } finally {
        setLoading(false)
      }
    }

    // ── With API key → DALL-E 3 standard, fallback Pollinations ──────────
    try {
      const res = await fetch(PROXY_OPENAI, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'X-OpenAI-Key': key },
        body:    JSON.stringify({ action: 'generate-cue', payload: { prompt: stylePrompt } }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error ?? `HTTP ${res.status}`)
      }
      const data = await res.json()
      const item = data.data?.[0]
      if (!item) throw new Error('Không có kết quả từ DALL-E')
      if (item.url)      return item.url
      if (item.b64_json) return `data:image/png;base64,${item.b64_json}`
      throw new Error('Format DALL-E không hỗ trợ')
    } catch (dalleErr) {
      // DALL-E failed → fall back to Pollinations silently
      console.warn('[DALL-E] failed, trying Pollinations:', dalleErr.message)
      try {
        return await generateWithPollinations(stylePrompt)
      } catch (polErr) {
        setError(`DALL-E: ${dalleErr.message} · Pollinations: ${polErr.message}`)
        return null
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Brand compliance check — Gemini direct (free, CORS OK) > OpenAI proxy ─
  // NOTE: this function THROWS on error so the caller's try/catch handles it
  // (setError() state is async and would be stale in the caller's closure)
  const checkCompliance = useCallback(async (imageDataURL) => {
    if (!imageDataURL) throw new Error('Không có ảnh để kiểm tra')

    const geminiKey = getStoredGeminiKey()
    const openaiKey = getStoredApiKey()

    if (!geminiKey && !openaiKey) {
      throw new Error('Cần Gemini API key (miễn phí) hoặc OpenAI API key. Thêm trong ⚙ Cài đặt.')
    }

    setLoading(true)
    setError(null)

    // Helper: parse JSON from AI text response
    function parseJSON(text) {
      let clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      try { return JSON.parse(clean) } catch { /* fall through */ }
      const start = clean.indexOf('{')
      const end   = clean.lastIndexOf('}')
      if (start !== -1 && end > start) {
        try { return JSON.parse(clean.slice(start, end + 1)) } catch { /* fall through */ }
      }
      throw new Error('AI trả về định dạng không hợp lệ — thử lại sau')
    }

    // ── Gemini direct browser call (supports CORS, no proxy needed) ─────────
    if (geminiKey) {
      try {
        // Extract base64 data from data URL
        const [meta, b64Data] = imageDataURL.split(',')
        const mimeMatch = meta.match(/data:([^;]+)/)
        const mimeType  = mimeMatch ? mimeMatch[1] : 'image/jpeg'

        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`
        const res = await fetch(GEMINI_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { inline_data: { mime_type: mimeType, data: b64Data } },
                { text: BRAND_CHECK_PROMPT },
              ],
            }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 2400 },
          }),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          const msg = errData?.error?.message ?? `HTTP ${res.status}`
          throw new Error(`Gemini: ${msg}`)
        }

        const data   = await res.json()
        const text   = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        if (!text) throw new Error('Gemini không trả về nội dung — thử lại sau')
        return parseJSON(text)

      } catch (err) {
        console.warn('[Gemini direct] failed:', err.message)
        if (!openaiKey) {
          setLoading(false)
          throw err   // re-throw so runAICheck's catch block shows the real error
        }
        // Fall through to OpenAI if user also has that key
      }
    }

    // ── Fallback: OpenAI GPT-4o via proxy ────────────────────────────────────
    if (openaiKey) {
      try {
        const res = await fetch(PROXY_OPENAI, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'X-OpenAI-Key': openaiKey },
          body:    JSON.stringify({ action: 'check-compliance', payload: { imageDataURL } }),
        })
        if (!res.ok) {
          const e = await res.json().catch(() => ({}))
          throw new Error(e.error ?? `HTTP ${res.status}`)
        }
        const data = await res.json()
        const text = data.choices?.[0]?.message?.content ?? ''
        if (!text) throw new Error('GPT-4o không trả về nội dung')
        return parseJSON(text)
      } catch (err) {
        setLoading(false)
        throw new Error(`GPT-4o: ${err.message}`)
      }
    }

    setLoading(false)
    throw new Error('Không có API key hợp lệ')
  }, [])

  return { generateCue, checkCompliance, loading, error, hasKey, hasGeminiKey, refreshKeyStatus }
}
