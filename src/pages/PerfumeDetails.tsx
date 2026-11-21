import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase, getJwtShopIdSync } from '../lib/supabase'
import { useWishlist } from '../hooks/useWishlist'
import { resolveShopId } from '../lib/utils'
import { useShopSettings } from '../context/ShopSettingsContext'
import ShopBrandHeader from '../components/ShopBrandHeader'
import SocialContactMenu from '../components/SocialContactMenu'
import ExternalLinkModal, { type ExternalLinkTarget } from '../components/ExternalLinkModal'
import {
  ArrowLeft,
  Award,
  Loader2,
  HelpCircle,
  Heart,
  Tag,
  Layers,
  MessageSquare,
  Volume2,
  Compass,
  LogOut,
  Sun,
  Moon,
  CheckCircle2
} from 'lucide-react'

interface PerfumeDetailsType {
  id: string
  brand_id: string
  name: string
  gender: 'male' | 'female' | 'unisex'
  concentration: 'parfum' | 'edp' | 'edt' | 'edc'
  price: number
  volume_ml: number
  family: string | null
  season_tags: string[]
  occasion_tags: string[]
  in_stock: boolean
  is_dupe_of: string | null
  image_url: string | null
  description_ar: string | null
  description_fr: string | null
  description_en: string | null
  brands: {
    name: string
    logo_url: string | null
    country: string | null
  }
}

interface PerfumeNoteMapping {
  layer: 'top' | 'middle' | 'base'
  notes: {
    id: string
    name_ar: string
    name_en: string
    name_fr: string
    layer: 'top' | 'middle' | 'base'
    description_ar: string | null
  }
}

