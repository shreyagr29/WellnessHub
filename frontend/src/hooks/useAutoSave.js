import { useCallback, useEffect, useRef, useState } from 'react'

export const useAutoSave = (data, onSave, options = {}) => {
  const {
    debounceDelay = 5000,
    periodicInterval = 30000,
    enabled = true,
    shouldSave = (data) => data && Object.keys(data).some(key => data[key]?.toString().trim())
  } = options

  const debounceTimeoutRef = useRef(null)
  const periodicIntervalRef = useRef(null)
  const lastSavedDataRef = useRef(null)
  const isSavingRef = useRef(false)
  const saveCountRef = useRef(0)

  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [saveCount, setSaveCount] = useState(0)

  useEffect(() => {
    if (!lastSavedDataRef.current && data) {
      lastSavedDataRef.current = JSON.stringify(data)
    }
  }, [])

  const performSave = useCallback(async (saveData, saveType = 'auto') => {
    if (!enabled || isSavingRef.current || !shouldSave(saveData)) {
      return false
    }

    const currentDataString = JSON.stringify(saveData)
    
    if (currentDataString === lastSavedDataRef.current) {
      return false
    }

    isSavingRef.current = true
    setIsAutoSaving(true)
    setSaveError(null)

    try {
      await onSave(saveData, saveType)
      
      lastSavedDataRef.current = currentDataString
      saveCountRef.current += 1
      
      setLastSaved(new Date())
      setSaveCount(saveCountRef.current)
      
      return true
    } catch (error) {
      console.error('Auto-save error:', error)
      setSaveError(error.message || 'Save failed')
      
      return false
    } finally {
      isSavingRef.current = false
      setIsAutoSaving(false)
    }
  }, [enabled, onSave, shouldSave])

  const debouncedSave = useCallback(() => {
    if (!enabled || !data) return

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      performSave(data, 'debounced')
    }, debounceDelay)
  }, [data, debounceDelay, enabled, performSave])

  const manualSave = useCallback(async () => {
    if (!data) return false

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = null
    }

    return await performSave(data, 'manual')
  }, [data, performSave])

  useEffect(() => {
    if (enabled && data) {
      debouncedSave()
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [debouncedSave, enabled])

  useEffect(() => {
    if (!enabled || periodicInterval <= 0) return

    periodicIntervalRef.current = setInterval(() => {
      if (data && !isSavingRef.current) {
        performSave(data, 'periodic')
      }
    }, periodicInterval)

    return () => {
      if (periodicIntervalRef.current) {
        clearInterval(periodicIntervalRef.current)
      }
    }
  }, [data, enabled, periodicInterval, performSave])

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      if (periodicIntervalRef.current) {
        clearInterval(periodicIntervalRef.current)
      }
    }
  }, [])

  const formatLastSaved = useCallback((date) => {
    if (!date) return null
    
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    
    if (diff < 30) return 'Just now'
    if (diff < 60) return `${diff} seconds ago`
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }, [])

  const hasUnsavedChanges = useCallback(() => {
    if (!data) return false
    const currentDataString = JSON.stringify(data)
    return currentDataString !== lastSavedDataRef.current
  }, [data])

  const forceSave = useCallback(async () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = null
    }
    return await manualSave()
  }, [manualSave])

  return {
    isAutoSaving,
    lastSaved,
    saveError,
    saveCount,
    
    formatLastSaved,
    hasUnsavedChanges: hasUnsavedChanges(),
    
    manualSave,
    forceSave,
    
    get lastSavedFormatted() {
      return formatLastSaved(lastSaved)
    },
    
    get isSaveInProgress() {
      return isSavingRef.current
    },
    
    get canSave() {
      return enabled && !isSavingRef.current && shouldSave(data)
    }
  }
}

export const useSimpleAutoSave = (data, onSave, delayMs = 5000) => {
  return useAutoSave(data, onSave, {
    debounceDelay: delayMs,
    periodicInterval: 0, 
    enabled: true
  })
}

export const useValidatedAutoSave = (data, onSave, validator, options = {}) => {
  return useAutoSave(data, onSave, {
    ...options,
    shouldSave: (data) => validator(data)
  })
}

export default useAutoSave