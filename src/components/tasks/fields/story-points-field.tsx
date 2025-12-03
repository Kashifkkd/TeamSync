"use client"

import React from 'react'
import { Input } from '@/components/ui/input'

interface StoryPointsFieldProps {
  value: number | null
  onChange: (value: number | null) => void
  className?: string
  disabled?: boolean
  placeholder?: string
}

export function StoryPointsField({ 
  value, 
  onChange, 
  className, 
  disabled, 
  placeholder = "Enter story points" 
}: StoryPointsFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === '') {
      onChange(null)
    } else {
      const num = parseInt(val, 10)
      if (!isNaN(num) && num >= 0) {
        onChange(num)
      }
    }
  }

  return (
    <Input
      type="number"
      value={value || ''}
      onChange={handleChange}
      className={className}
      disabled={disabled}
      placeholder={placeholder}
      min="0"
      max="100"
    />
  )
}
