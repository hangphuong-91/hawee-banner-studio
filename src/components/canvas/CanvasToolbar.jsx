export default function CanvasToolbar({
  onUndo, onRedo, canUndo, canRedo,
  onCues, onCompliance, onExport, loading,
  onBack, onSettings,
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/20 backdrop-blur-sm gap-2">

      {/* Left: Back + Undo/Redo + Cues */}
      <div className="flex items-center gap-1">
        {onBack && (
          <>
            <button
              onClick={onBack}
              className="btn-ghost flex items-center gap-1 text-xs py-1.5 px-2.5"
              title="Quay lại wizard"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Quay lại
            </button>
            <div className="w-px h-5 bg-white/10 mx-0.5" />
          </>
        )}

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="btn-ghost w-8 h-8 p-0 flex items-center justify-center disabled:opacity-30"
          title="Undo (Ctrl+Z)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
          </svg>
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="btn-ghost w-8 h-8 p-0 flex items-center justify-center disabled:opacity-30"
          title="Redo (Ctrl+Y)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"/>
          </svg>
        </button>

        <div className="w-px h-5 bg-white/10 mx-0.5" />

        <button
          onClick={onCues}
          className="btn-ghost hidden md:inline-flex items-center gap-1.5 text-xs"
          title="Visual Cues Library"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
          </svg>
          Cues
        </button>
      </div>

      {/* Right: Compliance + Settings + Export */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onCompliance}
          className="btn-ghost hidden md:inline-flex items-center gap-1.5 text-xs"
          title="Brand Compliance"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          Check
        </button>

        {onSettings && (
          <button
            onClick={onSettings}
            className="btn-ghost w-8 h-8 p-0 flex items-center justify-center"
            title="Cài đặt API"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
        )}

        <button
          onClick={onExport}
          disabled={loading}
          className="hidden md:inline-flex btn-primary py-1.5 px-4 text-sm"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          )}
          Tải xuống PNG
        </button>
      </div>
    </div>
  )
}
