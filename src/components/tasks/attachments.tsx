"use client"

import React from 'react'
import {
  Box,
  Typography,
  Paper,
} from '@mui/material'
import { Paperclip } from 'lucide-react'

export function Attachments() {
  return (
    <div>
      <h3 className="text-sm font-medium mb-4">Attachments</h3>
      <div className="p-8 text-center border-2 border-dashed border-border rounded-md bg-transparent">
        <Paperclip size={32} className="text-muted-foreground mb-2 mx-auto" />
        <p className="text-sm text-muted-foreground">
          No attachments yet
        </p>
      </div>
    </div>
  )
}
