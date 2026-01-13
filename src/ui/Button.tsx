import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

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

interface TextButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  icon?: ReactNode
}

export function TextButton({
  children,
  href,
  onClick,
  className = '',
  icon,
}: TextButtonProps) {
  const baseStyles = `cursor-pointer group flex items-center gap-2 rounded-full px-5 py-3 text-base font-medium bg-transparent
    ${className}
  `

  // Default icon
  const IconElement = icon || (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform group-hover:translate-x-1"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5L19 12L12 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {children}
        {IconElement}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={baseStyles}>
      {children}
      {IconElement}
    </button>
  )
}

interface ArrowButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary'
}

export const ArrowRoundedButton = ({
  children,
  className,
  variant = 'primary',
  ...props
}: ArrowButtonProps) => {
  const isPrimary = variant === 'primary'

  return (
    <button
      className={cn(
        'group relative flex cursor-pointer items-center justify-between gap-4 rounded-full py-1 pr-1 pl-6 transition-all duration-300 md:py-2 md:pr-2',
        isPrimary
          ? 'bg-white text-black'
          : 'border border-black bg-black text-white',
        className,
      )}
      {...props}
    >
      <span className="font-medium">{children}</span>

      {/* Circle Icon Container */}
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300',
          isPrimary ? 'bg-white' : 'bg-black text-white',
        )}
      >
        <ArrowRight className="h-5 w-5 -rotate-45 transition-transform duration-300 ease-out group-hover:scale-120 group-hover:rotate-0" />
      </div>
    </button>
  )
}

interface BrutalismButtonProps {
  label: string
  href?: string
  bgColor?: string
  textColor?: string
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  target?: '_blank' | '_self' | '_parent' | '_top'
}

export function BrutalismButton({
  label = 'Button',
  href,
  bgColor = 'bg-[#FF9E00]',
  textColor = 'text-black',
  className = '',
  onClick,
  type = 'button',
  target,
}: BrutalismButtonProps) {
  const baseStyles = `
    ${bgColor} ${textColor} ${className} 
    inline-block cursor-pointer rounded-full 
    border-2 border-black px-8 py-3 
    text-center text-sm font-bold uppercase 
    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
    transition-all duration-200 
    hover:translate-y-1 hover:shadow-none
    active:translate-y-2 active:shadow-none
  `

  const isExternal = href
    ? href.startsWith('http') || href.startsWith('https')
    : false

  if (href && isExternal) {
    return (
      <a
        href={href}
        target={target || '_blank'} // Default _blank kalau external
        rel="noopener noreferrer"
        className={baseStyles}
        onClick={onClick}
      >
        {label}
      </a>
    )
  }

  if (href && !isExternal) {
    return (
      <Link href={href} className={baseStyles} onClick={onClick}>
        {label}
      </Link>
    )
  }

  return (
    <button type={type} className={baseStyles} onClick={onClick}>
      {label}
    </button>
  )
}
