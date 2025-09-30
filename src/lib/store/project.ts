import { create } from 'zustand'

// Project state interface
interface ProjectState {
  // Current project data
  currentProject: {
    id: string | null
    name: string
    key: string
    description?: string
    color: string
    status: 'active' | 'paused' | 'completed' | 'archived'
    startDate?: Date
    endDate?: Date
    progress: number
    createdAt: Date
    updatedAt: Date
  } | null
  
  // Project list
  projects: Array<{
    id: string
    name: string
    key: string
    description?: string
    color: string
    status: 'active' | 'paused' | 'completed' | 'archived'
    progress: number
    taskCount: number
    completedTasks: number
    lastUpdated: Date
  }>
  
  // Project members
  members: Array<{
    id: string
    name: string
    email: string
    avatar?: string
    role: 'owner' | 'admin' | 'member' | 'viewer'
    joinedAt: Date
    isActive: boolean
  }>
  
  // Project settings
  settings: {
    allowGuestAccess: boolean
    enableTimeTracking: boolean
    enableComments: boolean
    enableFileUploads: boolean
    maxFileSize: number // in MB
    allowedFileTypes: string[]
    notificationSettings: {
      taskAssignments: boolean
      taskUpdates: boolean
      milestoneUpdates: boolean
      commentMentions: boolean
    }
  }
  
  // UI state
  ui: {
    isLoading: boolean
    error: string | null
    selectedView: 'overview' | 'tasks' | 'milestones' | 'team' | 'settings'
    filters: {
      status: string[]
      priority: string[]
      assignee: string[]
      dateRange: {
        start?: Date
        end?: Date
      }
    }
    sortBy: 'name' | 'created' | 'updated' | 'priority' | 'status'
    sortOrder: 'asc' | 'desc'
  }
  
  // Actions
  setCurrentProject: (project: ProjectState['currentProject']) => void
  setProjects: (projects: ProjectState['projects']) => void
  addProject: (project: Omit<ProjectState['projects'][0], 'id' | 'lastUpdated'>) => void
  updateProject: (id: string, updates: Partial<ProjectState['projects'][0]>) => void
  deleteProject: (id: string) => void
  
  // Member actions
  setMembers: (members: ProjectState['members']) => void
  addMember: (member: Omit<ProjectState['members'][0], 'id' | 'joinedAt'>) => void
  updateMember: (id: string, updates: Partial<ProjectState['members'][0]>) => void
  removeMember: (id: string) => void
  
  // Settings actions
  updateSettings: (settings: Partial<ProjectState['settings']>) => void
  
  // UI actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedView: (view: 'overview' | 'tasks' | 'milestones' | 'team' | 'settings') => void
  setFilters: (filters: Partial<ProjectState['ui']['filters']>) => void
  setSortBy: (sortBy: ProjectState['ui']['sortBy']) => void
  setSortOrder: (order: 'asc' | 'desc') => void
  clearFilters: () => void
  
  // Data refresh
  refreshProject: () => Promise<void>
  refreshProjects: () => Promise<void>
  refreshMembers: () => Promise<void>
}

// Default state
const defaultState: Omit<ProjectState, 
  'setCurrentProject' | 'setProjects' | 'addProject' | 'updateProject' | 'deleteProject' |
  'setMembers' | 'addMember' | 'updateMember' | 'removeMember' | 'updateSettings' |
  'setLoading' | 'setError' | 'setSelectedView' | 'setFilters' | 'setSortBy' | 'setSortOrder' | 'clearFilters' |
  'refreshProject' | 'refreshProjects' | 'refreshMembers'
> = {
  currentProject: null,
  projects: [],
  members: [],
  settings: {
    allowGuestAccess: false,
    enableTimeTracking: true,
    enableComments: true,
    enableFileUploads: true,
    maxFileSize: 10,
    allowedFileTypes: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png', '.gif'],
    notificationSettings: {
      taskAssignments: true,
      taskUpdates: true,
      milestoneUpdates: true,
      commentMentions: true,
    },
  },
  ui: {
    isLoading: false,
    error: null,
    selectedView: 'overview',
    filters: {
      status: [],
      priority: [],
      assignee: [],
      dateRange: {},
    },
    sortBy: 'updated',
    sortOrder: 'desc',
  },
}

