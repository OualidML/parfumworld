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
  TrendingUp
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
  const isRtl = currentLanguage.startsWith('ar')

  // Database states
  const [categories, setCategories] = useState<NoteCategory[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Interaction states
  const [selectedTab, setSelectedTab] = useState<string>('')
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  
  const searchContainerRef = useRef<HTMLDivElement>(null)

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
        
        // Default select first tab if categories exist
        if (catData && catData.length > 0) {
          setSelectedTab(catData[0].id)
        }
      } catch (err: any) {
        console.error('Error fetching note data:', err)
        setError(err.message || 'Failed to load database records.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

  // Calculate matching notes from the database based on debounced search query
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return []
    const q = debouncedQuery.toLowerCase().trim()
    return notes.filter(note => 
      note.name_ar.toLowerCase().includes(q) ||
      note.name_en.toLowerCase().includes(q) ||
      note.name_fr.toLowerCase().includes(q)
    )
  }, [debouncedQuery, notes])

  // Toggle selection state of a note card
  const toggleNote = (note: Note) => {
    setSelectedNotes(prev => {
      const exists = prev.some(n => n.id === note.id)
      if (exists) {
        return prev.filter(n => n.id !== note.id)
      } else {
        return [...prev, note]
      }
    })
  }

  // Clear all selections
  const handleClearAll = () => {
    setSelectedNotes([])
  }

  // Navigate to results screen passing selected note IDs as params
  const handleShowResults = () => {
    if (selectedNotes.length === 0) return
    const ids = selectedNotes.map(n => n.id).join(',')
    navigate(`/results?notes=${ids}`)
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
                ParfumWorld
              </span>
              <span className="text-[10px] text-neutral-400 mt-1 tracking-wider uppercase block font-light">
                Premium Scents Explorer
              </span>
            </div>
          </div>

          {/* Search container */}
          <div ref={searchContainerRef} className="relative w-full max-w-sm">
            <div className="relative">
              <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 ${isRtl ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSearchResults(true)
                }}
                onFocus={() => setShowSearchResults(true)}
                className={`w-full bg-neutral-900/90 border border-white/10 rounded-full py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all backdrop-blur-sm ${
                  isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setShowSearchResults(false)
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/5 ${isRtl ? 'left-3' : 'right-3'}`}
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
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-burgundy-950/40 text-left rtl:text-right transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{getLocalizedName(note)}</p>
                          <p className="text-[10px] text-neutral-400 capitalize mt-0.5">{note.layer} Note</p>
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
      </header>

      {/* Main Core Selector Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6 md:gap-8 my-4">
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-10 w-10 text-gold-500 animate-spin" />
            <p className="text-neutral-400 text-sm italic font-light">Loading scent profiles...</p>
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
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h2 className="text-xs text-gold-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-gold-500" />
                  {currentLanguage === 'ar' ? 'العائلات العطرية' : 'Olfactive Families'}
                </h2>
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
                          ? 'bg-burgundy-750 border-gold-500/40 text-gold-400 shadow-lg shadow-burgundy-950/80 scale-[1.02]'
                          : 'bg-neutral-900/60 border-white/5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                      }`}
                    >
                      <span className={isActive ? 'text-gold-500' : 'text-neutral-400'}>
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
                  return (
                    <button
                      key={note.id}
                      onClick={() => toggleNote(note)}
                      className={`group p-4 rounded-2xl text-right rtl:text-right border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between items-start text-start gap-4 cursor-pointer min-h-[110px] ${
                        isSelected
                          ? 'bg-burgundy-950 border-gold-500 text-gold-400 shadow-lg shadow-gold-500/5'
                          : 'bg-neutral-900/30 border-white/10 text-neutral-300 hover:bg-neutral-900/60 hover:border-white/20'
                      }`}
                    >
                      {/* Note Label Header */}
                      <div className="w-full flex justify-between items-start gap-2">
                        <span className="text-sm font-bold tracking-wide leading-tight group-hover:text-white transition-colors">
                          {getLocalizedName(note)}
                        </span>
                        {isSelected ? (
                          <div className="h-5 w-5 rounded-full bg-gold-500 flex items-center justify-center text-neutral-950 shadow-md">
                            <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-white/10 group-hover:border-white/30 transition-colors" />
                        )}
                      </div>

                      {/* Note Description Footer */}
                      <div className="w-full">
                        <span className={`text-[9px] uppercase tracking-wider font-semibold block ${
                          isSelected ? 'text-gold-400/80' : 'text-neutral-400'
                        }`}>
                          {note.layer} Note
                        </span>
                        {note.description_ar && currentLanguage === 'ar' && (
                          <p className="text-[10px] text-neutral-400 mt-1 line-clamp-1 leading-snug font-light">
                            {note.description_ar}
                          </p>
                        )}
                      </div>

                    </button>
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
              <span className="text-sm font-serif font-bold text-white flex items-center gap-1.5">
                <Heart className="h-4 w-4 fill-burgundy-500 text-burgundy-500" />
                {getSelectedNotesLabel()}
              </span>
              {selectedNotes.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-neutral-400 hover:text-red-400 font-semibold px-2 py-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {t('clear_all')}
                </button>
              )}
            </div>

            {/* Scrollable list of active chips */}
            {selectedNotes.length > 0 ? (
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-lg scrollbar-none">
                {selectedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center gap-1.5 bg-burgundy-750/70 border border-gold-500/20 text-gold-400 rounded-full pl-2 pr-1 py-1 shrink-0 text-[10px] font-bold"
                  >
                    <span>{getLocalizedName(note)}</span>
                    <button
                      onClick={() => toggleNote(note)}
                      className="h-4.5 w-4.5 rounded-full hover:bg-white/10 flex items-center justify-center text-gold-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Trigger matching results OR Empty State UI */}
          {selectedNotes.length > 0 ? (
            <button
              onClick={handleShowResults}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-sm shadow-xl shadow-gold-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span>{t('show_results')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3.5 max-w-md w-full md:w-auto leading-tight text-center md:text-left rtl:text-right">
              <HelpCircle className="h-5 w-5 text-gold-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white mb-0.5">{t('empty_state_title')}</p>
                <p className="text-[10px] text-neutral-400 font-light">{t('empty_state_desc')}</p>
              </div>
            </div>
          )}

        </div>
      </footer>

    </div>
  )
}
