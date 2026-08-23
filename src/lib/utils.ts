import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function resolveShopId(): Promise<string> {
  const fallbackShopId = 'fbae2651-c18f-4682-99ef-2827c00044ff'
  try {
    // 1. Check URL parameters
    const params = new URLSearchParams(window.location.search)
    const urlShopId = params.get('shop') || params.get('shop_id')
    if (urlShopId) {
      localStorage.setItem('parfumworld_shop_id', urlShopId)
      return urlShopId
    }

    // 2. Check Local Storage
    const stored = localStorage.getItem('parfumworld_shop_id')
    if (stored) return stored

    // 3. Check Active Auth Session
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user?.id) {
      localStorage.setItem('parfumworld_shop_id', session.user.id)
      return session.user.id
    }
  } catch (e) {
    console.error('Error resolving shop_id:', e)
  }
  return fallbackShopId
}
