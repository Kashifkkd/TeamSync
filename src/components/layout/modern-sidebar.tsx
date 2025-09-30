"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { 
  Home, 
  FolderKanban, 
  Target, 
  CheckSquare, 
  Users, 
  Settings, 
  Plus,
  ChevronDown,
  LogOut,
  BarChart3,
  MessageSquare,
  Calendar,
  FileText,
  Bell,
  Menu,
  X
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInitials } from "@/lib/utils"

interface Workspace {
  id: string
  name: string
  slug: string
  image?: string
  color?: string
}

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface Project {
  id: string
  name: string
  key: string
  color: string
}

interface ModernSidebarProps {
  workspace: Workspace
  user: User
  projects?: Project[]
  workspaces?: Workspace[]
}

const primaryNavigation = [
  { 
    id: "overview", 
    name: "Overview", 
    href: "", 
    icon: Home,
    description: "Project dashboard and analytics"
  },
  { 
    id: "projects", 
    name: "Projects", 
    href: "/projects", 
    icon: FolderKanban,
    description: "Manage your projects",
    hasSubmenu: true
  },
  { 
    id: "tasks", 
    name: "Tasks", 
    href: "/tasks", 
    icon: CheckSquare,
    description: "Task management and tracking",
    hasSubmenu: true
  },
  { 
    id: "milestones", 
    name: "Milestones", 
    href: "/milestones", 
    icon: Target,
    description: "Sprint and milestone planning"
  },
  { 
    id: "team", 
    name: "Team", 
    href: "/team", 
    icon: Users,
    description: "Team members and collaboration"
  },
  { 
    id: "analytics", 
    name: "Analytics", 
    href: "/analytics", 
    icon: BarChart3,
    description: "Reports and insights"
  },
  { 
    id: "settings", 
    name: "Settings", 
    href: "/settings", 
    icon: Settings,
    description: "Workspace configuration"
  },
]

const secondaryNavigation = {
  projects: [
    { name: "All Projects", href: "/projects", icon: FolderKanban },
    { name: "Active", href: "/projects?status=active", icon: CheckSquare },
    { name: "Archived", href: "/projects?status=archived", icon: FileText },
    { name: "Templates", href: "/projects/templates", icon: FileText },
  ],
  tasks: [
    { name: "All Tasks", href: "/tasks", icon: CheckSquare },
    { name: "My Tasks", href: "/tasks?assignee=me", icon: Users },
    { name: "In Progress", href: "/tasks?status=in_progress", icon: Target },
    { name: "Completed", href: "/tasks?status=done", icon: CheckSquare },
    { name: "Overdue", href: "/tasks?status=overdue", icon: Calendar },
  ],
  team: [
    { name: "Members", href: "/team", icon: Users },
    { name: "Invitations", href: "/team/invitations", icon: MessageSquare },
    { name: "Roles", href: "/team/roles", icon: Settings },
  ],
  analytics: [
    { name: "Overview", href: "/analytics", icon: BarChart3 },
    { name: "Project Reports", href: "/analytics/projects", icon: FolderKanban },
    { name: "Team Performance", href: "/analytics/team", icon: Users },
    { name: "Time Tracking", href: "/analytics/time", icon: Calendar },
  ],
}

export function ModernSidebar({ workspace, user, workspaces = [] }: ModernSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const baseUrl = `/workspace/${workspace.slug}`
  const currentPath = pathname.replace(baseUrl, "")

  const getActiveModule = () => {
    const current = primaryNavigation.find(item => 
      currentPath.startsWith(item.href) && item.href !== ""
    )
    return current?.id || "overview"
  }

  const activeModuleId = getActiveModule()
  const secondaryItems = secondaryNavigation[activeModuleId as keyof typeof secondaryNavigation] || []

  return (
    <div className="flex h-full">
      {/* Primary Sidebar */}
      <div className={cn(
        "flex flex-col bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-primary-foreground font-bold text-sm">TS</span>
                </div>
                <span className="text-lg font-semibold text-foreground">TeamSync</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-muted/50"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Workspace Switcher */}
        <div className="p-4 border-b border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto p-0 hover:bg-muted/50 w-full justify-start">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-primary-foreground font-semibold text-sm">
                      {getInitials(workspace.name)}
                    </span>
                  </div>
                  {!isCollapsed && (
                    <>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {workspace.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Workspace</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Switch Workspace</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces.map((ws) => (
                <DropdownMenuItem key={ws.id} asChild>
                  <Link href={`/workspace/${ws.slug}`} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {getInitials(ws.name)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{ws.name}</p>
                      <p className="text-xs text-muted-foreground">{ws.slug}</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {primaryNavigation.map((item) => {
            const isActive = activeModuleId === item.id
            const Icon = item.icon

            return (
              <div key={item.id}>
                <Link href={`${baseUrl}${item.href}`}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-10",
                      isActive && "bg-primary/10 text-primary border-primary/20",
                      isCollapsed && "px-2"
                    )}
                    onClick={() => {}}
                  >
                    <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && (
                      <span className="flex-1 text-left">{item.name}</span>
                    )}
                    {!isCollapsed && item.hasSubmenu && (
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    )}
                  </Button>
                </Link>
              </div>
            )
          })}
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto p-0 hover:bg-muted/50 w-full justify-start">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Secondary Sidebar */}
      {!isCollapsed && secondaryItems.length > 0 && (
        <div className="w-64 bg-muted/30 border-r border-border">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">
              {primaryNavigation.find(item => item.id === activeModuleId)?.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {primaryNavigation.find(item => item.id === activeModuleId)?.description}
            </p>
          </div>
          
          <nav className="p-2 space-y-1">
            {secondaryItems.map((item, index) => {
              const Icon = item.icon
              const isActive = currentPath === item.href || 
                (item.href !== "/projects" && currentPath.startsWith(item.href))

              return (
                <Link key={index} href={`${baseUrl}${item.href}`}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-9 text-sm",
                      isActive && "bg-primary/10 text-primary border-primary/20"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <span className="flex-1 text-left">{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          {activeModuleId === "projects" && (
            <div className="p-4 border-t border-border">
              <Button className="w-full btn-primary" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
