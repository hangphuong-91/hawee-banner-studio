import { useState, useEffect, useCallback } from 'react'
import { runComplianceChecks, getComplianceSummary } from '../lib/complianceRules.js'
import { getCanvasScreenshot } from '../lib/exportCanvas.js'
import { useOpenAI } from './useOpenAI.js'

export function useCompliance(fabricCanvas, config) {
  const [ruleResults, setRuleResults] = useState([])
  const [summary,     setSummary]     = useState({ errors: 0, warnings: 0, passed: 0, total: 0, ok: false })
  const [aiResult,    setAiResult]    = useState(null)
  const [aiLoading,   setAiLoading]   = useState(false)
  const { checkCompliance, hasKey }   = useOpenAI()

  // ── Run rule checks when canvas changes ─────────────────────────────────
  const runRules = useCallback(() => {
    const results = runComplianceChecks(fabricCanvas, config)
    setRuleResults(results)
    setSummary(getComplianceSummary(results))
  }, [fabricCanvas, config])

  useEffect(() => {
    if (!fabricCanvas) return
    runRules()
    fabricCanvas.on?.('object:modified', runRules)
    fabricCanvas.on?.('object:added',    runRules)
    fabricCanvas.on?.('object:removed',  runRules)
    return () => {
      fabricCanvas.off?.('object:modified', runRules)
      fabricCanvas.off?.('object:added',    runRules)
      fabricCanvas.off?.('object:removed',  runRules)
    }
  }, [fabricCanvas, runRules])

  // ── AI deep check (on demand) ────────────────────────────────────────
  const runAICheck = useCallback(async () => {
    if (!fabricCanvas || !hasKey) return
    setAiLoading(true)
    setAiResult(null)
    try {
      const screenshot = getCanvasScreenshot(fabricCanvas)
      const result     = await checkCompliance(screenshot)
      setAiResult(result)
    } finally {
      setAiLoading(false)
    }
  }, [fabricCanvas, hasKey, checkCompliance])

  return { ruleResults, summary, aiResult, aiLoading, runAICheck, runRules }
}
