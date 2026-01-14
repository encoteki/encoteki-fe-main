export const DiscountReceiptIllustration = () => (
  <div className="relative h-24 w-24 scale-75 transition-transform duration-300 ease-out group-hover:scale-90 sm:h-28 sm:w-28 md:h-32 md:w-32 md:scale-75 md:group-hover:scale-90 xl:scale-90 xl:group-hover:scale-105">
    <div className="absolute top-2 left-1/2 z-10 -translate-x-1/2 rotate-0 transform transition-transform duration-300 group-hover:scale-105">
      <div className="absolute top-0 left-1/2 -z-10 flex w-16 -translate-x-1/2 flex-col items-center rounded-b-md border-2 border-black bg-white shadow-sm transition-all duration-500 ease-out group-hover:translate-y-12 sm:w-20">
        <div className="flex w-full flex-col items-center gap-1 pt-6 pb-2">
          <div className="w-full border-t-2 border-dashed border-gray-300"></div>
        </div>

        <div className="flex flex-col items-center pb-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-2xl font-black text-[#ef5848] sm:text-3xl">
            50%
          </span>

          {/* Barcode Mockup */}
          <div className="mt-2 flex gap-0.5 opacity-60">
            <div className="h-3 w-1 bg-black"></div>
            <div className="h-3 w-0.5 bg-black"></div>
            <div className="h-3 w-1.5 bg-black"></div>
            <div className="h-3 w-1 bg-black"></div>
          </div>
        </div>
      </div>

      <div className="relative z-20 h-12 w-24 rounded-lg border-2 border-black bg-[#A855F7] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:h-14 sm:w-28">
        <div className="absolute bottom-0 left-1/2 h-2 w-16 -translate-x-1/2 rounded-t-sm border-x-2 border-t-2 border-black bg-black opacity-20"></div>

        <div className="absolute top-3 left-3 flex gap-2">
          <div className="h-3 w-3 rounded-full border-2 border-black bg-[#ccf281]"></div>
          <div className="h-3 w-3 rounded-full border-2 border-black bg-[#ef5848]"></div>
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <div className="h-1 w-4 rounded-full bg-black opacity-20"></div>
          <div className="h-1 w-4 rounded-full bg-black opacity-20"></div>
        </div>
      </div>

      <div className="absolute top-0 -right-3 z-30 h-9 w-9 animate-bounce rounded-full border-2 border-black bg-[#ccf281] shadow-sm delay-100 sm:h-10 sm:w-10">
        <div className="flex h-full items-center justify-center font-bold text-black">
          $
        </div>
      </div>
    </div>
  </div>
)
