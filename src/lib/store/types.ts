// Shared types for Zustand stores

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  isOnline?: boolean
  lastActive?: Date
}

export interface Project {
  id: string
  name: string
  key: string
  description?: string
  color: string
  status: 'active' | 'paused' | 'completed' | 'archived'
  startDate?: Date
  endDate?: Date
  progress: number
  taskCount: number
  completedTasks: number
  createdAt: Date
  updatedAt: Date
  lastUpdated: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  projectId: string
  projectName: string
  milestoneId?: string
  milestoneName?: string
  status: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee?: User
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  tags: string[]
  estimatedHours?: number
  actualHours?: number
}

export interface Milestone {
  id: string
  name: string
  description?: string
  projectId: string
  projectName: string
  status: 'upcoming' | 'active' | 'completed' | 'overdue'
  startDate?: Date
  dueDate: Date
  progress: number
  taskCount: number
  completedTasks: number
  createdAt: Date
  updatedAt: Date
}

export interface Workspace {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Filter and sort types
export interface FilterOptions {
  status?: string[]
  priority?: string[]
  assignee?: string[]
  project?: string[]
  milestone?: string[]
  dateRange?: {
    start?: Date
    end?: Date
  }
  tags?: string[]
}

export interface SortOptions {
  field: string
  order: 'asc' | 'desc'
}

// Notification types
export interface Notification {
  id: string
  type: 'task' | 'milestone' | 'project' | 'team' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
  metadata?: Record<string, unknown>
}

// Activity log types
export interface ActivityLog {
  id: string
  type: 'create' | 'update' | 'delete' | 'assign' | 'comment' | 'status_change'
  entityType: 'task' | 'milestone' | 'project' | 'member'
  entityId: string
  entityName: string
  userId: string
  userName: string
  userAvatar?: string
  description: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// View types
export type ViewType = 'list' | 'board' | 'calendar' | 'gantt' | 'timeline'

// Priority types
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

// Status types
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed' | 'cancelled'
export type MilestoneStatus = 'upcoming' | 'active' | 'completed' | 'overdue'
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived'

// Role types
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer'

// Time format types
export type TimeFormat = '12h' | '24h'

// Date format types
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD MMM YYYY'

// Week start types
export type WeekStart = 0 | 1 // 0 = Sunday, 1 = Monday
