"use client"

import React, { useState, useEffect } from 'react'
import { StatusField } from './fields/status-field'
import { PriorityField } from './fields/priority-field'
import { OwnerField } from './fields/owner-field'
import { TeamField } from './fields/team-field'
import { TagsField } from './fields/tags-field'
import { DateTimePickerField } from '@/components/ui/date-time-picker-field'
import { useTask, useUpdateTask } from '@/hooks/use-tasks'
import { useWorkspaceMembers } from '@/hooks/use-workspace-members'
import { useAutoSave } from '@/hooks/use-autosave'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Play,
  Calendar,
  Clock,
  Tag,
  User,
  Users,
  Flag,
} from 'lucide-react'
import { AutoSaveIndicator } from '@/components/ui/autosave-indicator'

interface TaskAttributesProps {
  taskId?: string
}

export function TaskAttributes({ taskId }: TaskAttributesProps) {
  const params = useParams()
  const workspaceSlug = params.slug as string
  
  const { data: taskData } = useTask(workspaceSlug, taskId)
  const updateTask = useUpdateTask(workspaceSlug, taskId || '')
  const { members } = useWorkspaceMembers({ workspaceId: workspaceSlug })
  const { data: session } = useSession()
  
  // Get projectId from task data
  const projectId = taskData?.task?.projectId
  
  const [status, setStatus] = useState('todo')
  const [priority, setPriority] = useState('medium')
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [tags, setTags] = useState<string[]>([])
  const [ownerId, setOwnerId] = useState('')
  const [teamIds, setTeamIds] = useState<string[]>([])

  // Handle start date change with validation
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)
    
    // If end date exists and is before the new start date, adjust it
    if (date && dueDate && dueDate < date) {
      const newEndDate = new Date(date)
      newEndDate.setDate(newEndDate.getDate() + 1)
      setDueDate(newEndDate)
    }
  }

  // Handle end date change with validation
  const handleEndDateChange = (date: Date | undefined) => {
    // If start date exists and the new end date is before it, don't allow it
    if (date && startDate && date < startDate) {
      return // Don't update if end date would be before start date
    }
    setDueDate(date)
  }

  // Update local state when task data loads
  useEffect(() => {
    if (taskData?.task) {
      // Use statusId if available, otherwise fall back to status string
      setStatus(taskData.task.statusId || taskData.task.status)
      setPriority(taskData.task.priority)
      setStartDate(taskData.task.startDate ? new Date(taskData.task.startDate) : undefined)
      setDueDate(taskData.task.dueDate ? new Date(taskData.task.dueDate) : undefined)
      // Handle owner - set current user as default if no owner is set
      if (taskData.task.assigneeId) {
        setOwnerId(taskData.task.assigneeId)
      } else if (session?.user?.id) {
        setOwnerId(session.user.id)
      }
      // Set tags from labels if available
      if (taskData.task.labels?.length > 0) {
        setTags(taskData.task.labels.map((l: { label: { name: string } }) => l.label.name))
      }
    }
  }, [taskData, session?.user?.id])

  // Auto-save for task attributes
  const attributesData = {
    statusId: status, // Use statusId instead of status
    priority,
    startDate: startDate ? startDate.toISOString() : null,
    dueDate: dueDate ? dueDate.toISOString() : null,
    assigneeId: ownerId || null,
  }

  const { isSaving, lastSaved, hasUnsavedChanges } = useAutoSave(attributesData, {
    delay: 1500,
    enabled: !!taskId,
    onSave: async (data) => {
      await updateTask.mutateAsync(data)
    }
  })



  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Task Attributes</h3>
        <div className="flex items-center gap-2">
          <AutoSaveIndicator 
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center gap-4">
            <Play size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium w-20">Status</span>
            <StatusField
              value={status}
              onChange={setStatus}
              workspaceId={workspaceSlug}
              projectId={projectId}
              className="min-w-fit"
            />
          </div>

          {/* Priority */}
          <div className="flex items-center gap-4">
            <Flag size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium w-20">Priority</span>
            <PriorityField
              value={priority}
              onChange={setPriority}
              className="min-w-fit"
            />
          </div>

          {/* Owner */}
          <div className="flex items-center gap-4">
            <User size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium w-20">Owner</span>
            <OwnerField
              value={ownerId}
              onChange={setOwnerId}
              workspaceId={workspaceSlug}
              className="min-w-fit"
            />
          </div>

          {/* Team */}
          <div className="flex items-center gap-4">
            <Users size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium w-20">Team</span>
            <TeamField
              value={teamIds}
              onChange={setTeamIds}
              workspaceId={workspaceSlug}
              className="min-w-fit"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Start Date */}
          <div className="flex items-center gap-4">
            <Calendar size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium w-20">Start Date</span>
            <DateTimePickerField
              value={startDate}
              onChange={handleStartDateChange}
              className="min-w-fit"
              placeholder="Select start date"
            />
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-4">
            <Clock size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium w-20">Due Date</span>
            <DateTimePickerField
              value={dueDate}
              onChange={handleEndDateChange}
              className="min-w-fit"
              placeholder="Select due date"
              minDate={startDate}
            />
          </div>


          {/* Tags */}
          <div className="flex items-center gap-4">
            <Tag size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium w-20">Tags</span>
            <TagsField
              value={tags}
              onChange={setTags}
              workspaceId={workspaceSlug}
              className="min-w-fit"
            />
          </div>
        </div>
      </div>
    </div>
  )
}