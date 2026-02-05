import Image from 'next/image'
import Tiggy from '@/assets/tsb/tiggy-tp.webp'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent">
      <div className="space-y-3">
        <Image
          className="animate-spin"
          alt="Loading"
          src={Tiggy}
          width={100}
          height={100}
        />
      </div>
    </div>
  )
}
