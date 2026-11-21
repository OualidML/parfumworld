import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import { useShopSettings } from '../context/ShopSettingsContext'
import {
  PlatformVectorIcon,
  type ExternalLinkTarget,
  type ExternalLinkPlatform
} from './ExternalLinkModal'

interface SocialContactMenuProps {
  onSelectTarget: (target: ExternalLinkTarget) => void
}

export default function SocialContactMenu({ onSelectTarget }: SocialContactMenuProps) {
  const { i18n } = useTranslation()
  const { shopSettings } = useShopSettings()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const currentLanguage = i18n.language || 'ar'
  const langCode: 'ar' | 'fr' | 'en' = currentLanguage.startsWith('en')
    ? 'en'
    : currentLanguage.startsWith('fr')
    ? 'fr'
    : 'ar'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const configuredSocials: {
    platform: ExternalLinkPlatform
    name: string
    handle: string
    url: string
  }[] = []

  if (shopSettings.instagram_url?.trim()) {
    configuredSocials.push({
      platform: 'instagram',
      name: 'Instagram',
      handle: shopSettings.instagram_handle?.trim() || 'Instagram',
      url: shopSettings.instagram_url.trim()
    })
  }

  if (shopSettings.facebook_url?.trim()) {
    configuredSocials.push({
      platform: 'facebook',
      name: 'Facebook',
      handle: shopSettings.facebook_handle?.trim() || 'Facebook',
      url: shopSettings.facebook_url.trim()
    })
  }

  if (shopSettings.tiktok_url?.trim()) {
    configuredSocials.push({
      platform: 'tiktok',
      name: 'TikTok',
      handle: shopSettings.tiktok_handle?.trim() || 'TikTok',
      url: shopSettings.tiktok_url.trim()
    })
  }

  // Hide completely when the shop owner hasn't configured any social platform URLs
  if (configuredSocials.length === 0) {
    return null
  }

  const buttonLabel =
    langCode === 'ar'
      ? 'تواصل معنا'
      : langCode === 'fr'
      ? 'Contactez-nous'
      : 'Contact Us'

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs text-[#F9E29C] font-bold transition-transform duration-150 active:scale-95 cursor-pointer"
      >
        <div className="flex items-center gap-1 text-[#D4AF37]">
          {configuredSocials.map((s) => (
            <PlatformVectorIcon key={s.platform} platform={s.platform} className="h-3.5 w-3.5" />
          ))}
        </div>
        <span>{buttonLabel}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#D4AF37] transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full end-0 mt-2 w-60 rounded-2xl bg-[#1E120D] border border-[#D4AF37]/35 shadow-2xl py-2 z-50 divide-y divide-[#D4AF37]/10"
        >
          {configuredSocials.map((item) => (
            <button
              key={item.platform}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                onSelectTarget({
                  platform: item.platform,
                  label: item.handle,
                  url: item.url
                })
              }}
              className="w-full px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-[#2D1B14] transition-colors cursor-pointer text-start"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-xl bg-[#120A07] border border-[#D4AF37]/30 flex items-center justify-center text-[#F9E29C] shrink-0">
                  <PlatformVectorIcon platform={item.platform} className="h-4 w-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-[#A8988A] font-semibold">
                    {item.name}
                  </span>
                  <span
                    dir="ltr"
                    className="text-xs font-bold text-[#F5EFE6] truncate max-w-[145px]"
                  >
                    {item.handle}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
