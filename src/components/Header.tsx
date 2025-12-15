import Link from 'next/link'
import Image from 'next/image'
import Encoteki from '@/assets/logo.webp'
import { TextButton } from '@/ui/Button'

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-9999 flex h-16 items-center justify-between border-b border-black bg-white px-4 md:h-20 md:px-6">
      <Link href="/">
        <Image
          src={Encoteki}
          alt="Home"
          width={190}
          height={150}
          className="h-auto w-12 md:w-12 lg:w-16"
          priority
        />
      </Link>

      <TextButton className="px-4 py-2 font-medium uppercase md:px-6 md:py-3 md:text-lg lg:px-8 lg:py-4 lg:text-xl">
        App
      </TextButton>
    </header>
  )
}
