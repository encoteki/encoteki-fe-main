'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="font-mono text-xs tracking-widest text-(--neutral-40) uppercase">
          Something went wrong
        </p>
        <h2 className="text-2xl font-black tracking-tight text-(--primary-black) uppercase">
          Oops, that&apos;s on us.
        </h2>
      </div>
      <button
        onClick={reset}
        className="group flex items-center gap-2 rounded-full border-2 border-(--primary-black) bg-white px-6 py-3 text-sm font-bold text-(--primary-black) shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:translate-y-0.5 hover:bg-[#ccf281] hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-y-1 active:shadow-none"
      >
        <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
        Try again
      </button>
    </div>
  )
}
