// ===== SRC/HOOKS/USEAUTOSAVE.JS =====
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Custom hook for auto-saving data with debouncing and periodic saves
 * @param {Object} data - The data to auto-save
 * @param {Function} onSave - Function to call when saving (should return a Promise)
 * @param {Object} options - Configuration options
 * @param {number} options.debounceDelay - Delay in ms after user stops typing (default: 5000)
 * @param {number} options.periodicInterval - Interval in ms for periodic saves (default: 30000)
 * @param {boolean} options.enabled - Whether auto-save is enabled (default: true)
 * @param {Function} options.shouldSave - Function to determine if save should happen
 * @returns {Object} - Object containing save state and manual save function
 */
export const useAutoSave = (data, onSave, options = {}) => {
  const {
    debounceDelay = 5000,
    periodicInterval = 30000,
    enabled = true,
    shouldSave = (data) => data && Object.keys(data).some(key => data[key]?.toString().trim())
  } = options

  // Refs to persist values across renders
  const debounceTimeoutRef = useRef(null)
  const periodicIntervalRef = useRef(null)
  const lastSavedDataRef = useRef(null)
  const isSavingRef = useRef(false)
  const saveCountRef = useRef(0)

  // State for UI feedback
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [saveCount, setSaveCount] = useState(0)

  // Initialize last saved data on first render
  useEffect(() => {
    if (!lastSavedDataRef.current && data) {
      lastSavedDataRef.current = JSON.stringify(data)
    }
  }, [])

  // Function to perform the actual save
  const performSave = useCallback(async (saveData, saveType = 'auto') => {
    if (!enabled || isSavingRef.current || !shouldSave(saveData)) {
      return false
    }

    const currentDataString = JSON.stringify(saveData)
    
    // Don't save if data hasn't changed
    if (currentDataString === lastSavedDataRef.current) {
      return false
    }

    isSavingRef.current = true
    setIsAutoSaving(true)
    setSaveError(null)

    try {
      await onSave(saveData, saveType)
      
      // Update refs and state on successful save
      lastSavedDataRef.current = currentDataString
      saveCountRef.current += 1
      
      setLastSaved(new Date())
      setSaveCount(saveCountRef.current)
      
      return true
    } catch (error) {
      console.error('Auto-save error:', error)
      setSaveError(error.message || 'Save failed')
      
      // Don't update lastSavedDataRef on error so it will retry
      return false
    } finally {
      isSavingRef.current = false
      setIsAutoSaving(false)
    }
  }, [enabled, onSave, shouldSave])

  // Debounced save function
  const debouncedSave = useCallback(() => {
    if (!enabled || !data) return

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      performSave(data, 'debounced')
    }, debounceDelay)
  }, [data, debounceDelay, enabled, performSave])

  // Manual save function
  const manualSave = useCallback(async () => {
    if (!data) return false

    // Clear debounce timeout since we're saving manually
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = null
    }

    return await performSave(data, 'manual')
  }, [data, performSave])

  // Effect for debounced saving
  useEffect(() => {
    if (enabled && data) {
      debouncedSave()
    }

    // Cleanup timeout on unmount or data change
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [debouncedSave, enabled])

  // Effect for periodic saving
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

  // Cleanup on unmount
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

  // Format last saved time for display
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

  // Check if data has unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    if (!data) return false
    const currentDataString = JSON.stringify(data)
    return currentDataString !== lastSavedDataRef.current
  }, [data])

  // Force save with debounce bypass
  const forceSave = useCallback(async () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = null
    }
    return await manualSave()
  }, [manualSave])

  return {
    // State
    isAutoSaving,
    lastSaved,
    saveError,
    saveCount,
    
    // Helper functions
    formatLastSaved,
    hasUnsavedChanges: hasUnsavedChanges(),
    
    // Manual control functions
    manualSave,
    forceSave,
    
    // Status helpers
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

// Alternative hook for simpler use cases
export const useSimpleAutoSave = (data, onSave, delayMs = 5000) => {
  return useAutoSave(data, onSave, {
    debounceDelay: delayMs,
    periodicInterval: 0, // Disable periodic saves
    enabled: true
  })
}

// Hook with custom validation
export const useValidatedAutoSave = (data, onSave, validator, options = {}) => {
  return useAutoSave(data, onSave, {
    ...options,
    shouldSave: (data) => validator(data)
  })
}

// Example usage:
/*
// Basic usage
const { isAutoSaving, lastSaved, manualSave } = useAutoSave(
  formData, 
  async (data) => {
    const response = await sessionService.saveDraft(data)
    return response
  }
)

// Advanced usage with custom options
const autoSaveState = useAutoSave(formData, saveFn, {
  debounceDelay: 3000,        // 3 seconds
  periodicInterval: 60000,    // 1 minute
  enabled: !isReadOnly,       // Conditional enabling
  shouldSave: (data) => {     // Custom validation
    return data.title && data.title.length > 3
  }
})

// Simple usage for basic debouncing
const { isAutoSaving } = useSimpleAutoSave(formData, saveFn, 2000)

// Validated auto-save
const { isAutoSaving, saveError } = useValidatedAutoSave(
  formData,
  saveFn,
  (data) => data.title && data.content && data.title.length >= 5
)
*/

export default useAutoSave