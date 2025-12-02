import Link from 'next/link'
import Image from 'next/image'
import Encoteki from '@/assets/logo.webp'
import Button from '@/ui/Button'

export default function Header() {
  return (
    <header className="z-50 flex items-center justify-between bg-transparent p-4 md:p-6 lg:p-8">
      <Link href="/">
        <Image
          src={Encoteki}
          alt="Home"
          className="hidden md:block md:h-[54px] md:w-[79px]"
          priority
        />
      </Link>

      <Button className="text-sm font-medium md:text-base">Launch App</Button>
    </header>
  )
}
