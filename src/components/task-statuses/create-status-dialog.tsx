"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Palette, X } from "lucide-react"

interface CreateStatusDialogProps {
  onStatusCreate: (status: {
    name: string
    color: string
    bgColor: string
    textColor: string
    badgeColor: string
  }) => void
}

const colorOptions = [
  { name: "Gray", color: "#6b7280", bgColor: "#f9fafb", textColor: "#1f2937", badgeColor: "#6b7280" },
  { name: "Blue", color: "#3b82f6", bgColor: "#eff6ff", textColor: "#1e40af", badgeColor: "#3b82f6" },
  { name: "Purple", color: "#8b5cf6", bgColor: "#faf5ff", textColor: "#7c3aed", badgeColor: "#8b5cf6" },
  { name: "Orange", color: "#f59e0b", bgColor: "#fffbeb", textColor: "#d97706", badgeColor: "#f59e0b" },
  { name: "Yellow", color: "#eab308", bgColor: "#fefce8", textColor: "#a16207", badgeColor: "#eab308" },
  { name: "Pink", color: "#ec4899", bgColor: "#fdf2f8", textColor: "#be185d", badgeColor: "#ec4899" },
  { name: "Indigo", color: "#6366f1", bgColor: "#eef2ff", textColor: "#4338ca", badgeColor: "#6366f1" }
]

const statusSuggestions = [
  "To Do", "In Progress", "Done", "Blocked", "In Review", "Testing", "Ready for QA", "In QA",
  "Approved", "Rejected", "On Hold", "Cancelled", "Pending", "Draft", "Published", "Archived",
  "New", "Assigned", "Started", "Completed", "Failed", "Passed", "Under Review", "Needs Attention",
  "In Development", "Code Review", "Deployed", "Rollback", "Hotfix", "Feature Complete", "Bug Fix",
  "Enhancement", "Maintenance", "Research", "Planning", "Design", "Implementation", "Documentation",
  "Testing Phase", "User Acceptance", "Production Ready", "Staging", "Live", "Beta", "Alpha",
  "Experimental", "Deprecated", "Legacy", "Modern", "Updated", "Refactored", "Optimized",
  "Performance", "Security", "Accessibility", "Compatibility", "Integration", "Migration",
  "Upgrade", "Downgrade", "Rollout", "Pilot", "Trial", "Demo", "Prototype", "MVP",
  "Version 1.0", "Version 2.0", "Hotfix 1.1", "Patch", "Release Candidate", "Final",
  "Pre-Release", "Post-Release", "Maintenance Mode", "Emergency", "Critical", "High Priority",
  "Medium Priority", "Low Priority", "No Priority", "Urgent", "Important", "Nice to Have",
  "Must Have", "Should Have", "Could Have", "Won't Have", "Future", "Backlog", "Sprint Ready",
  "Sprint Planning", "Sprint Review", "Sprint Retrospective", "Daily Standup", "Grooming",
  "Estimation", "Story Points", "Epic", "User Story", "Task", "Subtask", "Bug", "Issue",
  "Defect", "Enhancement Request", "Feature Request", "Improvement", "Optimization",
  "Refactoring", "Code Cleanup", "Technical Debt", "Documentation Update", "Training",
  "Knowledge Transfer", "Handover", "Onboarding", "Offboarding", "Setup", "Configuration",
  "Installation", "Deployment", "Monitoring", "Alerting", "Logging", "Debugging", "Troubleshooting"
]

