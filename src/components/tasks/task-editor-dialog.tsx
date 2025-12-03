"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogProps,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { TaskEditor } from './task-editor'

interface TaskEditorDialogProps extends Omit<DialogProps, 'children'> {
  taskId?: string
  milestoneId?: string
  projectId?: string
  workspaceId?: string
  onTaskSave?: (task: unknown) => void
  onTaskDelete?: (taskId: string) => void
}

export function TaskEditorDialog({
  open,
  onClose,
  taskId,
  milestoneId,
  projectId,
  workspaceId,
  onTaskSave,
  onTaskDelete,
  ...dialogProps
}: TaskEditorDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      fullScreen={fullScreen}
      sx={{
        '& .MuiDialog-paper': {
          width: '95vw',
          height: '95vh',
          maxWidth: 'none',
          maxHeight: 'none',
          margin: '5vh auto',
          borderRadius: 2,
        },
      }}
      {...dialogProps}
    >
      <DialogContent sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
        <TaskEditor
          taskId={taskId}
          milestoneId={milestoneId}
          projectId={projectId}
          workspaceId={workspaceId}
          onTaskSave={onTaskSave}
          onTaskDelete={onTaskDelete}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
