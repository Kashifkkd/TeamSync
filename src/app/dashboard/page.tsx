import { redirect } from "next/navigation"
import { requireAuth, getUserWorkspaces } from "@/lib/auth-utils"

export default async function DashboardPage() {
  const user = await requireAuth()
  const workspaces = await getUserWorkspaces(user.id)

  // If user has workspaces, redirect to the first one
  if (workspaces.length > 0) {
    redirect(`/workspace/${workspaces[0].slug}`)
  }

  // If no workspaces, redirect to onboarding
  redirect("/onboarding")
}
