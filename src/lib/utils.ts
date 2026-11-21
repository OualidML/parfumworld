import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getJwtShopIdSync } from "./supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Strictly synchronous tenant resolution.
 * Priority #1: Active Authenticated Admin JWT claim (`session.user.app_metadata.shop_id`).
 * Priority #2: `import.meta.env.VITE_SHOP_ID`.
 * Throws a fatal Error if unauthenticated and `VITE_SHOP_ID` is missing.
 */
export function resolveShopId(): string {
  // 1. PRIORITY #1: Active Authenticated Admin JWT claim (session.user.app_metadata.shop_id)
  const jwtShopId = getJwtShopIdSync()
  if (jwtShopId) {
    return jwtShopId
  }

  // 2. PRIORITY #2: Unauthenticated Session — strictly require VITE_SHOP_ID (no MASTER_SHOP_ID fallback)
  const envShopId = import.meta.env.VITE_SHOP_ID?.trim()
  if (!envShopId) {
    throw new Error('CRITICAL: Missing VITE_SHOP_ID environment variable')
  }

  return envShopId
}
