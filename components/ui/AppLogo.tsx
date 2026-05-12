// HRGA System Logo — enterprise brand component

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'light' | 'dark'
  showText?: boolean
}

const sizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' }
const textSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' }

export function AppLogo({ size = 'md', variant = 'dark', showText = true }: AppLogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-dark'

  return (
    <div className="flex items-center gap-3">
      <div className={`relative ${sizes[size]} shrink-0`}>
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="12" className="fill-brand" />
          <path d="M24 22c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0 3c-4 0-12 2.01-12 6v3h24v-3c0-3.99-8-6-12-6z" fill="white" fillOpacity="0.95" />
          <circle cx="34" cy="18" r="4" fill="white" fillOpacity="0.5" />
          <circle cx="14" cy="18" r="4" fill="white" fillOpacity="0.5" />
        </svg>
      </div>
      {showText && (
        <div>
          <div className={`${textSizes[size]} font-bold tracking-tight ${textColor}`}>
            Veneris HR
          </div>
          <div className="text-xs text-muted leading-tight">
            Human Resource & General Affairs
          </div>
        </div>
      )}
    </div>
  )
}
