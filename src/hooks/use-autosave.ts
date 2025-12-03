"use client"

import { useEffect, useRef, useState } from 'react'

interface UseAutoSaveOptions<T> {
  delay?: number
  onSave: (data: T) => Promise<void>
  enabled?: boolean
}

export function useAutoSave<T>(
  data: T,
  options: UseAutoSaveOptions<T>
) {
  const { delay = 1000, onSave, enabled = true } = options
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const previousDataRef = useRef<T | undefined>(undefined)

  useEffect(() => {
    if (!enabled) return

    // Check if data has actually changed
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return
    }

    setHasUnsavedChanges(true)
    previousDataRef.current = data

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true)
        await onSave(data)
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
      } catch (error) {
        console.error('Auto-save failed:', error)
      } finally {
        setIsSaving(false)
      }
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay, onSave, enabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveNow: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return onSave(data)
    }
  }
}
