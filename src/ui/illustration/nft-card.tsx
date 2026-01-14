export const NFTCardIllustration = () => (
  <div className="relative flex h-24 w-24 scale-75 items-center justify-center transition-transform duration-300 ease-out group-hover:scale-90 sm:h-28 sm:w-28 md:h-32 md:w-32 md:scale-75 md:group-hover:scale-90 xl:scale-90 xl:group-hover:scale-105">
    <div className="group relative z-10 flex h-28 w-20 -rotate-6 flex-col overflow-hidden rounded-md border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105 sm:h-36 sm:w-28 sm:rounded-xl sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:h-42 md:w-28 md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      {/* Art Area (Top) */}
      <div className="relative flex h-3/5 w-full items-center justify-center border-b-2 border-black bg-[#ccf281]">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-[#A855F7] sm:h-8 sm:w-8 md:h-12 md:w-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 scale-0 transform text-white opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 sm:h-4 sm:w-4 md:h-6 md:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Details Area */}
      <div className="flex flex-1 flex-col justify-center gap-1 px-1.5 sm:gap-1.5 sm:px-2 md:gap-2 md:px-3">
        <div className="h-1 w-8 rounded-full bg-black sm:h-1.5 sm:w-10 md:h-2 md:w-16"></div>
        <div className="h-0.5 w-5 rounded-full bg-gray-400 sm:h-1 sm:w-6 md:h-1.5 md:w-10"></div>
        <div className="mt-0.5 flex items-center justify-between sm:mt-1">
          <span className="text-[10px] font-bold sm:text-[11px] md:text-sm">
            #1024
          </span>
          <div className="h-1.5 w-1.5 rounded-full border-2 border-black bg-[#A855F7] sm:h-2 sm:w-2 md:h-3 md:w-3"></div>
        </div>
      </div>
    </div>
  </div>
)
