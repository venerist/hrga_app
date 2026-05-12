// Reusable LoadingSpinner component
// Replaces the repeated loading/spinner pattern in all pages

interface LoadingSpinnerProps {
  /** Text shown next to the spinner */
  text?: string
  /** Whether to center in a full-height container */
  fullPage?: boolean
}

export function LoadingSpinner({ text = 'Memuat data...', fullPage = false }: LoadingSpinnerProps) {
  const style = fullPage
    ? { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }
    : { textAlign: 'center' as const, padding: 40 }

  if (fullPage) {
    return (
      <div style={style}>
        <span className="spinner" />
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{text}</span>
      </div>
    )
  }

  return (
    <div style={style}>
      <span className="spinner" />
    </div>
  )
}
