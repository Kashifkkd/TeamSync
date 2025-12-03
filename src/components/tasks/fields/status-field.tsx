"use client"

import React, { useMemo } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { useTaskStatuses } from '@/hooks/use-task-statuses'

interface StatusFieldProps {
  value: string
  onChange: (value: string) => void
  workspaceId: string
  projectId?: string
  className?: string
  disabled?: boolean
}

export function StatusField({ value, onChange, workspaceId, projectId, className, disabled }: StatusFieldProps) {
  const { data: statusData, isLoading, error } = useTaskStatuses(workspaceId, projectId)

  const statusOptions = useMemo(() => {
    if (!statusData?.taskStatuses) {
      return []
    }
    
    return statusData.taskStatuses
      .sort((a, b) => a.order - b.order)
      .map((status) => ({
        value: status.id,
        label: status.name,
        icon: <div 
          className={`w-2 h-2 rounded-full ${status.color}`}
        />
      }))
  }, [statusData])

  if (isLoading) {
    return (
      <div className="h-10 w-32 bg-gray-100 animate-pulse rounded-md" />
    )
  }

  return (
    <Combobox
      options={statusOptions}
      value={value}
      onValueChange={onChange}
      placeholder="Select status"
      className={className}
      searchPlaceholder="Search status..."
      emptyText="No status found."
      minWidth="200px"
      disabled={disabled}
    />
  )
}
