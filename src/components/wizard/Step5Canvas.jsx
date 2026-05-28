import { useState } from 'react'
import CanvasEditor from '../canvas/CanvasEditor.jsx'
import SettingsModal from '../modals/SettingsModal.jsx'

export default function Step5Canvas({ onBack }) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <CanvasEditor onBack={onBack} onSettings={() => setShowSettings(true)} />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}
