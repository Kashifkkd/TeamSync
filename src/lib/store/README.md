# Zustand Store Setup

This directory contains the Zustand state management setup for the Team Sync application.

## Structure

```
src/lib/store/
├── index.ts          # Main store exports
├── settings.ts       # Settings store (theme, UI preferences, notifications)
├── home.ts          # Home/Dashboard store (recent data, analytics)
├── project.ts       # Project store (projects, members, settings)
├── types.ts         # Shared TypeScript types
└── README.md        # This file
```

## Stores

### 1. Settings Store (`useSettingsStore`)
Manages application-wide settings and preferences:
- Theme (light/dark/system)
- Sidebar state and width
- Notification preferences
- View preferences
- Workspace settings (timezone, date format, etc.)

**Usage:**
```typescript
import { useSettings } from '@/hooks/use-store'

function MyComponent() {
  const { theme, setTheme, toggleSidebar } = useSettings()
  
  return (
    <div>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
    </div>
  )
}
```

### 2. Home Store (`useHomeStore`)
Manages dashboard and home page data:
- Recent projects, tasks, milestones
- Team members
- Analytics data
- UI state for home page

**Usage:**
```typescript
import { useHome } from '@/hooks/use-store'

function Dashboard() {
  const { dashboard, ui, refreshDashboard } = useHome()
  
  useEffect(() => {
    refreshDashboard()
  }, [])
  
  return (
    <div>
      {ui.isLoading ? 'Loading...' : (
        <div>
          <h2>Recent Projects: {dashboard.recentProjects.length}</h2>
          <h2>Recent Tasks: {dashboard.recentTasks.length}</h2>
        </div>
      )}
    </div>
  )
}
```

### 3. Project Store (`useProjectStore`)
Manages project-specific data:
- Current project details
- Project list
- Project members
- Project settings
- Filters and sorting

**Usage:**
```typescript
import { useProject } from '@/hooks/use-store'

function ProjectView() {
  const { currentProject, projects, setCurrentProject } = useProject()
  
  return (
    <div>
      <h1>{currentProject?.name || 'No Project Selected'}</h1>
      <div>
        {projects.map(project => (
          <div key={project.id} onClick={() => setCurrentProject(project)}>
            {project.name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Hooks

### Custom Hooks (`use-store.ts`)
Provides convenient hooks for accessing store state and actions:

- `useSettings()` - Access settings store
- `useHome()` - Access home/dashboard store  
- `useProject()` - Access project store
- `useAppState()` - Access all stores at once

## Features

### Persistence
- Settings store is persisted to localStorage
- Other stores are in-memory (can be made persistent if needed)

### TypeScript Support
- Full TypeScript support with proper typing
- Shared types in `types.ts`
- Type-safe store access

### Scalability
- Modular store structure
- Easy to add new stores
- Separation of concerns
- Reusable patterns

## Adding New Stores

1. Create a new store file (e.g., `task.ts`)
2. Define the state interface
3. Create the store with `create<StateInterface>()`
4. Add actions for state updates
5. Export from `index.ts`
6. Add custom hook in `use-store.ts`

Example:
```typescript
// src/lib/store/task.ts
import { create } from 'zustand'

interface TaskState {
  tasks: Task[]
  selectedTask: Task | null
  setTasks: (tasks: Task[]) => void
  setSelectedTask: (task: Task | null) => void
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  selectedTask: null,
  setTasks: (tasks) => set({ tasks }),
  setSelectedTask: (task) => set({ selectedTask: task }),
}))
```

## Best Practices

1. **Keep stores focused** - Each store should handle one domain
2. **Use TypeScript** - Always define proper interfaces
3. **Immutable updates** - Always return new objects/arrays
4. **Async actions** - Use async/await for API calls
5. **Error handling** - Always handle errors in async actions
6. **Loading states** - Track loading states for better UX

## Future Enhancements

- Add middleware for logging
- Add persistence for other stores
- Add optimistic updates
- Add undo/redo functionality
- Add store devtools integration
