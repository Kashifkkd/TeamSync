import { z } from "zod"

// Auth schemas
export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
})

// Workspace schemas
export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(50, "Name too long"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(30, "Slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(500, "Description too long").optional(),
})

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(50, "Name too long").optional(),
  description: z.string().max(500, "Description too long").optional(),
  settings: z.record(z.any()).optional(),
})

export const inviteMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "member", "viewer"]),
})

// Project schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Name too long"),
  key: z
    .string()
    .min(2, "Key must be at least 2 characters")
    .max(10, "Key too long")
    .regex(/^[A-Z0-9]+$/, "Key can only contain uppercase letters and numbers"),
  description: z.string().max(1000, "Description too long").optional(),
  status: z.enum(["active", "archived", "on_hold"]).default("active"),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  visibility: z.enum(["private", "internal", "public"]).default("private"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

export const updateProjectSchema = createProjectSchema.partial()

// Task schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200, "Title too long"),
  description: z.string().max(2000, "Description too long").optional(),
  status: z.enum(["todo", "in_progress", "in_review", "done", "cancelled"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  type: z.enum(["task", "bug", "feature", "epic", "story"]).default("task"),
  assigneeId: z.string().optional(),
  milestoneId: z.string().optional(),
  parentId: z.string().optional(),
  storyPoints: z.number().int().min(1).max(100).optional(),
  originalEstimate: z.number().int().min(1).optional(), // in minutes
  dueDate: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
  labelIds: z.array(z.string()).optional(),
})

export const updateTaskSchema = createTaskSchema.partial()

export const bulkUpdateTasksSchema = z.object({
  taskIds: z.array(z.string()).min(1, "At least one task must be selected"),
  updates: z.object({
    status: z.enum(["todo", "in_progress", "in_review", "done", "cancelled"]).optional(),
    priority: z.enum(["low", "medium", "high", "critical"]).optional(),
    assigneeId: z.string().optional(),
    milestoneId: z.string().optional(),
    labelIds: z.array(z.string()).optional(),
  }),
})

// Milestone schemas
export const createMilestoneSchema = z.object({
  name: z.string().min(1, "Milestone name is required").max(100, "Name too long"),
  description: z.string().max(1000, "Description too long").optional(),
  type: z.enum(["sprint", "milestone", "release"]).default("sprint"),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sprintGoal: z.string().max(500, "Sprint goal too long").optional(),
  capacity: z.number().int().min(1).optional(),
})

export const updateMilestoneSchema = createMilestoneSchema.partial()

// Label schemas
export const createLabelSchema = z.object({
  name: z.string().min(1, "Label name is required").max(50, "Name too long"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  description: z.string().max(200, "Description too long").optional(),
})

export const updateLabelSchema = createLabelSchema.partial()

// Comment schemas
export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000, "Comment too long"),
  taskId: z.string().optional(),
  projectId: z.string().optional(),
})

export const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000, "Comment too long"),
})

// Time entry schemas
export const createTimeEntrySchema = z.object({
  taskId: z.string(),
  description: z.string().max(500, "Description too long").optional(),
  duration: z.number().int().min(1, "Duration must be at least 1 minute"),
  date: z.string().datetime().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
})

export const updateTimeEntrySchema = createTimeEntrySchema.partial().omit({ taskId: true })

// Custom field schemas
export const createCustomFieldSchema = z.object({
  name: z.string().min(1, "Field name is required").max(100, "Name too long"),
  type: z.enum(["text", "number", "select", "multiselect", "date", "checkbox", "user"]),
  required: z.boolean().default(false),
  description: z.string().max(500, "Description too long").optional(),
  options: z.array(z.string()).optional(), // for select/multiselect fields
})

export const updateCustomFieldSchema = createCustomFieldSchema.partial()

// Search and filter schemas
export const taskFilterSchema = z.object({
  status: z.array(z.string()).optional(),
  priority: z.array(z.string()).optional(),
  assigneeId: z.array(z.string()).optional(),
  milestoneId: z.string().optional(),
  labelIds: z.array(z.string()).optional(),
  type: z.array(z.string()).optional(),
  search: z.string().optional(),
  dueDate: z.enum(["overdue", "today", "this_week", "this_month"]).optional(),
  sortBy: z.enum(["created", "updated", "priority", "dueDate", "title"]).default("updated"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

export const projectFilterSchema = z.object({
  status: z.array(z.string()).optional(),
  priority: z.array(z.string()).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["created", "updated", "name", "priority"]).default("updated"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
})

// Settings schemas
export const userPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  timezone: z.string().default("UTC"),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  weekStartsOn: z.enum(["sunday", "monday"]).default("monday"),
  timeFormat: z.enum(["12h", "24h"]).default("12h"),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("MM/DD/YYYY"),
})

export const notificationPreferencesSchema = z.object({
  taskAssigned: z.boolean().default(true),
  taskCompleted: z.boolean().default(true),
  taskCommented: z.boolean().default(true),
  taskDue: z.boolean().default(true),
  milestoneStarted: z.boolean().default(true),
  milestoneCompleted: z.boolean().default(true),
  projectUpdated: z.boolean().default(false),
  weeklyDigest: z.boolean().default(true),
})

// Type exports
export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type BulkUpdateTasksInput = z.infer<typeof bulkUpdateTasksSchema>
export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>
export type CreateLabelInput = z.infer<typeof createLabelSchema>
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>
export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>
export type UpdateTimeEntryInput = z.infer<typeof updateTimeEntrySchema>
export type CreateCustomFieldInput = z.infer<typeof createCustomFieldSchema>
export type UpdateCustomFieldInput = z.infer<typeof updateCustomFieldSchema>
export type TaskFilterInput = z.infer<typeof taskFilterSchema>
export type ProjectFilterInput = z.infer<typeof projectFilterSchema>
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>
export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>
