import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export default function Button({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-(--primary-green) text-white hover:bg-(--green-10)',
    secondary:
      'bg-white text-(--primary-green) border border-(--primary-green)',
  }

  return (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-full transition-all duration-300',
        'px-4 py-3 md:px-6 lg:px-6 lg:py-3',
        'hover:scale-105 active:scale-95',
        'disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
