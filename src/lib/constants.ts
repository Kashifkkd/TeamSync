import { ROLE } from './permissions'

// Task Status Constants
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done',
  CANCELLED: 'cancelled',
} as const

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.IN_REVIEW]: 'In Review',
  [TASK_STATUS.DONE]: 'Done',
  [TASK_STATUS.CANCELLED]: 'Cancelled',
} as const

// Task Priority Constants
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Low',
  [TASK_PRIORITY.MEDIUM]: 'Medium',
  [TASK_PRIORITY.HIGH]: 'High',
  [TASK_PRIORITY.CRITICAL]: 'Critical',
} as const

// Task Type Constants
export const TASK_TYPE = {
  TASK: 'task',
  BUG: 'bug',
  FEATURE: 'feature',
  EPIC: 'epic',
  STORY: 'story',
} as const

export const TASK_TYPE_LABELS = {
  [TASK_TYPE.TASK]: 'Task',
  [TASK_TYPE.BUG]: 'Bug',
  [TASK_TYPE.FEATURE]: 'Feature',
  [TASK_TYPE.EPIC]: 'Epic',
  [TASK_TYPE.STORY]: 'Story',
} as const

// Project Status Constants
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  ON_HOLD: 'on_hold',
} as const

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.ACTIVE]: 'Active',
  [PROJECT_STATUS.ARCHIVED]: 'Archived',
  [PROJECT_STATUS.ON_HOLD]: 'On Hold',
} as const

// Project Priority Constants
export const PROJECT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const

export const PROJECT_PRIORITY_LABELS = {
  [PROJECT_PRIORITY.LOW]: 'Low',
  [PROJECT_PRIORITY.MEDIUM]: 'Medium',
  [PROJECT_PRIORITY.HIGH]: 'High',
  [PROJECT_PRIORITY.CRITICAL]: 'Critical',
} as const

// Project Visibility Constants
export const PROJECT_VISIBILITY = {
  PRIVATE: 'private',
  INTERNAL: 'internal',
  PUBLIC: 'public',
} as const

export const PROJECT_VISIBILITY_LABELS = {
  [PROJECT_VISIBILITY.PRIVATE]: 'Private',
  [PROJECT_VISIBILITY.INTERNAL]: 'Internal',
  [PROJECT_VISIBILITY.PUBLIC]: 'Public',
} as const

// Milestone Type Constants
export const MILESTONE_TYPE = {
  SPRINT: 'sprint',
  MILESTONE: 'milestone',
  RELEASE: 'release',
} as const

export const MILESTONE_TYPE_LABELS = {
  [MILESTONE_TYPE.SPRINT]: 'Sprint',
  [MILESTONE_TYPE.MILESTONE]: 'Milestone',
  [MILESTONE_TYPE.RELEASE]: 'Release',
} as const

// Milestone Status Constants
export const MILESTONE_STATUS = {
  ACTIVE: 'active',
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
  PAUSED: 'paused',
} as const

export const MILESTONE_STATUS_LABELS = {
  [MILESTONE_STATUS.ACTIVE]: 'Active',
  [MILESTONE_STATUS.UPCOMING]: 'Upcoming',
  [MILESTONE_STATUS.COMPLETED]: 'Completed',
  [MILESTONE_STATUS.PAUSED]: 'Paused',
} as const

// Role Constants - Imported from permissions.ts for consistency
export { ROLE, ROLE_LABELS, SYSTEM_ROLES } from './permissions'
export type Role = typeof ROLE[keyof typeof ROLE]

// Member Status Constants
export const MEMBER_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
} as const

export const MEMBER_STATUS_LABELS = {
  [MEMBER_STATUS.ACTIVE]: 'Active',
  [MEMBER_STATUS.PENDING]: 'Pending',
  [MEMBER_STATUS.SUSPENDED]: 'Suspended',
} as const

// Invite Status Constants
export const INVITE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
} as const

export const INVITE_STATUS_LABELS = {
  [INVITE_STATUS.PENDING]: 'Pending',
  [INVITE_STATUS.ACCEPTED]: 'Accepted',
  [INVITE_STATUS.EXPIRED]: 'Expired',
  [INVITE_STATUS.REVOKED]: 'Revoked',
} as const

