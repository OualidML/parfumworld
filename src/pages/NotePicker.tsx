import { useState, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { NoteCategory, Note } from '../types/database'
import { resolveShopId } from '../lib/utils'
import { useWishlist } from '../hooks/useWishlist'
import { useShopSettings } from '../context/ShopSettingsContext'
import ShopBrandHeader from '../components/ShopBrandHeader'
import SocialContactMenu from '../components/SocialContactMenu'
import ExternalLinkModal, { type ExternalLinkTarget } from '../components/ExternalLinkModal'
import {
  QUIZ_QUESTIONS,
  calculateFragranticaPyramid,
  expandNotesToRpcQueryIds
} from '../data/quizData'

import {
  Flower2,
  Trees,
  Sparkles,
  Droplets,
  Citrus,
  Cookie,
  Flame,
  Shield,
  Search,
  X,
  Check,
  Globe,
  Heart,
  HelpCircle,
  TrendingUp,
  Ban,
  MapPin,
  LogOut,
  Sun,
  Moon,
  CheckCircle2,
  Package,
  Layers,
  Tag,
  ArrowUpRight
} from 'lucide-react'

interface CatalogPerfumeRow {
  id: string
  brand_id: string
  name: string
  gender: 'male' | 'female' | 'unisex'
  concentration: 'parfum' | 'edp' | 'edt' | 'edc'
  price: number
  volume_ml: number
  family: string | null
  in_stock: boolean
  is_dupe_of: string | null
  image_url: string | null
  description_ar: string | null
  description_fr: string | null
  description_en: string | null
  brands?: { name: string } | { name: string }[] | null
  perfume_notes?: { note_id: string }[] | null
}

interface ScoredCatalogPerfume {
  id: string
  brand_id: string
  brand_name: string
  name: string
  gender: 'male' | 'female' | 'unisex'
  concentration: 'parfum' | 'edp' | 'edt' | 'edc'
  price: number
  volume_ml: number
  family: string | null
  in_stock: boolean
  is_dupe_of: string | null
  image_url: string | null
  description_ar: string | null
  description_fr: string | null
  description_en: string | null
  all_note_ids: string[]
  matching_note_ids: string[]
  match_score: number
}

// Lucide icon mapping based on database icon_name field
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'flower': return <Flower2 className="h-4 w-4" />
    case 'tree': return <Trees className="h-4 w-4" />
    case 'sparkles': return <Sparkles className="h-4 w-4" />
    case 'droplets': return <Droplets className="h-4 w-4" />
    case 'citrus': return <Citrus className="h-4 w-4" />
    case 'cookie': return <Cookie className="h-4 w-4" />
    case 'flame': return <Flame className="h-4 w-4" />
    case 'shield': return <Shield className="h-4 w-4" />
    default: return <Sparkles className="h-4 w-4" />
  }
}

