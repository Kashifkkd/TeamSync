"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Eye, 
  Settings, 
  Plus, 
  Filter, 
  SortAsc, 
  CheckSquare, 
  Calendar, 
  Flag, 
  MoreHorizontal,
  User,
  MessageSquare,
  Paperclip,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  assignee: { name: string; initials: string; avatar: string | null }
  dueDate: string
  priority: string
  tags: string[]
  comments: number
  attachments: number
  subtasks: number
}

// Mock data for tasks
const mockTasks: {
  todo: Task[]
  inProgress: Task[]
  complete: Task[]
} = {
  todo: [
    {
      id: "1",
      title: "Coupon by coupon id api",
      assignee: { name: "Kashif", initials: "K", avatar: null },
      dueDate: "Feb 20",
      priority: "high",
      tags: ["API", "Backend"],
      comments: 3,
      attachments: 1,
      subtasks: 2
    },
    {
      id: "2", 
      title: "All Screens Completed React Native",
      assignee: { name: "Nikhil", initials: "NC", avatar: null },
      dueDate: "Feb 22",
      priority: "medium",
      tags: ["Frontend", "Mobile"],
      comments: 1,
      attachments: 0,
      subtasks: 0
    }
  ],
  inProgress: [],
  complete: [
    {
      id: "3",
      title: "FE-1-login module",
      assignee: { name: "Kashif", initials: "K", avatar: null },
      dueDate: "Feb 14 - Feb 16",
      priority: "normal",
      tags: ["Frontend", "Auth"],
      comments: 5,
      attachments: 2,
      subtasks: 3
    },
    {
      id: "4",
      title: "FE integration web app", 
      assignee: { name: "Kashif", initials: "K", avatar: null },
      dueDate: "Feb 15",
      priority: "high",
      tags: ["Frontend", "Integration"],
      comments: 2,
      attachments: 1,
      subtasks: 1
    },
    {
      id: "5",
      title: "Be-(Services-post and get",
      assignee: { name: "Kashif", initials: "K", avatar: null },
      dueDate: "Feb 16",
      priority: "medium",
      tags: ["Backend", "API"],
      comments: 4,
      attachments: 0,
      subtasks: 0
    },
    {
      id: "6",
      title: "Be-1-login-mod",
      assignee: { name: "Faisal", initials: "FJ", avatar: null },
      dueDate: "Feb 16",
      priority: "normal",
      tags: ["Backend", "Auth"],
      comments: 1,
      attachments: 0,
      subtasks: 0
    },
    {
      id: "7",
      title: "House cleaning",
      assignee: { name: "Kashif", initials: "K", avatar: null },
      dueDate: "Feb 17",
      priority: "low",
      tags: ["Personal"],
      comments: 0,
      attachments: 0,
      subtasks: 0
    }
  ]
}

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  normal: "bg-blue-100 text-blue-800 border-blue-200",
  low: "bg-gray-100 text-gray-800 border-gray-200"
}

// const statusColors = {
//   todo: "bg-gray-100 text-gray-800",
//   inProgress: "bg-blue-100 text-blue-800", 
//   complete: "bg-green-100 text-green-800"
// }

export default function MilestonesTasksPage() {
  const [activeView, setActiveView] = useState("board")
  const [showSubtasks, setShowSubtasks] = useState(false)

  const views = [
    { id: "board", name: "Board" },
    { id: "list", name: "List" },
    { id: "calendar", name: "Calendar" },
    { id: "table", name: "Table" },
    { id: "gantt", name: "Gantt" }
  ]

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
            {task.title}
          </h4>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar || undefined} alt={task.assignee.name} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {task.assignee.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{task.dueDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
          <Badge className={cn("text-xs px-2 py-0.5", priorityColors[task.priority as keyof typeof priorityColors])}>
            <Flag className="h-3 w-3 mr-1" />
            {task.priority}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            {task.subtasks > 0 && (
              <div className="flex items-center space-x-1">
                <CheckSquare className="h-3 w-3" />
                <span>{task.subtasks}</span>
              </div>
            )}
            {task.comments > 0 && (
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-3 w-3" />
                <span>{task.comments}</span>
              </div>
            )}
            {task.attachments > 0 && (
              <div className="flex items-center space-x-1">
                <Paperclip className="h-3 w-3" />
                <span>{task.attachments}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>2h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={cn(
                    "text-sm font-medium transition-colors pb-2 border-b-2",
                    activeView === view.id
                      ? "text-foreground border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  )}
                >
                  {view.name}
                </button>
              ))}
              <button className="text-sm text-muted-foreground hover:text-foreground">
                1 more...
              </button>
              <Button variant="outline" size="sm" className="text-sm">
                + View
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Control Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Group:</span>
                <Badge variant="secondary" className="text-xs">
                  Status
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="subtasks"
                  checked={showSubtasks}
                  onChange={(e) => setShowSubtasks(e.target.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="subtasks" className="text-sm text-muted-foreground">
                  Subtasks
                </label>
              </div>
              
              <Button variant="ghost" size="sm" className="text-sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
              
              <Button variant="ghost" size="sm" className="text-sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="closed"
                  className="rounded border-border"
                />
                <label htmlFor="closed" className="text-sm text-muted-foreground">
                  Closed
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    K
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                + Add group
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex overflow-x-auto">
          {/* TO DO Column */}
          <div className="w-80 flex-shrink-0 border-r border-border bg-muted/20">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <h3 className="font-semibold text-foreground">TO DO</h3>
                  <Badge variant="secondary" className="text-xs">
                    {mockTasks.todo.length}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {mockTasks.todo.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              <Button 
                variant="ghost" 
                className="w-full h-12 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          {/* IN PROGRESS Column */}
          <div className="w-80 flex-shrink-0 border-r border-border bg-muted/20">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <h3 className="font-semibold text-foreground">IN PROGRESS</h3>
                  <Badge variant="secondary" className="text-xs">
                    {mockTasks.inProgress.length}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {mockTasks.inProgress.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              <Button 
                variant="ghost" 
                className="w-full h-12 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          {/* COMPLETE Column */}
          <div className="w-80 flex-shrink-0 border-r border-border bg-muted/20">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <h3 className="font-semibold text-foreground">COMPLETE</h3>
                  <Badge variant="secondary" className="text-xs">
                    {mockTasks.complete.length}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-full">
              {mockTasks.complete.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              <Button 
                variant="ghost" 
                className="w-full h-12 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
