"use client"

import React, { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { KanbanColumn } from "./kanban-column"
import { TaskCard } from "./task-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export interface Task {
  id: string
  title: string
  description?: string | null
  status: string
  priority: string
  type: string
  number: number
  storyPoints?: number | null
  originalEstimate?: number | null
  remainingEstimate?: number | null
  timeSpent: number
  dueDate?: string | null
  startDate?: string | null
  position: number
  createdAt: string
  updatedAt: string
  projectId: string
  milestoneId?: string | null
  assigneeId?: string | null
  creatorId: string
  statusId?: string | null
  parentId?: string | null
  assignee?: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
  creator?: {
    id: string
    name?: string | null
    image?: string | null
  }
  milestone?: {
    id: string
    name: string
  } | null
  project: {
    id: string
    name: string
    key: string
    color: string
  }
  labels: Array<{
    label: {
      id: string
      name: string
      color: string
    }
  }>
  _count: {
    comments: number
    timeEntries: number
    children: number
  }
}

interface KanbanBoardProps {
  tasks: Task[]
  onTaskMove: (taskId: string, newStatus: string, newPosition?: number) => void
  onTaskCreate: (status: string) => void
  onTaskClick: (task: Task) => void
}

const columns = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-100" },
  { id: "in_review", title: "In Review", color: "bg-yellow-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
]

export function KanbanBoard({ tasks, onTaskMove, onTaskCreate, onTaskClick }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Find the containers
    const activeTask = tasks.find(t => t.id === activeId)
    const overTask = tasks.find(t => t.id === overId)
    
    if (!activeTask) return

    // If we're over a column, not a task
    if (columns.find(col => col.id === overId)) {
      if (activeTask.status !== overId) {
        onTaskMove(activeTask.id, overId as string)
      }
      return
    }

    // If we're over a task in a different column
    if (overTask && activeTask.status !== overTask.status) {
      onTaskMove(activeTask.id, overTask.status)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    
    const { active, over } = event
    
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    // Handle column drop
    if (columns.find(col => col.id === overId)) {
      const activeTask = tasks.find(t => t.id === activeId)
      if (activeTask && activeTask.status !== overId) {
        onTaskMove(activeTask.id, overId as string)
      }
    }
  }

  const getTasksByStatus = (status: string) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => a.number - b.number) // Sort by task number for consistent ordering
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full overflow-x-auto pb-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id)
          
          return (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-medium text-gray-900">{column.title}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTaskCreate(column.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <SortableContext
                items={columnTasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <KanbanColumn
                  id={column.id}
                  tasks={columnTasks}
                  onTaskClick={onTaskClick}
                />
              </SortableContext>
            </div>
          )
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <TaskCard task={activeTask} onClick={() => {}} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
