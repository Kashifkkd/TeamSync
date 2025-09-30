"use client"

import React from 'react'
import {
  Box,
  Typography,
} from '@mui/material'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function CustomFields() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Custom Fields</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create a field on this location
        </Button>
      </div>
    </div>
  )
}
