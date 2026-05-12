import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HRGA System — Enterprise HR & General Affairs',
  description: 'Modern enterprise Human Resource & General Affairs management platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-surface text-dark">{children}</body>
    </html>
  )
}
