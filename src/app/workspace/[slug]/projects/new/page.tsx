"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Palette } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProjectSchema, type CreateProjectInput } from "@/lib/validations"
import { generateProjectKey } from "@/lib/utils"

interface NewProjectPageProps {
  params: Promise<{ slug: string }>
}

const projectColors = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", 
  "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
]

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On Hold" },
  { value: "archived", label: "Archived" },
]

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

const visibilityOptions = [
  { value: "private", label: "Private", description: "Only team members can see this project" },
  { value: "internal", label: "Internal", description: "All workspace members can see this project" },
  { value: "public", label: "Public", description: "Anyone with the link can view this project" },
]

export default function NewProjectPage({ params }: NewProjectPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const [workspaceSlug, setWorkspaceSlug] = useState("")

  React.useEffect(() => {
    params.then(({ slug }) => setWorkspaceSlug(slug))
  }, [params])

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      key: "",
      description: "",
      status: "active",
      priority: "medium",
      visibility: "private",
      color: projectColors[0],
      startDate: "",
      endDate: "",
    },
  })

  const watchedName = form.watch("name")
  const watchedColor = form.watch("color")

  // Auto-generate project key from name
  React.useEffect(() => {
    if (watchedName) {
      const key = generateProjectKey(watchedName)
      form.setValue("key", key)
    }
  }, [watchedName, form])

  const onSubmit = async (data: CreateProjectInput) => {
    if (!workspaceSlug) return

    setIsLoading(true)
    setError("")

    try {
      // Get workspace ID first
      const workspaceResponse = await fetch(`/api/workspaces`)
      if (!workspaceResponse.ok) {
        throw new Error("Failed to get workspace")
      }
      
      const workspaces = await workspaceResponse.json()
      const workspace = workspaces.find((w: any) => w.slug === workspaceSlug)
      
      if (!workspace) {
        throw new Error("Workspace not found")
      }

      const response = await fetch(`/api/workspaces/${workspace.id}/projects`, {
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

      const project = await response.json()
      router.push(`/workspace/${workspaceSlug}/projects/${project.id}`)
      router.refresh()
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href={`/workspace/${workspaceSlug}/projects`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600">
            Set up a new project to organize tasks and collaborate with your team
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Provide the basic information for your project
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Website Redesign, Mobile App"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Key</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., WEB, MOB"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Used for task IDs (e.g., WEB-123)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Color</FormLabel>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-8 h-8 rounded-lg border-2 border-gray-300"
                            style={{ backgroundColor: watchedColor }}
                          />
                          <div className="grid grid-cols-5 gap-1">
                            {projectColors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className={`w-6 h-6 rounded border-2 ${
                                  watchedColor === color ? 'border-gray-400' : 'border-gray-200'
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => field.onChange(color)}
                              />
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what this project is about..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibility</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {visibilityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6">
                  <Link href={`/workspace/${workspaceSlug}/projects`}>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
