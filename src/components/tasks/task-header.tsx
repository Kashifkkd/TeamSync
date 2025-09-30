"use client"

import React, { useState } from 'react'
import {
  Box,
  Typography,
} from '@mui/material'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  CheckSquare,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
} from 'lucide-react'

interface TaskHeaderProps {
  taskId?: string
  onClose?: () => void
}

export function TaskHeader({ taskId, onClose }: TaskHeaderProps) {
  const [taskType, setTaskType] = useState('task')
  const [title, setTitle] = useState('Coupon by coupon id api')

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Task Type Dropdown */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <CheckSquare className="h-4 w-4 text-white" />
            </div>
            <Select value={taskType} onValueChange={setTaskType}>
              <SelectTrigger className="w-20 h-8 border-none shadow-none p-0 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="story">Story</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm font-mono text-muted-foreground">
              86cy7290b
            </span>
          </div>
          
          {/* Ask AI Button */}
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Task Title */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
        className="text-2xl font-bold border-none shadow-none p-0 focus-visible:ring-0 bg-transparent"
      />

      {/* AI Description Section */}
      <div className="mt-4 p-4 bg-muted/50 rounded-md border border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Ask Brain to write a description, create a summary or find similar tasks
          </p>
        </div>
      </div>
    </div>
  )
}
