"use client"

import React, { useState } from 'react'
import {
  Box,
  Typography,
} from '@mui/material'
import { Button } from '@/components/ui/button'
import {
  FileText,
  CheckSquare,
  MessageSquare,
  Sparkles,
} from 'lucide-react'

export function TaskTabs() {
  const [activeTab, setActiveTab] = useState('details')

  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'subtasks', label: 'Subtasks', icon: CheckSquare },
    { id: 'actionItems', label: 'Action Items', icon: MessageSquare },
  ]

  return (
    <div className="space-y-4">
      {/* Description and AI Options */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-primary text-sm"
        >
          <FileText className="h-4 w-4 mr-2" />
          Add description
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary text-sm"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Write with AI
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-normal rounded-none pb-1 px-0 ${
                  activeTab === tab.id 
                    ? 'text-primary font-medium border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {tab.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'details' && (
          <p className="text-sm text-muted-foreground">
            Task details content will go here...
          </p>
        )}
        {activeTab === 'subtasks' && (
          <p className="text-sm text-muted-foreground">
            Subtasks content will go here...
          </p>
        )}
        {activeTab === 'actionItems' && (
          <p className="text-sm text-muted-foreground">
            Action items content will go here...
          </p>
        )}
      </div>
    </div>
  )
}
