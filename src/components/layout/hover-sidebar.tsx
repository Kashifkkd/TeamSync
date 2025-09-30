"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useMilestones } from "@/hooks/use-milestones"
import { useProjects } from "@/hooks/use-projects"
import { 
  Home, 
  FolderKanban,
  Target, 
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Status color mapping for milestone indicators
const statusColors = {
  active: "bg-green-500",
  upcoming: "bg-blue-500", 
  completed: "bg-gray-500",
  paused: "bg-yellow-500"
}

// Navigation item interface
interface NavigationItem {
  name: string
  href: string
  icon: any
  status?: string
}

// Secondary navigation interface
interface SecondaryNavigation {
  title: string
  topSections?: NavigationItem[]
  sections: NavigationItem[]
  bottomSections?: NavigationItem[]
}
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

interface Milestone {
  id: string
  name: string
  status: "active" | "upcoming" | "completed" | "paused"
  project?: {
    name: string
    color: string
  }
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
    id: "milestones", 
    name: "Milestones", 
    href: "/milestones", 
    icon: Target,
    description: "Sprint and milestone planning",
    hasSubmenu: true
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

const getSecondaryNavigation = (milestones: Milestone[]) => ({
  milestones: {
    title: "MILESTONES", 
    topSections: [
      { name: "All Milestones", href: "/milestones", icon: Target },
      { name: "Analytics", href: "/milestones/analytics", icon: BarChart3 },
    ],
    sections: milestones.map(milestone => ({
      name: milestone.name,
      href: `/milestones/${milestone.id}`,
      icon: Target,
      status: milestone.status,
      project: milestone.project
    })),
    bottomSections: [
      { name: "Backlog", href: "/milestones/backlog", icon: FolderKanban },
      { name: "Current Sprint", href: "/milestones/current", icon: Calendar },
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
})

export function HoverSidebar({ user, workspace }: HoverSidebarProps) {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)

  const baseUrl = `/workspace/${workspace.slug}`
  const currentPath = pathname.replace(baseUrl, "")

  // Use TanStack Query for milestones and projects
  const { data: milestonesData, isLoading: loading, error } = useMilestones(workspace.slug)
  const { data: projectsData, isLoading: projectsLoading } = useProjects(workspace.slug)
  const milestones = milestonesData?.milestones || []
  const projects = projectsData?.projects || []

  const getActiveModule = () => {
    const current = primaryNavigation.find(item => 
      currentPath.startsWith(item.href) && item.href !== ""
    )
    return current?.id || "overview"
  }

  const activeModuleId = getActiveModule()
  const activeModule = primaryNavigation.find(item => item.id === activeModuleId)
  const hasSubmenu = activeModule?.hasSubmenu || false
  const secondaryNavigation = getSecondaryNavigation(milestones)
  const secondaryConfig = hasSubmenu ? secondaryNavigation[activeModuleId as keyof typeof secondaryNavigation] : null
  const topItems = secondaryConfig?.topSections || []
  const secondaryItems = secondaryConfig?.sections || []
  const bottomItems = secondaryConfig?.bottomSections || []

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
         <div className="w-52 bg-card border-r border-border flex-shrink-0 relative z-20">
           <div className="px-5 pt-5">
             <h3 className="text-lg font-semibold text-foreground">
               {activeModule?.name}
             </h3>
           </div>
           
           <nav className="p-5 space-y-6">
             {secondaryConfig && (
               <>
                 {/* Top Section Items */}
                 {topItems.length > 0 && (
                   <>
                     <div className="space-y-2 mb-4">
                       {topItems.map((item, index) => {
                         const Icon = item.icon
                         const isActive = currentPath === item.href

                         return (
                         <Link key={`top-${index}`} href={`${baseUrl}${item.href}`}>
                           <TooltipProvider>
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <Button
                                   variant={isActive ? "secondary" : "ghost"}
                                   className={cn(
                                     "w-full justify-start h-10 text-sm px-4",
                                     isActive && "bg-primary/10 text-primary border-primary/20"
                                   )}
                                 >
                                   <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                                   <span className="flex-1 text-left truncate">{item.name}</span>
                                 </Button>
                               </TooltipTrigger>
                               <TooltipContent>
                                 <p>{item.name}</p>
                               </TooltipContent>
                             </Tooltip>
                           </TooltipProvider>
                         </Link>
                         )
                       })}
                     </div>
                     <div className="border-b border-border -mx-5"></div>
                   </>
                 )}

                 {/* Section Items */}
                 <div className="space-y-2">
                   {loading ? (
                     // Loading skeleton for milestones
                     Array.from({ length: 3 }).map((_, index) => (
                       <div key={index} className="flex items-center space-x-3 h-10 px-4">
                         <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
                         <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
                         <div className="flex-1 h-4 bg-gray-300 rounded animate-pulse" />
                       </div>
                     ))
                   ) : error ? (
                     // Error state
                     <div className="text-center py-4 px-4">
                       <div className="text-sm text-red-600">
                         Failed to load milestones
                       </div>
                       <div className="text-xs text-muted-foreground mt-1">
                         Try refreshing the page
                       </div>
                     </div>
                   ) : projectsLoading ? (
                     // Loading projects check
                     <div className="text-center py-4 px-4">
                       <div className="text-xs text-muted-foreground">
                         Checking projects...
                       </div>
                     </div>
                   ) : projects.length === 0 ? (
                     // No projects state
                     <div className="text-center py-4 px-4">
                       <FolderKanban className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                       <div className="text-sm text-muted-foreground">
                         No projects yet
                       </div>
                       <div className="text-xs text-muted-foreground/70 mt-1">
                         Create a project first
                       </div>
                     </div>
                   ) : milestones.length === 0 ? (
                     // No milestones state (but projects exist)
                     <div className="text-center py-4 px-4">
                       <Target className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                       <div className="text-sm text-muted-foreground">
                         No milestones yet
                       </div>
                       <div className="text-xs text-muted-foreground/70 mt-1">
                         Create your first milestone
                       </div>
                     </div>
                   ) : (
                     secondaryItems.map((item, index) => {
                       const Icon = item.icon
                       const isActive = currentPath === item.href
                       const status = (item as any).status
                       const project = (item as any).project

                       return (
                         <Link key={index} href={`${baseUrl}${item.href}`}>
                           <TooltipProvider>
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <Button
                                   variant={isActive ? "secondary" : "ghost"}
                                   className={cn(
                                     "w-full justify-start h-10 text-sm px-4",
                                     isActive && "bg-primary/10 text-primary border-primary/20"
                                   )}
                                 >
                                   <div className="flex items-center space-x-3 w-full min-w-0">
                                     {/* Status indicator */}
                                     {status && (
                                       <div className={cn(
                                         "w-2 h-2 rounded-full flex-shrink-0",
                                         statusColors[status as keyof typeof statusColors] || "bg-gray-500"
                                       )} />
                                     )}
                                     <Icon className="h-4 w-4 flex-shrink-0" />
                                     <div className="flex-1 text-left min-w-0">
                                       <div className="truncate">{item.name}</div>
                                       {project && (
                                         <div className="text-xs text-muted-foreground truncate">
                                           {project.name}
                                         </div>
                                       )}
                                     </div>
                                   </div>
                                 </Button>
                               </TooltipTrigger>
                               <TooltipContent>
                                 <div>
                                   <p className="font-medium">{item.name}</p>
                                   {project && (
                                     <p className="text-sm text-muted-foreground">{project.name}</p>
                                   )}
                                   {status && (
                                     <p className="text-xs text-muted-foreground capitalize">{status}</p>
                                   )}
                                 </div>
                               </TooltipContent>
                             </Tooltip>
                           </TooltipProvider>
                         </Link>
                       )
                     })
                   )}
                 </div>

                 {/* Bottom Sections */}
                 {bottomItems.length > 0 && (
                   <>
                     <div className="border-t border-border -mx-5 mt-8 mb-4"></div>
                     <div className="space-y-2">
                       {bottomItems.map((item, index) => {
                         const Icon = item.icon
                         const isActive = currentPath === item.href

                         return (
                           <Link key={`bottom-${index}`} href={`${baseUrl}${item.href}`}>
                             <TooltipProvider>
                               <Tooltip>
                                 <TooltipTrigger asChild>
                                   <Button
                                     variant={isActive ? "secondary" : "ghost"}
                                     className={cn(
                                       "w-full justify-start h-10 text-sm px-4",
                                       isActive && "bg-primary/10 text-primary border-primary/20"
                                     )}
                                   >
                                     <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                                     <span className="flex-1 text-left truncate">{item.name}</span>
                                   </Button>
                                 </TooltipTrigger>
                                 <TooltipContent>
                                   <p>{item.name}</p>
                                 </TooltipContent>
                               </Tooltip>
                             </TooltipProvider>
                           </Link>
                         )
                       })}
                     </div>
                   </>
                 )}
               </>
             )}
           </nav>
         </div>
       )}
     </div>
   )
 }