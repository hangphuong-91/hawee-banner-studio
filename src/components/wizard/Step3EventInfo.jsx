import { useBanner } from '../../context/BannerContext.jsx'

const BADGE_SUGGESTIONS = [
  'Miễn phí hội viên', 'Members Only', 'Free Entry',
  'Đăng ký ngay', 'Còn 10 chỗ', 'Online & Offline',
]

const CTA_SUGGESTIONS = [
  'Đăng ký ngay', 'Xem chi tiết', 'Tham gia miễn phí',
  'Đặt chỗ ngay', 'Register Now',
]

export default function Step3EventInfo() {
  const { config, updateConfig } = useBanner()

  const headlineLen = (config.headline || '').length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {/* Program name */}
        <div className="col-span-2">
          <label className="label-brand">Tên chương trình</label>
          <input
            type="text"
            value={config.programName}
            onChange={e => updateConfig({ programName: e.target.value })}
            placeholder="HAWEE Empower Lunch"
            className="input-brand"
            maxLength={60}
          />
          <p className="text-xs text-white/30 mt-1">Hiển thị trên badge pill — viết ngắn gọn</p>
        </div>

        {/* Headline */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="label-brand mb-0">Tiêu đề chính ✳️</label>
            <span className={`text-xs ${headlineLen > 70 ? 'text-amber-400' : 'text-white/30'}`}>
              {headlineLen}/80
            </span>
          </div>
          <textarea
            value={config.headline}
            onChange={e => updateConfig({ headline: e.target.value })}
            placeholder="Kỹ Năng Số Cho Doanh Nghiệp Nhỏ&#10;Bắt Đầu Từ Đâu?"
            className="input-brand resize-none"
            rows={3}
            maxLength={80}
          />
          <p className="text-xs text-white/30 mt-1">Tối đa 2–3 dòng. Xuống dòng = Enter</p>
          {headlineLen > 70 && (
            <p className="text-xs text-amber-400 mt-1">⚠ Tiêu đề dài — có thể bị cắt trên canvas nhỏ</p>
          )}
        </div>

        {/* Tagline */}
        <div className="col-span-2">
          <label className="label-brand">Tagline phụ (tùy chọn)</label>
          <input
            type="text"
            value={config.tagline}
            onChange={e => updateConfig({ tagline: e.target.value })}
            placeholder="Nâng tầm doanh nghiệp số"
            className="input-brand"
            maxLength={60}
          />
        </div>

        {/* Date */}
        <div>
          <label className="label-brand">Ngày tổ chức ✳️</label>
          <input
            type="text"
            value={config.date}
            onChange={e => updateConfig({ date: e.target.value })}
            placeholder="Thứ 6, 30/05/2026"
            className="input-brand"
          />
        </div>

        {/* Time */}
        <div>
          <label className="label-brand">Giờ</label>
          <input
            type="text"
            value={config.time}
            onChange={e => updateConfig({ time: e.target.value })}
            placeholder="11:30 – 13:30"
            className="input-brand"
          />
        </div>

        {/* Location */}
        <div className="col-span-2">
          <label className="label-brand">Địa điểm</label>
          <input
            type="text"
            value={config.location}
            onChange={e => updateConfig({ location: e.target.value })}
            placeholder="Ambrosia Cafe Bistro, 29/9 Nguyễn Bỉnh Khiêm, Q.1, TP.HCM"
            className="input-brand"
          />
        </div>

        {/* Badge */}
        <div className="col-span-2">
          <label className="label-brand">Badge / nhãn nổi bật</label>
          <input
            type="text"
            value={config.badgeText}
            onChange={e => updateConfig({ badgeText: e.target.value })}
            placeholder="Miễn phí hội viên HAWEE"
            className="input-brand mb-2"
            maxLength={40}
          />
          <div className="flex flex-wrap gap-1.5">
            {BADGE_SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => updateConfig({ badgeText: s })}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  config.badgeText === s
                    ? 'border-[#C9187F] bg-[#C9187F22] text-[#FB6094]'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/25 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="col-span-2">
          <label className="label-brand">Nút CTA (tùy chọn)</label>
          <input
            type="text"
            value={config.ctaText}
            onChange={e => updateConfig({ ctaText: e.target.value })}
            placeholder="Đăng ký ngay"
            className="input-brand mb-2"
            maxLength={30}
          />
          <div className="flex flex-wrap gap-1.5">
            {CTA_SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => updateConfig({ ctaText: s })}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  config.ctaText === s
                    ? 'border-[#C9187F] bg-[#C9187F22] text-[#FB6094]'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/25 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/30 mt-1">Hiển thị dưới dạng button trên canvas</p>
        </div>
      </div>

      {/* Required field indicator */}
      <p className="text-xs text-white/30">✳️ Bắt buộc cho brand compliance check</p>
    </div>
  )
}
