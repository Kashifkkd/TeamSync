"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Users, Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROLE } from "@/lib/constants"

interface TeamMember {
  id: string
  name: string
  email: string
  image?: string | null
  role: string
}

interface TeamMemberSelectorProps {
  workspaceId: string
  selectedMembers: TeamMember[]
  onSelectionChange: (members: TeamMember[]) => void
  disabled?: boolean
}

export function TeamMemberSelector({ 
  workspaceId, 
  selectedMembers, 
  onSelectionChange,
  disabled = false 
}: TeamMemberSelectorProps) {
  const [open, setOpen] = useState(false)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch workspace members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/workspaces/${workspaceId}/members`)
        if (response.ok) {
          const data = await response.json()
          // Transform the nested user structure to flat structure
          const transformedMembers = (data.members || []).map((member: any) => ({
            id: member.user.id,
            name: member.user.name,
            email: member.user.email,
            image: member.user.image,
            role: member.role
          }))
          setMembers(transformedMembers)
        }
      } catch (error) {
        console.error('Error fetching members:', error)
      } finally {
        setLoading(false)
      }
    }

    if (workspaceId) {
      fetchMembers()
    }
  }, [workspaceId])

  const handleSelect = (member: TeamMember) => {
    const isSelected = selectedMembers.some(m => m.id === member.id)
    
    if (isSelected) {
      onSelectionChange(selectedMembers.filter(m => m.id !== member.id))
    } else {
      onSelectionChange([...selectedMembers, member])
    }
  }

  const handleRemove = (memberId: string) => {
    onSelectionChange(selectedMembers.filter(m => m.id !== memberId))
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Team Members</span>
        <span className="text-xs text-muted-foreground">(Optional)</span>
      </div>
      
      {/* Selected Members */}
      {selectedMembers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedMembers.map((member) => (
            <Badge
              key={member.id}
              variant="secondary"
              className="flex items-center space-x-2 px-3 py-1"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={member.image || undefined} alt={member.name} />
                <AvatarFallback className="text-xs">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{member.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleRemove(member.id)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Member Selection Dropdown */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled || loading}
          >
            {loading ? (
              "Loading members..."
            ) : (
              <>
                <span className="truncate">
                  {selectedMembers.length === 0 
                    ? "Select team members..." 
                    : `${selectedMembers.length} member${selectedMembers.length === 1 ? '' : 's'} selected`
                  }
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search members..." />
            <CommandList>
              <CommandEmpty>No members found.</CommandEmpty>
              <CommandGroup>
                {members.map((member) => {
                  const isSelected = selectedMembers.some(m => m.id === member.id)
                  
                  return (
                    <CommandItem
                      key={member.id}
                      value={member.name}
                      onSelect={() => handleSelect(member)}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelect(member)}
                        className="pointer-events-none"
                      />
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.image || undefined} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {member.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {member.email}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {member.role}
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
