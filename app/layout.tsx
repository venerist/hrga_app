import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HRGA System',
  description: 'Human Resource & General Affairs Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
