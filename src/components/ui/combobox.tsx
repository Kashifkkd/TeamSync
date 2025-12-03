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
  minWidth?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
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
  minWidth,
  open: controlledOpen,
  onOpenChange,
}: ComboboxProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const [mounted, setMounted] = React.useState(false)

  // Ensure component is mounted to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={false}
        className={cn("justify-between", className)}
        disabled
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <span className="truncate">{placeholder}</span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          onClick={() => setOpen(!open)}
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
        className="p-0 z-[9999]" 
        align="start" 
        style={{ 
          width: 'var(--radix-popover-trigger-width)',
          ...(minWidth && { minWidth })
        }}
        sideOffset={4}
        side="bottom"
      >
        <div className="max-h-[200px] overflow-auto">
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
                      // Find the matching option (cmdk lowercases the value)
                      const selected = options.find(
                        (opt) => opt.value.toLowerCase() === currentValue.toLowerCase()
                      )
                      
                      if (selected && onValueChange) {
                        const newValue = selected.value === value ? "" : selected.value
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
        </div>
      </PopoverContent>
    </Popover>
  )
}
