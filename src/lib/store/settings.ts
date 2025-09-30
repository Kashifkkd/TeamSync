import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Settings state interface
interface SettingsState {
  // Theme settings
  theme: 'light' | 'dark' | 'system'
  
  // UI preferences
  sidebarCollapsed: boolean
  sidebarWidth: number
  compactMode: boolean
  
  // Notification settings
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
    taskUpdates: boolean
    milestoneUpdates: boolean
    teamUpdates: boolean
  }
  
  // View preferences
  defaultView: 'list' | 'board' | 'calendar' | 'gantt'
  itemsPerPage: number
  showCompletedTasks: boolean
  
  // Workspace settings
  workspace: {
    timezone: string
    dateFormat: string
    timeFormat: '12h' | '24h'
    weekStartsOn: 0 | 1 // 0 = Sunday, 1 = Monday
  }
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void
  setCompactMode: (compact: boolean) => void
  updateNotifications: (notifications: Partial<SettingsState['notifications']>) => void
  setDefaultView: (view: 'list' | 'board' | 'calendar' | 'gantt') => void
  setItemsPerPage: (count: number) => void
  setShowCompletedTasks: (show: boolean) => void
  updateWorkspaceSettings: (settings: Partial<SettingsState['workspace']>) => void
  resetSettings: () => void
}

// Default settings
const defaultSettings: Omit<SettingsState, 'setTheme' | 'toggleSidebar' | 'setSidebarWidth' | 'setCompactMode' | 'updateNotifications' | 'setDefaultView' | 'setItemsPerPage' | 'setShowCompletedTasks' | 'updateWorkspaceSettings' | 'resetSettings'> = {
  theme: 'system',
  sidebarCollapsed: false,
  sidebarWidth: 256,
  compactMode: false,
  notifications: {
    email: true,
    push: true,
    desktop: true,
    taskUpdates: true,
    milestoneUpdates: true,
    teamUpdates: false,
  },
  defaultView: 'board',
  itemsPerPage: 25,
  showCompletedTasks: true,
  workspace: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    weekStartsOn: 1,
  },
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      // Theme actions
      setTheme: (theme) => set({ theme }),
      
      // Sidebar actions
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarWidth: (width) => set({ sidebarWidth: Math.max(200, Math.min(400, width)) }),
      
      // UI actions
      setCompactMode: (compact) => set({ compactMode: compact }),
      
      // Notification actions
      updateNotifications: (notifications) => 
        set((state) => ({ 
          notifications: { ...state.notifications, ...notifications } 
        })),
      
      // View actions
      setDefaultView: (view) => set({ defaultView: view }),
      setItemsPerPage: (count) => set({ itemsPerPage: Math.max(10, Math.min(100, count)) }),
      setShowCompletedTasks: (show) => set({ showCompletedTasks: show }),
      
      // Workspace actions
      updateWorkspaceSettings: (settings) => 
        set((state) => ({ 
          workspace: { ...state.workspace, ...settings } 
        })),
      
      // Reset action
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'team-sync-settings',
      version: 1,
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarWidth: state.sidebarWidth,
        compactMode: state.compactMode,
        notifications: state.notifications,
        defaultView: state.defaultView,
        itemsPerPage: state.itemsPerPage,
        showCompletedTasks: state.showCompletedTasks,
        workspace: state.workspace,
      }),
    }
  )
)
