# Dynamic View Parameters

This document explains how to use dynamic view parameters to toggle and store view states in URLs.

## Overview

The view parameter system allows you to:
- Toggle between different views (All, Board, List, Calendar, Table, Gantt)
- Store the current view in the URL
- Generate dynamic links that preserve other URL parameters
- Share URLs with specific views
- Navigate back/forward with browser history

## Usage

### 1. Using the `useViewParams` Hook

```tsx
import { useViewParams } from "@/hooks/use-view-params"

function MyComponent() {
  const { 
    activeView, 
    updateView, 
    generateViewLink, 
    isViewActive 
  } = useViewParams({
    defaultView: "all",
    validViews: ["all", "board", "list", "calendar", "table", "gantt"]
  })

  return (
    <div>
      <button onClick={() => updateView("board")}>
        Switch to Board View
      </button>
      
      <Link href={generateViewLink("list")}>
        Go to List View
      </Link>
      
      {isViewActive("calendar") && (
        <div>Calendar view is active!</div>
      )}
    </div>
  )
}
```

### 2. Using Utility Functions

```tsx
import { generateViewUrl, getCurrentView } from "@/lib/view-utils"
import { useSearchParams } from "next/navigation"

function MyComponent() {
  const searchParams = useSearchParams()
  const currentView = getCurrentView(searchParams)
  const boardUrl = generateViewUrl("board", searchParams)
  
  return (
    <Link href={boardUrl}>
      Go to Board View
    </Link>
  )
}
```

### 3. Using the ViewLink Component

```tsx
import { ViewLink } from "@/components/navigation/view-link"

function MyComponent() {
  return (
    <ViewLink 
      view="board"
      className="px-4 py-2 rounded"
      activeClassName="bg-primary text-primary-foreground"
      inactiveClassName="bg-muted hover:bg-muted/80"
    >
      Board View
    </ViewLink>
  )
}
```

## URL Structure

### Default View (All)
```
/milestones/sprint-1
```

### Specific View
```
/milestones/sprint-1?view=board
/milestones/sprint-1?view=list
/milestones/sprint-1?view=calendar
```

### With Additional Parameters
```
/milestones/sprint-1?view=board&filter=active&sort=priority
```

## API Reference

### `useViewParams` Hook

#### Options
- `defaultView?: string` - Default view when no parameter is present (default: "all")
- `validViews?: string[]` - Array of valid view values
- `paramName?: string` - URL parameter name (default: "view")

#### Returns
- `activeView: string` - Current active view
- `updateView(view: string): void` - Update the current view
- `generateViewLink(view: string): string` - Generate URL for a view
- `getViewParam(): string` - Get current view parameter value
- `isViewActive(view: string): boolean` - Check if a view is active
- `validViews: string[]` - Array of valid views

### Utility Functions

#### `generateViewUrl(view, searchParams, options?)`
Generates a URL for a specific view while preserving other parameters.

#### `getCurrentView(searchParams, paramName?, defaultView?)`
Gets the current view from URL parameters.

#### `isValidView(view, validViews?)`
Validates if a view is in the list of valid views.

## Examples

### Basic View Toggle
```tsx
function ViewToggle() {
  const { activeView, updateView } = useViewParams()
  
  return (
    <div className="flex space-x-2">
      <button 
        onClick={() => updateView("all")}
        className={activeView === "all" ? "active" : ""}
      >
        All
      </button>
      <button 
        onClick={() => updateView("board")}
        className={activeView === "board" ? "active" : ""}
      >
        Board
      </button>
    </div>
  )
}
```

### Navigation Menu
```tsx
function NavigationMenu() {
  const { generateViewLink, isViewActive } = useViewParams()
  
  const views = [
    { id: "all", name: "All", icon: Target },
    { id: "board", name: "Board", icon: BarChart3 },
    { id: "list", name: "List", icon: List }
  ]
  
  return (
    <nav>
      {views.map(view => (
        <Link 
          key={view.id}
          href={generateViewLink(view.id)}
          className={isViewActive(view.id) ? "active" : ""}
        >
          <view.icon />
          {view.name}
        </Link>
      ))}
    </nav>
  )
}
```

### Breadcrumb with View
```tsx
function Breadcrumb() {
  const { activeView, generateViewLink } = useViewParams()
  
  return (
    <nav className="flex items-center space-x-2">
      <Link href="/milestones">Milestones</Link>
      <span>/</span>
      <Link href="/milestones/sprint-1">Sprint 1</Link>
      <span>/</span>
      <span className="capitalize">{activeView}</span>
    </nav>
  )
}
```

## Best Practices

1. **Always validate views** - Use the `validViews` array to prevent invalid views
2. **Preserve other parameters** - The system automatically preserves other URL parameters
3. **Use semantic view names** - Use clear, descriptive view names
4. **Handle edge cases** - Always provide fallbacks for invalid or missing views
5. **Test URL sharing** - Ensure URLs work when shared or bookmarked

## Migration Guide

### From Manual State Management
```tsx
// Before
const [activeView, setActiveView] = useState("all")

// After
const { activeView, updateView } = useViewParams()
```

### From Manual URL Building
```tsx
// Before
const boardUrl = `/milestones/sprint-1?view=board&${otherParams}`

// After
const boardUrl = generateViewUrl("board", searchParams)
```
