import { createContext, useContext, useState, useCallback } from 'react'
import { DEFAULT_CONFIG } from '../lib/brandConfig.js'

const BannerContext = createContext(null)

export function BannerProvider({ children }) {
  const [config, setConfig] = useState({ ...DEFAULT_CONFIG })

  const updateConfig = useCallback((updates) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }, [])

  const resetConfig = useCallback(() => {
    setConfig({ ...DEFAULT_CONFIG })
  }, [])

  // Add a speaker (max 4)
  const addSpeaker = useCallback(() => {
    setConfig(prev => {
      if (prev.speakers.length >= 4) return prev
      const newId = `sp${prev.speakers.length + 1}`
      return {
        ...prev,
        speakers: [...prev.speakers, { id: newId, photoUrl: null, name: '', title: '', organization: '' }],
        canvasVersion: prev.canvasVersion + 1,
      }
    })
  }, [])

  // Remove a speaker
  const removeSpeaker = useCallback((speakerId) => {
    setConfig(prev => {
      if (prev.speakers.length <= 1) return prev
      return {
        ...prev,
        speakers: prev.speakers.filter(s => s.id !== speakerId),
        canvasVersion: prev.canvasVersion + 1,
      }
    })
  }, [])

  // Update a speaker field
  const updateSpeaker = useCallback((speakerId, field, value) => {
    setConfig(prev => ({
      ...prev,
      speakers: prev.speakers.map(s => s.id === speakerId ? { ...s, [field]: value } : s),
      // Photo change requires full canvas rebuild
      canvasVersion: field === 'photoUrl' ? prev.canvasVersion + 1 : prev.canvasVersion,
    }))
  }, [])

  // Trigger full canvas rebuild
  const bumpCanvasVersion = useCallback(() => {
    setConfig(prev => ({ ...prev, canvasVersion: prev.canvasVersion + 1 }))
  }, [])

  return (
    <BannerContext.Provider value={{
      config,
      updateConfig,
      resetConfig,
      addSpeaker,
      removeSpeaker,
      updateSpeaker,
      bumpCanvasVersion,
    }}>
      {children}
    </BannerContext.Provider>
  )
}

export function useBanner() {
  const ctx = useContext(BannerContext)
  if (!ctx) throw new Error('useBanner must be used within BannerProvider')
  return ctx
}
