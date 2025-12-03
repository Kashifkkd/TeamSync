"use client"

import React, { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, ChevronDown, Check } from 'lucide-react'
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
import { useTags, useCreateTag } from "@/hooks/use-tags"

interface TagsFieldProps {
  value: string[]
  onChange: (tags: string[]) => void
  workspaceId: string
  className?: string
  disabled?: boolean
  placeholder?: string
}

export function TagsField({ 
  value, 
  onChange, 
  workspaceId,
  className, 
  disabled, 
  placeholder = "Select tags..." 
}: TagsFieldProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  
  const { data: tags = [] } = useTags({ workspaceId })
  const createTagMutation = useCreateTag()

  const filteredTags = useMemo(() => {
    if (!searchValue) return tags
    
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [tags, searchValue])

  const handleSelectTag = (tagName: string) => {
    if (value.includes(tagName)) {
      onChange(value.filter(tag => tag !== tagName))
    } else {
      onChange([...value, tagName])
    }
  }

  const handleCommandSelect = (currentValue: string) => {
    console.log('Tags command select triggered:', currentValue)
    const tag = filteredTags.find(t => t.name === currentValue)
    if (tag) {
      console.log('Found tag:', tag)
      handleSelectTag(tag.name)
    }
  }

  const handleCreateTag = async () => {
    if (!searchValue.trim() || value.includes(searchValue.trim())) return
    
    try {
      const newTag = await createTagMutation.mutateAsync({
        name: searchValue.trim(),
        workspaceId,
      })
      
      // Add the new tag to the selected tags
      onChange([...value, newTag.name])
      setSearchValue('')
      setOpen(false) // Close the popover after creating
    } catch (error) {
      console.error('Failed to create tag:', error)
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
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
                value.map((tag, index) => {
                  const tagData = tags.find(t => t.name === tag)
                  return (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs flex items-center gap-1 px-2 py-1 hover:shadow-sm transition-all duration-200 group"
                      style={{ 
                        backgroundColor: tagData?.color ? `${tagData.color}15` : undefined,
                        borderColor: tagData?.color ? `${tagData.color}40` : undefined,
                        borderWidth: '1px'
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full shadow-sm" 
                        style={{ backgroundColor: tagData?.color || '#3b82f6' }}
                      />
                      <span className="font-medium">{tag}</span>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            removeTag(tag)
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
        <PopoverContent className="w-full p-0 z-[9999]" style={{ pointerEvents: 'auto' }}>
          <Command onValueChange={handleCommandSelect}>
            <CommandInput
              placeholder="Search tags"
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                <div className="p-3">
                  <span className="text-sm text-muted-foreground">No tags found.</span>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {filteredTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={(currentValue) => {
                      // Find the matching tag (cmdk lowercases the value)
                      const selected = tags.find(
                        (t) => t.name.toLowerCase() === currentValue.toLowerCase()
                      )
                      
                      if (selected) {
                        handleSelectTag(selected.name)
                      }
                      setOpen(false)
                    }}
                    className="cursor-pointer [&[data-disabled]]:pointer-events-auto [&[data-disabled]]:opacity-100"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full border border-white/20 shadow-sm" 
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="font-medium">{tag.name}</span>
                      </div>
                      {value.includes(tag.name) && (
                        <Check className="h-4 w-4 text-primary ml-auto" />
                      )}
                    </div>
                  </CommandItem>
                ))}
                
                {/* Create Tag Button - Only show when there's search text and no matching tags */}
                {searchValue && !filteredTags.some(tag => 
                  tag.name.toLowerCase() === searchValue.toLowerCase()
                ) && (
                  <div className="px-2 py-2 mt-2 border-t border-border">
                    <div
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleCreateTag()
                      }}
                      className="flex items-center justify-between cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 rounded-md py-2 px-3 border border-dashed border-muted-foreground/30 hover:border-primary/50"
                    >
                      <div className="flex items-center gap-2">
                        <ChevronDown className="h-4 w-4" />
                        <span className="font-medium">
                          {createTagMutation.isPending ? 'Creating...' : `Create "${searchValue}"`}
                        </span>
                      </div>
                      {createTagMutation.isPending && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                      )}
                    </div>
                  </div>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
