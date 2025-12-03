interface TeamLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default function TeamLayout({ children }: TeamLayoutProps) {
  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
