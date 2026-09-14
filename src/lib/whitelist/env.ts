function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const env = {
  supabaseUrl: () => requireEnv('SUPABASE_URL'),
  supabaseServiceRoleKey: () => requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  authTwitterId: () => requireEnv('AUTH_TWITTER_ID'),
  authTwitterSecret: () => requireEnv('AUTH_TWITTER_SECRET'),
  authSecret: () => requireEnv('AUTH_SECRET'),
  campaignTargetAccountUsername: () =>
    requireEnv('CAMPAIGN_TARGET_ACCOUNT_USERNAME'),
  campaignTargetPostId: () => requireEnv('CAMPAIGN_TARGET_POST_ID'),
  campaignName: () => requireEnv('CAMPAIGN_NAME'),
}
