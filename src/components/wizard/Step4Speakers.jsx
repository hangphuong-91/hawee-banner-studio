import { useBanner } from '../../context/BannerContext.jsx'
import SpeakerCard from '../ui/SpeakerCard.jsx'

export default function Step4Speakers() {
  const { config, addSpeaker, removeSpeaker, updateSpeaker } = useBanner()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Diễn giả</h3>
          <p className="text-sm text-white/50">Tối đa 4 diễn giả</p>
        </div>
        {config.speakers.length < 4 && (
          <button
            onClick={addSpeaker}
            className="btn-outline text-sm py-2 px-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Thêm diễn giả
          </button>
        )}
      </div>

      {config.speakers.map((sp, i) => (
        <SpeakerCard
          key={sp.id}
          speaker={sp}
          index={i}
          onUpdate={updateSpeaker}
          onRemove={removeSpeaker}
          canRemove={config.speakers.length > 1}
        />
      ))}

      {config.speakers.length >= 4 && (
        <div className="glass rounded-xl p-3 text-sm text-white/50 text-center">
          Đã đạt tối đa 4 diễn giả
        </div>
      )}

      {/* Tips */}
      <div className="glass rounded-xl p-3 space-y-1.5">
        <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">💡 Tips ảnh diễn giả</p>
        <ul className="text-xs text-white/40 space-y-1">
          <li>• Ảnh nền trắng hoặc đơn sắc trông chuyên nghiệp nhất</li>
          <li>• Kích thước tối thiểu 400×400px, vuông hoặc dọc</li>
          <li>• PNG nền trong suốt sẽ hiển thị tốt nhất trong frame tròn</li>
        </ul>
      </div>
    </div>
  )
}
