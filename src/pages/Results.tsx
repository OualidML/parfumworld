import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { Note } from '../types/database'
import { useWishlist } from '../hooks/useWishlist'
import { 
  ArrowLeft, 
  Sparkles, 
  Award, 
  Loader2, 
  Filter, 
  AlertTriangle,
  Tag,
  CheckCircle2,
  Package,
  Layers,
  Heart,
  Undo,
  X
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

  // Component states
  const [perfumes, setPerfumes] = useState<MatchedPerfume[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Comparison State
  const [comparedPerfumeIds, setComparedPerfumeIds] = useState<string[]>([])
  const [compareModalOpen, setCompareModalOpen] = useState(false)

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
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(500)
  const [filterConcentration, setFilterConcentration] = useState<string>('all')
  const [filterInStockOnly, setFilterInStockOnly] = useState<boolean>(false)

  // 1. Fetch matching perfumes and all note descriptions
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

        // Invoke PostgreSQL RPC matching function with exclusions
        const { data: matchedData, error: matchedErr } = await supabase
          .rpc('match_perfumes', { 
            user_note_ids: selectedNoteIds,
            excluded_note_ids: excludedNoteIds
          })

        if (matchedErr) throw matchedErr

        // Fetch all scent notes description to map on the card list
        const { data: notesData, error: notesErr } = await supabase
          .from('notes')
          .select('*')

        if (notesErr) throw notesErr

        setPerfumes(matchedData || [])
        setNotes(notesData || [])

        // Set max price slider dynamically based on results
        if (matchedData && matchedData.length > 0) {
          const maxPriceVal = Math.max(...matchedData.map((p: any) => Number(p.price)))
          setFilterMaxPrice(Math.ceil(maxPriceVal))
        }
      } catch (err: any) {
        console.error('Error fetching matching results:', err)
        setError(err.message || 'Failed to match perfumes.')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [selectedNoteIds, excludedNoteIds])

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
    // Suggest removing the first selected note
    const targetId = selectedNoteIds[0]
    return notes.find(n => n.id === targetId) || null
  }, [selectedNoteIds, notes])

  // Remove suggested note from URL query params
  const handleRemoveSuggestedNote = (noteId: string) => {
    const updatedIds = selectedNoteIds.filter(id => id !== noteId)
    setSearchParams({ notes: updatedIds.join(',') })
  }

  // Derive dynamic slider max boundary
  const absoluteMaxPriceLimit = useMemo(() => {
    if (perfumes.length === 0) return 500
    const highest = Math.max(...perfumes.map(p => Number(p.price)))
    return Math.ceil(highest)
  }, [perfumes])

  // Apply secondary filtering client-side
  const filteredPerfumes = useMemo(() => {
    return perfumes.filter(p => {
      // 1. Gender Filter
      if (filterGender !== 'all' && p.gender !== filterGender) return false
      // 2. Price Filter
      if (Number(p.price) > filterMaxPrice) return false
      // 3. Concentration Filter
      if (filterConcentration !== 'all' && p.concentration !== filterConcentration) return false
      // 4. In Stock Filter
      if (filterInStockOnly && !p.in_stock) return false
      return true
    })
  }, [perfumes, filterGender, filterMaxPrice, filterConcentration, filterInStockOnly])

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

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-950 via-neutral-950 to-black text-white flex flex-col justify-between selection:bg-gold-500 selection:text-black">
      
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-lg border-b border-white/5 py-4 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-gold-500/30 hover:bg-white/5 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{t('back_to_picker')}</span>
          </button>

          {/* Title */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gold-500 to-burgundy-500 flex items-center justify-center shadow-lg">
              <Sparkles className="h-4 w-4 text-neutral-900" />
            </div>
            <span className="font-serif text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-gold-100 to-gold-400">
              ParfumWorld
            </span>
          </div>

          <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-light text-end">
            {t('results_title')}
          </div>

        </div>
      </header>

      {/* Main Container */}
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
              <AlertTriangle className="h-6 w-6" />
            </div>
            <p className="text-sm text-neutral-300 font-medium">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-2 text-xs text-gold-400 underline hover:text-white"
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
              <div className="bg-neutral-900/40 border border-white/5 backdrop-blur-md rounded-3xl p-5 md:p-6 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <Filter className="h-4 w-4 text-gold-500" />
                  <h3 className="text-xs uppercase tracking-wider font-bold text-gold-400">
                    {t('filters_header')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-end text-start">
                  {/* 1. Gender Filter */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-neutral-400 font-medium">{t('gender_label')}</label>
                    <div className="flex bg-neutral-950/80 p-1 border border-white/5 rounded-xl gap-1">
                      {['all', 'male', 'female', 'unisex'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setFilterGender(g)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            filterGender === g
                              ? 'bg-burgundy-750 text-gold-400 font-bold shadow-md'
                              : 'text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          {g === 'all' ? t('gender_all') : t(`gender_options.${g}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Concentration Filter */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-neutral-400 font-medium">{t('concentration_label')}</label>
                    <select
                      value={filterConcentration}
                      onChange={(e) => setFilterConcentration(e.target.value)}
                      className="w-full bg-neutral-950/90 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50"
                    >
                      <option value="all">{t('concentration_all')}</option>
                      <option value="parfum">Parfum</option>
                      <option value="edp">Eau de Parfum (EDP)</option>
                      <option value="edt">Eau de Toilette (EDT)</option>
                      <option value="edc">Eau de Cologne (EDC)</option>
                    </select>
                  </div>

                  {/* 3. Price Filter Slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-neutral-400 font-medium">
                        {t('price_max_filter', { price: filterMaxPrice })}
                      </label>
                      <span className="text-[10px] text-neutral-500 font-mono">Max: {absoluteMaxPriceLimit}$</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={absoluteMaxPriceLimit}
                      value={filterMaxPrice}
                      onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-gold-500 focus:outline-none"
                    />
                  </div>

                  {/* 4. In Stock Filter */}
                  <div className="flex items-center gap-2.5 py-1 sm:py-2.5">
                    <input
                      id="inStockCheck"
                      type="checkbox"
                      checked={filterInStockOnly}
                      onChange={(e) => setFilterInStockOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-neutral-950 text-gold-500 focus:ring-0 focus:ring-offset-0 accent-gold-500 cursor-pointer"
                    />
                    <label htmlFor="inStockCheck" className="text-xs text-neutral-300 hover:text-white cursor-pointer select-none font-medium">
                      {t('in_stock_only')}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Matching Result Cards List */}
            {filteredPerfumes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPerfumes.map((perfume) => {
                  const isFullMatch = Number(perfume.match_score) >= 100.0
                  return (
                    <div 
                      key={perfume.id}
                      onClick={() => navigate(`/perfume/${perfume.id}`)}
                      className="group bg-neutral-900/30 border border-white/5 hover:border-gold-500/25 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative cursor-pointer"
                    >
                      {/* Image container & Match Badge */}
                      <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                        {perfume.image_url ? (
                          <img 
                            src={perfume.image_url} 
                            alt={perfume.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-600 font-serif">
                            No Image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
                        
                        {/* Wishlist Toggle Heart */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleWishlist(perfume.id)
                          }}
                          className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} z-20 p-2 rounded-full bg-black/60 border border-white/10 text-neutral-400 hover:text-burgundy-400 transition-all cursor-pointer`}
                        >
                          <Heart className={`h-4 w-4 ${isWishlisted(perfume.id) ? 'fill-burgundy-500 text-burgundy-500' : ''}`} />
                        </button>

                        {/* Match Score Badge */}
                        <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} z-10`}>
                          {isFullMatch ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-500/90 backdrop-blur-md text-neutral-950 font-bold text-xs shadow-lg animate-pulse">
                              {t('full_match')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-burgundy-750/90 border border-gold-500/30 backdrop-blur-md text-gold-400 font-bold text-xs shadow-lg">
                              {t('match_percentage', { percentage: Math.round(perfume.match_score) })}
                            </span>
                          )}
                        </div>

                        {/* Dupe Badge */}
                        {perfume.is_dupe_of && (
                          <div className={`absolute bottom-3 ${isRtl ? 'right-3' : 'left-3'} z-10 flex items-center gap-1.5 bg-black/75 border border-white/10 rounded-lg px-2.5 py-1 backdrop-blur-sm`}>
                            <Tag className="h-3 w-3 text-gold-400" />
                            <span className="text-[10px] text-neutral-300 font-medium">
                              {t('dupe_badge_text', { perfume: perfume.is_dupe_of })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                        <div className="flex flex-col gap-2.5">
                          {/* Brand and Stock Status */}
                          <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold">
                            <span className="text-gold-400">{perfume.brand_name}</span>
                            {perfume.in_stock ? (
                              <span className="text-emerald-400 flex items-center gap-1 text-[9px]">
                                <CheckCircle2 className="h-3 w-3" />
                                {t('in_stock')}
                              </span>
                            ) : (
                              <span className="text-neutral-500 flex items-center gap-1 text-[9px]">
                                <Package className="h-3 w-3" />
                                {t('out_of_stock')}
                              </span>
                            )}
                          </div>

                          {/* Perfume Name */}
                          <h4 className="font-serif text-lg font-bold text-white group-hover:text-gold-400 transition-colors text-start">
                            {perfume.name}
                          </h4>

                          {/* Description */}
                          <p className="text-xs text-neutral-400 leading-relaxed font-light line-clamp-2 text-start">
                            {getLocalizedDescription(perfume)}
                          </p>
                        </div>

                        {/* Note Comparison Grid */}
                        <div className="border-t border-white/5 pt-4 text-start">
                          <span className="text-[9px] uppercase tracking-wider font-semibold text-neutral-400 flex items-center gap-1 mb-2.5">
                            <Layers className="h-3 w-3 text-gold-500" />
                            {t('scent_pyramid_header')}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {/* Loop over notes related to the perfume */}
                            {notes
                              .filter((note) => perfume.all_note_ids.includes(note.id))
                              .map((note) => {
                                const isMatched = perfume.matching_note_ids.includes(note.id)
                                return (
                                  <span
                                    key={note.id}
                                    className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                                      isMatched
                                        ? 'bg-burgundy-750/30 border-gold-500/40 text-gold-400 shadow-sm shadow-gold-500/5'
                                        : 'bg-black/10 border-white/5 text-neutral-500'
                                    }`}
                                  >
                                    {getLocalizedName(note)}
                                  </span>
                                )
                              })}
                          </div>
                        </div>

                        {/* Footer details (price, ml, compare selector) */}
                        <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2"
                          >
                            <input 
                              type="checkbox"
                              id={`compare-${perfume.id}`}
                              checked={comparedPerfumeIds.includes(perfume.id)}
                              onChange={() => toggleCompare(perfume.id)}
                              className="w-4 h-4 rounded border-white/10 bg-neutral-950 text-gold-500 focus:ring-0 focus:ring-offset-0 accent-gold-500 cursor-pointer"
                            />
                            <label 
                              htmlFor={`compare-${perfume.id}`}
                              className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 hover:text-white cursor-pointer select-none"
                            >
                              {t('compare_trigger')}
                            </label>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-neutral-450 font-mono">
                              {perfume.volume_ml}ml • {perfume.concentration.toUpperCase()}
                            </span>
                            <span className="text-base font-serif font-extrabold text-gold-400 bg-clip-text">
                              {perfume.price} $
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
              <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 max-w-xl mx-auto text-center bg-neutral-900/20 border border-white/5 rounded-3xl p-8 shadow-xl">
                <div className="h-16 w-16 rounded-full bg-burgundy-950/40 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-6 shadow-inner shadow-black">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-serif font-bold text-white mb-2 leading-tight">
                  {t('results_empty_state')}
                </h3>
                
                <p className="text-sm text-neutral-400 leading-relaxed mb-8 max-w-md mx-auto font-light">
                  {t('results_empty_desc')}
                </p>

                {/* Offer auto removal note action */}
                {suggestRemoveNote && (
                  <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-3">
                    <span className="text-[10px] text-gold-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
                      {t('suggest_note_prompt')}
                    </span>
                    <button
                      onClick={() => handleRemoveSuggestedNote(suggestRemoveNote.id)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy-750 hover:bg-burgundy-500 border border-gold-500/30 text-gold-400 hover:text-white font-bold text-xs transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-burgundy-950/80"
                    >
                      <Undo className="h-3.5 w-3.5" />
                      <span>{t('remove_note_action', { note: getLocalizedName(suggestRemoveNote) })}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center py-6 border-t border-white/5 backdrop-blur-sm flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-500 text-xs font-light px-4">
        <p>© 2026 ParfumWorld. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-gold-500" />
          <span>Designed with premium aesthetics</span>
        </div>
      </footer>

      {/* FLOATING COMPARE BAR */}
      {comparedPerfumeIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/95 border border-gold-500/35 px-6 py-4 rounded-3xl flex items-center justify-between gap-6 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 w-11/12 max-w-md font-sans">
          <div className="text-start">
            <p className="text-xs text-white font-bold">
              {comparedPerfumeIds.length === 1 
                ? "Select one more perfume to compare" 
                : `${comparedPerfumeIds.length} Perfumes Selected`}
            </p>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              Compare features and scent pyramids side-by-side
            </p>
          </div>
          <div className="flex items-center gap-3">
            {comparedPerfumeIds.length === 2 && (
              <button
                type="button"
                onClick={() => setCompareModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-extrabold text-xs cursor-pointer shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('compare_trigger')}
              </button>
            )}
            <button
              type="button"
              onClick={() => setComparedPerfumeIds([])}
              className="text-[10px] text-neutral-400 hover:text-white underline font-semibold cursor-pointer"
            >
              {t('clear_all')}
            </button>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE COMPARISON MODAL OVERLAY */}
      {compareModalOpen && comparedPerfumes.length === 2 && comparisonDetails && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl my-8 flex flex-col justify-between font-sans text-start overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-neutral-950/40">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-gold-400" />
                <h3 className="font-serif text-lg font-bold text-white">
                  {t('compare_perfumes_title')}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setCompareModalOpen(false)} 
                className="p-1 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: Comparison Table/Grid */}
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-xs text-neutral-300 border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="py-4 px-3 text-start text-neutral-400 uppercase tracking-widest text-[9px] w-1/4">Criteria</th>
                    <th className="py-4 px-3 text-start font-serif text-sm font-bold text-gold-400 w-3/8">
                      {comparedPerfumes[0].name}
                      <span className="block text-[9px] font-sans font-semibold text-neutral-400 uppercase tracking-wider mt-0.5">
                        {comparedPerfumes[0].brand_name}
                      </span>
                    </th>
                    <th className="py-4 px-3 text-start font-serif text-sm font-bold text-gold-400 w-3/8">
                      {comparedPerfumes[1].name}
                      <span className="block text-[9px] font-sans font-semibold text-neutral-400 uppercase tracking-wider mt-0.5">
                        {comparedPerfumes[1].brand_name}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {/* Photo row */}
                  <tr>
                    <td className="py-4 px-3 text-neutral-400 font-medium">Image</td>
                    <td className="py-4 px-3">
                      {comparedPerfumes[0].image_url ? (
                        <img src={comparedPerfumes[0].image_url} alt={comparedPerfumes[0].name} className="h-20 w-32 object-cover rounded-xl border border-white/5" />
                      ) : (
                        <div className="h-20 w-32 bg-neutral-950 flex items-center justify-center text-neutral-600 rounded-xl">No Photo</div>
                      )}
                    </td>
                    <td className="py-4 px-3">
                      {comparedPerfumes[1].image_url ? (
                        <img src={comparedPerfumes[1].image_url} alt={comparedPerfumes[1].name} className="h-20 w-32 object-cover rounded-xl border border-white/5" />
                      ) : (
                        <div className="h-20 w-32 bg-neutral-950 flex items-center justify-center text-neutral-600 rounded-xl">No Photo</div>
                      )}
                    </td>
                  </tr>

                  {/* Match Score row */}
                  <tr>
                    <td className="py-4 px-3 text-neutral-400 font-medium">{t('compare_match_score')}</td>
                    <td className="py-4 px-3 font-mono font-bold text-sm text-gold-400">
                      {Math.round(comparedPerfumes[0].match_score)}% Match
                    </td>
                    <td className="py-4 px-3 font-mono font-bold text-sm text-gold-400">
                      {Math.round(comparedPerfumes[1].match_score)}% Match
                    </td>
                  </tr>

                  {/* Price row */}
                  <tr>
                    <td className="py-4 px-3 text-neutral-400 font-medium">{t('compare_price')}</td>
                    <td className="py-4 px-3 font-bold font-mono text-sm text-white">{comparedPerfumes[0].price} $</td>
                    <td className="py-4 px-3 font-bold font-mono text-sm text-white">{comparedPerfumes[1].price} $</td>
                  </tr>

                  {/* Volume row */}
                  <tr>
                    <td className="py-4 px-3 text-neutral-400 font-medium">{t('compare_volume')}</td>
                    <td className="py-4 px-3 font-mono">{comparedPerfumes[0].volume_ml} ml</td>
                    <td className="py-4 px-3 font-mono">{comparedPerfumes[1].volume_ml} ml</td>
                  </tr>

                  {/* Concentration row */}
                  <tr>
                    <td className="py-4 px-3 text-neutral-400 font-medium">{t('compare_concentration')}</td>
                    <td className="py-4 px-3 uppercase font-semibold text-neutral-350">{comparedPerfumes[0].concentration}</td>
                    <td className="py-4 px-3 uppercase font-semibold text-neutral-350">{comparedPerfumes[1].concentration}</td>
                  </tr>

                  {/* Inspired by row */}
                  <tr>
                    <td className="py-4 px-3 text-neutral-400 font-medium">Alternative To</td>
                    <td className="py-4 px-3 italic text-neutral-350">
                      {comparedPerfumes[0].is_dupe_of ? t('dupe_badge_text', { perfume: comparedPerfumes[0].is_dupe_of }) : '—'}
                    </td>
                    <td className="py-4 px-3 italic text-neutral-350">
                      {comparedPerfumes[1].is_dupe_of ? t('dupe_badge_text', { perfume: comparedPerfumes[1].is_dupe_of }) : '—'}
                    </td>
                  </tr>

                  {/* Shared Scent Notes row */}
                  <tr>
                    <td className="py-4 px-3 text-neutral-400 font-medium">{t('shared_notes_label')}</td>
                    <td className="py-4 px-3" colSpan={2}>
                      <div className="flex flex-wrap gap-1.5">
                        {comparisonDetails.shared.length > 0 ? (
                          comparisonDetails.shared.map(note => (
                            <span key={note.id} className="px-2 py-0.5 rounded-lg bg-burgundy-750/30 border border-gold-500/35 text-gold-400 font-semibold text-[10px]">
                              {getLocalizedName(note)}
                            </span>
                          ))
                        ) : (
                          <span className="italic text-neutral-500">None</span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Unique Scent Notes row */}
                  <tr>
                    <td className="py-4 px-3 text-neutral-400 font-medium">{t('unique_notes_label')}</td>
                    <td className="py-4 px-3">
                      <div className="flex flex-wrap gap-1.5">
                        {comparisonDetails.uniqueP1.length > 0 ? (
                          comparisonDetails.uniqueP1.map(note => (
                            <span key={note.id} className="px-2 py-0.5 rounded-lg bg-neutral-950 border border-white/5 text-neutral-400 text-[10px]">
                              {getLocalizedName(note)}
                            </span>
                          ))
                        ) : (
                          <span className="italic text-neutral-500">None</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex flex-wrap gap-1.5">
                        {comparisonDetails.uniqueP2.length > 0 ? (
                          comparisonDetails.uniqueP2.map(note => (
                            <span key={note.id} className="px-2 py-0.5 rounded-lg bg-neutral-950 border border-white/5 text-neutral-400 text-[10px]">
                              {getLocalizedName(note)}
                            </span>
                          ))
                        ) : (
                          <span className="italic text-neutral-500">None</span>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-neutral-950/40 flex justify-end">
              <button
                type="button"
                onClick={() => setCompareModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
