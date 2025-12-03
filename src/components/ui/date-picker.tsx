"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "./calendar"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  clearable?: boolean
  format?: string
  minDate?: Date
  maxDate?: Date
  error?: boolean
  label?: string
  required?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "ghost"
  showTime?: boolean
  timeFormat?: "12h" | "24h"
  autoClose?: boolean
}

/**
 * A reusable DatePicker component built with shadcn/ui
 * 
 * @example
 * // Basic usage
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   placeholder="Select a date"
 * />
 * 
 * @example
 * // With label and validation
 * <DatePicker
 *   label="Start Date"
 *   value={startDate}
 *   onChange={setStartDate}
 *   required
 *   error={!!errors.startDate}
 * />
 * 
 * @example
 * // With date constraints and sizing
 * <DatePicker
 *   label="End Date"
 *   value={endDate}
 *   onChange={setEndDate}
 *   minDate={startDate}
 *   maxDate={new Date()}
 *   clearable
 *   size="lg"
 *   variant="outline"
 * />
 * 
 * @example
 * // Small compact version
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   size="sm"
 *   variant="ghost"
 *   placeholder="Pick date"
 * />
 */

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  clearable = false,
  format: dateFormat = "PPP",
  minDate,
  maxDate,
  error = false,
  label,
  required = false,
  size = "md",
  variant = "outline",
  showTime = false,
  timeFormat = "12h",
  autoClose = true
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(undefined)
  }

  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return date < new Date("1900-01-01")
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={variant}
            type="button"
            size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
            className={cn(
              "w-full justify-start text-left font-normal",
              size === "sm" && "h-8 text-sm",
              size === "md" && "h-9",
              size === "lg" && "h-10 text-base",
              !value && "text-muted-foreground",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className={cn(
              "mr-2",
              size === "sm" && "h-3 w-3",
              size === "md" && "h-4 w-4",
              size === "lg" && "h-5 w-5"
            )} />
            {value ? format(value, showTime ? (timeFormat === "12h" ? "PPP p" : "PPP HH:mm") : dateFormat) : <span>{placeholder}</span>}
            {clearable && value && (
              <X 
                className={cn(
                  "ml-auto hover:bg-muted rounded-sm",
                  size === "sm" && "h-3 w-3",
                  size === "md" && "h-4 w-4",
                  size === "lg" && "h-5 w-5"
                )}
                onClick={handleClear}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date: Date | undefined) => {
              onChange?.(date)
              if (autoClose) {
                setOpen(false)
              }
            }}
            disabled={isDisabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