export const useProjectStore = create<ProjectState>((set) => ({
  ...defaultState,
  
  // Project actions
  setCurrentProject: (project) => set({ currentProject: project }),
  
  setProjects: (projects) => set({ projects }),
  
  addProject: (project) => set((state) => ({
    projects: [...state.projects, {
      ...project,
      id: `project-${Date.now()}`, // TODO: Replace with proper ID generation
      lastUpdated: new Date(),
    }],
  })),
  
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(project => 
      project.id === id 
        ? { ...project, ...updates, lastUpdated: new Date() }
        : project
    ),
  })),
  
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(project => project.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject,
  })),
  
  // Member actions
  setMembers: (members) => set({ members }),
  
  addMember: (member) => set((state) => ({
    members: [...state.members, {
      ...member,
      id: `member-${Date.now()}`, // TODO: Replace with proper ID generation
      joinedAt: new Date(),
    }],
  })),
  
  updateMember: (id, updates) => set((state) => ({
    members: state.members.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ),
  })),
  
  removeMember: (id) => set((state) => ({
    members: state.members.filter(member => member.id !== id),
  })),
  
  // Settings actions
  updateSettings: (settings) => set((state) => ({
    settings: { ...state.settings, ...settings },
  })),
  
  // UI actions
  setLoading: (loading) => set((state) => ({
    ui: { ...state.ui, isLoading: loading },
  })),
  
  setError: (error) => set((state) => ({
    ui: { ...state.ui, error },
  })),
  
  setSelectedView: (view) => set((state) => ({
    ui: { ...state.ui, selectedView: view },
  })),
  
  setFilters: (filters) => set((state) => ({
    ui: { 
      ...state.ui, 
      filters: { ...state.ui.filters, ...filters } 
    },
  })),
  
  setSortBy: (sortBy) => set((state) => ({
    ui: { ...state.ui, sortBy },
  })),
  
  setSortOrder: (order) => set((state) => ({
    ui: { ...state.ui, sortOrder: order },
  })),
  
  clearFilters: () => set((state) => ({
    ui: {
      ...state.ui,
      filters: {
        status: [],
        priority: [],
        assignee: [],
        dateRange: {},
      },
    },
  })),
  
  // Refresh actions (placeholder implementations)
  refreshProject: async () => {
    set((state) => ({ ui: { ...state.ui, isLoading: true, error: null } }))
    try {
      // TODO: Implement API call to refresh current project
      console.log('Refreshing current project...')
      await new Promise(resolve => setTimeout(resolve, 500))
      set((state) => ({ 
        ui: { ...state.ui, isLoading: false } 
      }))
    } catch (error) {
      set((state) => ({ 
        ui: { 
          ...state.ui, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to refresh project' 
        } 
      }))
    }
  },
  
  refreshProjects: async () => {
    set((state) => ({ ui: { ...state.ui, isLoading: true, error: null } }))
    try {
      // TODO: Implement API call to refresh projects list
      console.log('Refreshing projects list...')
      await new Promise(resolve => setTimeout(resolve, 500))
      set((state) => ({ 
        ui: { ...state.ui, isLoading: false } 
      }))
    } catch (error) {
      set((state) => ({ 
        ui: { 
          ...state.ui, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to refresh projects' 
        } 
      }))
    }
  },
  
  refreshMembers: async () => {
    set((state) => ({ ui: { ...state.ui, isLoading: true, error: null } }))
    try {
      // TODO: Implement API call to refresh project members
      console.log('Refreshing project members...')
      await new Promise(resolve => setTimeout(resolve, 500))
      set((state) => ({ 
        ui: { ...state.ui, isLoading: false } 
      }))
    } catch (error) {
      set((state) => ({ 
        ui: { 
          ...state.ui, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to refresh members' 
        } 
      }))
    }
  },
}))
