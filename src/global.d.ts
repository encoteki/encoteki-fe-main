declare module '*.webp' {
  const value: string
  export default value
}

// tell TS that any .css file is a valid module
declare module '*.css'
declare module '*.scss'
declare module '*.sass'
declare module '*.mp4'
