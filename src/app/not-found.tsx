import { BrutalismButton } from '@/ui/buttons'

export default function NotFound() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="w-122 text-center font-normal md:w-150">
        <video
          width="100%"
          height="auto"
          loop
          muted
          autoPlay
          playsInline
          preload="none"
          style={{ objectFit: 'cover' }}
        >
          <source src={'/assets/404.mp4'} type="video/mp4" />
        </video>

        <div className="mb-4 grid md:mb-6">
          <p className="mb-2 text-2xl font-medium md:text-3xl">
            This page is lost in the wild
          </p>
          <p className="text-sm md:text-base lg:text-lg">
            We couldn&apos;t find the page you were looking for.
          </p>
        </div>

        <BrutalismButton
          label="Go back home"
          href="/"
          bgColor="bg-(--primary-green)"
          textColor="text-white"
        />
      </div>
    </main>
  )
}
