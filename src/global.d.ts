declare module '*.webp' {
  const value: string
  export default value
}

// Static image imports. These types normally come from `next/image-types`
// via the generated (gitignored) `next-env.d.ts`, which doesn't exist on a
// fresh CI checkout when `tsc` runs before `next build`. Declaring them here
// keeps typecheck self-sufficient. Typed as StaticImageData to match how
// next/image consumes them (e.g. StaticImageData[] in vertical-marquee.tsx).
declare module '*.png' {
  const value: import('next/image').StaticImageData
  export default value
}
declare module '*.jpg' {
  const value: import('next/image').StaticImageData
  export default value
}
declare module '*.jpeg' {
  const value: import('next/image').StaticImageData
  export default value
}
declare module '*.svg' {
  const value: import('next/image').StaticImageData
  export default value
}

// tell TS that any .css file is a valid module
declare module '*.css'
declare module '*.scss'
declare module '*.sass'
declare module '*.mp4'
