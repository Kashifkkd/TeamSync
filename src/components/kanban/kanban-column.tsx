"use client"

import { useDroppable } from "@dnd-kit/core"
import { TaskCard } from "./task-card"
import { Task } from "./kanban-board"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  id: string
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function KanbanColumn({ id, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col space-y-3 min-h-[400px] max-h-[calc(100vh-200px)] p-2 rounded-lg transition-colors",
        isOver && "bg-blue-50 border-2 border-blue-200 border-dashed"
      )}
    >
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task)}
        />
      ))}
      
      {tasks.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg py-8">
          Drop tasks here
        </div>
      )}
    </div>
  )
}
