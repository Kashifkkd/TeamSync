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
import { KanbanColumn } from "../kanban/kanban-column"
import { TaskCard } from "../kanban/task-card"
import { Task as KanbanTask } from "../kanban/kanban-board"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Task, useTasks } from "@/hooks/use-tasks"
import { TaskEditorDialog as TaskDialog } from "./task-editor-dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface KanbanViewProps {
  workspaceId: string
  projectId?: string
  milestoneId?: string
}

const DEFAULT_COLUMNS = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-100" },
  { id: "in_review", title: "In Review", color: "bg-yellow-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
]

export function KanbanView({ workspaceId, projectId, milestoneId }: KanbanViewProps) {
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [createTaskStatus, setCreateTaskStatus] = useState<string | null>(null)
  
  const { data, isLoading } = useTasks({
    workspaceId,
    projectId,
    milestoneId
  })

  const tasks = data?.tasks || []
  
  // Convert hooks Task to KanbanTask format
  const convertToKanbanTask = (task: Task): KanbanTask => ({
    ...task,
    description: task.description || undefined,
    storyPoints: task.storyPoints || undefined,
    dueDate: task.dueDate || undefined,
    assignee: task.assignee || undefined,
  })
  
  const kanbanTasks = tasks.map(convertToKanbanTask)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = kanbanTasks.find((t) => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Find the containers
    const activeTask = kanbanTasks.find((t) => t.id === activeId)
    const overTask = kanbanTasks.find((t) => t.id === overId)
    
    if (!activeTask) return

    // If we're over a column, not a task
    const overColumn = DEFAULT_COLUMNS.find((col) => col.id === overId)
    if (overColumn && activeTask.status !== overId) {
      // Will be handled in handleDragEnd
      return
    }

    // If we're over a task in a different column
    if (overTask && activeTask.status !== overTask.status) {
      // Will be handled in handleDragEnd
      return
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    setActiveTask(null)
    
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeTask = kanbanTasks.find((t) => t.id === activeId)
    if (!activeTask) return

    // Check if dropped on a column
    const overColumn = DEFAULT_COLUMNS.find((col) => col.id === overId)
    if (overColumn) {
      handleTaskMove()
      return
    }

    // Check if dropped on another task
    const overTask = kanbanTasks.find((t) => t.id === overId)
    if (overTask && activeTask.status !== overTask.status) {
      handleTaskMove()
    }
  }

  const handleTaskMove = async () => {
    // The mutation is handled by the hook with optimistic updates
    // Update will be handled by the mutation hook
  }

  const handleTaskCreate = (status: string) => {
    setCreateTaskStatus(status)
    setSelectedTask(null)
    setIsTaskDialogOpen(true)
  }

  const handleTaskClick = (task: KanbanTask) => {
    // Convert KanbanTask back to Task for the dialog
    const originalTask = tasks.find(t => t.id === task.id)
    if (originalTask) {
      setSelectedTask(originalTask)
      setCreateTaskStatus(null)
      setIsTaskDialogOpen(true)
    }
  }

  const getTasksByStatus = (status: string) => {
    return kanbanTasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.position - b.position)
  }

  if (isLoading) {
    return (
      <div className="flex gap-6 h-full overflow-x-auto overflow-y-hidden pb-6">
        {DEFAULT_COLUMNS.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
            <div className="space-y-3 min-h-[400px] max-h-[calc(100vh-200px)]">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 h-full overflow-x-auto overflow-y-hidden pb-6">
          {DEFAULT_COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.id)
            
            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`} />
                    <h3 className="font-medium text-foreground">{column.title}</h3>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTaskCreate(column.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <SortableContext
                  items={columnTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <KanbanColumn
                    id={column.id}
                    tasks={columnTasks}
                    onTaskClick={handleTaskClick}
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

      <TaskDialog
        open={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        taskId={selectedTask?.id}
        workspaceId={workspaceId}
        projectId={projectId}
        milestoneId={milestoneId}
      />
    </>
  )
}

