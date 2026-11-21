import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react'
import { supabase } from '../lib/supabase'
import { resolveShopId } from '../lib/utils'
import type { ShopPublicProfile } from '../types/database'

const DEFAULT_SHOP_SETTINGS: ShopPublicProfile = {
  shop_name: 'ParfumWorld',
  slogan: '',
  logo_url: null,
  whatsapp_number: '',
  location_url: '',
  instagram_handle: '',
  instagram_url: '',
  facebook_handle: '',
  facebook_url: '',
  tiktok_handle: '',
  tiktok_url: ''
}

interface ShopSettingsContextValue {
  shopSettings: ShopPublicProfile
  isLoadingSettings: boolean
  refreshShopSettings: () => Promise<void>
}

const ShopSettingsContext = createContext<ShopSettingsContextValue>({
  shopSettings: DEFAULT_SHOP_SETTINGS,
  isLoadingSettings: true,
  refreshShopSettings: async () => {}
})

export function ShopSettingsProvider({ children }: { children: ReactNode }) {
  const [shopSettings, setShopSettings] = useState<ShopPublicProfile>(DEFAULT_SHOP_SETTINGS)
  const [isLoadingSettings, setIsLoadingSettings] = useState<boolean>(true)

  const refreshShopSettings = useCallback(async () => {
    let shopId: string | null = null
    try {
      shopId = resolveShopId()
    } catch {
      shopId = import.meta.env.VITE_SHOP_ID?.trim() || null
    }

    if (!shopId) {
      setIsLoadingSettings(false)
      return
    }

    try {
      const { data, error } = await supabase.rpc('get_shop_public_profile', {
        p_shop_id: shopId
      })

      if (error || !data) {
        return
      }

      const raw = (Array.isArray(data) ? data[0] : data) as Partial<ShopPublicProfile> | undefined
      if (!raw) return

      setShopSettings({
        shop_name: raw.shop_name?.trim() || 'ParfumWorld',
        slogan: raw.slogan ?? '',
        logo_url: raw.logo_url ?? null,
        whatsapp_number: raw.whatsapp_number ?? '',
        location_url: raw.location_url ?? '',
        instagram_handle: raw.instagram_handle ?? '',
        instagram_url: raw.instagram_url ?? '',
        facebook_handle: raw.facebook_handle ?? '',
        facebook_url: raw.facebook_url ?? '',
        tiktok_handle: raw.tiktok_handle ?? '',
        tiktok_url: raw.tiktok_url ?? ''
      })
    } catch (err) {
      console.error('[ShopSettingsContext] Failed to fetch shop public profile:', err)
    } finally {
      setIsLoadingSettings(false)
    }
  }, [])

  useEffect(() => {
    refreshShopSettings()
  }, [refreshShopSettings])

  // Dynamically update document.title whenever shop_name changes
  useEffect(() => {
    if (typeof document !== 'undefined' && shopSettings.shop_name) {
      document.title = shopSettings.slogan
        ? `${shopSettings.shop_name} — ${shopSettings.slogan}`
        : `${shopSettings.shop_name} — عالم العطور الفاخرة`
    }
  }, [shopSettings.shop_name, shopSettings.slogan])

  return (
    <ShopSettingsContext.Provider
      value={{
        shopSettings,
        isLoadingSettings,
        refreshShopSettings
      }}
    >
      {children}
    </ShopSettingsContext.Provider>
  )
}

export function useShopSettings(): ShopSettingsContextValue {
  return useContext(ShopSettingsContext)
}
