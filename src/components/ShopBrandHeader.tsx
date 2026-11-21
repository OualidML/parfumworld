import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { useShopSettings } from '../context/ShopSettingsContext'

interface ShopBrandHeaderProps {
  /** Optional fallback subtitle when the shop owner hasn't set a custom slogan */
  fallbackSubtitle?: string
  /** Optional suffix for admin views (e.g. "Admin") */
  badgeSuffix?: string
  /** Optional click handler (e.g. navigate home) */
  onClick?: () => void
}

export default function ShopBrandHeader({
  fallbackSubtitle,
  badgeSuffix,
  onClick
}: ShopBrandHeaderProps) {
  const { shopSettings } = useShopSettings()
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    setLogoError(false)
  }, [shopSettings.logo_url])

  const displayName = shopSettings.shop_name?.trim() || 'ParfumWorld'
  const displaySubtitle = shopSettings.slogan?.trim() || fallbackSubtitle || ''
  const showCustomLogo = Boolean(shopSettings.logo_url && !logoError)

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Crisp rounded logo container (preserves current built-in logo as default fallback) */}
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#1E120D] border border-[#D4AF37]/30 p-1 flex items-center justify-center shrink-0 overflow-hidden">
        {showCustomLogo ? (
          <img
            src={shopSettings.logo_url!}
            alt={displayName}
            onError={() => setLogoError(true)}
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <Sparkles className="h-5 w-5 text-[#F9E29C]" />
        )}
      </div>

      {/* Shop Name stacked cleanly above optional personal slogan (zero overlapping shapes) */}
      <div className="flex flex-col text-start min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-arabic-display gold-metallic-text text-xl md:text-2xl font-bold leading-snug truncate">
            {displayName}
          </span>
          {badgeSuffix && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2D1B14] border border-[#D4AF37]/40 text-[#F9E29C] shrink-0">
              {badgeSuffix}
            </span>
          )}
        </div>

        {displaySubtitle && (
          <span className="text-xs md:text-sm text-[#A8988A] truncate max-w-[220px] sm:max-w-[320px]">
            {displaySubtitle}
          </span>
        )}
      </div>
    </div>
  )
}
