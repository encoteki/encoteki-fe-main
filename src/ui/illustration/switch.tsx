export const SwitchIllustration = () => (
  <div className="relative flex h-24 w-24 scale-75 items-center justify-center transition-transform duration-300 ease-out group-hover:scale-90 sm:h-28 sm:w-28 md:h-32 md:w-32 md:scale-75 md:group-hover:scale-90 xl:scale-90 xl:group-hover:scale-105">
    {/* --- Switch --- */}
    <div className="relative z-10 flex h-12 w-24 -rotate-6 cursor-pointer items-center rounded-full border-2 border-black bg-[#ef5848] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300 group-hover:bg-[#ccf281] sm:h-14 sm:w-28">
      <div className="absolute inset-0 flex items-center justify-between px-3 font-black text-black">
        <span className="translate-x-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          YES
        </span>
        <span className="-translate-x-1 text-white opacity-100 transition-opacity duration-300 group-hover:opacity-0">
          NO
        </span>
      </div>

      {/* --- Knob--- */}
      <div className="cubic-bezier(0.4, 0, 0.2, 1) absolute left-1 h-9 w-9 rounded-full border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group-hover:left-[calc(100%-2.5rem)] group-hover:rotate-180 sm:h-11 sm:w-11 sm:group-hover:left-[calc(100%-3rem)]">
        <div className="absolute top-1/2 left-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-300"></div>
      </div>
    </div>

    {/* --- Sparkles/Click Effect --- */}
    <div className="absolute -top-2 -right-2 z-20 scale-0 transition-transform duration-300 group-hover:scale-100">
      <div className="relative h-8 w-8">
        <div className="absolute top-0 left-1/2 h-2 w-1 -translate-x-1/2 bg-black"></div>
        <div className="absolute bottom-0 left-1/2 h-2 w-1 -translate-x-1/2 bg-black"></div>
        <div className="absolute top-1/2 left-0 h-1 w-2 -translate-y-1/2 bg-black"></div>
        <div className="absolute top-1/2 right-0 h-1 w-2 -translate-y-1/2 bg-black"></div>
      </div>
    </div>
  </div>
)
