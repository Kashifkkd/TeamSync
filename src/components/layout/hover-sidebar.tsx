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
  ChevronDown,
  LogOut,
  BarChart3,
  MessageSquare,
  Calendar,
  Bell
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

interface User {
  id: string
  name?: string
  email?: string
  image?: string
}

interface Workspace {
  id: string
  name: string
  slug: string
  image?: string
}

interface HoverSidebarProps {
  user: User
  workspace: Workspace
}

const primaryNavigation = [
  { 
    id: "overview", 
    name: "Overview", 
    href: "", 
    icon: Home,
    description: "Project dashboard and analytics",
    hasSubmenu: false
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
    description: "Sprint and milestone planning",
    hasSubmenu: false
  },
  { 
    id: "team", 
    name: "Team", 
    href: "/team", 
    icon: Users,
    description: "Team members and collaboration",
    hasSubmenu: true
  },
  { 
    id: "analytics", 
    name: "Analytics", 
    href: "/analytics", 
    icon: BarChart3,
    description: "Reports and insights",
    hasSubmenu: true
  },
  { 
    id: "settings", 
    name: "Settings", 
    href: "/settings", 
    icon: Settings,
    description: "Workspace configuration",
    hasSubmenu: false
  },
]

const secondaryNavigation = {
  tasks: {
    title: "TASK MANAGEMENT", 
    sections: [
      { name: "All Tasks", href: "/tasks", icon: CheckSquare },
      { name: "My Tasks", href: "/tasks?assignee=me", icon: Users },
      { name: "In Progress", href: "/tasks?status=in_progress", icon: Target },
      { name: "Completed", href: "/tasks?status=done", icon: CheckSquare },
      { name: "Overdue", href: "/tasks?status=overdue", icon: Calendar },
    ]
  },
  team: {
    title: "TEAM MANAGEMENT",
    sections: [
      { name: "Members", href: "/team", icon: Users },
      { name: "Invitations", href: "/team/invitations", icon: MessageSquare },
      { name: "Roles", href: "/team/roles", icon: Settings },
    ]
  },
  analytics: {
    title: "ANALYTICS & REPORTS",
    sections: [
      { name: "Overview", href: "/analytics", icon: BarChart3 },
      { name: "Project Reports", href: "/analytics/projects", icon: FolderKanban },
      { name: "Team Performance", href: "/analytics/team", icon: Users },
      { name: "Time Tracking", href: "/analytics/time", icon: Calendar },
    ]
  },
}

export function HoverSidebar({ user, workspace }: HoverSidebarProps) {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)

  const baseUrl = `/workspace/${workspace.slug}`
  const currentPath = pathname.replace(baseUrl, "")

  const getActiveModule = () => {
    const current = primaryNavigation.find(item => 
      currentPath.startsWith(item.href) && item.href !== ""
    )
    return current?.id || "overview"
  }

  const activeModuleId = getActiveModule()
  const activeModule = primaryNavigation.find(item => item.id === activeModuleId)
  const hasSubmenu = activeModule?.hasSubmenu || false
  const secondaryConfig = hasSubmenu ? secondaryNavigation[activeModuleId as keyof typeof secondaryNavigation] : null
  const secondaryItems = secondaryConfig?.sections || []

  return (
    <div className="flex h-full relative">
      {/* Primary Sidebar - Fixed width, expands as overlay */}
      <div 
        className="w-16 flex flex-col bg-muted/50 border-r border-border relative z-30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Overlay expansion */}
        <div 
          className={cn(
            "absolute left-0 top-0 h-full bg-muted border-r border-border transition-all duration-300 ease-in-out z-40",
            isHovered ? "w-64 opacity-100" : "w-16 opacity-0 pointer-events-none"
          )}
        >
          {/* Expanded content */}
          <div className="p-2 space-y-2 h-full flex flex-col">
            <nav className="flex-1 space-y-2">
              {primaryNavigation.map((item) => {
                const isActive = activeModuleId === item.id
                const Icon = item.icon

                return (
                  <div key={item.id}>
                    <Link href={`${baseUrl}${item.href}`}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start h-10 relative",
                          isActive && "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="flex-1 text-left text-sm">{item.name}</span>
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r" />
                        )}
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </nav>

            {/* User Menu in overlay */}
            <div className="p-3 border-t border-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-auto p-2 hover:bg-muted/50 w-full justify-start">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.name || user.email || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.name || user.email}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
        </div>

        {/* Collapsed content */}
        <nav className="flex-1 p-2 space-y-2">
          {primaryNavigation.map((item) => {
            const isActive = activeModuleId === item.id
            const Icon = item.icon

            return (
              <div key={item.id}>
                <Link href={`${baseUrl}${item.href}`}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-center h-10 relative",
                      isActive && "bg-primary/10 text-primary",
                      "px-2"
                    )}
                    title={item.name}
                  >
                    <Icon className="h-5 w-5" />
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r" />
                    )}
                  </Button>
                </Link>
              </div>
            )
          })}
        </nav>

        {/* User Menu collapsed */}
        <div className="p-3 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto p-2 hover:bg-muted/50 w-full justify-center">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="text-xs">
                    {getInitials(user.name || user.email || "")}
                  </AvatarFallback>
                </Avatar>
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

       {/* Secondary Sidebar - Fixed position, only show if has submenu */}
       {hasSubmenu && (
         <div className="w-64 bg-card border-r border-border flex-shrink-0 relative z-20">
           <div className="p-6 border-b border-border">
             <h3 className="text-lg font-semibold text-foreground">
               {activeModule?.name}
             </h3>
             <p className="text-sm text-muted-foreground mt-1">
               {activeModule?.description}
             </p>
           </div>
           
           <nav className="p-6 space-y-8">
             {secondaryConfig && (
               <>
                 {/* Section Header */}
                 <div className="px-2">
                   <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                     {secondaryConfig.title}
                   </h4>
                 </div>
                 
                 {/* Section Items */}
                 <div className="space-y-2">
                   {secondaryItems.map((item, index) => {
                     const Icon = item.icon
                     const isActive = currentPath === item.href || 
                       (item.href !== "/projects" && currentPath.startsWith(item.href))

                     return (
                       <Link key={index} href={`${baseUrl}${item.href}`}>
                         <Button
                           variant={isActive ? "secondary" : "ghost"}
                           className={cn(
                             "w-full justify-start h-10 text-sm px-4",
                             isActive && "bg-primary/10 text-primary border-primary/20"
                           )}
                         >
                           <Icon className="h-4 w-4 mr-3" />
                           <span className="flex-1 text-left">{item.name}</span>
                         </Button>
                       </Link>
                     )
                   })}
                 </div>
               </>
             )}
           </nav>
         </div>
       )}
     </div>
   )
 }