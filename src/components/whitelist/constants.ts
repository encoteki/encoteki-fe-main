export const PRIMARY_BUTTON =
  'cursor-pointer rounded-full bg-(--primary-green) px-5 py-3 text-sm font-medium text-white shadow-primary transition-[background-color,box-shadow,transform] duration-300 outline-none hover:enabled:bg-(--green-10) hover:enabled:shadow-primary-hover focus-visible:ring-2 focus-visible:ring-(--primary-green) focus-visible:ring-offset-2 active:enabled:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'

// Shared by the secondary Share and Download CTAs beside the primary
// "Share to X" button — same visual weight so neither reads as more
// important than the other.
export const ROUNDED_ICON_BUTTON =
  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--khaki-70) bg-white text-(--neutral-10) shadow-sm transition-colors duration-200 outline-none hover:bg-(--green-90) focus-visible:ring-2 focus-visible:ring-(--primary-green) focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
