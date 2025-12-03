"use client"

import { useParams } from "next/navigation"
import { RoleManagement } from "@/components/team/role-management"
import { useWorkspace } from "@/hooks/use-workspace-data"
import { ROLE } from "@/lib/constants"

export default function RolesPage() {
    const params = useParams()
    const slug = params.slug as string
    
    const { data: workspace, isLoading } = useWorkspace(slug)

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-9 w-32 bg-muted animate-pulse rounded" />
                </div>
            </div>
        )
    }

    if (!workspace) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-4">Workspace Not Found</h1>
                <p className="text-muted-foreground">
                    The workspace you&apos;re looking for doesn&apos;t exist.
                </p>
            </div>
        )
    }

    if (workspace.userRole !== ROLE.OWNER && workspace.userRole !== ROLE.ADMIN) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
                <p className="text-muted-foreground">
                    You don&apos;t have permission to view role management.
                </p>
            </div>
        )
    }

    return (
        <RoleManagement
            workspaceId={workspace.id}
            currentUserRole={workspace.userRole}
        />
    )
}
