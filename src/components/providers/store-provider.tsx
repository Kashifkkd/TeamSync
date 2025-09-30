"use client"

import { ReactNode } from 'react'

interface StoreProviderProps {
  children: ReactNode
}

// This component can be used to wrap the app if needed for store initialization
// Currently, Zustand stores work without a provider, but this gives us flexibility
// for future store initialization or middleware setup
export function StoreProvider({ children }: StoreProviderProps) {
  return <>{children}</>
}
