import {
    Home,
    FolderKanban,
    Target,
    CheckSquare,
    Users,
    Settings,
    BarChart3,
    Calendar,
    FileText,
    Mail
} from "lucide-react"

export interface SidebarItem {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    description?: string
    badge?: string | number
    disabled?: boolean
}

export interface SidebarSection {
    title: string
    topSections?: SidebarItem[]
    sections?: SidebarItem[]
    bottomSections?: SidebarItem[]
}

export interface ModuleConfig {
    id: string
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    description: string
    hasSubmenu: boolean
    getSecondaryNavigation: (data?: unknown) => SidebarSection
    getData?: (workspaceSlug: string) => Promise<unknown>
}

// Primary navigation items
export const primaryNavigation: ModuleConfig[] = [
    {
        id: "overview",
        name: "Overview",
        href: "",
        icon: Home,
        description: "Workspace dashboard and overview",
        hasSubmenu: false,
        getSecondaryNavigation: () => ({
            title: "OVERVIEW",
            sections: []
        })
    },
    {
        id: "projects",
        name: "Projects",
        href: "/projects",
        icon: FolderKanban,
        description: "Manage your projects",
        hasSubmenu: true,
        getSecondaryNavigation: (projects: unknown = []) => ({
            title: "PROJECTS",
            topSections: [
                { name: "All Projects", href: "/projects?status=all", icon: FolderKanban },
                { name: "Active", href: "/projects?status=active", icon: CheckSquare },
                { name: "Archived", href: "/projects?status=archived", icon: FileText },
            ],
            sections: Array.isArray(projects) ? projects.map((project: Record<string, unknown>) => ({
                name: String(project.name || ''),
                href: `/projects/${project.id}`,
                icon: FolderKanban,
                description: String(project.description || ''),
                badge: project.status === 'active' ? 'Active' : undefined
            })) : [],
            bottomSections: []
        })
    },
    {
        id: "milestones",
        name: "Milestones",
        href: "/milestones",
        icon: Target,
        description: "Track project milestones and sprints",
        hasSubmenu: true,
        getSecondaryNavigation: (milestones: unknown = []) => ({
            title: "MILESTONES",
            topSections: [
                { name: "All Milestones", href: "/milestones", icon: Target },
                { name: "Analytics", href: "/milestones/analytics", icon: BarChart3 },
            ],
            sections: Array.isArray(milestones) ? milestones.map((milestone: Record<string, unknown>) => ({
                name: String(milestone.name || ''),
                href: `/milestones/${milestone.id}`,
                icon: Target,
                description: String((milestone.project as Record<string, unknown>)?.name || ''),
                badge: milestone.status === 'active' ? 'Active' : String(milestone.status || '')
            })) : [],
            bottomSections: [
                { name: "Backlog", href: "/milestones/backlog", icon: FolderKanban },
                { name: "Current Sprint", href: "/milestones/current", icon: Calendar },
            ]
        })
    },
    {
        id: "tasks",
        name: "Tasks",
        href: "/tasks",
        icon: CheckSquare,
        description: "Manage tasks and assignments",
        hasSubmenu: true,
        getSecondaryNavigation: () => ({
            title: "TASKS",
            topSections: [
                { name: "All Tasks", href: "/tasks", icon: CheckSquare },
                { name: "My Tasks", href: "/tasks?assignee=me", icon: Users },
                { name: "In Progress", href: "/tasks?status=in_progress", icon: Target },
                { name: "Completed", href: "/tasks?status=done", icon: CheckSquare },
                { name: "Overdue", href: "/tasks?status=overdue", icon: Calendar },
            ],
            sections: [],
            bottomSections: []
        })
    },
    {
        id: "team",
        name: "Team",
        href: "/team",
        icon: Users,
        description: "Manage team members and permissions",
        hasSubmenu: true,
        getSecondaryNavigation: () => ({
            title: "TEAM MANAGEMENT",
            topSections: [
                { name: "Members", href: "/team", icon: Users },
                { name: "Invitations", href: "/team/invitations", icon: Mail },
                { name: "Roles", href: "/team/roles", icon: Settings },
            ],
            sections: [],
            bottomSections: []
        })
    },
    {
        id: "analytics",
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        description: "View reports and analytics",
        hasSubmenu: true,
        getSecondaryNavigation: () => ({
            title: "ANALYTICS & REPORTS",
            topSections: [
                { name: "Overview", href: "/analytics", icon: BarChart3 },
                { name: "Project Reports", href: "/analytics/projects", icon: FolderKanban },
                { name: "Team Performance", href: "/analytics/team", icon: Users },
                { name: "Time Tracking", href: "/analytics/time", icon: Calendar },
            ],
            sections: [],
            bottomSections: []
        })
    },
    {
        id: "settings",
        name: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Workspace configuration",
        hasSubmenu: false,
        getSecondaryNavigation: () => ({
            title: "SETTINGS",
            sections: []
        })
    }
]

// Helper function to get module config by ID
export function getModuleConfig(moduleId: string): ModuleConfig | undefined {
    return primaryNavigation.find(moduleConfig => moduleConfig.id === moduleId)
}

// Helper function to get active module based on pathname
export function getActiveModule(pathname: string, baseUrl: string): ModuleConfig {
    const currentPath = pathname.replace(baseUrl, "")

    const moduleConfig = primaryNavigation.find(item =>
        currentPath.startsWith(item.href) && item.href !== ""
    )

    return moduleConfig || primaryNavigation[0] // Default to overview
}

// Data fetching functions for each module
export const moduleDataFetchers = {
    projects: async (workspaceSlug: string) => {
        const response = await fetch(`/api/workspaces/${workspaceSlug}/projects`)
        if (!response.ok) throw new Error("Failed to fetch projects")
        const data = await response.json()
        return data.projects || []
    },

    milestones: async (workspaceSlug: string) => {
        const response = await fetch(`/api/workspaces/${workspaceSlug}/milestones`)
        if (!response.ok) throw new Error("Failed to fetch milestones")
        const data = await response.json()
        return data.milestones || []
    },

    // Add more data fetchers as needed
    team: async () => {
        // Team data fetching logic
        return []
    },

    tasks: async () => {
        // Tasks data fetching logic
        return []
    },

    analytics: async () => {
        // Analytics data fetching logic
        return []
    }
}
