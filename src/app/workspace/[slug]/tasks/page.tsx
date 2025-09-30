"use client"

import { useState } from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  List, 
  Grid3X3, 
  BarChart3,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Play,
  Edit3,
  Trash2,
  Copy,
  Move,
  Tag,
  Circle,
  ChevronDown,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { KanbanBoard } from "@/components/tasks/kanban-board"
import { cn } from "@/lib/utils"

// Types
type Priority = "high" | "medium" | "low"
type Status = "todo" | "in_progress" | "completed" | "blocked"

interface Task {
  id: string
  name: string
  assignee: { name: string; initials: string; avatar: string | null }
  dueDate: string
  priority: Priority
  status: Status
  progress: number
  comments: number
  attachments: number
  subtasks: Array<{ id: string; name: string; completed: boolean }>
  tags: string[]
}

// Mock data
const mockTasks: Task[] = [
  {
    id: "1",
    name: "FE-1-login module",
    assignee: { name: "Kashif", initials: "K", avatar: null },
    dueDate: "2025-02-16",
    priority: "high",
    status: "completed",
    progress: 100,
    comments: 3,
    attachments: 2,
    subtasks: [
      { id: "1-1", name: "Create login form", completed: true },
      { id: "1-2", name: "Add validation", completed: true },
      { id: "1-3", name: "Implement authentication", completed: true },
      { id: "1-4", name: "Add error handling", completed: true }
    ],
    tags: ["Frontend", "Authentication"]
  },
  {
    id: "2",
    name: "FE integration web app",
    assignee: { name: "Fatima", initials: "FJ", avatar: null },
    dueDate: "2025-02-20",
    priority: "medium",
    status: "completed",
    progress: 100,
    comments: 1,
    attachments: 0,
    subtasks: [],
    tags: ["Frontend", "Integration"]
  },
  {
    id: "3",
    name: "BE-(Services-post and get)",
    assignee: { name: "Kashif", initials: "K", avatar: null },
    dueDate: "2025-02-18",
    priority: "high",
    status: "completed",
    progress: 100,
    comments: 5,
    attachments: 1,
    subtasks: [
      { id: "3-1", name: "Create API endpoints", completed: true },
      { id: "3-2", name: "Add database models", completed: true },
      { id: "3-3", name: "Implement validation", completed: true }
    ],
    tags: ["Backend", "API"]
  },
  {
    id: "4",
    name: "House cleaning",
    assignee: { name: "Fatima", initials: "FJ", avatar: null },
    dueDate: "2025-02-15",
    priority: "low",
    status: "completed",
    progress: 100,
    comments: 0,
    attachments: 0,
    subtasks: [],
    tags: ["Personal"]
  },
  {
    id: "5",
    name: "Laundry",
    assignee: { name: "Kashif", initials: "K", avatar: null },
    dueDate: "2025-02-14",
    priority: "low",
    status: "completed",
    progress: 100,
    comments: 0,
    attachments: 0,
    subtasks: [],
    tags: ["Personal"]
  },
  {
    id: "6",
    name: "Cart Func(JR.Intern)",
    assignee: { name: "Fatima", initials: "FJ", avatar: null },
    dueDate: "2025-02-22",
    priority: "medium",
    status: "completed",
    progress: 100,
    comments: 2,
    attachments: 1,
    subtasks: [
      { id: "6-1", name: "Design cart UI", completed: true },
      { id: "6-2", name: "Implement add to cart", completed: true },
      { id: "6-3", name: "Add remove functionality", completed: true }
    ],
    tags: ["Frontend", "E-commerce"]
  },
  {
    id: "7",
    name: "BE-Cart apis",
    assignee: { name: "Kashif", initials: "K", avatar: null },
    dueDate: "2025-02-25",
    priority: "high",
    status: "completed",
    progress: 100,
    comments: 4,
    attachments: 1,
    subtasks: [],
    tags: ["Backend", "API"]
  },
  {
    id: "8",
    name: "Pharma all products",
    assignee: { name: "Fatima", initials: "FJ", avatar: null },
    dueDate: "2025-02-28",
    priority: "medium",
    status: "completed",
    progress: 100,
    comments: 2,
    attachments: 0,
    subtasks: [],
    tags: ["Frontend", "E-commerce"]
  },
  {
    id: "9",
    name: "Single product page",
    assignee: { name: "Kashif", initials: "K", avatar: null },
    dueDate: "2025-03-01",
    priority: "medium",
    status: "completed",
    progress: 100,
    comments: 1,
    attachments: 0,
    subtasks: [],
    tags: ["Frontend", "E-commerce"]
  },
  {
    id: "10",
    name: "Add to cart functionality",
    assignee: { name: "Fatima", initials: "FJ", avatar: null },
    dueDate: "2025-03-02",
    priority: "high",
    status: "completed",
    progress: 100,
    comments: 3,
    attachments: 1,
    subtasks: [],
    tags: ["Frontend", "E-commerce"]
  },
  {
    id: "11",
    name: "Change design for laundry product",
    assignee: { name: "Kashif", initials: "K", avatar: null },
    dueDate: "2025-03-03",
    priority: "low",
    status: "completed",
    progress: 100,
    comments: 1,
    attachments: 0,
    subtasks: [],
    tags: ["Frontend", "Design"]
  },
  {
    id: "12",
    name: "Cart addition for home cleaning & laundary",
    assignee: { name: "Fatima", initials: "FJ", avatar: null },
    dueDate: "2025-03-04",
    priority: "medium",
    status: "completed",
    progress: 100,
    comments: 2,
    attachments: 0,
    subtasks: [],
    tags: ["Frontend", "E-commerce"]
  },
  {
    id: "13",
    name: "Change the add to cart as per new ani re",
    assignee: { name: "Kashif", initials: "K", avatar: null },
    dueDate: "2025-03-05",
    priority: "low",
    status: "completed",
    progress: 100,
    comments: 1,
    attachments: 0,
    subtasks: [],
    tags: ["Frontend", "Animation"]
  }
]

