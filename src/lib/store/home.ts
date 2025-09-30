import { create } from 'zustand'

// Home state interface
interface HomeState {
  // Dashboard data
  dashboard: {
    recentProjects: Array<{
      id: string
      name: string
      key: string
      color: string
      progress: number
      lastUpdated: Date
      taskCount: number
      completedTasks: number
    }>
    
    recentTasks: Array<{
      id: string
      title: string
      projectId: string
      projectName: string
      status: string
      priority: 'low' | 'medium' | 'high' | 'urgent'
      dueDate?: Date
      assignee?: {
        id: string
        name: string
        avatar?: string
      }
    }>
    
    upcomingMilestones: Array<{
      id: string
      name: string
      projectId: string
      projectName: string
      dueDate: Date
      progress: number
      status: 'upcoming' | 'active' | 'completed' | 'overdue'
    }>
    
    teamMembers: Array<{
      id: string
      name: string
      email: string
      avatar?: string
      role: string
      isOnline: boolean
      lastActive?: Date
    }>
    
    // Analytics data
    analytics: {
      totalProjects: number
      totalTasks: number
      completedTasks: number
      overdueTasks: number
      teamProductivity: number
      projectProgress: Array<{
        projectId: string
        projectName: string
        progress: number
        completedTasks: number
        totalTasks: number
      }>
    }
  }
  
  // UI state
  ui: {
    isLoading: boolean
    lastUpdated: Date | null
    error: string | null
    selectedProjectId: string | null
    selectedView: 'overview' | 'projects' | 'tasks' | 'milestones' | 'team'
  }
  
  // Actions
  setDashboardData: (data: Partial<HomeState['dashboard']>) => void
  setRecentProjects: (projects: HomeState['dashboard']['recentProjects']) => void
  setRecentTasks: (tasks: HomeState['dashboard']['recentTasks']) => void
  setUpcomingMilestones: (milestones: HomeState['dashboard']['upcomingMilestones']) => void
  setTeamMembers: (members: HomeState['dashboard']['teamMembers']) => void
  setAnalytics: (analytics: HomeState['dashboard']['analytics']) => void
  
  // UI actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedProject: (projectId: string | null) => void
  setSelectedView: (view: 'overview' | 'projects' | 'tasks' | 'milestones' | 'team') => void
  updateLastUpdated: () => void
  
  // Data refresh
  refreshDashboard: () => Promise<void>
  refreshProjects: () => Promise<void>
  refreshTasks: () => Promise<void>
  refreshMilestones: () => Promise<void>
  refreshTeam: () => Promise<void>
  refreshAnalytics: () => Promise<void>
}

// Default state
const defaultState: Omit<HomeState, 
  'setDashboardData' | 'setRecentProjects' | 'setRecentTasks' | 'setUpcomingMilestones' | 
  'setTeamMembers' | 'setAnalytics' | 'setLoading' | 'setError' | 'setSelectedProject' | 
  'setSelectedView' | 'updateLastUpdated' | 'refreshDashboard' | 'refreshProjects' | 
  'refreshTasks' | 'refreshMilestones' | 'refreshTeam' | 'refreshAnalytics'
> = {
  dashboard: {
    recentProjects: [],
    recentTasks: [],
    upcomingMilestones: [],
    teamMembers: [],
    analytics: {
      totalProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
      teamProductivity: 0,
      projectProgress: [],
    },
  },
  ui: {
    isLoading: false,
    lastUpdated: null,
    error: null,
    selectedProjectId: null,
    selectedView: 'overview',
  },
}