export function CreateStatusDialog({ onStatusCreate }: CreateStatusDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [customColor, setCustomColor] = useState("#3b82f6")
  const [useCustomColor, setUseCustomColor] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState(statusSuggestions)
  const [randomSuggestions, setRandomSuggestions] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const colorToUse = useCustomColor ? {
      name: "Custom",
      color: customColor,
      bgColor: `${customColor}15`, // 15% opacity
      textColor: customColor,
      badgeColor: customColor
    } : selectedColor

    onStatusCreate({
      name: name.toUpperCase(),
      color: `bg-[${colorToUse.color}]`,
      bgColor: `bg-[${colorToUse.bgColor}]`,
      textColor: `text-[${colorToUse.textColor}]`,
      badgeColor: `bg-[${colorToUse.badgeColor}]`
    })

    setName("")
    setSelectedColor(colorOptions[0])
    setUseCustomColor(false)
    setOpen(false)
  }

  const currentColor = useCustomColor ? {
    name: "Custom",
    color: customColor,
    bgColor: `${customColor}15`,
    textColor: customColor,
    badgeColor: customColor
  } : selectedColor

  const handleNameChange = (value: string) => {
    setName(value)
    if (value.trim()) {
      const filtered = statusSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setName(suggestion)
    setShowSuggestions(false)
  }

  const generateRandomSuggestions = () => {
    const shuffled = [...statusSuggestions].sort(() => 0.5 - Math.random())
    setRandomSuggestions(shuffled.slice(0, 5))
  }

  const handleRandomSuggestionClick = (suggestion: string) => {
    setName(suggestion)
    setShowSuggestions(false)
  }

  const handleClickOutside = () => {
    setShowSuggestions(false)
  }

  // Generate initial random suggestions
  useEffect(() => {
    generateRandomSuggestions()
  }, [])

  return (
    <>
      <Button 
        variant="ghost" 
        className="w-full h-12 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add group
      </Button>
      
      {/* Dialog Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="fixed inset-0 bg-black/50" 
          onClick={() => setOpen(false)}
        />
        
         {/* Dialog Content */}
         <div className="relative bg-background border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-primary rounded text-white">
                <Palette className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Create Status</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="p-4" onClick={handleClickOutside}>
            <form onSubmit={handleSubmit} className="space-y-4">
               {/* Status Name */}
               <div className="relative">
                 <Label htmlFor="name" className="text-sm font-medium mb-2 block">Status Name</Label>
                 <div className="flex-1 relative">
                   <Input
                     id="name"
                     placeholder="e.g., In Review, Blocked..."
                     value={name}
                     onChange={(e) => handleNameChange(e.target.value)}
                     onFocus={() => setShowSuggestions(true)}
                     className="h-10"
                   />
                   
                   {/* Suggestions Dropdown */}
                   {showSuggestions && filteredSuggestions.length > 0 && (
                     <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                       {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
                         <button
                           key={index}
                           type="button"
                           onClick={() => handleSuggestionClick(suggestion)}
                           className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors"
                         >
                           {suggestion}
                         </button>
                       ))}
                     </div>
                   )}
                 </div>
                 
                 {/* Random Suggestions */}
                 <div className="mt-3">
                   <div className="flex items-center justify-between mb-2">
                     <Label className="text-sm font-medium">Quick Suggestions</Label>
                     <Button
                       type="button"
                       variant="ghost"
                       size="sm"
                       onClick={generateRandomSuggestions}
                       className="h-6 px-2 text-xs"
                     >
                       Refresh
                     </Button>
                   </div>
                   <div className="flex gap-2 flex-wrap">
                     {randomSuggestions.map((suggestion, index) => (
                       <button
                         key={index}
                         type="button"
                         onClick={() => handleRandomSuggestionClick(suggestion)}
                         className="px-2 py-1 rounded-sm text-xs font-medium border border-border hover:bg-muted/50 transition-colors"
                       >
                         {suggestion}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
              
               {/* Color Selection */}
               <div>
                 <Label className="text-sm font-medium mb-2 block">Color</Label>
                 <div className="flex gap-2 mb-3 flex-wrap">
                   {colorOptions.map((color) => (
                     <button
                       key={color.name}
                       type="button"
                       onClick={() => {
                         setSelectedColor(color)
                         setUseCustomColor(false)
                       }}
                       className={`px-2 py-1 rounded-sm text-xs font-medium transition-all border-2 flex items-center gap-2 ${
                         selectedColor.name === color.name 
                           ? 'ring-2 ring-offset-2 ring-primary' 
                           : 'hover:opacity-80'
                       }`}
                       style={{
                         backgroundColor: color.bgColor,
                         color: color.textColor,
                         borderColor: selectedColor.name === color.name ? color.color : color.color + '40'
                       }}
                     >
                       <div 
                         className="w-2 h-2 rounded-full"
                         style={{ backgroundColor: color.color }}
                       />
                       <span className="text-xs">{color.name}</span>
                     </button>
                   ))}
                 </div>
                 
                 {/* Custom Color Option */}
                 <div className="flex gap-2 mb-3 items-center">
                   <button
                     type="button"
                     onClick={() => setUseCustomColor(true)}
                     className={`px-2 py-1 rounded-sm text-xs font-medium transition-all border-2 flex items-center gap-2 ${
                       useCustomColor 
                         ? 'ring-2 ring-offset-2 ring-primary' 
                         : 'hover:opacity-80'
                     }`}
                     style={{
                       backgroundColor: useCustomColor ? customColor + '15' : '#f3f4f6',
                       color: useCustomColor ? customColor : '#6b7280',
                       borderColor: useCustomColor ? customColor : '#d1d5db'
                     }}
                   >
                     <div 
                       className="w-2 h-2 rounded-full"
                       style={{ backgroundColor: useCustomColor ? customColor : '#9ca3af' }}
                     />
                     <span className="text-xs">Custom</span>
                   </button>
                   
                   {/* Custom Color Picker - In same row */}
                   {useCustomColor && (
                     <>
                       <input
                         type="color"
                         value={customColor}
                         onChange={(e) => setCustomColor(e.target.value)}
                         className="w-8 h-8 border-none rounded cursor-pointer"
                       />
                       <Input
                         value={customColor}
                         onChange={(e) => setCustomColor(e.target.value)}
                         placeholder="#000000"
                         className="h-8 text-xs w-20"
                       />
                     </>
                   )}
                 </div>
              </div>

              {/* Preview */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Preview</Label>
                <div 
                  className="px-3 py-2 rounded border"
                  style={{
                    backgroundColor: currentColor.bgColor,
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: currentColor.color }}
                      />
                      <span 
                        className="text-xs font-semibold"
                        style={{ color: currentColor.textColor }}
                      >
                        {name || "STATUS NAME"}
                      </span>
                      <Badge 
                        className="text-xs px-1.5 py-0.5 min-w-4 h-4 flex items-center justify-center"
                        style={{ 
                          backgroundColor: currentColor.badgeColor,
                          color: 'white'
                        }}
                      >
                        0
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0 border border-dashed"
                      style={{ 
                        borderColor: currentColor.color,
                        color: currentColor.color
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="flex justify-end gap-2 p-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-9 px-4"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="h-9 px-6"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
      )}
    </>
  )
}