export default function NotePicker() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const currentLanguage = i18n.language || 'ar'
  const isRtl = currentLanguage.startsWith('ar')

  const { wishlist, toggleWishlist } = useWishlist()
  const isWishlisted = (id: string) => wishlist.includes(id)
  const { shopSettings } = useShopSettings()

  // External link confirmation modal target ( strictly for Social Media & Location )
  const [externalLinkTarget, setExternalLinkTarget] = useState<ExternalLinkTarget | null>(null)

  // Database states
  const [categories, setCategories] = useState<NoteCategory[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [catalogPerfumes, setCatalogPerfumes] = useState<CatalogPerfumeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Interaction states
  const [selectedTab, setSelectedTab] = useState<string>('')
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([])
  const [excludedNotes, setExcludedNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)

  const searchContainerRef = useRef<HTMLDivElement>(null)
  const resultsGridRef = useRef<HTMLElement>(null)

  // Auth & Session States
  const [sessionUser, setSessionUser] = useState<any>(null)

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

  // Quiz States
  const [quizOpen, setQuizOpen] = useState(false)
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<string[]>([])

  // Dynamically derive Top, Heart, and Base pyramid directly from selectedNotes (single source of truth)
  const selectedPyramid = useMemo(() => ({
    top: selectedNotes.filter(note => note.layer === 'top'),
    heart: selectedNotes.filter(note => note.layer === 'middle'),
    base: selectedNotes.filter(note => note.layer === 'base')
  }), [selectedNotes])

  const currentLangCode: 'en' | 'fr' | 'ar' = currentLanguage.startsWith('en')
    ? 'en'
    : currentLanguage.startsWith('fr')
    ? 'fr'
    : 'ar'

  const poeticSubtitle =
    shopSettings.slogan?.trim() ||
    (currentLangCode === 'ar'
      ? 'اكتشف توقيعك العطري'
      : currentLangCode === 'fr'
      ? 'Découvrez votre signature olfactive'
      : 'Discover your signature scent')

  // 1. Fetch categories, tenant-scoped notes, and boutique catalog on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const shopId = resolveShopId()

        const [catRes, notesRes, perfumesRes] = await Promise.all([
          supabase.from('note_categories').select('*'),
          supabase
            .from('notes')
            .select('*')
            .or(`shop_id.is.null,shop_id.eq.${shopId}`),
          supabase
            .from('perfumes')
            .select('*, brands(name), perfume_notes(note_id)')
            .eq('shop_id', shopId)
        ])

        if (catRes.error) throw catRes.error
        if (notesRes.error) throw notesRes.error

        setCategories(catRes.data || [])
        setNotes(notesRes.data || [])
        setCatalogPerfumes((perfumesRes.data as CatalogPerfumeRow[]) || [])

        if (catRes.data && catRes.data.length > 0) {
          setSelectedTab(catRes.data[0].id)
        }
      } catch (err: any) {
        console.error('Error fetching note data:', err)
        setError(err.message || t('db_load_error'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // 1.5. Manage Auth & Session Check
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
    localStorage.removeItem('parfumworld_shop_id')
    await supabase.auth.signOut()
    setSessionUser(null)
  }

  // 2. Debounce search queries (150ms for low latency responsiveness)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 150)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // 3. Handle clicking outside search container to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Localized string retrieval helpers
  const getLocalizedName = (item: NoteCategory | Note) => {
    if (currentLanguage.startsWith('en')) return item.name_en
    if (currentLanguage.startsWith('fr')) return item.name_fr
    return item.name_ar
  }

  const getLocalizedDescription = (p: ScoredCatalogPerfume) => {
    if (currentLanguage.startsWith('en')) return p.description_en || p.description_ar
    if (currentLanguage.startsWith('fr')) return p.description_fr || p.description_ar
    return p.description_ar
  }

  // Toggle language helper
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const normalizeText = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .trim()
  }

  // Calculate matching notes from the database based on debounced search query
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return []
    const q = normalizeText(debouncedQuery)
    return notes.filter(note =>
      normalizeText(note.name_ar).includes(q) ||
      normalizeText(note.name_en).includes(q) ||
      normalizeText(note.name_fr).includes(q)
    )
  }, [debouncedQuery, notes])

  // Toggle selection state of a note pill
  const toggleNote = (note: Note) => {
    setSelectedNotes(prev => {
      const exists = prev.some(n => n.id === note.id)
      if (exists) {
        return prev.filter(n => n.id !== note.id)
      } else {
        setExcludedNotes(ex => ex.filter(n => n.id !== note.id))
        return [...prev, note]
      }
    })
  }

  // Toggle exclusion state of a note pill
  const toggleExclude = (note: Note) => {
    setExcludedNotes(prev => {
      const exists = prev.some(n => n.id === note.id)
      if (exists) {
        return prev.filter(n => n.id !== note.id)
      } else {
        setSelectedNotes(s => s.filter(n => n.id !== note.id))
        return [...prev, note]
      }
    })
  }

  // Clear all selections
  const handleClearAll = () => {
    setSelectedNotes([])
    setExcludedNotes([])
    try {
      sessionStorage.removeItem('parfumworld_active_blend_ids')
    } catch {
      // Ignore storage access errors
    }
  }

  // Expanded query IDs using existing matching utility
  const expandedSelectedIds = useMemo(
    () => (selectedNotes.length > 0 ? expandNotesToRpcQueryIds(selectedNotes, notes) : []),
    [selectedNotes, notes]
  )

  const expandedExcludedIds = useMemo(
    () => (excludedNotes.length > 0 ? expandNotesToRpcQueryIds(excludedNotes, notes) : []),
    [excludedNotes, notes]
  )

  // Persist active blend note IDs so PerfumeDetails 3-tier pyramid can highlight matching notes
  useEffect(() => {
    try {
      if (expandedSelectedIds.length > 0) {
        sessionStorage.setItem(
          'parfumworld_active_blend_ids',
          JSON.stringify(expandedSelectedIds)
        )
      } else {
        sessionStorage.removeItem('parfumworld_active_blend_ids')
      }
    } catch {
      // Ignore storage errors
    }
  }, [expandedSelectedIds])

  // Live Boutique Catalog scoring (mirrors match_perfumes logic without altering RPC)
  const displayedPerfumes = useMemo<ScoredCatalogPerfume[]>(() => {
    const selectedSet = new Set(expandedSelectedIds)
    const excludedSet = new Set(expandedExcludedIds)
    const totalSelected = expandedSelectedIds.length

    const mapped: ScoredCatalogPerfume[] = []

    for (const p of catalogPerfumes) {
      const allNoteIds = (p.perfume_notes || []).map(pn => pn.note_id)

      if (excludedSet.size > 0 && allNoteIds.some(id => excludedSet.has(id))) {
        continue
      }

      const matchingNoteIds =
        totalSelected > 0 ? allNoteIds.filter(id => selectedSet.has(id)) : []

      if (totalSelected > 0 && matchingNoteIds.length === 0) {
        continue
      }

      const matchScore =
        totalSelected > 0
          ? Math.min(Math.round((matchingNoteIds.length / totalSelected) * 1000) / 10, 100)
          : 0

      const brandObj = Array.isArray(p.brands) ? p.brands[0] : p.brands

      mapped.push({
        id: p.id,
        brand_id: p.brand_id,
        brand_name: brandObj?.name || '',
        name: p.name,
        gender: p.gender,
        concentration: p.concentration,
        price: p.price,
        volume_ml: p.volume_ml,
        family: p.family,
        in_stock: p.in_stock,
        is_dupe_of: p.is_dupe_of,
        image_url: p.image_url,
        description_ar: p.description_ar,
        description_fr: p.description_fr,
        description_en: p.description_en,
        all_note_ids: allNoteIds,
        matching_note_ids: matchingNoteIds,
        match_score: matchScore
      })
    }

    if (totalSelected > 0) {
      mapped.sort((a, b) => b.match_score - a.match_score || a.price - b.price)
    }

    return mapped
  }, [catalogPerfumes, expandedSelectedIds, expandedExcludedIds])

  // Navigate to dedicated Results screen
  const handleShowResults = () => {
    if (selectedNotes.length === 0) return
    const ids = expandedSelectedIds.join(',')
    const exIds = expandedExcludedIds.join(',')
    navigate(`/results?notes=${ids}${exIds ? `&exclude=${exIds}` : ''}`)
  }

  // Smooth scroll to the inline Boutique Perfume Cards grid
  const handleScrollToResults = () => {
    if (displayedPerfumes.length === 0) return
    if (resultsGridRef.current) {
      resultsGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      handleShowResults()
    }
  }

  // Quiz finish handler: populates selectedNotes (single source of truth) with deduplicated uiNotes
  const handleFinishQuiz = (answers: string[]) => {
    const { uiNotes } = calculateFragranticaPyramid(answers, notes, categories, 5)
    setSelectedNotes(uiNotes)
    setExcludedNotes([])
    setQuizStep(QUIZ_QUESTIONS.length)
  }

  // Filter notes belonging to the selected tab
  const activeTabNotes = useMemo(() => {
    if (!selectedTab) return []
    return notes.filter(note => note.category_id === selectedTab)
  }, [selectedTab, notes])

  // Bilingual dock CTA label
  const getDockCtaLabel = (count: number) => {
    if (currentLangCode === 'ar') {
      return `عرض ${count} عطور مطابقة`
    }
    if (currentLangCode === 'fr') {
      return `Voir ${count} parfums correspondants`
    }
    return `View ${count} matching perfumes`
  }

  const isDockVisible = selectedNotes.length > 0

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen antialiased bg-[#120A07] text-[#F5EFE6] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#120A07]"
    >
      {/* Top Boutique Header */}
      <header className="sticky top-0 z-40 w-full bg-[#120A07]/90 backdrop-blur-md border-b border-[#D4AF37]/20 py-3.5 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Top-Right (RTL start): Unified Brand Logo, Shop Name & Poetic Slogan */}
          <ShopBrandHeader fallbackSubtitle={poeticSubtitle} />

          {/* Search Container */}
          <div ref={searchContainerRef} className="relative w-full max-w-sm">
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8988A] start-3.5" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSearchResults(true)
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full bg-[#1E120D] border border-[#D4AF37]/20 rounded-full py-2.5 text-sm text-[#F5EFE6] placeholder:text-[#A8988A]/70 focus:outline-none focus:border-[#D4AF37] transition-colors ps-10 pe-9"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setShowSearchResults(false)
                  }}
                  className="absolute top-1/2 -translate-y-1/2 text-[#A8988A] hover:text-[#F5EFE6] p-1 rounded-full end-2.5 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Dropdown Search Results */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute top-full inset-x-0 mt-2 bg-[#1E120D] border border-[#D4AF37]/30 rounded-2xl shadow-2xl max-h-72 overflow-y-auto z-50 py-1.5 divide-y divide-[#D4AF37]/10">
                {searchResults.length > 0 ? (
                  searchResults.map((note) => {
                    const isSelected = selectedNotes.some(n => n.id === note.id)
                    return (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => {
                          toggleNote(note)
                          setSearchQuery('')
                          setShowSearchResults(false)
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#2D1B14] text-start transition-colors cursor-pointer"
                      >
                        <div className="text-start">
                          <p className="text-sm font-semibold text-[#F5EFE6]">{getLocalizedName(note)}</p>
                          <p className="text-[10px] text-[#A8988A] mt-0.5">{t('layer_' + note.layer)}</p>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 text-[#D4AF37] stroke-[3]" />
                        )}
                      </button>
                    )
                  })
                ) : (
                  <p className="text-sm text-[#A8988A] italic px-4 py-4 text-center">
                    {t('no_search_results')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Left Header Controls (RTL end): Symbol-Only Location, Social Contact Menu, Wishlist, Auth, Theme, Lang */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Symbol-Only Luxury Location Button (Rendered ONLY when location_url is non-empty) */}
            {shopSettings.location_url?.trim() && (
              <button
                type="button"
                onClick={() =>
                  setExternalLinkTarget({
                    platform: 'location',
                    label: shopSettings.shop_name?.trim() || 'ParfumWorld',
                    url: shopSettings.location_url.trim()
                  })
                }
                aria-label={
                  currentLangCode === 'ar'
                    ? 'موقع المتجر على الخريطة'
                    : currentLangCode === 'fr'
                    ? 'Localisation de la boutique'
                    : 'Store Location'
                }
                title={
                  currentLangCode === 'ar'
                    ? 'موقع المتجر على الخريطة'
                    : currentLangCode === 'fr'
                    ? 'Localisation de la boutique'
                    : 'Store Location'
                }
                className="h-9 w-9 rounded-full bg-[#1E120D] border border-[#D4AF37]/35 hover:border-[#D4AF37] flex items-center justify-center text-[#D4AF37] hover:text-[#F9E29C] transition-transform duration-150 active:scale-95 cursor-pointer shrink-0"
              >
                <MapPin className="h-4 w-4" />
              </button>
            )}

            {/* Dynamic Social Media Contact Menu (Instagram, Facebook, TikTok) */}
            <SocialContactMenu onSelectTarget={setExternalLinkTarget} />

            <button
              type="button"
              onClick={() => navigate('/wishlist')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-xs text-[#F5EFE6] transition-transform duration-150 active:scale-95 cursor-pointer font-semibold"
            >
              <Heart className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span>{t('wishlist_title')}</span>
            </button>

            {sessionUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/20 hover:border-red-500/40 text-xs text-[#A8988A] hover:text-red-300 transition-transform duration-150 active:scale-95 cursor-pointer font-semibold flex items-center gap-1"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:inline">{isRtl ? 'خروج' : 'Sign Out'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/wishlist')}
                className="px-3.5 py-2 rounded-full bg-[#1E120D] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-xs text-[#A8988A] hover:text-[#F5EFE6] transition-transform duration-150 active:scale-95 cursor-pointer font-semibold"
              >
                {isRtl ? 'دخول' : 'Sign In'}
              </button>
            )}

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

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-[#1E120D] border border-[#D4AF37]/20 rounded-full p-1">
              <Globe className="h-3.5 w-3.5 text-[#D4AF37] mx-1" />
              {[
                { code: 'ar', label: t('arabic') },
                { code: 'fr', label: t('french') },
                { code: 'en', label: t('english') }
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-transform duration-150 active:scale-95 cursor-pointer ${
                    currentLanguage.startsWith(lang.code)
                      ? 'gold-metallic-bg font-extrabold'
                      : 'text-[#A8988A] hover:text-[#F5EFE6]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Catalog Workspace (pb-36 md:pb-28 when dock is visible) */}
      <main
        className={`flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8 my-2 ${
          isDockVisible ? 'pb-36 md:pb-28' : ''
        }`}
      >
        {/* Dark Espresso Shimmer Skeletons during Loading */}
        {loading && (
          <div className="space-y-8">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-11 w-32 rounded-2xl oud-skeleton-shimmer border border-[#D4AF37]/15 shrink-0"
                />
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-24 rounded-2xl oud-skeleton-shimmer border border-[#D4AF37]/15"
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="oud-card-surface rounded-2xl overflow-hidden flex flex-col"
                >
                  <div className="h-56 w-full oud-skeleton-shimmer" />
                  <div className="p-5 space-y-3">
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
          </div>
        )}

        {/* Database Errors */}
        {error && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3 max-w-md mx-auto text-center">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400">
              <HelpCircle className="h-6 w-6" />
            </div>
            <p className="text-sm text-[#F5EFE6] font-medium">{error}</p>
          </div>
        )}

        {/* Loaded State */}
        {!loading && !error && (
          <>
            {/* 1. Olfactive Families Category Scroller */}
            <section className="flex flex-col gap-3.5 text-start">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-2.5">
                <h2 className="font-arabic-display text-base font-bold gold-metallic-text flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-[#D4AF37]" />
                  {t('olfactive_families')}
                </h2>

                {/* Scent Quiz trigger button */}
                <button
                  type="button"
                  onClick={() => {
                    setQuizStep(0)
                    setQuizAnswers([])
                    setQuizOpen(true)
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E120D] border border-[#D4AF37]/30 text-[#F9E29C] hover:bg-[#2D1B14] hover:border-[#D4AF37] transition-transform duration-150 active:scale-95 text-xs font-bold cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>{t('quiz_start_button')}</span>
                </button>
              </div>

              {/* Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                {categories.map((category) => {
                  const isActive = selectedTab === category.id
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedTab(category.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-transform duration-150 active:scale-95 cursor-pointer shrink-0 border ${
                        isActive
                          ? 'bg-[#2D1B14] border-[#D4AF37] text-[#F9E29C] shadow-[0_0_16px_rgba(212,175,55,0.28)]'
                          : 'bg-[#1E120D] border-[#D4AF37]/15 text-[#A8988A] hover:text-[#F5EFE6] hover:bg-[#2D1B14]/60'
                      }`}
                    >
                      <span className={isActive ? 'text-[#D4AF37]' : 'text-[#A8988A]'}>
                        {getCategoryIcon(category.icon_name)}
                      </span>
                      <span>{getLocalizedName(category)}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* 2. Tactile Note Selector Pills Grid (Zero backdrop-blur, zero letter-spacing on Arabic) */}
            <section className="flex flex-col gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {activeTabNotes.map((note) => {
                  const isSelected = selectedNotes.some(n => n.id === note.id)
                  const isExcluded = excludedNotes.some(n => n.id === note.id)
                  return (
                    <div
                      key={note.id}
                      onClick={() => toggleNote(note)}
                      className={`group p-3.5 rounded-2xl border transition-transform duration-150 active:scale-95 flex flex-col justify-between items-start text-start gap-3 cursor-pointer min-h-[100px] ${
                        isSelected
                          ? 'bg-[#2D1B14] border-[#D4AF37] text-[#F9E29C] shadow-[0_0_16px_rgba(212,175,55,0.28)]'
                          : isExcluded
                          ? 'bg-[#1E120D] border-red-500/40 text-red-300'
                          : 'bg-[#1E120D] border-[#D4AF37]/15 text-[#F5EFE6] hover:bg-[#2D1B14]/60 hover:border-[#D4AF37]/35'
                      }`}
                    >
                      {/* Note Label Header */}
                      <div className="w-full flex justify-between items-start gap-2 text-start">
                        <span
                          className={`text-sm font-bold leading-tight ${
                            isSelected ? 'text-[#F9E29C]' : 'text-[#F5EFE6]'
                          }`}
                        >
                          {getLocalizedName(note)}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Exclude Ban Icon */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleExclude(note)
                            }}
                            title={t('exclude_note_action')}
                            className={`h-5 w-5 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                              isExcluded
                                ? 'bg-red-500 border-red-500 text-white'
                                : 'border-[#D4AF37]/20 hover:border-red-400 text-[#A8988A] hover:text-red-300'
                            }`}
                          >
                            <Ban className="h-2.5 w-2.5" />
                          </button>

                          {/* Include Checkbox Icon */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleNote(note)
                            }}
                            className={`h-5 w-5 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#D4AF37] border-[#D4AF37] text-[#120A07]'
                                : 'border-[#D4AF37]/25 hover:border-[#D4AF37] text-[#A8988A]'
                            }`}
                          >
                            {isSelected ? (
                              <Check className="h-2.5 w-2.5 stroke-[3.5]" />
                            ) : (
                              <div className="h-1.5 w-1.5 rounded-full bg-transparent" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Note Layer & Description Footer */}
                      <div className="w-full text-start">
                        <span
                          className={`text-[10px] font-semibold block ${
                            isSelected
                              ? 'text-[#D4AF37]'
                              : isExcluded
                              ? 'text-red-400/80'
                              : 'text-[#A8988A]'
                          }`}
                        >
                          {isExcluded ? t('excluded_note_badge') : t('layer_' + note.layer)}
                        </span>
                        {note.description_ar && isRtl && (
                          <p
                            className={`text-[10px] mt-1 line-clamp-1 leading-snug font-normal ${
                              isSelected ? 'text-[#F5EFE6]/85' : 'text-[#A8988A]'
                            }`}
                          >
                            {note.description_ar}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* 3. Boutique Perfume Cards Section (Spotlight Framing, Match Badges & Staggered Reveal) */}
            <section
              ref={resultsGridRef}
              id="catalog-results-grid"
              className="flex flex-col gap-5 pt-4 border-t border-[#D4AF37]/15 scroll-mt-24"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-arabic-display text-xl md:text-2xl font-bold gold-metallic-text">
                    {selectedNotes.length > 0
                      ? currentLangCode === 'ar'
                        ? `العطور المطابقة (${displayedPerfumes.length})`
                        : currentLangCode === 'fr'
                        ? `Parfums Correspondants (${displayedPerfumes.length})`
                        : `Matching Perfumes (${displayedPerfumes.length})`
                      : currentLangCode === 'ar'
                      ? `مجموعة العطور الفاخرة (${displayedPerfumes.length})`
                      : currentLangCode === 'fr'
                      ? `Collection de Parfums (${displayedPerfumes.length})`
                      : `Boutique Collection (${displayedPerfumes.length})`}
                  </h3>
                  <p className="text-xs text-[#A8988A] mt-0.5">
                    {selectedNotes.length > 0
                      ? currentLangCode === 'ar'
                        ? 'مرتبة حسب تناغمها مع توليفتك المختارة'
                        : currentLangCode === 'fr'
                        ? 'Classés selon votre accord olfactif'
                        : 'Ranked by harmony with your selected notes'
                      : currentLangCode === 'ar'
                      ? 'اختر نوتاتك المفضلة أعلاه لتركيب بصمتك العطرية'
                      : currentLangCode === 'fr'
                      ? 'Sélectionnez vos notes ci-dessus pour filtrer la collection'
                      : 'Select your favorite notes above to filter the collection'}
                  </p>
                </div>

                {selectedNotes.length > 0 && displayedPerfumes.length > 0 && (
                  <button
                    type="button"
                    onClick={handleShowResults}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E120D] border border-[#D4AF37]/35 hover:border-[#D4AF37] text-xs font-bold text-[#F9E29C] transition-transform duration-150 active:scale-95 cursor-pointer"
                  >
                    <span>
                      {currentLangCode === 'ar'
                        ? 'المقارنة والتركيبة الخاصة'
                        : currentLangCode === 'fr'
                        ? 'Comparaison & Accord sur mesure'
                        : 'Compare & Bespoke Blend'}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#D4AF37]" />
                  </button>
                )}
              </div>

              {displayedPerfumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedPerfumes.map((perfume, idx) => {
                    const hasScore = selectedNotes.length > 0
                    const roundedScore = Math.round(perfume.match_score)
                    return (
                      <div
                        key={perfume.id}
                        style={{ animationDelay: `${Math.min(idx, 7) * 45}ms` }}
                        onClick={() => navigate(`/perfume/${perfume.id}`)}
                        className="group oud-card-surface oud-card-reveal hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-colors duration-300 flex flex-col justify-between relative cursor-pointer"
                      >
                        {/* Spotlight Bottle Stage (No backdrop-blur on cards) */}
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

                          {/* Wishlist Heart Button */}
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
                                isWishlisted(perfume.id)
                                  ? 'fill-[#D4AF37] text-[#D4AF37]'
                                  : ''
                              }`}
                            />
                          </button>

                          {/* Smart Match Badge */}
                          {hasScore && (
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
                          )}

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

                        {/* Card Details Body */}
                        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                          <div className="flex flex-col gap-2">
                            {/* Latin Luxury Brand Name & Stock */}
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
                            {getLocalizedDescription(perfume) && (
                              <p className="text-xs text-[#A8988A] leading-relaxed line-clamp-2 text-start">
                                {getLocalizedDescription(perfume)}
                              </p>
                            )}
                          </div>

                          {/* Note Comparison Pills */}
                          <div className="border-t border-[#D4AF37]/15 pt-3.5 text-start">
                            <span className="text-[10px] font-semibold text-[#A8988A] flex items-center gap-1 mb-2">
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

                          {/* Card Footer */}
                          <div className="border-t border-[#D4AF37]/15 pt-3 flex justify-between items-center text-[11px] text-[#A8988A]">
                            <span dir="ltr" className="font-mono">
                              {perfume.volume_ml}ml • {perfume.concentration.toUpperCase()}
                            </span>
                            <span className="text-[#F9E29C] font-semibold text-xs">
                              {currentLangCode === 'ar'
                                ? 'عرض التفاصيل'
                                : currentLangCode === 'fr'
                                ? 'Voir détails'
                                : 'View Details'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="oud-card-surface rounded-2xl p-8 text-center max-w-lg mx-auto my-4 space-y-2">
                  <p className="text-sm font-bold text-[#F5EFE6]">
                    {t('results_empty_state')}
                  </p>
                  <p className="text-xs text-[#A8988A]">{t('results_empty_desc')}</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Sticky Bottom "Your Blend" Dock */}
      {isDockVisible && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed bottom-0 inset-x-0 z-40 bg-[#160C08]/90 backdrop-blur-xl border-t border-[#D4AF37]/25 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_35px_rgba(0,0,0,0.8)]"
        >
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Horizontally Scrollable Removable Gold Chips (clean hidden scrollbar) */}
            <div className="w-full sm:flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {selectedNotes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => toggleNote(note)}
                  className="flex items-center gap-1.5 bg-[#2D1B14] border border-[#D4AF37] text-[#F9E29C] rounded-full px-3 py-1 shrink-0 text-xs font-bold hover:bg-[#3E2723] transition-transform duration-150 active:scale-95 cursor-pointer"
                >
                  <span>{getLocalizedName(note)}</span>
                  <X className="h-3 w-3 text-[#D4AF37]" />
                </button>
              ))}

              {excludedNotes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => toggleExclude(note)}
                  className="flex items-center gap-1.5 bg-[#1E120D] border border-red-500/40 text-red-300 rounded-full px-3 py-1 shrink-0 text-xs font-bold hover:border-red-400 transition-transform duration-150 active:scale-95 cursor-pointer"
                >
                  <Ban className="h-3 w-3" />
                  <span>{getLocalizedName(note)}</span>
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>

            {/* Dock Actions: Localized Clear All + Live Match CTA (Zero-Match Guard) */}
            <div className="w-full sm:w-auto flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3 py-2 text-xs font-semibold text-[#A8988A] hover:text-[#F9E29C] transition-colors cursor-pointer"
              >
                {t('clear_all')}
              </button>

              <button
                type="button"
                onClick={handleScrollToResults}
                disabled={displayedPerfumes.length === 0}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full gold-metallic-bg font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-transform duration-150 active:scale-95 cursor-pointer disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed"
              >
                <span>{getDockCtaLabel(displayedPerfumes.length)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scent Quiz Modal Overlay */}
      {quizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="oud-card-surface rounded-3xl w-full max-w-xl shadow-2xl p-6 md:p-8 flex flex-col gap-6 text-start font-sans my-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-[#D4AF37]" />
                <h3 className="font-arabic-display text-lg font-bold text-[#F5EFE6]">
                  {t('quiz_modal_title')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuizOpen(false)}
                className="p-1 rounded-full hover:bg-[#2D1B14] text-[#A8988A] hover:text-[#F5EFE6] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {quizStep < QUIZ_QUESTIONS.length ? (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      {QUIZ_QUESTIONS.map((q, step) => (
                        <div
                          key={q.id}
                          className={`h-1.5 rounded-full transition-all ${
                            quizStep === step
                              ? 'w-6 bg-[#D4AF37]'
                              : quizStep > step
                              ? 'w-2 bg-[#AA7C11]'
                              : 'w-2 bg-[#2D1B14]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#F9E29C] font-semibold ms-2">
                      {QUIZ_QUESTIONS[quizStep].categoryTag[currentLangCode]}
                    </span>
                  </div>
                  <span dir="ltr" className="text-[10px] text-[#A8988A] font-mono">
                    {quizStep + 1} / {QUIZ_QUESTIONS.length}
                  </span>
                </div>

                <div className="space-y-4">
                  <h4 className="font-arabic-display text-lg font-bold text-[#F5EFE6] leading-relaxed">
                    {t(
                      QUIZ_QUESTIONS[quizStep].titleKey,
                      QUIZ_QUESTIONS[quizStep].fallbackTitle[currentLangCode]
                    )}
                  </h4>

                  <div className="flex flex-col gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
                    {QUIZ_QUESTIONS[quizStep].options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          const nextAnswers = [...quizAnswers]
                          nextAnswers[quizStep] = opt.id
                          setQuizAnswers(nextAnswers)

                          if (quizStep < QUIZ_QUESTIONS.length - 1) {
                            setQuizStep(prev => prev + 1)
                          } else {
                            handleFinishQuiz(nextAnswers)
                          }
                        }}
                        className="w-full p-4 rounded-2xl bg-[#160D09] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#2D1B14] text-start transition-transform duration-150 active:scale-95 cursor-pointer group flex justify-between items-center gap-3"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-[#F5EFE6] group-hover:text-[#F9E29C] transition-colors">
                            {t(opt.labelKey, opt.fallbackLabel[currentLangCode])}
                          </span>
                          <span className="text-[11px] text-[#A8988A] leading-snug">
                            {t(opt.subtitleKey, opt.fallbackSubtitle[currentLangCode])}
                          </span>
                        </div>
                        <div className="h-4 w-4 shrink-0 rounded-full border border-[#D4AF37]/40 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/20 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-5">
                <div>
                  <h4 className="font-arabic-display text-lg font-bold text-[#F9E29C]">
                    {t('quiz_pyramid_ready')}
                  </h4>
                  <p className="text-xs text-[#A8988A] mt-1">
                    {t('quiz_pyramid_subtitle')}
                  </p>
                </div>

                <div className="space-y-3 bg-[#160D09] border border-[#D4AF37]/20 rounded-2xl p-4">
                  {/* Top Notes */}
                  <div className="flex flex-col gap-1.5 border-b border-[#D4AF37]/15 pb-3">
                    <span className="text-[11px] text-[#D4AF37] font-bold">
                      {t('scent_pyramid_top')}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedPyramid.top.map(note => (
                        <span
                          key={note.id}
                          className="px-3 py-1 rounded-full bg-[#2D1B14] border border-[#D4AF37] text-xs font-bold text-[#F9E29C]"
                        >
                          {getLocalizedName(note)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Heart Notes */}
                  <div className="flex flex-col gap-1.5 border-b border-[#D4AF37]/15 pb-3">
                    <span className="text-[11px] text-[#D4AF37] font-bold">
                      {t('scent_pyramid_middle')}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedPyramid.heart.map(note => (
                        <span
                          key={note.id}
                          className="px-3 py-1 rounded-full bg-[#2D1B14] border border-[#D4AF37] text-xs font-bold text-[#F9E29C]"
                        >
                          {getLocalizedName(note)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Base Notes */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] text-[#D4AF37] font-bold">
                      {t('scent_pyramid_base')}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedPyramid.base.map(note => (
                        <span
                          key={note.id}
                          className="px-3 py-1 rounded-full bg-[#2D1B14] border border-[#D4AF37] text-xs font-bold text-[#F9E29C]"
                        >
                          {getLocalizedName(note)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setQuizOpen(false)
                      handleShowResults()
                    }}
                    className="flex-1 py-3 px-5 rounded-full gold-metallic-bg font-extrabold text-xs shadow-lg cursor-pointer transition-transform duration-150 active:scale-95"
                  >
                    {t('show_results')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizOpen(false)}
                    className="py-3 px-5 rounded-full bg-[#160D09] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#F5EFE6] font-semibold text-xs cursor-pointer transition-transform duration-150 active:scale-95"
                  >
                    {t('quiz_apply_notes')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizStep(0)
                      setQuizAnswers([])
                    }}
                    className="py-3 px-4 rounded-full text-[#A8988A] hover:text-[#F5EFE6] text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {t('quiz_retake')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* External Link Confirmation Modal (Strictly for Social Media & Location) */}
      <ExternalLinkModal
        target={externalLinkTarget}
        onClose={() => setExternalLinkTarget(null)}
      />
    </div>
  )
}