export const useHomeStore = create<HomeState>((set) => ({
  ...defaultState,
  
  // Dashboard data actions
  setDashboardData: (data) => set((state) => ({
    dashboard: { ...state.dashboard, ...data },
    ui: { ...state.ui, lastUpdated: new Date() },
  })),
  
  setRecentProjects: (projects) => set((state) => ({
    dashboard: { ...state.dashboard, recentProjects: projects },
    ui: { ...state.ui, lastUpdated: new Date() },
  })),
  
  setRecentTasks: (tasks) => set((state) => ({
    dashboard: { ...state.dashboard, recentTasks: tasks },
    ui: { ...state.ui, lastUpdated: new Date() },
  })),
  
  setUpcomingMilestones: (milestones) => set((state) => ({
    dashboard: { ...state.dashboard, upcomingMilestones: milestones },
    ui: { ...state.ui, lastUpdated: new Date() },
  })),
  
  setTeamMembers: (members) => set((state) => ({
    dashboard: { ...state.dashboard, teamMembers: members },
    ui: { ...state.ui, lastUpdated: new Date() },
  })),
  
  setAnalytics: (analytics) => set((state) => ({
    dashboard: { ...state.dashboard, analytics: analytics },
    ui: { ...state.ui, lastUpdated: new Date() },
  })),
  
  // UI actions
  setLoading: (loading) => set((state) => ({
    ui: { ...state.ui, isLoading: loading },
  })),
  
  setError: (error) => set((state) => ({
    ui: { ...state.ui, error },
  })),
  
  setSelectedProject: (projectId) => set((state) => ({
    ui: { ...state.ui, selectedProjectId: projectId },
  })),
  
  setSelectedView: (view) => set((state) => ({
    ui: { ...state.ui, selectedView: view },
  })),
  
  updateLastUpdated: () => set((state) => ({
    ui: { ...state.ui, lastUpdated: new Date() },
  })),
  
  // Refresh actions (placeholder implementations)
  refreshDashboard: async () => {
    set((state) => ({ ui: { ...state.ui, isLoading: true, error: null } }))
    try {
      // TODO: Implement API calls to refresh dashboard data
      console.log('Refreshing dashboard data...')
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      set((state) => ({ 
        ui: { ...state.ui, isLoading: false, lastUpdated: new Date() } 
      }))
    } catch (error) {
      set((state) => ({ 
        ui: { 
          ...state.ui, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to refresh dashboard' 
        } 
      }))
    }
  },
  
  refreshProjects: async () => {
    set((state) => ({ ui: { ...state.ui, isLoading: true, error: null } }))
    try {
      // TODO: Implement API call to refresh projects
      console.log('Refreshing projects...')
      await new Promise(resolve => setTimeout(resolve, 500))
      set((state) => ({ 
        ui: { ...state.ui, isLoading: false, lastUpdated: new Date() } 
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
  
  refreshTasks: async () => {
    set((state) => ({ ui: { ...state.ui, isLoading: true, error: null } }))
    try {
      // TODO: Implement API call to refresh tasks
      console.log('Refreshing tasks...')
      await new Promise(resolve => setTimeout(resolve, 500))
      set((state) => ({ 
        ui: { ...state.ui, isLoading: false, lastUpdated: new Date() } 
      }))
    } catch (error) {
      set((state) => ({ 
        ui: { 
          ...state.ui, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to refresh tasks' 
        } 
      }))
    }
  },
  
  refreshMilestones: async () => {
    set((state) => ({ ui: { ...state.ui, isLoading: true, error: null } }))
    try {
      // TODO: Implement API call to refresh milestones
      console.log('Refreshing milestones...')
      await new Promise(resolve => setTimeout(resolve, 500))
      set((state) => ({ 
        ui: { ...state.ui, isLoading: false, lastUpdated: new Date() } 
      }))
    } catch (error) {
      set((state) => ({ 
        ui: { 
          ...state.ui, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to refresh milestones' 
        } 
      }))
    }
  },
  
  refreshTeam: async () => {
    set((state) => ({ ui: { ...state.ui, isLoading: true, error: null } }))
    try {
      // TODO: Implement API call to refresh team data
      console.log('Refreshing team data...')
      await new Promise(resolve => setTimeout(resolve, 500))
      set((state) => ({ 
        ui: { ...state.ui, isLoading: false, lastUpdated: new Date() } 
      }))
    } catch (error) {
      set((state) => ({ 
        ui: { 
          ...state.ui, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to refresh team data' 
        } 
      }))
    }
  },
  
  refreshAnalytics: async () => {
    set((state) => ({ ui: { ...state.ui, isLoading: true, error: null } }))
    try {
      // TODO: Implement API call to refresh analytics
      console.log('Refreshing analytics...')
      await new Promise(resolve => setTimeout(resolve, 500))
      set((state) => ({ 
        ui: { ...state.ui, isLoading: false, lastUpdated: new Date() } 
      }))
    } catch (error) {
      set((state) => ({ 
        ui: { 
          ...state.ui, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to refresh analytics' 
        } 
      }))
    }
  },
}))
