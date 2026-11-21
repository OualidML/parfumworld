import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWishlist } from '../hooks/useWishlist'
import { supabase } from '../lib/supabase'
import { resolveShopId } from '../lib/utils'
import { useShopSettings } from '../context/ShopSettingsContext'
import ShopBrandHeader from '../components/ShopBrandHeader'
import SocialContactMenu from '../components/SocialContactMenu'
import ExternalLinkModal, { type ExternalLinkTarget } from '../components/ExternalLinkModal'
import {
  Package,
  Award,
  Sun,
  Moon,
  Sparkles,
  ArrowLeft,
  Heart,
  Loader2,
  Mail,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Tag
} from 'lucide-react'

interface Brand {
  id: string
  name: string
}

interface Perfume {
  id: string
  brand_id: string
  brands: Brand
  name: string
  gender: 'male' | 'female' | 'unisex'
  concentration: string
  price: number
  volume_ml: number
  in_stock: boolean
  is_dupe_of?: string | null
  image_url?: string
  description_ar?: string
  description_en?: string
  description_fr?: string
}

export default function WishlistPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const currentLanguage = i18n.language || 'ar'
  const isRtl = currentLanguage.startsWith('ar')

  const { wishlist, toggleWishlist } = useWishlist()
  const { shopSettings } = useShopSettings()
  const [externalLinkTarget, setExternalLinkTarget] = useState<ExternalLinkTarget | null>(null)

  // Perfumes catalog state
  const [perfumes, setPerfumes] = useState<Perfume[]>([])
  const [loading, setLoading] = useState(true)

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
  )

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Auth States
  const [sessionUser, setSessionUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  // Fetch Session & Catalog
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user || null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user || null)
    })

    fetchPerfumes()

    return () => subscription.unsubscribe()
  }, [])

  const fetchPerfumes = async () => {
    setLoading(true)
    try {
      const shopId = resolveShopId()
      const { data, error } = await supabase
        .from('perfumes')
        .select('*, brands(*)')
        .eq('shop_id', shopId)
      if (error) throw error
      setPerfumes(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Magic Link Login
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthMessage(null)
    setAuthError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/wishlist'
        }
      })

      if (error) throw error
      setAuthMessage(t('magic_link_sent'))
    } catch (err: any) {
      setAuthError(err.message || t('general_error'))
    } finally {
      setAuthLoading(false)
    }
  }

  // Logout
  const handleLogout = async () => {
    localStorage.removeItem('parfumworld_shop_id')
    await supabase.auth.signOut()
    setSessionUser(null)
  }

  // Filter wishlisted perfumes
  const wishlistedPerfumes = perfumes.filter(p => wishlist.includes(p.id))

  const getLocalizedDescription = (p: Perfume) => {
    if (currentLanguage.startsWith('ar')) return p.description_ar || p.description_en
    if (currentLanguage.startsWith('fr')) return p.description_fr || p.description_en
    return p.description_en
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen antialiased bg-[#120A07] text-[#F5EFE6] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#120A07] font-sans text-start"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-[#120A07]/90 backdrop-blur-md border-b border-[#D4AF37]/20 py-3.5 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-3">
          {/* Top-Right (RTL start): Unified Brand Logo & Shop Name */}
          <ShopBrandHeader onClick={() => navigate('/')} />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-xs text-[#F5EFE6] transition-transform duration-150 active:scale-95 cursor-pointer font-semibold"
            >
              <ArrowLeft className={`h-3.5 w-3.5 text-[#D4AF37] ${isRtl ? 'rotate-180' : ''}`} />
              <span>{t('back_to_picker')}</span>
            </button>

            <SocialContactMenu onSelectTarget={setExternalLinkTarget} />

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-[#F5EFE6] transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 text-[#F9E29C]" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-[#120A07]" />
              )}
            </button>

            {sessionUser ? (
              <div className="flex items-center gap-1.5 bg-[#1E120D] border border-[#D4AF37]/20 rounded-full p-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2.5 py-1 rounded-full hover:bg-red-500/10 text-[10px] text-[#A8988A] hover:text-red-300 transition-colors cursor-pointer font-bold flex items-center gap-1"
                >
                  <LogOut className="h-3 w-3" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/wishlist')}
                className="px-3.5 py-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-xs text-[#A8988A] hover:text-[#F5EFE6] transition-colors cursor-pointer font-semibold"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8 my-4">
        {/* Page Title & Auth state */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D4AF37]/15 pb-4">
          <div>
            <h1 className="font-arabic-display text-2xl md:text-3xl font-bold gold-metallic-text flex items-center gap-2.5">
              <Heart className="h-6 w-6 text-[#D4AF37] fill-[#D4AF37]" />
              {t('wishlist_page_title')}
            </h1>
            <p className="text-xs text-[#A8988A] mt-1">
              {isRtl
                ? 'مجموعتك الخاصة من العطور والتوليفات المفضلة'
                : 'Your personal catalog of favorite scent blends and luxury fragrances.'}
            </p>
          </div>

          {sessionUser ? (
            <div className="flex items-center gap-3 oud-card-surface rounded-2xl p-3">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#A8988A]">
                  Account Synced
                </span>
                <span className="text-xs font-mono text-[#F9E29C] mt-0.5">{sessionUser.email}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-xl bg-[#160D09] hover:bg-red-500/10 text-[#A8988A] hover:text-red-300 border border-[#D4AF37]/15 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        {/* Auth sync prompt banner */}
        {!sessionUser && (
          <section className="oud-card-surface rounded-3xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-start max-w-lg">
              <h3 className="text-sm font-bold text-[#F5EFE6] flex items-center justify-center md:justify-start gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-[#D4AF37]" />
                Sync Across Devices
              </h3>
              <p className="text-xs text-[#A8988A] leading-relaxed">
                {t('sync_wishlist_banner')}
              </p>
            </div>

            <form onSubmit={handleMagicLink} className="flex flex-col w-full md:w-auto gap-2.5 max-w-sm">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute start-3 top-3 h-4 w-4 text-[#A8988A]" />
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#120A07] border border-[#D4AF37]/20 rounded-xl py-2.5 ps-10 pe-4 text-xs text-[#F5EFE6] placeholder:text-[#A8988A]/60 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="px-5 py-2.5 rounded-xl gold-metallic-bg font-extrabold text-xs shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {authLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#120A07]" />}
                  <span>{t('send_magic_link')}</span>
                </button>
              </div>

              {authMessage && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <p>{authMessage}</p>
                </div>
              )}

              {authError && (
                <div className="flex items-center gap-1.5 text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <p>{authError}</p>
                </div>
              )}
            </form>
          </section>
        )}

        {/* Gallery */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="oud-card-surface rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="h-56 w-full oud-skeleton-shimmer" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 rounded oud-skeleton-shimmer" />
                  <div className="h-5 w-2/3 rounded oud-skeleton-shimmer" />
                  <div className="h-3 w-full rounded oud-skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlistedPerfumes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlistedPerfumes.map((perfume) => (
              <div
                key={perfume.id}
                className="group oud-card-surface hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full cursor-pointer relative"
                onClick={() => navigate(`/perfume/${perfume.id}`)}
              >
                {/* Spotlight Bottle Stage */}
                <div className="relative h-56 flex items-center justify-center p-4 overflow-hidden isolate rounded-t-2xl bg-[#160D09]">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle at center, rgba(212,175,55,0.20) 0%, transparent 68%)'
                    }}
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWishlist(perfume.id)
                    }}
                    className={`absolute top-3.5 ${
                      isRtl ? 'right-3.5' : 'left-3.5'
                    } z-20 p-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/30 text-[#D4AF37] hover:text-[#A8988A] transition-colors cursor-pointer`}
                  >
                    <Heart className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                  </button>

                  {perfume.image_url ? (
                    <img
                      src={perfume.image_url}
                      alt={perfume.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                      className="object-contain max-h-full max-w-full drop-shadow-[0_18px_24px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-500 relative z-10"
                    />
                  ) : (
                    <span className="text-xs uppercase tracking-widest text-[#A8988A]/50 font-serif relative z-10">
                      No Image
                    </span>
                  )}

                  {perfume.is_dupe_of && (
                    <div
                      className={`absolute bottom-3 ${
                        isRtl ? 'right-3' : 'left-3'
                      } z-20 flex items-center gap-1.5 bg-[#1E120D] border border-[#D4AF37]/25 rounded-lg px-2.5 py-1`}
                    >
                      <Tag className="h-3 w-3 text-[#D4AF37]" />
                      <span className="text-[10px] text-[#F5EFE6] font-medium">
                        {t('dupe_badge_text', { perfume: perfume.is_dupe_of })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <span
                      dir="ltr"
                      className="font-latin-luxury text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4AF37]/80 block"
                    >
                      {perfume.brands?.name}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#F5EFE6] group-hover:text-[#F9E29C] transition-colors">
                      {perfume.name}
                    </h3>
                    <p className="text-xs text-[#A8988A] line-clamp-2 leading-relaxed mt-1">
                      {getLocalizedDescription(perfume)}
                    </p>
                  </div>

                  {/* Volume & stock */}
                  <div className="border-t border-[#D4AF37]/15 pt-3 flex justify-between items-center text-[10px] font-mono font-medium text-[#A8988A]">
                    <span>
                      {perfume.volume_ml}ml • {perfume.concentration.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-3">
                      {perfume.in_stock !== false ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-[9px] font-sans font-semibold">
                          <CheckCircle2 className="h-3 w-3" />
                          {t('in_stock')}
                        </span>
                      ) : (
                        <span className="text-[#A8988A]/60 flex items-center gap-1 text-[9px] font-sans font-semibold">
                          <Package className="h-3 w-3" />
                          {t('out_of_stock')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto gap-4 oud-card-surface rounded-3xl p-8">
            <Heart className="h-10 w-10 text-[#A8988A]" />
            <p className="text-sm text-[#A8988A] leading-relaxed">{t('wishlist_empty')}</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-2 text-xs text-[#F9E29C] underline hover:text-white cursor-pointer"
            >
              {t('back_to_picker')}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center py-6 border-t border-[#D4AF37]/15 flex flex-col md:flex-row justify-between items-center gap-4 text-[#A8988A] text-xs px-4">
        <p>© 2026 {shopSettings.shop_name?.trim() || 'ParfumWorld'}. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-[#D4AF37]" />
          <span>Designed with Royal Oud & Gold aesthetics</span>
        </div>
      </footer>

      {/* External Link Confirmation Modal (Strictly for Social Media links) */}
      <ExternalLinkModal
        target={externalLinkTarget}
        onClose={() => setExternalLinkTarget(null)}
      />
    </div>
  )
}
