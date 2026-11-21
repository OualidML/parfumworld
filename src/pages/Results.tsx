import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { Note } from '../types/database'
import { resolveShopId } from '../lib/utils'
import { useWishlist } from '../hooks/useWishlist'
import { useShopSettings } from '../context/ShopSettingsContext'
import ShopBrandHeader from '../components/ShopBrandHeader'
import SocialContactMenu from '../components/SocialContactMenu'
import ExternalLinkModal, { type ExternalLinkTarget } from '../components/ExternalLinkModal'
import {
  ArrowLeft,
  Sparkles,
  Award,
  Filter,
  AlertTriangle,
  Tag,
  CheckCircle2,
  Package,
  Layers,
  Heart,
  Undo,
  X,
  LogOut,
  Sun,
  Moon,
  MessageSquare
} from 'lucide-react'

interface MatchedPerfume {
  id: string
  brand_id: string
  brand_name: string
  brand_logo_url: string | null
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
  match_score: number
  matching_note_ids: string[]
  all_note_ids: string[]
}

export default function Results() {
  const { t, i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const currentLanguage = i18n.language || 'ar'
  const isRtl = currentLanguage.startsWith('ar')
  const currentLangCode: 'en' | 'fr' | 'ar' = currentLanguage.startsWith('en')
    ? 'en'
    : currentLanguage.startsWith('fr')
    ? 'fr'
    : 'ar'

  const resultsGridRef = useRef<HTMLDivElement>(null)

  // Import wishlist hook
  const { wishlist, toggleWishlist } = useWishlist()
  const isWishlisted = (id: string) => wishlist.includes(id)

  // Parse notes from query param: ?notes=uuid1,uuid2...
  const notesParam = searchParams.get('notes') || ''
  const selectedNoteIds = useMemo(() => {
    return notesParam ? notesParam.split(',').filter(Boolean) : []
  }, [notesParam])

  // Parse excluded notes: ?exclude=uuid1,uuid2...
  const excludeParam = searchParams.get('exclude') || ''
  const excludedNoteIds = useMemo(() => {
    return excludeParam ? excludeParam.split(',').filter(Boolean) : []
  }, [excludeParam])

  // Persist active blend note IDs so PerfumeDetails 3-tier pyramid can highlight matching notes
  useEffect(() => {
    try {
      if (selectedNoteIds.length > 0) {
        sessionStorage.setItem(
          'parfumworld_active_blend_ids',
          JSON.stringify(selectedNoteIds)
        )
      }
    } catch {
      // Ignore storage errors
    }
  }, [selectedNoteIds])

  // Component states
  const [perfumes, setPerfumes] = useState<MatchedPerfume[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Comparison State
  const [comparedPerfumeIds, setComparedPerfumeIds] = useState<string[]>([])
  const [compareModalOpen, setCompareModalOpen] = useState(false)
  const [sessionUser, setSessionUser] = useState<any>(null)

  const { shopSettings } = useShopSettings()
  const [externalLinkTarget, setExternalLinkTarget] = useState<ExternalLinkTarget | null>(null)
  const sanitizedWhatsappNumber = useMemo(
    () => (shopSettings.whatsapp_number || '').replace(/[^0-9]/g, ''),
    [shopSettings.whatsapp_number]
  )

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

  const toggleCompare = (id: string) => {
    setComparedPerfumeIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(pid => pid !== id)
      } else {
        if (prev.length >= 2) {
          return [prev[1], id]
        }
        return [...prev, id]
      }
    })
  }

  // Secondary Filters State
  const [filterGender, setFilterGender] = useState<string>('all')
  const [filterConcentration, setFilterConcentration] = useState<string>('all')
  const [filterInStockOnly, setFilterInStockOnly] = useState<boolean>(false)

  // 1. Fetch matching perfumes and all note descriptions (untouched RPC logic)
  useEffect(() => {
    async function fetchResults() {
      if (selectedNoteIds.length === 0) {
        setPerfumes([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const shopId = resolveShopId()

        // Invoke PostgreSQL RPC matching function with exclusions
        const { data: matchedData, error: matchedErr } = await supabase
          .rpc('match_perfumes', {
            user_note_ids: selectedNoteIds,
            excluded_note_ids: excludedNoteIds,
            p_shop_id: shopId
          })

        if (matchedErr) throw matchedErr

        // Fetch all scent notes description (global + active shop's custom notes) to map on the card list
        const { data: notesData, error: notesErr } = await supabase
          .from('notes')
          .select('*')
          .or(`shop_id.is.null,shop_id.eq.${shopId}`)

        if (notesErr) throw notesErr

        setPerfumes(matchedData || [])
        setNotes(notesData || [])
      } catch (err: any) {
        console.error('Error fetching matching results:', err)
        setError(t('db_load_error'))
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [selectedNoteIds, excludedNoteIds])

  // Manage Auth & Session Check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user || null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSessionUser(null)
  }

  // Localized retrieval helpers
  const getLocalizedName = (item: Note) => {
    if (currentLanguage.startsWith('en')) return item.name_en
    if (currentLanguage.startsWith('fr')) return item.name_fr
    return item.name_ar
  }

  const getLocalizedDescription = (p: MatchedPerfume) => {
    if (currentLanguage.startsWith('en')) return p.description_en || p.description_ar
    if (currentLanguage.startsWith('fr')) return p.description_fr || p.description_ar
    return p.description_ar
  }

  // Auto-recovery: choose a note that can be suggested for removal to broaden results
  const suggestRemoveNote = useMemo(() => {
    if (selectedNoteIds.length === 0 || notes.length === 0) return null
    const targetId = selectedNoteIds[0]
    return notes.find(n => n.id === targetId) || null
  }, [selectedNoteIds, notes])

  // Remove note from URL query params
  const handleRemoveSuggestedNote = (noteId: string) => {
    const updatedIds = selectedNoteIds.filter(id => id !== noteId)
    if (updatedIds.length === 0) {
      navigate('/')
      return
    }
    const nextParams: Record<string, string> = { notes: updatedIds.join(',') }
    if (excludedNoteIds.length > 0) {
      nextParams.exclude = excludedNoteIds.join(',')
    }
    setSearchParams(nextParams)
  }

  // Apply secondary filtering client-side
  const filteredPerfumes = useMemo(() => {
    return perfumes.filter(p => {
      if (filterGender !== 'all' && p.gender !== filterGender) return false
      if (filterConcentration !== 'all' && p.concentration !== filterConcentration) return false
      if (filterInStockOnly && !p.in_stock) return false
      return true
    })
  }, [perfumes, filterGender, filterConcentration, filterInStockOnly])

  const selectedNoteObjects = useMemo(
    () => notes.filter(n => selectedNoteIds.includes(n.id)),
    [notes, selectedNoteIds]
  )

  const comparedPerfumes = useMemo(() => {
    return perfumes.filter(p => comparedPerfumeIds.includes(p.id))
  }, [perfumes, comparedPerfumeIds])

  const comparisonDetails = useMemo(() => {
    if (comparedPerfumes.length < 2) return null
    const p1 = comparedPerfumes[0]
    const p2 = comparedPerfumes[1]

    const p1Notes = notes.filter(n => p1.all_note_ids.includes(n.id))
    const p2Notes = notes.filter(n => p2.all_note_ids.includes(n.id))

    const shared = p1Notes.filter(n1 => p2Notes.some(n2 => n2.id === n1.id))
    const uniqueP1 = p1Notes.filter(n1 => !shared.some(s => s.id === n1.id))
    const uniqueP2 = p2Notes.filter(n2 => !shared.some(s => s.id === n2.id))

    return { shared, uniqueP1, uniqueP2 }
  }, [comparedPerfumes, notes])

  const getDockCtaLabel = (count: number) => {
    if (currentLangCode === 'ar') {
      return `عرض ${count} عطور مطابقة`
    }
    if (currentLangCode === 'fr') {
      return `Voir ${count} parfums correspondants`
    }
    return `View ${count} matching perfumes`
  }

  const isDockVisible = selectedNoteObjects.length > 0 && comparedPerfumeIds.length === 0

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen antialiased bg-[#120A07] text-[#F5EFE6] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#120A07]"
    >
      {/* Top Boutique Header */}
      <header className="sticky top-0 z-40 w-full bg-[#120A07]/90 backdrop-blur-md border-b border-[#D4AF37]/20 py-3.5 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-3">
          {/* Top-Right (RTL start): Unified Brand Logo & Shop Name */}
          <ShopBrandHeader onClick={() => navigate('/')} />

          <div className="flex flex-wrap items-center gap-2">
            {/* Back button */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-xs text-[#F5EFE6] transition-transform duration-150 active:scale-95 cursor-pointer font-semibold"
            >
              <ArrowLeft className={`h-3.5 w-3.5 text-[#D4AF37] ${isRtl ? 'rotate-180' : ''}`} />
              <span>{t('back_to_picker')}</span>
            </button>

            <SocialContactMenu onSelectTarget={setExternalLinkTarget} />

            {/* Wishlist navigation portal */}
            <button
              type="button"
              onClick={() => navigate('/wishlist')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-xs text-[#F5EFE6] transition-transform duration-150 active:scale-95 cursor-pointer font-semibold"
            >
              <Heart className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="hidden sm:inline">{t('wishlist_title')}</span>
            </button>

            {/* Theme Toggler */}
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

            {/* Auth Widget */}
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

      {/* Main Container (pb-36 md:pb-28 when dock is visible) */}
      <main
        className={`flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6 md:gap-8 my-4 ${
          isDockVisible || comparedPerfumeIds.length > 0 ? 'pb-36 md:pb-28' : ''
        }`}
      >
        {/* Dark Espresso Shimmer Skeletons during Catalog Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="oud-card-surface rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="h-56 w-full oud-skeleton-shimmer" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-24 rounded oud-skeleton-shimmer" />
                  <div className="h-5 w-3/4 rounded oud-skeleton-shimmer" />
                  <div className="h-3 w-full rounded oud-skeleton-shimmer" />
                  <div className="flex gap-1.5 pt-2">
                    <div className="h-5 w-14 rounded-full oud-skeleton-shimmer" />
                    <div className="h-5 w-16 rounded-full oud-skeleton-shimmer" />
                    <div className="h-5 w-12 rounded-full oud-skeleton-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Database Errors */}
        {error && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3 max-w-md mx-auto text-center">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <p className="text-sm text-[#F5EFE6] font-medium">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-2 text-xs text-[#F9E29C] underline hover:text-white cursor-pointer"
            >
              {t('back_to_picker')}
            </button>
          </div>
        )}

        {/* Loaded successfully */}
        {!loading && !error && (
          <>
            {/* Secondary filters bar */}
            {perfumes.length > 0 && (
              <div className="oud-card-surface rounded-2xl p-5 md:p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-[#D4AF37]/15 pb-2.5">
                  <Filter className="h-4 w-4 text-[#D4AF37]" />
                  <h3 className="font-arabic-display text-base font-bold gold-metallic-text">
                    {t('filters_header')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-end text-start">
                  {/* 1. Gender Filter */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-[#A8988A] font-medium">{t('gender_label')}</label>
                    <div className="flex bg-[#120A07] p-1 border border-[#D4AF37]/15 rounded-xl gap-1">
                      {['all', 'male', 'female', 'unisex'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFilterGender(g)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-transform duration-150 active:scale-95 cursor-pointer ${
                            filterGender === g
                              ? 'bg-[#2D1B14] border border-[#D4AF37] text-[#F9E29C] font-bold'
                              : 'text-[#A8988A] hover:text-[#F5EFE6]'
                          }`}
                        >
                          {g === 'all' ? t('gender_all') : t(`gender_options.${g}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Concentration Filter */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-[#A8988A] font-medium">{t('concentration_label')}</label>
                    <select
                      value={filterConcentration}
                      onChange={(e) => setFilterConcentration(e.target.value)}
                      className="w-full bg-[#120A07] border border-[#D4AF37]/20 rounded-xl p-2.5 text-xs text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="all">{t('concentration_all')}</option>
                      <option value="parfum">Parfum</option>
                      <option value="edp">Eau de Parfum (EDP)</option>
                      <option value="edt">Eau de Toilette (EDT)</option>
                      <option value="edc">Eau de Cologne (EDC)</option>
                    </select>
                  </div>

                  {/* 3. In Stock Filter */}
                  <div className="flex items-center gap-2.5 py-1 sm:py-2.5">
                    <input
                      id="inStockCheck"
                      type="checkbox"
                      checked={filterInStockOnly}
                      onChange={(e) => setFilterInStockOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-[#D4AF37]/30 bg-[#120A07] text-[#D4AF37] focus:ring-0 focus:ring-offset-0 accent-[#D4AF37] cursor-pointer"
                    />
                    <label
                      htmlFor="inStockCheck"
                      className="text-xs text-[#F5EFE6] cursor-pointer select-none font-medium"
                    >
                      {t('in_stock_only')}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Matching Result Cards List */}
            {filteredPerfumes.length > 0 || selectedNoteIds.length > 0 ? (
              <div
                ref={resultsGridRef}
                id="results-grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-24"
              >
                {/* 1. Dynamic Bespoke Custom Blend Card */}
                {selectedNoteIds.length > 0 && (
                  <div className="group oud-card-surface oud-card-reveal hover:border-[#D4AF37]/60 rounded-2xl overflow-hidden transition-colors duration-300 flex flex-col justify-between relative cursor-default">
                    {/* Top Spotlight Stage */}
                    <div className="relative h-56 flex flex-col items-center justify-center text-center p-6 overflow-hidden isolate rounded-t-2xl bg-[#160D09] border-b border-[#D4AF37]/15">
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            'radial-gradient(circle at center, rgba(212,175,55,0.20) 0%, transparent 68%)'
                        }}
                      />
                      <div className="h-14 w-14 rounded-full bg-[#2D1B14] border border-[#D4AF37] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)] mb-3 relative z-10">
                        <Sparkles className="h-6 w-6 text-[#F9E29C]" />
                      </div>
                      <span className="text-[11px] text-[#D4AF37] font-extrabold relative z-10">
                        {isRtl ? 'تركيبة مخصصة' : 'Bespoke Fragrance'}
                      </span>
                      <h3 className="font-arabic-display text-xl font-bold gold-metallic-text mt-1 relative z-10">
                        {isRtl ? 'توليفتك الخاصة' : 'Your Custom Scent Blend'}
                      </h3>
                    </div>

                    {/* Content details */}
                    <div className="p-6 flex-1 flex flex-col justify-between gap-5 text-start">
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-[#D4AF37]">
                            {isRtl ? 'النوتات المختارة' : 'Selected Scent Profile'}
                          </span>
                        </div>

                        {/* Notes list chips */}
                        <div className="flex flex-wrap gap-1.5 max-h-[75px] overflow-y-auto no-scrollbar pr-1">
                          {selectedNoteObjects.map((note) => (
                            <span
                              key={note.id}
                              className="px-2.5 py-0.5 rounded-full bg-[#2D1B14] border border-[#D4AF37] text-[10px] font-semibold text-[#F9E29C]"
                            >
                              {getLocalizedName(note)}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-[#A8988A] leading-relaxed mt-1">
                          {isRtl
                            ? 'تركيبة عطرية فاخرة تُحضّر خصيصاً لك بنسب متوازنة وفق اختيارك.'
                            : 'A bespoke perfume blended on-demand in our boutique, crafted around your exact selection.'}
                        </p>
                      </div>

                      {/* WhatsApp order action (Direct launch when whatsapp_number is configured) */}
                      {sanitizedWhatsappNumber && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            const activeStoreName = shopSettings.shop_name?.trim() || 'ParfumWorld'
                            const notesStr = selectedNoteObjects
                              .map(n => getLocalizedName(n))
                              .join(', ')
                            const messageText = isRtl
                              ? `مرحباً ${activeStoreName}، أود طلب تركيب عطري الخاص بالمكونات التالية: ${notesStr}.`
                              : `Hello ${activeStoreName}, I would like to order a bespoke custom blend with the following notes: ${notesStr}.`
                            const encodedText = encodeURIComponent(messageText)
                            window.open(
                              `https://wa.me/${sanitizedWhatsappNumber}?text=${encodedText}`,
                              '_blank',
                              'noopener,noreferrer'
                            )
                          }}
                          className="w-full py-3 rounded-xl gold-metallic-bg font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-transform duration-150 active:scale-95 cursor-pointer"
                        >
                          <MessageSquare className="h-4 w-4 text-[#120A07]" />
                          <span>{isRtl ? 'اطلب تركيبتك الخاصة' : 'Order Custom Blend'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Boutique Perfume Cards (Spotlight Framing, Match Badges, Staggered Reveal) */}
                {filteredPerfumes.map((perfume, idx) => {
                  const roundedScore = Math.round(perfume.match_score)
                  return (
                    <div
                      key={perfume.id}
                      style={{ animationDelay: `${Math.min(idx, 7) * 45}ms` }}
                      onClick={() =>
                        navigate(
                          `/perfume/${perfume.id}${
                            selectedNoteIds.length > 0 ? `?notes=${selectedNoteIds.join(',')}` : ''
                          }`
                        )
                      }
                      className="group oud-card-surface oud-card-reveal hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-colors duration-300 flex flex-col justify-between relative cursor-pointer"
                    >
                      {/* Spotlight Bottle Stage */}
                      <div className="relative h-56 flex items-center justify-center p-4 overflow-hidden isolate rounded-t-2xl bg-[#160D09]">
                        {/* Soft radial golden spotlight behind bottle */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              'radial-gradient(circle at center, rgba(212,175,55,0.20) 0%, transparent 68%)'
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

                        {/* Wishlist Toggle Heart */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleWishlist(perfume.id)
                          }}
                          className={`absolute top-3.5 ${
                            isRtl ? 'right-3.5' : 'left-3.5'
                          } z-20 p-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/25 text-[#A8988A] hover:text-[#F9E29C] hover:border-[#D4AF37] transition-transform duration-150 active:scale-95 cursor-pointer`}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isWishlisted(perfume.id) ? 'fill-[#D4AF37] text-[#D4AF37]' : ''
                            }`}
                          />
                        </button>

                        {/* Smart Match Badge (Crisp Gold Pill, Zero backdrop-blur) */}
                        <div
                          className={`absolute top-3.5 ${
                            isRtl ? 'left-3.5' : 'right-3.5'
                          } z-20`}
                        >
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full gold-metallic-bg font-extrabold text-xs shadow-md">
                            {isRtl
                              ? `تطابق ${roundedScore}%`
                              : t('match_percentage', { percentage: roundedScore })}
                          </span>
                        </div>

                        {/* Dupe Badge */}
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

                      {/* Details Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                        <div className="flex flex-col gap-2">
                          {/* Latin Luxury Brand Name and Stock Status */}
                          <div className="flex justify-between items-center text-[11px] font-semibold">
                            <span
                              dir="ltr"
                              className="font-latin-luxury uppercase tracking-[0.2em] text-[#D4AF37]/80"
                            >
                              {perfume.brand_name}
                            </span>
                            {perfume.in_stock !== false ? (
                              <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                                <CheckCircle2 className="h-3 w-3" />
                                {t('in_stock')}
                              </span>
                            ) : (
                              <span className="text-[#A8988A]/60 flex items-center gap-1 text-[10px]">
                                <Package className="h-3 w-3" />
                                {t('out_of_stock')}
                              </span>
                            )}
                          </div>

                          {/* Perfume Name */}
                          <h4 className="font-serif text-lg font-bold text-[#F5EFE6] group-hover:text-[#F9E29C] transition-colors text-start">
                            {perfume.name}
                          </h4>

                          {/* Description */}
                          <p className="text-xs text-[#A8988A] leading-relaxed line-clamp-2 text-start">
                            {getLocalizedDescription(perfume)}
                          </p>
                        </div>

                        {/* Note Comparison Grid */}
                        <div className="border-t border-[#D4AF37]/15 pt-4 text-start">
                          <span className="text-[10px] font-semibold text-[#A8988A] flex items-center gap-1 mb-2.5">
                            <Layers className="h-3 w-3 text-[#D4AF37]" />
                            {t('scent_pyramid_header')}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {notes
                              .filter((note) => perfume.all_note_ids.includes(note.id))
                              .map((note) => {
                                const isMatched = perfume.matching_note_ids.includes(note.id)
                                return (
                                  <span
                                    key={note.id}
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                      isMatched
                                        ? 'bg-[#2D1B14] border-[#D4AF37] text-[#F9E29C]'
                                        : 'bg-[#160D09] border-[#A8988A]/20 text-[#A8988A]'
                                    }`}
                                  >
                                    {getLocalizedName(note)}
                                  </span>
                                )
                              })}
                          </div>
                        </div>

                        {/* Footer details (volume, concentration, compare selector) */}
                        <div className="border-t border-[#D4AF37]/15 pt-4 flex justify-between items-center">
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              id={`compare-${perfume.id}`}
                              checked={comparedPerfumeIds.includes(perfume.id)}
                              onChange={() => toggleCompare(perfume.id)}
                              className="w-4 h-4 rounded border-[#D4AF37]/30 bg-[#120A07] text-[#D4AF37] focus:ring-0 focus:ring-offset-0 accent-[#D4AF37] cursor-pointer"
                            />
                            <label
                              htmlFor={`compare-${perfume.id}`}
                              className="text-[11px] font-semibold text-[#A8988A] hover:text-[#F5EFE6] cursor-pointer select-none"
                            >
                              {t('compare_trigger')}
                            </label>
                          </div>

                          <div className="flex items-center gap-1">
                            <span dir="ltr" className="text-[10px] text-[#A8988A] font-mono">
                              {perfume.volume_ml}ml • {perfume.concentration.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* Smart Empty State Recovery */
              <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 max-w-xl mx-auto text-center oud-card-surface rounded-3xl p-8">
                <div className="h-16 w-16 rounded-full bg-[#2D1B14] border border-[#D4AF37]/40 flex items-center justify-center text-[#F9E29C] mb-6">
                  <AlertTriangle className="h-8 w-8" />
                </div>

                <h3 className="font-arabic-display text-2xl font-bold text-[#F5EFE6] mb-2 leading-tight">
                  {t('results_empty_state')}
                </h3>

                <p className="text-sm text-[#A8988A] leading-relaxed mb-8 max-w-md mx-auto">
                  {t('results_empty_desc')}
                </p>

                {suggestRemoveNote && (
                  <div className="w-full bg-[#120A07] border border-[#D4AF37]/20 rounded-2xl p-5 flex flex-col items-center gap-3">
                    <span className="text-xs text-[#D4AF37] font-bold flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                      {t('suggest_note_prompt')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSuggestedNote(suggestRemoveNote.id)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D1B14] hover:bg-[#3E2723] border border-[#D4AF37] text-[#F9E29C] font-bold text-xs transition-transform duration-150 active:scale-95 cursor-pointer"
                    >
                      <Undo className="h-3.5 w-3.5" />
                      <span>
                        {t('remove_note_action', { note: getLocalizedName(suggestRemoveNote) })}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
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

      {/* Sticky Bottom "Your Blend" Dock */}
      {isDockVisible && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed bottom-0 inset-x-0 z-40 bg-[#160C08]/90 backdrop-blur-xl border-t border-[#D4AF37]/25 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_35px_rgba(0,0,0,0.8)]"
        >
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Horizontally Scrollable Removable Gold Chips */}
            <div className="w-full sm:flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {selectedNoteObjects.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => handleRemoveSuggestedNote(note.id)}
                  className="flex items-center gap-1.5 bg-[#2D1B14] border border-[#D4AF37] text-[#F9E29C] rounded-full px-3 py-1 shrink-0 text-xs font-bold hover:bg-[#3E2723] transition-transform duration-150 active:scale-95 cursor-pointer"
                >
                  <span>{getLocalizedName(note)}</span>
                  <X className="h-3 w-3 text-[#D4AF37]" />
                </button>
              ))}
            </div>

            {/* Dock Actions: Localized Clear All + Live Match Scroll Button */}
            <div className="w-full sm:w-auto flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-3 py-2 text-xs font-semibold text-[#A8988A] hover:text-[#F9E29C] transition-colors cursor-pointer"
              >
                {t('clear_all')}
              </button>

              <button
                type="button"
                disabled={filteredPerfumes.length === 0}
                onClick={() =>
                  resultsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full gold-metallic-bg font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-transform duration-150 active:scale-95 cursor-pointer disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed"
              >
                <span>{getDockCtaLabel(filteredPerfumes.length)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Compare Bar */}
      {comparedPerfumeIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#160C08]/95 border border-[#D4AF37]/40 px-6 py-4 rounded-3xl flex items-center justify-between gap-6 shadow-2xl backdrop-blur-xl w-11/12 max-w-md font-sans">
          <div className="text-start">
            <p className="text-xs text-[#F5EFE6] font-bold">
              {comparedPerfumeIds.length === 1
                ? isRtl
                  ? 'اختر عطراً آخر للمقارنة'
                  : 'Select one more perfume to compare'
                : isRtl
                ? `تم اختيار عطرين للمقارنة`
                : `${comparedPerfumeIds.length} Perfumes Selected`}
            </p>
            <p className="text-[10px] text-[#A8988A] mt-0.5">
              {isRtl ? 'قارن المكونات والتركيز جنباً إلى جنب' : 'Compare scent pyramids side-by-side'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {comparedPerfumeIds.length === 2 && (
              <button
                type="button"
                onClick={() => setCompareModalOpen(true)}
                className="px-4 py-2 rounded-xl gold-metallic-bg font-extrabold text-xs cursor-pointer shadow-lg transition-transform duration-150 active:scale-95"
              >
                {t('compare_trigger')}
              </button>
            )}
            <button
              type="button"
              onClick={() => setComparedPerfumeIds([])}
              className="text-[10px] text-[#A8988A] hover:text-[#F9E29C] underline font-semibold cursor-pointer"
            >
              {t('clear_all')}
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal Overlay */}
      {compareModalOpen && comparedPerfumes.length === 2 && comparisonDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="oud-card-surface rounded-3xl w-full max-w-4xl shadow-2xl my-8 flex flex-col justify-between font-sans text-start overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#D4AF37]/20 bg-[#160D09]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-[#D4AF37]" />
                <h3 className="font-arabic-display text-xl font-bold text-[#F5EFE6]">
                  {t('compare_perfumes_title')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCompareModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#2D1B14] text-[#A8988A] hover:text-[#F5EFE6] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-xs text-[#F5EFE6] border-collapse">
                <thead>
                  <tr className="border-b border-[#D4AF37]/15">
                    <th className="py-4 px-3 text-start text-[#A8988A] text-[10px] w-1/4">
                      {isRtl ? 'المعيار' : 'Criteria'}
                    </th>
                    <th className="py-4 px-3 text-start font-serif text-sm font-bold text-[#F9E29C] w-3/8">
                      {comparedPerfumes[0].name}
                      <span
                        dir="ltr"
                        className="block font-latin-luxury text-[10px] font-semibold text-[#D4AF37]/80 uppercase tracking-[0.2em] mt-0.5"
                      >
                        {comparedPerfumes[0].brand_name}
                      </span>
                    </th>
                    <th className="py-4 px-3 text-start font-serif text-sm font-bold text-[#F9E29C] w-3/8">
                      {comparedPerfumes[1].name}
                      <span
                        dir="ltr"
                        className="block font-latin-luxury text-[10px] font-semibold text-[#D4AF37]/80 uppercase tracking-[0.2em] mt-0.5"
                      >
                        {comparedPerfumes[1].brand_name}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10">
                  <tr>
                    <td className="py-4 px-3 text-[#A8988A] font-medium">
                      {isRtl ? 'الزجاجة' : 'Image'}
                    </td>
                    {[comparedPerfumes[0], comparedPerfumes[1]].map((cp) => (
                      <td key={cp.id} className="py-4 px-3">
                        <div className="h-24 w-32 bg-[#160D09] border border-[#D4AF37]/20 flex items-center justify-center text-[#A8988A] rounded-xl relative overflow-hidden p-2">
                          {cp.image_url ? (
                            <img
                              src={cp.image_url}
                              alt={cp.name}
                              loading="lazy"
                              className="max-h-full max-w-full object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.85)] z-10"
                            />
                          ) : (
                            <span className="text-[10px]">No Photo</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-4 px-3 text-[#A8988A] font-medium">
                      {t('compare_match_score')}
                    </td>
                    <td dir="ltr" className="py-4 px-3 font-mono font-bold text-sm text-[#F9E29C]">
                      {Math.round(comparedPerfumes[0].match_score)}%
                    </td>
                    <td dir="ltr" className="py-4 px-3 font-mono font-bold text-sm text-[#F9E29C]">
                      {Math.round(comparedPerfumes[1].match_score)}%
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-3 text-[#A8988A] font-medium">{t('compare_volume')}</td>
                    <td dir="ltr" className="py-4 px-3 font-mono">
                      {comparedPerfumes[0].volume_ml} ml
                    </td>
                    <td dir="ltr" className="py-4 px-3 font-mono">
                      {comparedPerfumes[1].volume_ml} ml
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-3 text-[#A8988A] font-medium">
                      {t('compare_concentration')}
                    </td>
                    <td dir="ltr" className="py-4 px-3 uppercase font-semibold">
                      {comparedPerfumes[0].concentration}
                    </td>
                    <td dir="ltr" className="py-4 px-3 uppercase font-semibold">
                      {comparedPerfumes[1].concentration}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-3 text-[#A8988A] font-medium">
                      {isRtl ? 'مستوحى من' : 'Alternative To'}
                    </td>
                    <td className="py-4 px-3 italic text-[#A8988A]">
                      {comparedPerfumes[0].is_dupe_of
                        ? t('dupe_badge_text', { perfume: comparedPerfumes[0].is_dupe_of })
                        : '—'}
                    </td>
                    <td className="py-4 px-3 italic text-[#A8988A]">
                      {comparedPerfumes[1].is_dupe_of
                        ? t('dupe_badge_text', { perfume: comparedPerfumes[1].is_dupe_of })
                        : '—'}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-3 text-[#A8988A] font-medium">
                      {t('shared_notes_label')}
                    </td>
                    <td className="py-4 px-3" colSpan={2}>
                      <div className="flex flex-wrap gap-1.5">
                        {comparisonDetails.shared.length > 0 ? (
                          comparisonDetails.shared.map(note => (
                            <span
                              key={note.id}
                              className="px-2.5 py-0.5 rounded-full bg-[#2D1B14] border border-[#D4AF37] text-[#F9E29C] font-semibold text-[10px]"
                            >
                              {getLocalizedName(note)}
                            </span>
                          ))
                        ) : (
                          <span className="italic text-[#A8988A]">—</span>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-3 text-[#A8988A] font-medium">
                      {t('unique_notes_label')}
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex flex-wrap gap-1.5">
                        {comparisonDetails.uniqueP1.length > 0 ? (
                          comparisonDetails.uniqueP1.map(note => (
                            <span
                              key={note.id}
                              className="px-2.5 py-0.5 rounded-full bg-[#160D09] border border-[#A8988A]/20 text-[#A8988A] text-[10px]"
                            >
                              {getLocalizedName(note)}
                            </span>
                          ))
                        ) : (
                          <span className="italic text-[#A8988A]">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex flex-wrap gap-1.5">
                        {comparisonDetails.uniqueP2.length > 0 ? (
                          comparisonDetails.uniqueP2.map(note => (
                            <span
                              key={note.id}
                              className="px-2.5 py-0.5 rounded-full bg-[#160D09] border border-[#A8988A]/20 text-[#A8988A] text-[10px]"
                            >
                              {getLocalizedName(note)}
                            </span>
                          ))
                        ) : (
                          <span className="italic text-[#A8988A]">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#D4AF37]/20 bg-[#160D09] flex justify-end">
              <button
                type="button"
                onClick={() => setCompareModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#D4AF37]/30 hover:bg-[#2D1B14] text-[#F5EFE6] text-xs font-bold transition-transform duration-150 active:scale-95 cursor-pointer"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
