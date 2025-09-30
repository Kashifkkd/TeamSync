// Custom hooks for easy store access
import { useSettingsStore } from '@/lib/store/settings'
import { useHomeStore } from '@/lib/store/home'
import { useProjectStore } from '@/lib/store/project'

// Settings hooks
export const useSettings = () => {
  const store = useSettingsStore()
  return {
    // State
    theme: store.theme,
    sidebarCollapsed: store.sidebarCollapsed,
    sidebarWidth: store.sidebarWidth,
    compactMode: store.compactMode,
    notifications: store.notifications,
    defaultView: store.defaultView,
    itemsPerPage: store.itemsPerPage,
    showCompletedTasks: store.showCompletedTasks,
    workspace: store.workspace,
    
    // Actions
    setTheme: store.setTheme,
    toggleSidebar: store.toggleSidebar,
    setSidebarWidth: store.setSidebarWidth,
    setCompactMode: store.setCompactMode,
    updateNotifications: store.updateNotifications,
    setDefaultView: store.setDefaultView,
    setItemsPerPage: store.setItemsPerPage,
    setShowCompletedTasks: store.setShowCompletedTasks,
    updateWorkspaceSettings: store.updateWorkspaceSettings,
    resetSettings: store.resetSettings,
  }
}

// Home/Dashboard hooks
export const useHome = () => {
  const store = useHomeStore()
  return {
    // State
    dashboard: store.dashboard,
    ui: store.ui,
    
    // Actions
    setDashboardData: store.setDashboardData,
    setRecentProjects: store.setRecentProjects,
    setRecentTasks: store.setRecentTasks,
    setUpcomingMilestones: store.setUpcomingMilestones,
    setTeamMembers: store.setTeamMembers,
    setAnalytics: store.setAnalytics,
    setLoading: store.setLoading,
    setError: store.setError,
    setSelectedProject: store.setSelectedProject,
    setSelectedView: store.setSelectedView,
    updateLastUpdated: store.updateLastUpdated,
    refreshDashboard: store.refreshDashboard,
    refreshProjects: store.refreshProjects,
    refreshTasks: store.refreshTasks,
    refreshMilestones: store.refreshMilestones,
    refreshTeam: store.refreshTeam,
    refreshAnalytics: store.refreshAnalytics,
  }
}

// Project hooks
export const useProject = () => {
  const store = useProjectStore()
  return {
    // State
    currentProject: store.currentProject,
    projects: store.projects,
    members: store.members,
    settings: store.settings,
    ui: store.ui,
    
    // Actions
    setCurrentProject: store.setCurrentProject,
    setProjects: store.setProjects,
    addProject: store.addProject,
    updateProject: store.updateProject,
    deleteProject: store.deleteProject,
    setMembers: store.setMembers,
    addMember: store.addMember,
    updateMember: store.updateMember,
    removeMember: store.removeMember,
    updateSettings: store.updateSettings,
    setLoading: store.setLoading,
    setError: store.setError,
    setSelectedView: store.setSelectedView,
    setFilters: store.setFilters,
    setSortBy: store.setSortBy,
    setSortOrder: store.setSortOrder,
    clearFilters: store.clearFilters,
    refreshProject: store.refreshProject,
    refreshProjects: store.refreshProjects,
    refreshMembers: store.refreshMembers,
  }
}

// Combined hook for accessing multiple stores
export const useAppState = () => {
  const settings = useSettings()
  const home = useHome()
  const project = useProject()
  
  return {
    settings,
    home,
    project,
  }
}
