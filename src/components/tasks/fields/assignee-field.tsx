"use client"

import React, { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Plus, Check, User } from 'lucide-react'
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
import { useSession } from 'next-auth/react'

interface AssigneeFieldProps {
  value: string[]
  onChange: (assignees: string[]) => void
  workspaceId: string
  className?: string
  disabled?: boolean
  placeholder?: string
}

export function AssigneeField({
  value,
  onChange,
  workspaceId,
  className,
  disabled,
  placeholder = "Select assignees..."
}: AssigneeFieldProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { data: session } = useSession()
  const { data: members = [] } = useWorkspaceMembers({ workspaceId })

  const filteredMembers = useMemo(() => {
    if (!searchValue) return members

    return members.filter(member =>
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
    return members.find(member => member.user.id === memberId)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start min-h-10 h-auto p-2"
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
                      <div className="w-2 h-2 rounded-full bg-primary shadow-sm" />
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
            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                {filteredMembers.map((member) => (
                  <CommandItem
                    key={member.user.id}
                    value={member.user.id}
                    onSelect={() => handleSelectMember(member.user.id)}
                    className="flex items-center justify-between cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md mx-1 my-0.5 py-2 px-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{member.user.name || 'Unnamed'}</span>
                        <span className="text-xs text-muted-foreground">{member.user.email}</span>
                      </div>
                    </div>
                    {value.includes(member.user.id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
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