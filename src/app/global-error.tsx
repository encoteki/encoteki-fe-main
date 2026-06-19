'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function GlobalError({
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
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
          <p className="font-mono text-xs tracking-widest text-gray-400 uppercase">
            Critical error
          </p>
          <h1 className="text-3xl font-black tracking-tight uppercase">
            Something broke badly.
          </h1>
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-6 py-3 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all duration-200 hover:translate-y-0.5 hover:bg-[#ccf281] hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-y-1 active:shadow-none"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
