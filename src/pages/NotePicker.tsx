import { useState, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { NoteCategory, Note } from '../types/database'

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
  Loader2, 
  HelpCircle,
  TrendingUp,
  Ban,
  MapPin,
  LogOut,
  Sun,
  Moon
} from 'lucide-react'

// Lucide icon mapping based on database icon_name field
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'flower': return <Flower2 className="h-5 w-5" />
    case 'tree': return <Trees className="h-5 w-5" />
    case 'sparkles': return <Sparkles className="h-5 w-5" />
    case 'droplets': return <Droplets className="h-5 w-5" />
    case 'citrus': return <Citrus className="h-5 w-5" />
    case 'cookie': return <Cookie className="h-5 w-5" />
    case 'flame': return <Flame className="h-5 w-5" />
    case 'shield': return <Shield className="h-5 w-5" />
    default: return <Sparkles className="h-5 w-5" />
  }
}

export default function NotePicker() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const currentLanguage = i18n.language || 'ar'


  // Database states
  const [categories, setCategories] = useState<NoteCategory[]>([])
  const [notes, setNotes] = useState<Note[]>([])
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

  // Store settings state
  const [storeSettings, setStoreSettings] = useState({
    name: 'ParfumWorld',
    slogan: 'Premium Scents Explorer',
    mapsLink: ''
  })

  // Auth & Session States
  const [sessionUser, setSessionUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

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
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // Quiz States
  const [quizOpen, setQuizOpen] = useState(false)
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<string[]>([])

  const quizQuestions = [
    {
      question: t('quiz_q1_title'),
      options: [
        { text: t('quiz_q1_o1'), val: 'fresh' },
        { text: t('quiz_q1_o2'), val: 'warm' }
      ]
    },
    {
      question: t('quiz_q2_title'),
      options: [
        { text: t('quiz_q2_o1'), val: 'sweet' },
        { text: t('quiz_q2_o2'), val: 'dry' }
      ]
    },
    {
      question: t('quiz_q3_title'),
      options: [
        { text: t('quiz_q3_o1'), val: 'day' },
        { text: t('quiz_q3_o2'), val: 'night' }
      ]
    },
    {
      question: t('quiz_q4_title'),
      options: [
        { text: t('quiz_q4_o1'), val: 'subtle' },
        { text: t('quiz_q4_o2'), val: 'bold' }
      ]
    }
  ]

  // 1. Fetch categories and notes on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const { data: catData, error: catErr } = await supabase
          .from('note_categories')
          .select('*')
        
        if (catErr) throw catErr

        const { data: notesData, error: notesErr } = await supabase
          .from('notes')
          .select('*')
        
        if (notesErr) throw notesErr

        setCategories(catData || [])
        setNotes(notesData || [])
        
        // Fetch General Settings
        const { data: settingsData } = await supabase
          .from('store_settings')
          .select('key, value')

        if (settingsData) {
          const nameVal = settingsData.find(s => s.key === 'store_name')?.value
          const sloganVal = settingsData.find(s => s.key === 'store_slogan')?.value
          const mapsVal = settingsData.find(s => s.key === 'google_maps_link')?.value
          
          setStoreSettings({
            name: nameVal || 'ParfumWorld',
            slogan: sloganVal || 'Premium Scents Explorer',
            mapsLink: mapsVal || ''
          })
        }

        // Default select first tab if categories exist
        if (catData && catData.length > 0) {
          setSelectedTab(catData[0].id)
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
      const { data } = await supabase
        .from('admins')
        .select('id')
        .eq('id', userId)
        .maybeSingle()
      setIsAdmin(!!data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSessionUser(null)
    setIsAdmin(false)
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

  // Toggle selection state of a note card
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

  // Toggle exclusion state of a note card
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
  }

  // Navigate to results screen passing selected note IDs as params
  const handleShowResults = () => {
    if (selectedNotes.length === 0) return
    const ids = selectedNotes.map(n => n.id).join(',')
    const exIds = excludedNotes.map(n => n.id).join(',')
    navigate(`/results?notes=${ids}${exIds ? `&exclude=${exIds}` : ''}`)
  }

  // Quiz finish handler
  const handleFinishQuiz = (answers: string[]) => {
    const vibe = answers[0]
    const profile = answers[1]
    const time = answers[2]
    const intensity = answers[3]

    const scoredNotes = notes.map(note => {
      const cat = categories.find(c => c.id === note.category_id)
      const family = cat ? cat.family.toLowerCase() : ''
      
      let score = 0
      if (vibe === 'fresh' && ['citrus', 'fresh', 'floral'].includes(family)) score += 1
      if (vibe === 'warm' && ['woody', 'oriental', 'leather', 'gourmand'].includes(family)) score += 1
      if (profile === 'sweet' && ['gourmand', 'floral'].includes(family)) score += 1
      if (profile === 'dry' && ['woody', 'leather', 'oriental'].includes(family)) score += 1
      if (time === 'day' && ['citrus', 'fresh', 'musk', 'floral'].includes(family)) score += 1
      if (time === 'night' && ['woody', 'leather', 'oriental', 'gourmand'].includes(family)) score += 1
      if (intensity === 'subtle' && ['citrus', 'fresh', 'musk'].includes(family)) score += 1
      if (intensity === 'bold' && ['leather', 'oriental', 'woody'].includes(family)) score += 1
      
      return { note, score }
    })

    const sorted = scoredNotes.sort((a, b) => b.score - a.score)
    const topNotes = sorted.slice(0, 4).map(item => item.note)

    setSelectedNotes(topNotes)
    setExcludedNotes([])
    setQuizOpen(false)
  }

  // Filter notes belonging to the selected tab
  const activeTabNotes = useMemo(() => {
    if (!selectedTab) return []
    return notes.filter(note => note.category_id === selectedTab)
  }, [selectedTab, notes])

  // Dynamically resolve translation tags for counts (supporting Arabic plurals)
  const getSelectedNotesLabel = () => {
    const count = selectedNotes.length
    if (currentLanguage.startsWith('ar')) {
      if (count === 1) return t('selected_notes_count_one')
      if (count === 2) return t('selected_notes_count_two')
      if (count >= 3 && count <= 10) return t('selected_notes_count_few', { count })
      return t('selected_notes_count_many', { count })
    }
    if (count === 1) return t('selected_notes_count_one')
    return t('selected_notes_count_other', { count })
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-950 via-neutral-950 to-black text-white flex flex-col justify-between selection:bg-gold-500 selection:text-black">
      
      {/* Header and Global Settings */}
      <header className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-lg border-b border-white/5 py-4 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Brand Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gold-500 to-burgundy-500 flex items-center justify-center shadow-lg shadow-gold-500/20">
              <Sparkles className="h-5 w-5 text-neutral-900 animate-pulse" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400 block leading-none">
                {storeSettings.name}
              </span>
              <span className="text-[10px] text-neutral-400 mt-1 tracking-wider uppercase block font-light">
                {storeSettings.slogan}
              </span>
            </div>
          </div>

          {/* Search container */}
          <div ref={searchContainerRef} className="relative w-full max-w-sm">
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 start-3" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSearchResults(true)
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full bg-neutral-900/90 border border-white/10 rounded-full py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all backdrop-blur-sm ps-9 pe-4"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setShowSearchResults(false)
                  }}
                  className="absolute top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/5 end-3"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Floating Dropdown Results */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-950/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl max-h-72 overflow-y-auto z-50 py-2 divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
                {searchResults.length > 0 ? (
                  searchResults.map((note) => {
                    const isSelected = selectedNotes.some(n => n.id === note.id)
                    return (
                      <button
                        key={note.id}
                        onClick={() => {
                          toggleNote(note)
                          setSearchQuery('')
                          setShowSearchResults(false)
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-burgundy-950/40 text-start transition-colors"
                      >
                        <div className="text-start">
                          <p className="text-sm font-medium text-white">{getLocalizedName(note)}</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">{t('layer_' + note.layer)}</p>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 text-gold-500 stroke-[3]" />
                        )}
                      </button>
                    )
                  })
                ) : (
                  <p className="text-sm text-neutral-400 italic px-4 py-4 text-center">
                    {t('no_search_results')}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Visit Store Location Link */}
            {storeSettings.mapsLink && (
              <a
                href={storeSettings.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 hover:border-gold-500/30 hover:bg-white/5 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer font-bold"
              >
                <MapPin className="h-3.5 w-3.5 text-gold-500" />
                <span className="hidden sm:inline">Location</span>
              </a>
            )}

            {/* Wishlist Navigation Portal */}
            <button
              onClick={() => navigate('/wishlist')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-gold-500/30 hover:bg-white/5 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer font-bold"
            >
              <Heart className="h-3.5 w-3.5 fill-burgundy-500 text-burgundy-500" />
              <span>{t('wishlist_title')}</span>
            </button>

            {/* Auth Login / Logout / Admin widget */}
            {sessionUser ? (
              <div className="flex items-center gap-2 bg-neutral-950/90 border border-white/10 rounded-full p-1 shadow-md">
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="px-3 py-1.5 rounded-full bg-gold-500/10 text-[10px] text-gold-400 font-extrabold hover:bg-gold-500/20 transition-all cursor-pointer"
                  >
                    Admin
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-full hover:bg-red-500/10 text-[10px] text-neutral-400 hover:text-red-400 transition-all cursor-pointer font-bold flex items-center gap-1"
                >
                  <LogOut className="h-3 w-3" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/wishlist')}
                className="px-4 py-2 rounded-full border border-white/10 hover:border-gold-500/30 hover:bg-white/5 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer font-bold"
              >
                Sign In
              </button>
            )}

            {/* Theme Toggler */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-white/10 hover:border-gold-500/30 hover:bg-white/5 text-neutral-300 hover:text-white transition-all cursor-pointer shadow-md flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 text-gold-400" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-neutral-850" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 bg-neutral-950/90 border border-white/10 rounded-full p-1 shadow-md">
              <Globe className="h-3.5 w-3.5 text-gold-400/80 mx-1.5" />
              {[
                { code: 'ar', label: t('arabic') },
                { code: 'fr', label: t('french') },
                { code: 'en', label: t('english') }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all duration-300 ${
                    currentLanguage.startsWith(lang.code)
                      ? 'bg-gradient-to-r from-gold-500 to-burgundy-500 text-neutral-950 font-extrabold shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </header>

      {/* Main Core Selector Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6 md:gap-8 my-4">
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-10 w-10 text-gold-500 animate-spin" />
            <p className="text-neutral-400 text-sm italic font-light">{t('loading_profiles')}</p>
          </div>
        )}

        {/* Database Errors */}
        {error && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3 max-w-md mx-auto text-center">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400">
              <HelpCircle className="h-6 w-6" />
            </div>
            <p className="text-sm text-neutral-300 font-medium">{error}</p>
          </div>
        )}

        {/* Database loaded successfully */}
        {!loading && !error && (
          <>
            {/* 1. Category Tabs Scroller */}
            <div className="flex flex-col gap-3 text-start">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h2 className="text-xs text-gold-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-gold-500" />
                  {t('olfactive_families')}
                </h2>
                
                {/* Scent Quiz trigger button */}
                <button
                  onClick={() => {
                    setQuizStep(0)
                    setQuizAnswers([])
                    setQuizOpen(true)
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 hover:text-white hover:bg-gold-500/20 transition-all text-xs font-bold cursor-pointer"
                >
                  <span>{t('quiz_start_button')}</span>
                </button>
              </div>

              {/* Tabs Scroll Container */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                {categories.map((category) => {
                  const isActive = selectedTab === category.id
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedTab(category.id)}
                      className={`flex items-center gap-2.5 px-4.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer shrink-0 border ${
                        isActive
                          ? 'bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 border-gold-300 text-neutral-950 font-extrabold shadow-lg shadow-gold-500/20 scale-[1.02]'
                          : 'bg-neutral-900/60 border-white/5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                      }`}
                    >
                      <span className={isActive ? 'text-neutral-950 font-bold animate-pulse' : 'text-neutral-400'}>
                        {getCategoryIcon(category.icon_name)}
                      </span>
                      <span>{getLocalizedName(category)}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Scent Notes Chips Grid */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {activeTabNotes.map((note) => {
                  const isSelected = selectedNotes.some(n => n.id === note.id)
                  const isExcluded = excludedNotes.some(n => n.id === note.id)
                  return (
                    <div
                      key={note.id}
                      onClick={() => toggleNote(note)}
                      className={`group p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between items-start text-start gap-4 cursor-pointer min-h-[110px] ${
                        isSelected
                          ? 'bg-gradient-to-tr from-gold-400 via-gold-500 to-gold-600 border-gold-300 text-neutral-950 font-extrabold shadow-lg shadow-gold-500/20 scale-[1.02]'
                          : isExcluded
                          ? 'bg-red-950/20 border-red-500/30 text-red-400 shadow-lg shadow-red-500/5'
                          : 'bg-neutral-900/30 border-white/10 text-neutral-300 hover:bg-neutral-900/60 hover:border-white/20'
                      }`}
                    >
                      {/* Note Label Header */}
                      <div className="w-full flex justify-between items-start gap-2 text-start">
                        <span className={`text-sm font-bold tracking-wide leading-tight transition-colors ${
                          isSelected ? 'text-neutral-950' : 'text-neutral-300 group-hover:text-white'
                        }`}>
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
                            className={`h-5 w-5 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                              isExcluded
                                ? 'bg-red-500 border-red-500 text-white'
                                : isSelected
                                ? 'border-neutral-900/20 hover:border-red-500/50 hover:bg-red-500/10 text-neutral-800 hover:text-red-650'
                                : 'border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-neutral-500 hover:text-red-400'
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
                            className={`h-5 w-5 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-neutral-950 border-neutral-950 text-gold-400 shadow-md shadow-black/20'
                                : 'border-white/10 hover:border-gold-500/50 hover:bg-gold-500/10 text-neutral-500 hover:text-gold-400'
                            }`}
                          >
                            {isSelected ? <Check className="h-2.5 w-2.5 stroke-[3.5]" /> : <div className="h-1.5 w-1.5 rounded-full bg-transparent" />}
                          </button>
                        </div>
                      </div>

                      {/* Note Description Footer */}
                      <div className="w-full text-start">
                        <span className={`text-[9px] uppercase tracking-wider font-semibold block ${
                          isSelected ? 'text-neutral-800' : isExcluded ? 'text-red-400/80' : 'text-neutral-400'
                        }`}>
                          {isExcluded ? t('excluded_note_badge') : t('layer_' + note.layer)}
                        </span>
                        {note.description_ar && currentLanguage === 'ar' && (
                          <p className={`text-[10px] mt-1 line-clamp-1 leading-snug font-light ${
                            isSelected ? 'text-neutral-800/80' : 'text-neutral-400'
                          }`}>
                            {note.description_ar}
                          </p>
                        )}
                      </div>

                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

      </main>

      {/* Sticky Bottom Drawer / Selector Bar */}
      <footer className="sticky bottom-0 z-50 w-full bg-neutral-950/90 backdrop-blur-xl border-t border-white/10 py-5 px-4 md:px-8 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Selected Notes Tracker */}
          <div className="w-full md:w-auto flex flex-col gap-2">
            <div className="flex items-center justify-between md:justify-start gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-serif font-bold text-white flex items-center gap-1.5">
                  <Heart className="h-4 w-4 fill-burgundy-500 text-burgundy-500" />
                  {getSelectedNotesLabel()}
                </span>
                {excludedNotes.length > 0 && (
                  <span className="text-[10px] font-bold bg-red-500/15 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full">
                    {t('excluded_notes_count', { count: excludedNotes.length })}
                  </span>
                )}
              </div>
              {(selectedNotes.length > 0 || excludedNotes.length > 0) && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-neutral-400 hover:text-red-400 font-semibold px-2 py-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {t('clear_all')}
                </button>
              )}
            </div>

            {/* Scrollable list of active chips */}
            {(selectedNotes.length > 0 || excludedNotes.length > 0) ? (
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-lg scrollbar-none">
                {selectedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center gap-1.5 bg-burgundy-750/70 border border-gold-500/20 text-gold-400 rounded-full ps-2 pe-1 py-1 shrink-0 text-[10px] font-bold"
                  >
                    <span>{getLocalizedName(note)}</span>
                    <button
                      type="button"
                      onClick={() => toggleNote(note)}
                      className="h-4.5 w-4.5 rounded-full hover:bg-white/10 flex items-center justify-center text-gold-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {excludedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center gap-1.5 bg-red-950/75 border border-red-500/25 text-red-400 rounded-full ps-2 pe-1 py-1 shrink-0 text-[10px] font-bold"
                  >
                    <Ban className="h-2.5 w-2.5" />
                    <span>{getLocalizedName(note)}</span>
                    <button
                      type="button"
                      onClick={() => toggleExclude(note)}
                      className="h-4.5 w-4.5 rounded-full hover:bg-white/10 flex items-center justify-center text-red-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Trigger matching results OR Empty State UI */}
          {(selectedNotes.length > 0 || excludedNotes.length > 0) ? (
            <button
              onClick={handleShowResults}
              disabled={selectedNotes.length === 0}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 text-neutral-950 font-bold text-sm shadow-xl shadow-gold-500/10 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>{t('show_results')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3.5 max-w-md w-full md:w-auto leading-tight text-start">
              <HelpCircle className="h-5 w-5 text-gold-500 shrink-0" />
              <div className="text-start">
                <p className="text-xs font-bold text-white mb-0.5">{t('empty_state_title')}</p>
                <p className="text-[10px] text-neutral-400 font-light">{t('empty_state_desc')}</p>
              </div>
            </div>
          )}

        </div>
      </footer>

      {/* 3. SCENT QUIZ MODAL OVERLAY */}
      {quizOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 flex flex-col gap-6 text-start font-sans">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-gold-400 animate-pulse" />
                <h3 className="font-serif text-base font-bold text-white">
                  {t('quiz_modal_title')}
                </h3>
              </div>
              <button 
                onClick={() => setQuizOpen(false)} 
                className="p-1 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer animate-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quiz Progress dots */}
            <div className="flex justify-between items-center">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((step) => (
                  <div 
                    key={step} 
                    className={`h-1.5 rounded-full transition-all ${
                      quizStep === step 
                        ? 'w-6 bg-gold-500' 
                        : quizStep > step 
                        ? 'w-2 bg-burgundy-500' 
                        : 'w-2 bg-neutral-800'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                Step {quizStep + 1} of 4
              </span>
            </div>

            {/* Question card */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white leading-relaxed">
                {quizQuestions[quizStep].question}
              </h4>

              <div className="flex flex-col gap-3">
                {quizQuestions[quizStep].options.map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => {
                      const nextAnswers = [...quizAnswers]
                      nextAnswers[quizStep] = opt.val
                      setQuizAnswers(nextAnswers)
                      
                      if (quizStep < 3) {
                        setQuizStep(prev => prev + 1)
                      } else {
                        handleFinishQuiz(nextAnswers)
                      }
                    }}
                    className="w-full p-4 rounded-2xl bg-neutral-950 border border-white/5 hover:border-gold-500/40 hover:bg-burgundy-950/15 text-start transition-all cursor-pointer text-xs font-semibold text-neutral-300 hover:text-white group flex justify-between items-center"
                  >
                    <span>{opt.text}</span>
                    <div className="h-4 w-4 rounded-full border border-white/10 group-hover:border-gold-500/50 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
