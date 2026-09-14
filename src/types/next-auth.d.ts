// A bare (unbound) import is required so TypeScript treats this file as a
// module — otherwise `declare module "next-auth"` below would replace the
// module's real types instead of augmenting them with xUserId/xUsername.
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    xUserId?: string
    xUsername?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    xUserId?: string
    xUsername?: string
  }
}
