"use client"

import React from 'react'
import { Input } from '@/components/ui/input'

interface DateFieldProps {
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  placeholder?: string
}

export function DateField({ 
  value, 
  onChange, 
  className, 
  disabled, 
  placeholder = "Select date" 
}: DateFieldProps) {
  return (
    <Input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      disabled={disabled}
      placeholder={placeholder}
    />
  )
}
