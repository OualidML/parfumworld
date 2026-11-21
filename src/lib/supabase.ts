import { createClient, type Session } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

let currentAuthSession: Session | null = null

/**
 * Synchronously extracts `session.user.app_metadata.shop_id` from the active
 * Supabase session or persisted localStorage auth token.
 */
export function getJwtShopIdSync(): string | null {
  const inMemoryShopId = (
    currentAuthSession?.user?.app_metadata?.shop_id ||
    currentAuthSession?.user?.app_metadata?.app_metadata_shop_id
  )?.trim()

  if (inMemoryShopId && UUID_REGEX.test(inMemoryShopId)) {
    return inMemoryShopId
  }

  if (typeof window !== 'undefined') {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
          const rawSession = localStorage.getItem(key)
          if (rawSession) {
            const parsed = JSON.parse(rawSession)
            const user = parsed?.user || parsed?.currentSession?.user
            const jwtShopId = (
              user?.app_metadata?.shop_id ||
              user?.app_metadata?.app_metadata_shop_id
            )?.trim()
            if (jwtShopId && UUID_REGEX.test(jwtShopId)) {
              return jwtShopId
            }
          }
        }
      }
    } catch {
      // Ignore storage access or JSON parse errors
    }
  }

  return null
}

/**
 * Synchronously resolves the active tenant `shop_id` for outgoing PostgREST headers (`x-shop-id`).
 * Priority #1: Authenticated user's JWT `session.user.app_metadata.shop_id`.
 * Priority #2: `import.meta.env.VITE_SHOP_ID`.
 */
export function getActiveTenantShopId(): string | null {
  // 1. Check active Supabase auth JWT claim first (Admin Override Priority #1)
  const jwtShopId = getJwtShopIdSync()
  if (jwtShopId) {
    return jwtShopId
  }

  // 2. Unauthenticated session: strictly use VITE_SHOP_ID
  const envShopId = import.meta.env.VITE_SHOP_ID?.trim()
  if (envShopId && UUID_REGEX.test(envShopId)) {
    return envShopId
  }

  return null
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (input, init) => {
      const headers = new Headers(init?.headers)
      if (!headers.has('x-shop-id')) {
        const activeShopId = getActiveTenantShopId()
        if (activeShopId) {
          headers.set('x-shop-id', activeShopId)
        }
      }
      return fetch(input, { ...init, headers })
    }
  }
})

supabase.auth.onAuthStateChange((_event, session) => {
  currentAuthSession = session
})
