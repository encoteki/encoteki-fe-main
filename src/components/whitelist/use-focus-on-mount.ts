'use client'

import { useCallback } from 'react'

// Returns a ref callback that focuses an element the moment it's attached
// to the DOM. A callback ref fires on every genuine attach — a real
// component mount, or React swapping in a differently-typed element at the
// same JSX position — which a useRef+useEffect([deps]) pair can't
// guarantee. This is why full-screen/full-step swaps in the whitelist flow
// get this at all: each one unmounts the previously focused element with
// nothing telling a keyboard/AT user the screen changed — the browser just
// silently resets focus to <body>. Attaching this to each step's root gives
// every transition the same "focus lands somewhere meaningful" behavior a
// route change would have.
export function useFocusOnMount<T extends HTMLElement>() {
  return useCallback((node: T | null) => {
    node?.focus()
  }, [])
}
