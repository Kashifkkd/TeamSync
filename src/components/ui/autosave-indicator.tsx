"use client"

import React from 'react'
import { Check, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AutoSaveIndicatorProps {
  isSaving: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  error?: string
  className?: string
}

export function AutoSaveIndicator({ 
  isSaving, 
  lastSaved, 
  hasUnsavedChanges, 
  error,
  className 
}: AutoSaveIndicatorProps) {
  const getStatusIcon = () => {
    if (error) return <AlertCircle className="h-3 w-3 text-destructive" />
    if (isSaving) return <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
    if (lastSaved && !hasUnsavedChanges) return <Check className="h-3 w-3 text-green-500" />
    return null
  }

  const getStatusText = () => {
    if (error) return 'Save failed'
    if (isSaving) return 'Saving...'
    if (hasUnsavedChanges) return 'Unsaved changes'
    if (lastSaved) return `Saved ${formatLastSaved(lastSaved)}`
    return 'Not saved'
  }

  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={cn(
      "flex items-center gap-1 text-xs text-muted-foreground",
      className
    )}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  )
}
