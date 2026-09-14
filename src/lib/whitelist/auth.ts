import NextAuth from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { Profile, Session } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import { env } from './env'

// Shape of the `data` envelope X's OAuth2 userinfo endpoint
// (GET /2/users/me) returns, as delivered via the Twitter provider's raw
// `profile`. Narrower than the SDK's generic `Profile` type (a broad union
// of possible OIDC-ish claims across all providers), so callers get the two
// fields this app actually reads.
interface XProfile {
  data?: { id?: string; username?: string }
}

export async function jwtCallback(params: {
  token: JWT
  profile?: Profile
}): Promise<JWT> {
  const { token, profile } = params
  const data = (profile as XProfile | undefined)?.data
  if (data?.id && data.username) {
    token.xUserId = data.id
    token.xUsername = data.username
  }
  return token
}

export async function sessionCallback(params: {
  session: Session
  token: JWT
}): Promise<Session> {
  const { session, token } = params
  session.xUserId = token.xUserId
  session.xUsername = token.xUsername
  return session
}

// Config is a function, not a plain object — NextAuth() only calls it once
// an actual request comes in, not when this module is imported. A plain
// object would eagerly evaluate env.authTwitterId() etc. at import time,
// and Next's build-time page-data collection imports every route module
// just to inspect its config, which would then require AUTH_TWITTER_ID and
// friends to exist as env vars during `next build` itself — even in
// environments (CI) that never handle a real request and have no reason to
// carry those secrets.
export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  providers: [
    TwitterProvider({
      clientId: env.authTwitterId(),
      clientSecret: env.authTwitterSecret(),
      // Must include `url` explicitly, not just `params`. The built-in
      // Twitter provider's default `authorization` is a plain URL *string*
      // (unlike most providers, which default to `{ url, params }`), and
      // Auth.js's config merge can't merge a string with an object — an
      // object-only override silently replaces the whole string, dropping
      // the endpoint URL and crashing sign-in with "TypeError: Invalid URL"
      // (it falls back to OIDC discovery, which Twitter doesn't support).
      authorization: {
        url: 'https://x.com/i/oauth2/authorize',
        params: { scope: 'users.read tweet.read' },
      },
    }),
  ],
  secret: env.authSecret(),
  session: { strategy: 'jwt' },
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },
}))
