"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Edit2, Trash2 } from 'lucide-react'

interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox'
  value: string | number | boolean | null
  options?: string[]
}

export function CustomFields() {
  const [fields, setFields] = useState<CustomField[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [newField, setNewField] = useState({
    name: '',
    type: 'text' as const,
    value: '',
    options: [] as string[]
  })

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Select' },
    { value: 'checkbox', label: 'Checkbox' },
  ]

  const handleCreateField = () => {
    if (!newField.name.trim()) return

    const field: CustomField = {
      id: Date.now().toString(),
      name: newField.name,
      type: newField.type,
      value: newField.type === 'checkbox' ? false : (newField.value || null),
      options: newField.type === 'select' ? newField.options : undefined
    }

    setFields([...fields, field])
    setNewField({ name: '', type: 'text', value: '', options: [] })
    setIsCreating(false)
  }

  const handleUpdateField = (fieldId: string, value: string | number | boolean) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, value } : field
    ))
  }

  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId))
  }

  const renderFieldValue = (field: CustomField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={field.value as string || ''}
            onChange={(e) => handleUpdateField(field.id, e.target.value)}
            placeholder="Enter text"
            className="w-48"
          />
        )
      case 'number':
        return (
          <Input
            type="number"
            value={field.value as number || ''}
            onChange={(e) => handleUpdateField(field.id, parseFloat(e.target.value) || 0)}
            placeholder="Enter number"
            className="w-48"
          />
        )
      case 'date':
        return (
          <Input
            type="date"
            value={field.value as string || ''}
            onChange={(e) => handleUpdateField(field.id, e.target.value)}
            className="w-48"
          />
        )
      case 'select':
        return (
          <Select
            value={field.value as string || ''}
            onValueChange={(value) => handleUpdateField(field.id, value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={field.value as boolean || false}
            onChange={(e) => handleUpdateField(field.id, e.target.checked)}
            className="w-4 h-4"
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Custom Fields</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCreating(true)}
          className="text-primary text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      {/* Create New Field */}
      {isCreating && (
        <div className="p-4 border border-border rounded-md bg-muted/50">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                placeholder="Field name"
                className="flex-1"
              />
              <Select
                value={newField.type}
                onValueChange={(value) => setNewField({ ...newField, type: value as any })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newField.type === 'select' && (
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Options (one per line)</label>
                <textarea
                  value={newField.options.join('\n')}
                  onChange={(e) => setNewField({ 
                    ...newField, 
                    options: e.target.value.split('\n').filter(opt => opt.trim()) 
                  })}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  className="w-full p-2 text-sm border border-border rounded-md resize-none h-20"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleCreateField}>
                Create
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setIsCreating(false)
                  setNewField({ name: '', type: 'text', value: '', options: [] })
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Fields */}
      {fields.length > 0 ? (
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center gap-4 p-3 border border-border rounded-md">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">{field.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {fieldTypes.find(t => t.value === field.type)?.label}
                  </Badge>
                </div>
                {renderFieldValue(field)}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingField(editingField === field.id ? null : field.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteField(field.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No custom fields yet</p>
          <p className="text-xs">Add custom fields to track additional information</p>
        </div>
      )}
    </div>
  )
}
