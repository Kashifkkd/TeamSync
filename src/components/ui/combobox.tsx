"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  footerContent?: React.ReactNode
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  className,
  footerContent,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((option) => option.value === value)

  console.log('=== COMBOBOX RENDER ===')
  console.log('value:', value)
  console.log('options:', options)
  console.log('selectedOption:', selectedOption)
  console.log('onValueChange:', typeof onValueChange)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {selectedOption?.icon}
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 z-50" 
        align="start" 
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        sideOffset={4}
      >
        <Command shouldFilter={true}>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    console.log('=== ITEM SELECTED ===')
                    console.log('currentValue:', currentValue)
                    console.log('Looking for option with value:', currentValue)
                    
                    // Find the matching option (cmdk lowercases the value)
                    const selected = options.find(
                      (opt) => opt.value.toLowerCase() === currentValue.toLowerCase()
                    )
                    
                    console.log('Found selected:', selected)
                    console.log('onValueChange exists?', !!onValueChange)
                    
                    if (selected && onValueChange) {
                      const newValue = selected.value === value ? "" : selected.value
                      console.log('Calling onValueChange with:', newValue)
                      onValueChange(newValue)
                    }
                    setOpen(false)
                  }}
                  className="cursor-pointer [&[data-disabled]]:pointer-events-auto [&[data-disabled]]:opacity-100"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.icon && <span className="mr-2 shrink-0">{option.icon}</span>}
                  <div className="flex-1 truncate">
                    <div>{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {option.description}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {footerContent && (
              <div className="border-t p-2">
                {footerContent}
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
