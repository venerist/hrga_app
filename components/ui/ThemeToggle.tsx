'use client'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  size?: 'sm' | 'md'
}

export function ThemeToggle({ size = 'md' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const iconSize = size === 'sm' ? 14 : 18

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-surface-alt hover:bg-border/50 transition-all duration-300 cursor-pointer group focus-ring"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-[18px] h-[18px] flex items-center justify-center">
        <Sun
          size={iconSize}
          className={`absolute transition-all duration-300 ${
            theme === 'light'
              ? 'opacity-100 rotate-0 scale-100 text-amber-500'
              : 'opacity-0 rotate-90 scale-0 text-amber-500'
          }`}
        />
        <Moon
          size={iconSize}
          className={`absolute transition-all duration-300 ${
            theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100 text-primary-light'
              : 'opacity-0 -rotate-90 scale-0 text-primary-light'
          }`}
        />
      </div>
    </button>
  )
}