// Custom Field Type Constants
export const CUSTOM_FIELD_TYPE = {
  TEXT: 'text',
  NUMBER: 'number',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  DATE: 'date',
  CHECKBOX: 'checkbox',
  USER: 'user',
} as const

export const CUSTOM_FIELD_TYPE_LABELS = {
  [CUSTOM_FIELD_TYPE.TEXT]: 'Text',
  [CUSTOM_FIELD_TYPE.NUMBER]: 'Number',
  [CUSTOM_FIELD_TYPE.SELECT]: 'Select',
  [CUSTOM_FIELD_TYPE.MULTISELECT]: 'Multi-select',
  [CUSTOM_FIELD_TYPE.DATE]: 'Date',
  [CUSTOM_FIELD_TYPE.CHECKBOX]: 'Checkbox',
  [CUSTOM_FIELD_TYPE.USER]: 'User',
} as const

// Sort Order Constants
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const

// Sort By Constants
export const TASK_SORT_BY = {
  CREATED: 'created',
  UPDATED: 'updated',
  PRIORITY: 'priority',
  DUE_DATE: 'dueDate',
  TITLE: 'title',
} as const

export const PROJECT_SORT_BY = {
  CREATED: 'created',
  UPDATED: 'updated',
  NAME: 'name',
  PRIORITY: 'priority',
} as const

// Due Date Filter Constants
export const DUE_DATE_FILTER = {
  OVERDUE: 'overdue',
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
} as const

// Theme Constants
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

// Time Format Constants
export const TIME_FORMAT = {
  HOUR_12: '12h',
  HOUR_24: '24h',
} as const

// Date Format Constants
export const DATE_FORMAT = {
  MM_DD_YYYY: 'MM/DD/YYYY',
  DD_MM_YYYY: 'DD/MM/YYYY',
  YYYY_MM_DD: 'YYYY-MM-DD',
} as const

// Week Start Constants
export const WEEK_STARTS_ON = {
  SUNDAY: 'sunday',
  MONDAY: 'monday',
} as const

// Default Colors
export const DEFAULT_COLORS = {
  PRIMARY: '#2563eb',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
} as const

// Project Color Options
export const PROJECT_COLOR_OPTIONS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Teal', value: '#14b8a6' },
] as const

// Type definitions for better TypeScript support
export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS]
export type TaskPriority = typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY]
export type TaskType = typeof TASK_TYPE[keyof typeof TASK_TYPE]
export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS]
export type ProjectPriority = typeof PROJECT_PRIORITY[keyof typeof PROJECT_PRIORITY]
export type ProjectVisibility = typeof PROJECT_VISIBILITY[keyof typeof PROJECT_VISIBILITY]
export type MilestoneType = typeof MILESTONE_TYPE[keyof typeof MILESTONE_TYPE]
export type MilestoneStatus = typeof MILESTONE_STATUS[keyof typeof MILESTONE_STATUS]
export type MemberStatus = typeof MEMBER_STATUS[keyof typeof MEMBER_STATUS]
export type InviteStatus = typeof INVITE_STATUS[keyof typeof INVITE_STATUS]
export type CustomFieldType = typeof CUSTOM_FIELD_TYPE[keyof typeof CUSTOM_FIELD_TYPE]
export type SortOrder = typeof SORT_ORDER[keyof typeof SORT_ORDER]
export type TaskSortBy = typeof TASK_SORT_BY[keyof typeof TASK_SORT_BY]
export type ProjectSortBy = typeof PROJECT_SORT_BY[keyof typeof PROJECT_SORT_BY]
export type DueDateFilter = typeof DUE_DATE_FILTER[keyof typeof DUE_DATE_FILTER]
export type Theme = typeof THEME[keyof typeof THEME]
export type TimeFormat = typeof TIME_FORMAT[keyof typeof TIME_FORMAT]
export type DateFormat = typeof DATE_FORMAT[keyof typeof DATE_FORMAT]
export type WeekStartsOn = typeof WEEK_STARTS_ON[keyof typeof WEEK_STARTS_ON]
