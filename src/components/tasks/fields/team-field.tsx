"use client"

import React, { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, ChevronDown, Check, Users } from 'lucide-react'
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

interface TeamFieldProps {
  value: string[]
  onChange: (teamIds: string[]) => void
  workspaceId: string
  className?: string
  disabled?: boolean
  placeholder?: string
}

export function TeamField({
  value,
  onChange,
  workspaceId,
  className,
  disabled,
  placeholder = "Select team members..."
}: TeamFieldProps) {
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
    if (value.includes(memberId)) {
      onChange(value.filter(id => id !== memberId))
    } else {
      onChange([...value, memberId])
    }
  }


  const removeMember = (memberToRemove: string) => {
    onChange(value.filter(id => id !== memberToRemove))
  }

  const getMemberById = (memberId: string) => {
    return members.find((member: any) => member.user.id === memberId)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-fit justify-start min-h-10 h-auto p-2"
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 w-full">
              {value.length > 0 ? (
                value.map((memberId, index) => {
                  const member = getMemberById(memberId)
                  return (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs flex items-center gap-1 px-2 py-1 hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
                      <span className="font-medium">{member?.user.name || member?.user.email}</span>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            removeMember(memberId)
                          }}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="h-3 w-3 text-destructive" />
                        </button>
                      )}
                    </Badge>
                  )
                })
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
              placeholder="Search team members..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                <div className="p-3">
                  <span className="text-sm text-muted-foreground">No team members found.</span>
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
                        handleSelectMember(selected.user.id)
                      }
                    }}
                    className="cursor-pointer [&[data-disabled]]:pointer-events-auto [&[data-disabled]]:opacity-100"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{member.user.name || 'Unnamed'}</span>
                          <span className="text-xs text-muted-foreground">{member.user.email}</span>
                        </div>
                      </div>
                      {value.includes(member.user.id) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
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
