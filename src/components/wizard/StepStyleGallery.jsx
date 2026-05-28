// ── Step 1: Style Gallery — xem phong cách thiết kế HAWEE ────────────────────
// Shows brand style references so members understand the visual language

const STYLES = [
  {
    id: 'speaker-event',
    title: 'Speaker Event',
    subtitle: 'Banner sự kiện có diễn giả',
    desc: 'Ảnh chân dung diễn giả, headline nổi bật, thông tin sự kiện đầy đủ. Thường dùng cho HAWEE Lunch, Workshop, Hội thảo.',
    tags: ['#HAWEE Lunch', '#Workshop', '#Diễn giả'],
    preview: (
      <div className="w-full aspect-square rounded-xl overflow-hidden relative" style={{
        background: 'radial-gradient(circle at 70% 40%, #C9187F 0%, #50002F 40%, #0a0612 75%)'
      }}>
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div>
            <div className="w-16 h-3 rounded bg-white/80 mb-2" />
            <div className="h-5 w-36 rounded-lg" style={{background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)'}} />
          </div>
          <div className="flex items-end gap-3">
            <div>
              <div className="w-24 h-2.5 rounded bg-white/90 mb-1" />
              <div className="w-32 h-2 rounded bg-white/50 mb-0.5" />
              <div className="w-20 h-2 rounded bg-white/50" />
            </div>
            <div className="ml-auto w-14 h-14 rounded-full border-2 border-[#C9187F] shadow-[0_0_16px_rgba(201,24,127,0.7)]"
              style={{background:'linear-gradient(135deg,#E83A78,#50002F)'}} />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'announcement',
    title: 'Thông báo / Sự kiện',
    subtitle: 'Banner thông tin sự kiện đơn giản',
    desc: 'Nền aura hồng/tím, headline lớn, ngày giờ, địa điểm. Không cần ảnh người. Dùng cho Coming Soon, thông báo chung.',
    tags: ['#Thông báo', '#Coming Soon', '#Minimal'],
    preview: (
      <div className="w-full aspect-square rounded-xl overflow-hidden relative" style={{
        background: 'radial-gradient(ellipse at 30% 60%, #E83A78 0%, #A70061 38%, #0a0612 72%)'
      }}>
        <div className="absolute inset-0 p-4 flex flex-col justify-center gap-3">
          <div className="w-12 h-3 rounded bg-white/60" />
          <div className="w-40 h-7 rounded-lg bg-white/90" />
          <div className="w-32 h-4 rounded bg-white/50" />
          <div className="flex gap-2 mt-2">
            <div className="h-5 px-3 rounded-full flex items-center" style={{background:'rgba(201,24,127,0.4)',border:'1px solid rgba(201,24,127,0.6)'}}>
              <div className="w-12 h-1.5 rounded bg-[#C9187F]/80" />
            </div>
            <div className="h-5 px-3 rounded-full flex items-center" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)'}}>
              <div className="w-10 h-1.5 rounded bg-white/60" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'welcome',
    title: 'Chào mừng Hội viên',
    subtitle: 'Tôn vinh cá nhân hội viên',
    desc: 'Thiết kế cá nhân hóa với tên và thông tin hội viên. Phong cách sang trọng, premium, tỏa sáng.',
    tags: ['#Hội viên', '#Tôn vinh', '#Personal'],
    preview: (
      <div className="w-full aspect-square rounded-xl overflow-hidden relative" style={{
        background: 'radial-gradient(circle at 50% 35%, #9B00BB 0%, #50002F 42%, #040008 72%)'
      }}>
        <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-2">
          <div className="w-16 h-16 rounded-full border-2 border-[#E83A78] shadow-[0_0_20px_rgba(232,58,120,0.6)] mb-1"
            style={{background:'linear-gradient(135deg,#C9187F,#50002F)'}} />
          <div className="w-28 h-3 rounded bg-white/90" />
          <div className="w-20 h-2 rounded bg-white/50" />
          <div className="w-32 h-2 rounded bg-white/30" />
          <div className="mt-2 h-5 w-24 rounded-full" style={{background:'rgba(201,24,127,0.35)',border:'1px solid rgba(201,24,127,0.5)'}}>
            <div className="w-16 h-1.5 rounded bg-[#C9187F]/70 mx-auto mt-1.5" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'widescreen-connect',
    title: 'Widescreen / Cover',
    subtitle: 'Banner 16:9 cho YouTube, LinkedIn',
    desc: 'Layout ngang, logo HAWEE trái, headline phải. Phù hợp làm cover LinkedIn, YouTube thumbnail, backdrop màn hình.',
    tags: ['#LinkedIn', '#YouTube', '#16:9'],
    preview: (
      <div className="w-full aspect-video rounded-xl overflow-hidden relative" style={{
        background: 'linear-gradient(135deg, #50002F 0%, #280040 45%, #040008 80%)'
      }}>
        <div className="absolute inset-0 flex items-center px-5 gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-3 rounded bg-white/80 mb-1.5" />
            <div className="w-8 h-1.5 rounded bg-white/40" />
          </div>
          <div className="w-px h-10 bg-white/20 flex-shrink-0" />
          <div className="flex-1">
            <div className="w-full h-4 rounded bg-white/80 mb-1.5" />
            <div className="w-3/4 h-3 rounded bg-white/50 mb-2.5" />
            <div className="flex gap-1.5">
              <div className="w-16 h-2 rounded bg-[#C9187F]/70" />
              <div className="w-12 h-2 rounded bg-white/30" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'portrait-story',
    title: 'Portrait / Story 4:5',
    subtitle: 'Banner dọc cho Instagram Feed',
    desc: 'Tỷ lệ 4:5 chiếm nhiều diện tích trên feed Instagram. Thông tin tập trung, ảnh người dẫn dắt layout.',
    tags: ['#Instagram', '#4:5', '#Story'],
    preview: (
      <div className="w-full rounded-xl overflow-hidden relative mx-auto" style={{
        aspectRatio: '4/5',
        background: 'radial-gradient(circle at 60% 30%, #C9187F 0%, #4A0070 38%, #030008 68%)'
      }}>
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div>
            <div className="w-14 h-2.5 rounded bg-white/80 mb-3" />
            <div className="w-36 h-5 rounded-lg bg-white/85 mb-1.5" />
            <div className="w-28 h-3 rounded bg-white/50" />
          </div>
          <div className="flex items-end gap-2">
            <div className="w-16 h-16 rounded-full border-2 border-[#C9187F]"
              style={{background:'linear-gradient(135deg,#E83A78,#50002F)'}} />
            <div className="flex-1 pb-1">
              <div className="w-full h-2.5 rounded bg-white/80 mb-1" />
              <div className="w-3/4 h-2 rounded bg-white/40" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'futuristic',
    title: 'Futuristic / Tech',
    subtitle: 'Phong cách công nghệ, hiện đại',
    desc: 'Nền tối abstract gradient tím/đen, ánh sáng neon. Phù hợp cho chủ đề AI, Digital, E-commerce, Leadership.',
    tags: ['#Futuristic', '#Tech', '#AI/Digital'],
    preview: (
      <div className="w-full aspect-square rounded-xl overflow-hidden relative" style={{
        background: 'radial-gradient(circle at 35% 55%, #9B00BB 0%, #5500AA 26%, #020010 58%)'
      }}>
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-14 h-3 rounded bg-white/70" />
            <div className="w-8 h-8 rounded-full border border-[#C9187F]/60"
              style={{background:'rgba(155,0,187,0.2)'}} />
          </div>
          <div>
            <div className="w-full h-5 rounded bg-white/85 mb-1.5" />
            <div className="w-3/4 h-3 rounded bg-white/55 mb-3" />
            <div className="flex gap-1.5">
              {[40,28,36].map((w,i) => (
                <div key={i} className="h-5 rounded-full" style={{width:w+'px',background:'rgba(155,0,187,0.35)',border:'1px solid rgba(155,0,187,0.5)'}} />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export default function StepStyleGallery() {
  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">✨</span>
        <div>
          <p className="text-sm font-semibold text-white mb-0.5">Phong cách HAWEE — "Giao hưởng của hào quang"</p>
          <p className="text-xs text-white/50 leading-relaxed">
            Mỗi banner HAWEE tỏa năng lượng lãnh đạo — nữ tính, mạnh mẽ, tự tin. Màu chủ đạo Pink Bloom (#C9187F),
            font Mona Sans, nền aura/futuristic. Dưới đây là 6 phong cách layout tham khảo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {STYLES.map(style => (
          <div key={style.id} className="group glass rounded-xl overflow-hidden hover:bg-white/[0.08] transition-all duration-200 hover:-translate-y-0.5">
            <div className="p-3">
              {style.preview}
            </div>
            <div className="px-3 pb-3">
              <p className="text-sm font-semibold text-white truncate">{style.title}</p>
              <p className="text-[10px] text-white/40 truncate mb-2">{style.subtitle}</p>
              <p className="text-[10px] text-white/55 leading-relaxed line-clamp-2">{style.desc}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {style.tags.map(t => (
                  <span key={t} className="text-[9px] text-[#C9187F]/80 border border-[#C9187F]/30 rounded-full px-1.5 py-0.5 bg-[#C9187F]/8">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-3 flex items-center gap-3">
        <span className="text-base">💡</span>
        <p className="text-xs text-white/45 leading-relaxed">
          Bạn sẽ tự do tuỳ chỉnh mọi yếu tố trên canvas sau khi hoàn thành wizard này.
          Đây chỉ là gợi ý phong cách — không chọn cứng template.
        </p>
      </div>
    </div>
  )
}
