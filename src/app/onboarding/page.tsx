"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Users, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createWorkspaceSchema, type CreateWorkspaceInput } from "@/lib/validations"

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const form = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  })

  const watchedName = form.watch("name")

  // Auto-generate slug from name
  React.useEffect(() => {
    if (watchedName) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
      form.setValue("slug", slug)
    }
  }, [watchedName, form])

  const onSubmit = async (data: CreateWorkspaceInput) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || "Something went wrong")
        return
      }

      const workspace = await response.json()
      router.push(`/workspace/${workspace.slug}`)
      router.refresh()
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">TS</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">TeamSync</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to TeamSync!
          </h1>
          <p className="text-lg text-gray-600">
            Let's create your first workspace to get started
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center border-none shadow-md">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-sm">Organized Workspaces</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600">
                Keep your teams and projects organized in dedicated workspaces
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-md">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-sm">Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600">
                Invite team members and collaborate in real-time
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-md">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-sm">Smart Automation</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600">
                Automate workflows and boost productivity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Workspace Creation Form */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Create Your Workspace</CardTitle>
            <CardDescription>
              Your workspace is where your team will collaborate on projects and tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
                {error}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Acme Inc, My Team, Personal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace URL</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            teamsync.com/workspace/
                          </span>
                          <Input
                            placeholder="workspace-url"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What's this workspace for?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating workspace..." : "Create Workspace"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
