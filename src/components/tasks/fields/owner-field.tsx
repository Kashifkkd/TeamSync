"use client"

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Crown, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { useWorkspaceMembers } from '@/hooks/use-workspace-members'

interface OwnerFieldProps {
  value: string
  onChange: (ownerId: string) => void
  workspaceId: string
  className?: string
  disabled?: boolean
  placeholder?: string
}

export function OwnerField({
  value,
  onChange,
  workspaceId,
  className,
  disabled,
  placeholder = "Select owner..."
}: OwnerFieldProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { members } = useWorkspaceMembers({ workspaceId })

  const filteredMembers = useMemo(() => {
    if (!searchValue) return members

    return members.filter((member: any) =>
      member.user.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      member.user.email?.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [members, searchValue])

  const handleSelectMember = (memberId: string) => {
    onChange(memberId)
    setOpen(false)
  }

  const selectedMember = useMemo(() => {
    return members.find((member: any) => member.user.id === value)
  }, [members, value])

  return (
    <div className={`space-y-2 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-fit justify-between min-h-10"
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              {selectedMember ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Crown className="h-3 w-3 text-primary" />
                  </div>
                  <span className="font-medium">{selectedMember.user.name || selectedMember.user.email}</span>
                </>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 z-[9999]">
          <Command>
            <CommandInput
              placeholder="Search members..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                <div className="p-3">
                  <span className="text-sm text-muted-foreground">No members found.</span>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {filteredMembers.map((member: any) => (
                  <CommandItem
                    key={member.user.id}
                    value={member.user.id}
                    onSelect={(currentValue) => {
                      // Find the matching member (cmdk lowercases the value)
                      const selected = members.find(
                        (m: any) => m.user.id.toLowerCase() === currentValue.toLowerCase()
                      )
                      
                      if (selected) {
                        const newValue = selected.user.id === value ? "" : selected.user.id
                        handleSelectMember(newValue)
                      }
                      setOpen(false)
                    }}
                    className="cursor-pointer [&[data-disabled]]:pointer-events-auto [&[data-disabled]]:opacity-100"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Crown className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{member.user.name || 'Unnamed'}</span>
                          <span className="text-xs text-muted-foreground">{member.user.email}</span>
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === member.user.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