export default function PerfumeDetails() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language || 'ar'
  const isRtl = currentLanguage.startsWith('ar')
  const currentLangCode: 'ar' | 'fr' | 'en' = currentLanguage.startsWith('en')
    ? 'en'
    : currentLanguage.startsWith('fr')
    ? 'fr'
    : 'ar'

  const { shopSettings } = useShopSettings()
  const [externalLinkTarget, setExternalLinkTarget] = useState<ExternalLinkTarget | null>(null)

  // Component states
  const [perfume, setPerfume] = useState<PerfumeDetailsType | null>(null)
  const [noteMappings, setNoteMappings] = useState<PerfumeNoteMapping[]>([])
  const [sessionUser, setSessionUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [recordingSale, setRecordingSale] = useState(false)
  const [saleToast, setSaleToast] = useState<string | null>(null)

  // Active blend note IDs (from URL ?notes=... or sessionStorage) to highlight matched notes in the 3-tier pyramid
  const activeBlendNoteIds = useMemo<Set<string>>(() => {
    const queryNotes = searchParams.get('notes')
    if (queryNotes) {
      return new Set(queryNotes.split(',').filter(Boolean))
    }
    try {
      const stored = sessionStorage.getItem('parfumworld_active_blend_ids')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return new Set(parsed)
        }
      }
    } catch {
      // Ignore parse errors
    }
    return new Set()
  }, [searchParams])

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

  const [similarPerfumes, setSimilarPerfumes] = useState<PerfumeDetailsType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { isWishlisted, toggleWishlist } = useWishlist()

  // 1. Fetch perfume details, notes mapping, whatsapp number and similar recommendations
  useEffect(() => {
    async function fetchPerfumeData() {
      if (!id) return
      try {
        setLoading(true)
        setError(null)

        const shopId = resolveShopId()

        // Fetch primary perfume details joined with brand details, strictly scoped to active shopId
        const { data: perfData, error: perfErr } = await supabase
          .from('perfumes')
          .select('*, brands(*)')
          .eq('id', id)
          .eq('shop_id', shopId)
          .single()

        if (perfErr) throw perfErr
        if (!perfData) throw new Error('Perfume not found.')

        // Fetch perfume note mapping
        const { data: mappingData, error: mappingErr } = await supabase
          .from('perfume_notes')
          .select('layer, notes(*)')
          .eq('perfume_id', id)

        if (mappingErr) throw mappingErr

        // Fetch similar perfumes belonging to the same scent family
        const { data: similarData } = await supabase
          .from('perfumes')
          .select('*, brands(*)')
          .eq('family', perfData.family)
          .eq('shop_id', shopId)
          .neq('id', id)
          .limit(3)

        setPerfume(perfData)
        const formattedMappings: PerfumeNoteMapping[] = (mappingData || []).map((m: any) => ({
          layer: m.layer,
          notes: Array.isArray(m.notes) ? m.notes[0] : m.notes
        }))
        setNoteMappings(formattedMappings)
        setSimilarPerfumes(similarData || [])
      } catch (err: any) {
        console.error('Error fetching perfume details:', err)
        setError(t('db_load_error'))
      } finally {
        setLoading(false)
      }
    }

    fetchPerfumeData()
  }, [id])

  // Manage Auth & Session Check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user || null)
      if (session?.user) {
        checkAdminStatus(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user || null)
      if (session?.user) {
        checkAdminStatus(session.user.id)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (userId: string) => {
    try {
      const shopId = resolveShopId()
      const { data } = await supabase
        .from('admins')
        .select('id, shop_id')
        .eq('id', userId)
        .eq('shop_id', shopId)
        .maybeSingle()
      setIsAdmin(!!data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('parfumworld_shop_id')
    await supabase.auth.signOut()
    setSessionUser(null)
    setIsAdmin(false)
  }

  // Synchronous check if the current user is an authenticated Admin for this shop_id
  const jwtShopId = getJwtShopIdSync()
  const activeShopId = (() => {
    try {
      return resolveShopId()
    } catch {
      return null
    }
  })()
  const isAuthenticatedShopAdmin = Boolean(
    sessionUser && activeShopId && ((jwtShopId && jwtShopId === activeShopId) || isAdmin)
  )

  const handleConfirmSale = async () => {
    if (!perfume || recordingSale) return
    setRecordingSale(true)
    try {
      const shopId = resolveShopId()
      const { error: insertError } = await supabase
        .from('sales_tallies')
        .insert({
          shop_id: shopId,
          perfume_id: perfume.id
        })

      if (insertError) throw insertError

      setSaleToast('Sale recorded!')
      setTimeout(() => {
        setSaleToast(null)
      }, 2800)
    } catch (err: any) {
      console.error('Failed to record sale tally:', err)
      alert(err.message || 'Failed to record sale.')
    } finally {
      setRecordingSale(false)
    }
  }

  // Localized note/desc name helper
  const getLocalizedName = (item: any) => {
    if (currentLanguage.startsWith('en')) return item.name_en
    if (currentLanguage.startsWith('fr')) return item.name_fr
    return item.name_ar
  }

  const getLocalizedDescription = (p: PerfumeDetailsType) => {
    if (currentLanguage.startsWith('en')) return p.description_en || p.description_ar
    if (currentLanguage.startsWith('fr')) return p.description_fr || p.description_ar
    return p.description_ar
  }

  // Split scent notes into pyramid tiers
  const topNotes = useMemo(() => {
    return noteMappings.filter(m => m.layer === 'top' && m.notes).map(m => m.notes)
  }, [noteMappings])

  const middleNotes = useMemo(() => {
    return noteMappings.filter(m => m.layer === 'middle' && m.notes).map(m => m.notes)
  }, [noteMappings])

  const baseNotes = useMemo(() => {
    return noteMappings.filter(m => m.layer === 'base' && m.notes).map(m => m.notes)
  }, [noteMappings])

  // Sanitized WhatsApp digits from shopSettings
  const sanitizedWhatsappNumber = useMemo(() => {
    return (shopSettings.whatsapp_number || '').replace(/[^0-9]/g, '')
  }, [shopSettings.whatsapp_number])

  // Direct WhatsApp Order Launch (No Modal, Non-Blocking Intent Log, iOS Safari Popup Safe)
  const handleDirectWhatsappOrder = () => {
    if (!perfume || !sanitizedWhatsappNumber) return

    const activeStoreName = shopSettings.shop_name?.trim() || 'ParfumWorld'
    const brandName = perfume.brands?.name || ''
    const messageText =
      currentLangCode === 'ar'
        ? `مرحباً ${activeStoreName}، أود طلب عطر "${perfume.name}" (${brandName} — ${perfume.volume_ml}ml).`
        : currentLangCode === 'fr'
        ? `Bonjour ${activeStoreName}, je souhaite commander le parfum "${perfume.name}" (${brandName} — ${perfume.volume_ml}ml).`
        : `Hello ${activeStoreName}, I would like to order "${perfume.name}" (${brandName} — ${perfume.volume_ml}ml).`

    const encodedMessage = encodeURIComponent(messageText)
    const waUrl = `https://wa.me/${sanitizedWhatsappNumber}?text=${encodedMessage}`

    // Fire log_whatsapp_intent non-blocking so network blips never delay checkout
    try {
      const shopId = resolveShopId()
      void supabase
        .rpc('log_whatsapp_intent', {
          p_shop_id: shopId,
          p_perfume_id: perfume.id,
          p_perfume_name: perfume.name
        })
        .then(
          () => {},
          () => {}
        )
    } catch {
      // Ignore tenant resolution errors during direct checkout
    }

    // Synchronously open wa.me so iOS Safari popup blocker never blocks the redirect
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="min-h-screen antialiased bg-[#120A07] text-[#F5EFE6] p-4 md:p-8"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
          <div className="md:col-span-5 h-96 rounded-3xl oud-skeleton-shimmer border border-[#D4AF37]/20" />
          <div className="md:col-span-7 space-y-5">
            <div className="h-4 w-32 rounded oud-skeleton-shimmer" />
            <div className="h-10 w-2/3 rounded oud-skeleton-shimmer" />
            <div className="h-20 w-full rounded-2xl oud-skeleton-shimmer" />
            <div className="h-24 w-full rounded-2xl oud-skeleton-shimmer" />
            <div className="h-14 w-full rounded-2xl oud-skeleton-shimmer" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !perfume) {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="min-h-screen antialiased bg-[#120A07] text-[#F5EFE6] flex flex-col items-center justify-center gap-3 p-6 text-center"
      >
        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20 mb-4">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h2 className="font-arabic-display text-2xl font-bold">{t('perfume_details_title')}</h2>
        <p className="text-sm text-[#A8988A] max-w-sm mt-1">{error || t('db_load_error')}</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#1E120D] border border-[#D4AF37]/30 rounded-full text-xs text-[#F5EFE6] hover:bg-[#2D1B14] transition-transform duration-150 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className={`h-4 w-4 text-[#D4AF37] ${isRtl ? 'rotate-180' : ''}`} />
          <span>{t('back_to_picker')}</span>
        </button>
      </div>
    )
  }

  const wishlisted = isWishlisted(perfume.id)

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen antialiased bg-[#120A07] text-[#F5EFE6] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#120A07]"
    >
      {/* Boutique Header */}
      <header className="sticky top-0 z-40 w-full bg-[#120A07]/90 backdrop-blur-md border-b border-[#D4AF37]/20 py-3.5 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-3">
          {/* Top-Right (RTL start): Unified Brand Logo & Shop Name */}
          <ShopBrandHeader onClick={() => navigate('/')} />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-xs text-[#F5EFE6] transition-transform duration-150 active:scale-95 cursor-pointer font-semibold"
            >
              <ArrowLeft className={`h-3.5 w-3.5 text-[#D4AF37] ${isRtl ? 'rotate-180' : ''}`} />
              <span>{t('back_to_picker')}</span>
            </button>

            <SocialContactMenu onSelectTarget={setExternalLinkTarget} />

            <button
              type="button"
              onClick={() => navigate('/wishlist')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-xs text-[#F5EFE6] transition-transform duration-150 active:scale-95 cursor-pointer font-semibold"
            >
              <Heart className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="hidden sm:inline">{t('wishlist_title')}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-[#F5EFE6] transition-transform duration-150 active:scale-95 cursor-pointer flex items-center justify-center"
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
                  <span className="hidden md:inline">{isRtl ? 'خروج' : 'Sign Out'}</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/wishlist')}
                className="px-3.5 py-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-xs text-[#A8988A] hover:text-[#F5EFE6] transition-transform duration-150 active:scale-95 cursor-pointer font-semibold"
              >
                {isRtl ? 'دخول' : 'Sign In'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Details Screen */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col gap-12 my-4">
        {/* Perfume Overview Block */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Spotlight Bottle Stage Card (Solid dark backdrop, radial golden spotlight) */}
          <div className="md:col-span-5 w-full flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden isolate oud-card-surface bg-[#160D09] flex items-center justify-center p-8">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(212,175,55,0.22) 0%, transparent 68%)'
                }}
              />

              {perfume.image_url ? (
                <img
                  src={perfume.image_url}
                  alt={perfume.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                  className="object-contain max-h-full max-w-full drop-shadow-[0_18px_24px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform duration-500 relative z-10"
                />
              ) : (
                <span
                  dir="ltr"
                  className="font-latin-luxury text-xs uppercase tracking-[0.2em] text-[#A8988A]/50 relative z-10"
                >
                  No Image
                </span>
              )}

              {/* Target gender overlay tag */}
              <div className="absolute top-4 end-4 z-20">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#1E120D] border border-[#D4AF37]/30 text-[11px] font-bold text-[#F9E29C]">
                  {t(`gender_options.${perfume.gender}`)}
                </span>
              </div>

              {/* Volume tag */}
              <div className="absolute bottom-4 start-4 z-20">
                <span
                  dir="ltr"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E120D] border border-[#D4AF37]/30 text-[11px] font-mono text-[#F9E29C] font-bold"
                >
                  <Volume2 className="h-3 w-3 text-[#D4AF37]" />
                  {perfume.volume_ml} ml
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions & CTAs */}
          <div className="md:col-span-7 flex flex-col gap-6">
            {/* Header info */}
            <div className="flex flex-col gap-2.5">
              {/* Latin Luxury Brand and Country info */}
              <div className="flex justify-between items-center">
                <span
                  dir="ltr"
                  className="font-latin-luxury text-sm uppercase tracking-[0.2em] font-semibold text-[#D4AF37]/80"
                >
                  {perfume.brands.name}
                </span>
                {perfume.brands.country && (
                  <span className="text-xs text-[#A8988A]">{perfume.brands.country}</span>
                )}
              </div>

              {/* Perfume title */}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5EFE6] leading-tight">
                {perfume.name}
              </h1>

              {/* Dupe announcement notice */}
              {perfume.is_dupe_of && (
                <div className="inline-flex self-start items-center gap-2 border border-[#D4AF37]/35 bg-[#2D1B14] rounded-xl px-4 py-1.5 text-xs text-[#F9E29C] font-semibold my-1">
                  <Tag className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>{t('dupe_badge_text', { perfume: perfume.is_dupe_of })}</span>
                </div>
              )}
            </div>

            {/* Concentration block and wishlisting */}
            <div className="flex items-center justify-between oud-card-surface rounded-2xl p-4.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-[#A8988A] font-semibold">
                  {t('concentration_label')}
                </span>
                <span
                  dir="ltr"
                  className="font-latin-luxury text-lg md:text-xl font-bold text-[#F9E29C] uppercase tracking-[0.2em]"
                >
                  {perfume.concentration}
                </span>
              </div>

              {/* Wishlist toggle */}
              <button
                type="button"
                onClick={() => toggleWishlist(perfume.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-transform duration-150 active:scale-95 cursor-pointer ${
                  wishlisted
                    ? 'bg-[#2D1B14] border-[#D4AF37] text-[#F9E29C]'
                    : 'bg-[#160D09] border-[#D4AF37]/20 text-[#A8988A] hover:text-[#F5EFE6] hover:border-[#D4AF37]/50'
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${wishlisted ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`}
                />
                <span>{wishlisted ? t('wishlist_added') : t('wishlist_add')}</span>
              </button>
            </div>

            {/* Description details */}
            <div className="flex flex-col gap-2 text-start">
              <h3 className="font-arabic-display text-base text-[#F9E29C] font-bold">
                {t('about_fragrance')}
              </h3>
              <p className="text-sm text-[#F5EFE6]/90 leading-relaxed text-start">
                {getLocalizedDescription(perfume)}
              </p>
            </div>

            {/* Admin-Only Confirm Sale (+1) Tally Button (Strictly isolated to authenticated shop owner) */}
            {isAuthenticatedShopAdmin && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleConfirmSale}
                  disabled={recordingSale}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl gold-metallic-bg font-black text-sm shadow-xl border border-[#F9E29C]/60 transition-transform duration-150 active:scale-95 cursor-pointer disabled:opacity-60"
                >
                  {recordingSale ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#120A07]" />
                  ) : (
                    <span>✅ Confirm Sale (+1)</span>
                  )}
                </button>
                <p className="text-[11px] text-[#A8988A] text-center">
                  {isRtl
                    ? 'تذكير للمالك: عند إتمام طلب واتساب مع الزبون، اضغط أعلاه لتسجيل البيع في الإحصائيات.'
                    : 'Owner reminder: Once a WhatsApp transaction completes, tap above to tally the sale.'}
                </p>

                {saleToast && (
                  <div
                    role="status"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{saleToast}</span>
                  </div>
                )}
              </div>
            )}

            {/* Direct WhatsApp Order Button (All users when whatsapp_number is configured & in_stock !== false) */}
            {perfume.in_stock !== false ? (
              sanitizedWhatsappNumber ? (
                <button
                  type="button"
                  onClick={handleDirectWhatsappOrder}
                  className="w-full flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl gold-metallic-bg font-extrabold text-sm shadow-[0_0_24px_rgba(212,175,55,0.28)] transition-transform duration-150 active:scale-95 cursor-pointer text-center"
                >
                  <MessageSquare className="h-4 w-4 text-[#120A07]" />
                  <span>
                    {currentLangCode === 'ar'
                      ? 'اطلب هذا العطر عبر واتساب'
                      : currentLangCode === 'fr'
                      ? 'Commander ce parfum sur WhatsApp'
                      : 'Order this perfume via WhatsApp'}
                  </span>
                </button>
              ) : null
            ) : (
              <div className="w-full oud-card-surface rounded-2xl p-4 text-center text-xs text-[#A8988A] font-semibold">
                {t('out_of_stock')}
              </div>
            )}
          </div>
        </section>

        {/* STEP 2: Architectural 3-Tier Visual Fragrance Pyramid */}
        <section className="border-t border-[#D4AF37]/15 pt-10 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D4AF37]/15 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-[#D4AF37]" />
              <h2 className="font-arabic-display text-xl font-bold gold-metallic-text">
                {t('scent_pyramid_header')}
              </h2>
            </div>
            {activeBlendNoteIds.size > 0 && (
              <span className="text-xs text-[#A8988A] flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-[#D4AF37]" />
                {isRtl
                  ? 'النوتات المضيئة بالذهب تطابق اختيارك'
                  : 'Gold-highlighted notes match your selection'}
              </span>
            )}
          </div>

          {/* Solid .oud-card-surface 3-Tier Pyramid Container (Zero backdrop-blur) */}
          <div className="oud-card-surface rounded-3xl p-6 md:p-10 w-full max-w-3xl mx-auto flex flex-col items-center gap-6">
            {/* Tier 1 (Narrowest): الإفتتاحية (Top Notes) */}
            {topNotes.length > 0 && (
              <div className="w-full md:w-[58%] mx-auto flex flex-col items-center text-center gap-3 px-4 py-4 rounded-2xl bg-[#160D09] border border-[#D4AF37]/20">
                <span className="font-arabic-display text-base font-bold text-[#F9E29C]">
                  {isRtl ? 'الإفتتاحية' : t('scent_pyramid_top')}
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {topNotes.map(note => {
                    const isMatched = activeBlendNoteIds.has(note.id)
                    return (
                      <span
                        key={note.id}
                        className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          isMatched
                            ? 'bg-[#2D1B14] border-[#D4AF37] text-[#F9E29C] ring-1 ring-[#D4AF37]/55 shadow-[0_0_12px_rgba(212,175,55,0.22)]'
                            : 'bg-[#1E120D] border-[#D4AF37]/20 text-[#F5EFE6]'
                        }`}
                      >
                        {getLocalizedName(note)}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tapered Golden Hairline Divider 1 */}
            {topNotes.length > 0 && (middleNotes.length > 0 || baseNotes.length > 0) && (
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent" />
            )}

            {/* Tier 2 (Medium): قلب العطر (Heart Notes) */}
            {middleNotes.length > 0 && (
              <div className="w-full md:w-[78%] mx-auto flex flex-col items-center text-center gap-3 px-5 py-4 rounded-2xl bg-[#160D09] border border-[#D4AF37]/25">
                <span className="font-arabic-display text-base font-bold text-[#F9E29C]">
                  {isRtl ? 'قلب العطر' : t('scent_pyramid_middle')}
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {middleNotes.map(note => {
                    const isMatched = activeBlendNoteIds.has(note.id)
                    return (
                      <span
                        key={note.id}
                        className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          isMatched
                            ? 'bg-[#2D1B14] border-[#D4AF37] text-[#F9E29C] ring-1 ring-[#D4AF37]/55 shadow-[0_0_12px_rgba(212,175,55,0.22)]'
                            : 'bg-[#1E120D] border-[#D4AF37]/20 text-[#F5EFE6]'
                        }`}
                      >
                        {getLocalizedName(note)}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tapered Golden Hairline Divider 2 */}
            {middleNotes.length > 0 && baseNotes.length > 0 && (
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent" />
            )}

            {/* Tier 3 (Widest): القاعدة (Base Notes) */}
            {baseNotes.length > 0 && (
              <div className="w-full mx-auto flex flex-col items-center text-center gap-3 px-6 py-5 rounded-2xl bg-[#160D09] border border-[#D4AF37]/30">
                <span className="font-arabic-display text-base font-bold text-[#F9E29C]">
                  {isRtl ? 'القاعدة' : t('scent_pyramid_base')}
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {baseNotes.map(note => {
                    const isMatched = activeBlendNoteIds.has(note.id)
                    return (
                      <span
                        key={note.id}
                        className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          isMatched
                            ? 'bg-[#2D1B14] border-[#D4AF37] text-[#F9E29C] ring-1 ring-[#D4AF37]/55 shadow-[0_0_12px_rgba(212,175,55,0.22)]'
                            : 'bg-[#1E120D] border-[#D4AF37]/20 text-[#F5EFE6]'
                        }`}
                      >
                        {getLocalizedName(note)}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Similar Perfumes Section */}
        <section className="border-t border-[#D4AF37]/15 pt-10 flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-[#D4AF37]/15 pb-3">
            <Compass className="h-4.5 w-4.5 text-[#D4AF37]" />
            <h2 className="font-arabic-display text-xl font-bold gold-metallic-text">
              {t('similar_perfumes_title')}
            </h2>
          </div>

          {similarPerfumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarPerfumes.map((p, idx) => (
                <Link
                  key={p.id}
                  to={`/perfume/${p.id}`}
                  style={{ animationDelay: `${Math.min(idx, 7) * 45}ms` }}
                  className="group oud-card-surface oud-card-reveal hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-colors duration-300 flex flex-col justify-between"
                >
                  {/* Spotlight Bottle Stage */}
                  <div className="relative h-48 flex items-center justify-center p-4 overflow-hidden isolate rounded-t-2xl bg-[#160D09]">
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(circle at center, rgba(212,175,55,0.20) 0%, transparent 68%)'
                      }}
                    />
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                        className="object-contain max-h-full max-w-full drop-shadow-[0_18px_24px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-500 relative z-10"
                      />
                    ) : (
                      <span
                        dir="ltr"
                        className="font-latin-luxury text-xs uppercase tracking-[0.2em] text-[#A8988A]/50 relative z-10"
                      >
                        No Image
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <span
                        dir="ltr"
                        className="font-latin-luxury text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4AF37]/80 block mb-1"
                      >
                        {p.brands.name}
                      </span>
                      <h4 className="font-serif text-base font-bold text-[#F5EFE6] group-hover:text-[#F9E29C] transition-colors leading-tight">
                        {p.name}
                      </h4>
                      {p.is_dupe_of && (
                        <span className="inline-flex items-center text-[10px] font-bold text-[#F9E29C] bg-[#2D1B14] border border-[#D4AF37]/30 rounded-lg px-2 py-0.5 mt-2">
                          {t('dupe_badge_text', { perfume: p.is_dupe_of })}
                        </span>
                      )}
                    </div>

                    <div className="border-t border-[#D4AF37]/15 pt-2.5 flex justify-between items-center text-[10px] font-medium font-mono text-[#A8988A]">
                      <span dir="ltr">
                        {p.volume_ml}ml • {p.concentration.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#A8988A] italic py-4">{t('similar_empty')}</p>
          )}
        </section>
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