const priorityConfig = {
  high: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
  medium: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  low: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 }
}

const statusConfig = {
  todo: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: Circle, label: "To Do" },
  in_progress: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Play, label: "In Progress" },
  completed: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2, label: "Completed" },
  blocked: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, label: "Blocked" }
}

const viewModes = [
  { id: "list", label: "List", icon: List },
  { id: "kanban", label: "Board", icon: Grid3X3 },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "gantt", label: "Timeline", icon: BarChart3 }
]

export default function TasksPage() {
  const [currentView, setCurrentView] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [showSubtasks, setShowSubtasks] = useState(true)
  const [showColumns, setShowColumns] = useState(true)

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const completedTasks = filteredTasks.filter(task => task.status === "completed")

  const handleEditStart = (taskId: string, currentName: string) => {
    setEditingTask(taskId)
    setEditingValue(currentName)
  }

  const handleEditSave = (taskId: string) => {
    console.log(`Saving task ${taskId} with name: ${editingValue}`)
    setEditingTask(null)
    setEditingValue("")
  }

  const handleEditCancel = () => {
    setEditingTask(null)
    setEditingValue("")
  }

  const getPriorityIcon = (priority: keyof typeof priorityConfig) => {
    const Icon = priorityConfig[priority].icon
    return <Icon className="h-3 w-3" />
  }

  const getStatusIcon = (status: keyof typeof statusConfig) => {
    const Icon = statusConfig[status].icon
    return <Icon className="h-3 w-3" />
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
              <p className="text-sm text-gray-600">Manage and track your team&apos;s work</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                {viewModes.map((mode) => {
                  const Icon = mode.icon
                  return (
                    <Button
                      key={mode.id}
                      variant={currentView === mode.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentView(mode.id)}
                      className={cn(
                        "flex items-center space-x-2",
                        currentView === mode.id 
                          ? "bg-white shadow-sm" 
                          : "hover:bg-gray-200"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{mode.label}</span>
                    </Button>
                  )
                })}
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Hide
                </Button>
                <Button variant="outline" size="sm">
                  Customize
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentView === "list" && (
          <div className="space-y-6">
            {/* Status Filter and Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={selectedStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedStatus === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus("completed")}
                    className="bg-blue-100 text-blue-800 border-blue-200"
                  >
                    Closed
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSubtasks(!showSubtasks)}
                  >
                    {showSubtasks ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                    Subtasks
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowColumns(!showColumns)}
                  >
                    Columns
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Group:</span>
                  <Button variant="outline" size="sm">
                    Status <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Assignee:</span>
                  <div className="flex -space-x-1">
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="text-xs bg-purple-500 text-white">K</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>

            {/* COMPLETE Section Header */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">COMPLETE</h3>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {completedTasks.length}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-gray-700">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-2">Assignee</div>
                  <div className="col-span-2">Due date</div>
                  <div className="col-span-1">Priority</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1">Comments</div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {completedTasks.map((task) => (
                  <div key={task.id} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 group">
                    {/* Task Name */}
                    <div className="col-span-4 flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded border border-gray-300 bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        </div>
                        {editingTask === task.id ? (
                          <Input
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="flex-1"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleEditSave(task.id)
                              if (e.key === "Escape") handleEditCancel()
                            }}
                            onBlur={() => handleEditSave(task.id)}
                          />
                        ) : (
                          <span 
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                            onClick={() => handleEditStart(task.id, task.name)}
                          >
                            {task.name}
                          </span>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Assignee */}
                    <div className="col-span-2 flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar || undefined} />
                        <AvatarFallback className="text-xs bg-purple-500 text-white">
                          {task.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-900">{task.assignee.name}</span>
                    </div>

                    {/* Due Date */}
                    <div className="col-span-2 flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Priority */}
                    <div className="col-span-1">
                      <Badge className={cn("text-xs", priorityConfig[task.priority].color)}>
                        {getPriorityIcon(task.priority)}
                        <span className="ml-1 capitalize">{task.priority}</span>
                      </Badge>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <Badge className={cn("text-xs", statusConfig[task.status].color)}>
                        {getStatusIcon(task.status)}
                        <span className="ml-1">{statusConfig[task.status].label}</span>
                      </Badge>
                    </div>

                    {/* Comments */}
                    <div className="col-span-1 flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{task.comments}</span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Move className="mr-2 h-4 w-4" />
                            Move
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === "kanban" && (
          <div className="space-y-6">
            <KanbanBoard 
              tasks={filteredTasks}
              onTaskMove={(taskId, newStatus) => {
                console.log(`Moving task ${taskId} to ${newStatus}`)
              }}
              onTaskEdit={(taskId, updates) => {
                console.log(`Editing task ${taskId} with updates:`, updates)
              }}
            />
          </div>
        )}

        {currentView === "calendar" && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
              <p className="text-gray-600">Calendar view coming soon...</p>
            </div>
          </div>
        )}

        {currentView === "gantt" && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline View</h3>
              <p className="text-gray-600">Gantt chart view coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}