'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function FocusManager() {
  const pathname = usePathname()
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (prevPathname.current === pathname) return
    prevPathname.current = pathname
    requestAnimationFrame(() => {
      document.getElementById('main-content')?.focus()
    })
  }, [pathname])

  return null
}
