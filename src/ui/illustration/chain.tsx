export const ChainIllustration = () => (
  <div className="relative flex h-24 w-24 scale-75 items-center justify-center transition-transform duration-300 ease-out group-hover:scale-90 sm:h-28 sm:w-28 md:h-32 md:w-32 md:scale-75 md:group-hover:scale-90 xl:scale-90 xl:group-hover:scale-105">
    <div className="absolute top-4 left-2 z-10 flex h-10 w-16 -rotate-45 items-center justify-center rounded-full border-2 border-black bg-[#A855F7] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2 sm:h-12 sm:w-20">
      <div className="h-4 w-10 rounded-full border-2 border-black bg-[#f3f4f6]"></div>
    </div>

    <div className="absolute right-2 bottom-4 z-0 flex h-10 w-16 -rotate-45 items-center justify-center rounded-full border-2 border-black bg-[#ccf281] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2 sm:h-12 sm:w-20">
      <div className="h-4 w-10 rounded-full border-2 border-black bg-[#f3f4f6]"></div>
    </div>

    <div className="absolute top-0 right-0 h-2 w-2 rounded-full border-2 border-black bg-[#FF5A35] opacity-0 transition-opacity group-hover:animate-ping group-hover:opacity-100"></div>
    <div className="absolute bottom-0 left-0 h-2 w-2 rounded-full border-2 border-black bg-[#A855F7] opacity-0 transition-opacity group-hover:animate-ping group-hover:opacity-100"></div>
  </div>
)
