// Reusable PageHeader component
// Replaces the repeated page-header pattern found in ALL 6 dashboard pages

interface PageHeaderProps {
  title: string
  subtitle: string
  icon?: string
}

export function PageHeader({ title, subtitle, icon }: PageHeaderProps) {
  return (
    <div className="page-header">
      <h1>{icon ? `${icon} ` : ''}{title}</h1>
      <p>{subtitle}</p>
    </div>
  )
}
