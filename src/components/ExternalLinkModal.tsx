import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, ExternalLink, X } from 'lucide-react'

export type ExternalLinkPlatform = 'instagram' | 'facebook' | 'tiktok' | 'location'

export interface ExternalLinkTarget {
  platform: ExternalLinkPlatform
  label: string
  url: string
}

interface ExternalLinkModalProps {
  target: ExternalLinkTarget | null
  onClose: () => void
}

export function PlatformVectorIcon({
  platform,
  className = 'h-5 w-5'
}: {
  platform: ExternalLinkPlatform
  className?: string
}) {
  if (platform === 'instagram') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    )
  }

  if (platform === 'facebook') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    )
  }

  if (platform === 'tiktok') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    )
  }

  return <MapPin className={className} aria-hidden="true" />
}

export default function ExternalLinkModal({ target, onClose }: ExternalLinkModalProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language || 'ar'
  const isRtl = currentLanguage.startsWith('ar')
  const langCode: 'ar' | 'fr' | 'en' = currentLanguage.startsWith('en')
    ? 'en'
    : currentLanguage.startsWith('fr')
    ? 'fr'
    : 'ar'

  // Handle Escape key and lock background body scroll while modal is open
  useEffect(() => {
    if (!target) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [target, onClose])

  if (!target || typeof document === 'undefined') return null

  const platformDisplayName: Record<ExternalLinkPlatform, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    location:
      langCode === 'ar'
        ? 'خرائط جوجل (موقع المتجر)'
        : langCode === 'fr'
        ? 'Google Maps (Localisation)'
        : 'Google Maps (Store Location)'
  }

  const headline =
    langCode === 'ar'
      ? 'أنت على وشك مغادرة التطبيق!'
      : langCode === 'fr'
      ? 'Vous quittez notre application !'
      : 'You are leaving our app!'

  const description =
    langCode === 'ar'
      ? `سيتم توجيهك إلى ${platformDisplayName[target.platform]} في نافذة خارجية.`
      : langCode === 'fr'
      ? `Vous allez être redirigé vers ${platformDisplayName[target.platform]} dans un nouvel onglet.`
      : `You will be redirected to ${platformDisplayName[target.platform]} in a new tab.`

  const continueLabel =
    langCode === 'ar' ? 'متابعة' : langCode === 'fr' ? 'Continuer' : 'Continue'

  const stayLabel =
    langCode === 'ar'
      ? 'البقاء في التطبيق'
      : langCode === 'fr'
      ? "Rester dans l'application"
      : 'Stay in app'

  const handleConfirmRedirect = () => {
    const raw = (target.url || '').trim()
    if (!raw || /^(javascript|data|vbscript):/i.test(raw)) {
      onClose()
      return
    }
    const safeUrl = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    if (!/^https?:\/\//i.test(safeUrl)) {
      onClose()
      return
    }
    window.open(safeUrl, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return createPortal(
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="oud-card-surface oud-card-reveal w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center gap-5 relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={stayLabel}
          className="absolute top-4 end-4 p-1.5 rounded-full bg-[#120A07] border border-[#D4AF37]/20 text-[#A8988A] hover:text-[#F5EFE6] hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Destination Platform Icon Emblem */}
        <div className="h-16 w-16 rounded-2xl bg-[#2D1B14] border border-[#D4AF37]/50 flex items-center justify-center text-[#F9E29C] shadow-[0_0_24px_rgba(212,175,55,0.22)]">
          <PlatformVectorIcon platform={target.platform} className="h-7 w-7 text-[#F9E29C]" />
        </div>

        {/* Headline & Subtext */}
        <div className="space-y-2">
          <h3 className="font-arabic-display text-2xl font-bold gold-metallic-text">
            {headline}
          </h3>
          <p className="text-xs sm:text-sm text-[#A8988A] leading-relaxed">{description}</p>
        </div>

        {/* Destination Account Handle / Label Pill */}
        <div className="w-full rounded-2xl bg-[#120A07] border border-[#D4AF37]/25 px-4 py-3 flex items-center justify-center gap-2">
          <PlatformVectorIcon platform={target.platform} className="h-4 w-4 text-[#D4AF37] shrink-0" />
          <span
            dir="ltr"
            className="text-xs sm:text-sm font-bold text-[#F9E29C] truncate max-w-[260px]"
          >
            {target.label || platformDisplayName[target.platform]}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={handleConfirmRedirect}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl gold-metallic-bg font-extrabold text-xs sm:text-sm shadow-lg transition-transform duration-150 active:scale-95 cursor-pointer"
          >
            <span>{continueLabel}</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#120A07]" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-5 rounded-2xl bg-[#120A07] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 text-xs sm:text-sm font-semibold text-[#A8988A] hover:text-[#F5EFE6] transition-transform duration-150 active:scale-95 cursor-pointer"
          >
            {stayLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
