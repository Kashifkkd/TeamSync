"use client"

import React, { useState } from 'react'
import {
  Box,
  Grid,
  Typography,
} from '@mui/material'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Play,
  Calendar,
  Clock,
  Tag,
  User,
  Flag,
  Link,
  X,
} from 'lucide-react'

export function TaskAttributes() {
  const [status, setStatus] = useState('todo')
  const [priority, setPriority] = useState('')
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [tags, setTags] = useState('')

  const statusOptions = [
    { value: 'todo', label: 'TO DO', color: 'grey' },
    { value: 'inProgress', label: 'IN PROGRESS', color: 'blue' },
    { value: 'complete', label: 'COMPLETE', color: 'green' },
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-4">
          <Play size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium w-16">Status</span>
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Play size={16} className="text-muted-foreground" />
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4">
          <Calendar size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium w-16">Start → Due</span>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-32 h-8 text-xs"
            />
            <span className="text-sm text-muted-foreground">→</span>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-32 h-8 text-xs"
            />
          </div>
        </div>

        {/* Time Estimate */}
        <div className="flex items-center gap-4">
          <Clock size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium w-16">Time Estimate</span>
          <Input
            placeholder="Empty"
            value=""
            className="w-32 h-8 text-xs text-muted-foreground"
            readOnly
          />
        </div>

        {/* Tags */}
        <div className="flex items-center gap-4">
          <Tag size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium w-16">Tags</span>
          <Input
            placeholder="Empty"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-32 h-8 text-xs"
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Assignees */}
        <div className="flex items-center gap-4">
          <User size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium w-16">Assignees</span>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 bg-purple-500 text-white text-xs">
              <AvatarFallback>K</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <X size={12} />
            </Button>
          </div>
        </div>

        {/* Priority */}
        <div className="flex items-center gap-4">
          <Flag size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium w-16">Priority</span>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Empty" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Track Time */}
        <div className="flex items-center gap-4">
          <Play size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium w-16">Track Time</span>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
          >
            Add time
          </Button>
        </div>

        {/* Relationships */}
        <div className="flex items-center gap-4">
          <Link size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium w-16">Relationships</span>
          <span className="text-xs text-muted-foreground">Empty</span>
        </div>
      </div>
    </div>
  )
}
