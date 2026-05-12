interface LoadingSpinnerProps {
  text?: string
  fullPage?: boolean
}

export function LoadingSpinner({ text = 'Memuat data...', fullPage = false }: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <span className="spinner" />
        <span className="text-sm text-muted">{text}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center py-12">
      <span className="spinner" />
    </div>
  )
}
