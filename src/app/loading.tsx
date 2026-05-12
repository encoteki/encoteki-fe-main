import Image from 'next/image'
import Tiggy from '@/assets/tsb/tiggy-tp.webp'

export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-transparent"
      role="status"
      aria-label="Loading"
    >
      <Image
        className="animate-spin motion-reduce:animate-none"
        alt="Loading"
        src={Tiggy}
        width={100}
        height={100}
        priority
      />
    </div>
  )
}
