"use client"

import React from 'react'
import {
  Box,
  Typography,
  Paper,
} from '@mui/material'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  Send,
} from 'lucide-react'

export function ActivityFeed() {
  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Activity</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">1</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-4">
          {/* Show More */}
          <Button variant="ghost" size="sm" className="justify-start p-0 h-auto text-primary">
            <ChevronDown className="h-4 w-4 mr-1" />
            <span className="text-sm">Show more</span>
          </Button>

          {/* Activity Item */}
          <div className="p-3 bg-card rounded-md border border-border">
            <p className="text-sm text-foreground">
              You added follower: You
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Mar 8 at 12:05 am
            </p>
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            placeholder="Write a comment..."
            className="flex-1 min-h-[40px] resize-none"
          />
          <Button size="sm" className="h-10 w-10 p-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
