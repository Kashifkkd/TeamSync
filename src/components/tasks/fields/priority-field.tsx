"use client"

import React from 'react'
import { Combobox } from '@/components/ui/combobox'

interface PriorityFieldProps {
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

const priorityOptions = [
  { 
    value: 'low', 
    label: 'Low', 
    icon: <div className="w-2 h-2 rounded-full bg-gray-500" />
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    icon: <div className="w-2 h-2 rounded-full bg-yellow-500" />
  },
  { 
    value: 'high', 
    label: 'High', 
    icon: <div className="w-2 h-2 rounded-full bg-red-500" />
  },
  { 
    value: 'urgent', 
    label: 'Urgent', 
    icon: <div className="w-2 h-2 rounded-full bg-purple-500" />
  },
]

export function PriorityField({ value, onChange, className, disabled }: PriorityFieldProps) {
  return (
    <Combobox
      options={priorityOptions}
      value={value}
      onValueChange={onChange}
      placeholder="Select priority"
      className={className}
      searchPlaceholder="Search priority..."
      emptyText="No priority found."
      minWidth="200px"
    />
  )
}
