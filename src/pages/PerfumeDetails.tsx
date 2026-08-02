import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useWishlist } from '../hooks/useWishlist'
import { 
  ArrowLeft, 
  Sparkles, 
  Award, 
  Loader2, 
  HelpCircle, 
  Heart, 
  Tag, 
  Layers, 
  MessageSquare,
  Volume2,
  Compass
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
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language || 'ar'
  const isRtl = currentLanguage.startsWith('ar')

  // Component states
  const [perfume, setPerfume] = useState<PerfumeDetailsType | null>(null)
  const [noteMappings, setNoteMappings] = useState<PerfumeNoteMapping[]>([])
  const [whatsappNumber, setWhatsappNumber] = useState<string>('+212600000000')
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

        // Fetch primary perfume details joined with brand details
        const { data: perfData, error: perfErr } = await supabase
          .from('perfumes')
          .select('*, brands(*)')
          .eq('id', id)
          .single()

        if (perfErr) throw perfErr
        if (!perfData) throw new Error('Perfume not found.')

        // Fetch perfume note mapping
        const { data: mappingData, error: mappingErr } = await supabase
          .from('perfume_notes')
          .select('layer, notes(*)')
          .eq('perfume_id', id)

        if (mappingErr) throw mappingErr

        // Fetch WhatsApp contact phone setting
        const { data: settingData } = await supabase
          .from('store_settings')
          .select('value')
          .eq('key', 'whatsapp_number')
          .single()

        // Fetch similar perfumes belonging to the same scent family
        const { data: similarData } = await supabase
          .from('perfumes')
          .select('*, brands(*)')
          .eq('family', perfData.family)
          .neq('id', id)
          .limit(3)

        setPerfume(perfData)
        const formattedMappings: PerfumeNoteMapping[] = (mappingData || []).map((m: any) => ({
          layer: m.layer,
          notes: Array.isArray(m.notes) ? m.notes[0] : m.notes
        }))
        setNoteMappings(formattedMappings)
        if (settingData?.value) {
          setWhatsappNumber(settingData.value)
        }
        setSimilarPerfumes(similarData || [])

      } catch (err: any) {
        console.error('Error fetching perfume details:', err)
        setError(err.message || 'Failed to load perfume data.')
      } finally {
        setLoading(false)
      }
    }

    fetchPerfumeData()
  }, [id])

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
    return noteMappings.filter(m => m.layer === 'top').map(m => m.notes)
  }, [noteMappings])

  const middleNotes = useMemo(() => {
    return noteMappings.filter(m => m.layer === 'middle').map(m => m.notes)
  }, [noteMappings])

  const baseNotes = useMemo(() => {
    return noteMappings.filter(m => m.layer === 'base').map(m => m.notes)
  }, [noteMappings])

  // Build whatsapp prefilled message link
  const whatsappUrl = useMemo(() => {
    if (!perfume) return '#'
    const textTemplate = t('whatsapp_message', {
      name: perfume.name,
      volume: perfume.volume_ml,
      price: perfume.price
    })
    return `https://wa.me/${whatsappNumber.replace(/[+ ]/g, '')}?text=${encodeURIComponent(textTemplate)}`
  }, [perfume, whatsappNumber, t])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-gold-500 animate-spin" />
        <p className="text-neutral-400 text-sm italic font-light">{t('loading_details')}</p>
      </div>
    )
  }

  if (error || !perfume) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20 mb-4">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold font-serif">{t('perfume_details_title')}</h2>
        <p className="text-sm text-neutral-400 max-w-sm mt-1">{error || t('db_load_error')}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 border border-white/10 rounded-full text-xs text-white hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{t('back_to_picker')}</span>
        </button>
      </div>
    )
  }

  const wishlisted = isWishlisted(perfume.id)

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-950 via-neutral-950 to-black text-white flex flex-col justify-between selection:bg-gold-500 selection:text-black">
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-lg border-b border-white/5 py-4 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-gold-500/30 hover:bg-white/5 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{t('back_to_picker')}</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gold-500 to-burgundy-500 flex items-center justify-center shadow-lg">
              <Sparkles className="h-4 w-4 text-neutral-900" />
            </div>
            <span className="font-serif text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-gold-100 to-gold-400">
              ParfumWorld
            </span>
          </div>

          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-light">
            {t('perfume_details_title')}
          </span>

        </div>
      </header>

      {/* Main Details Screen */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col gap-12 my-4">
        
        {/* Perfume Overview Block */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Card */}
          <div className="md:col-span-5 w-full flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-neutral-950 border border-white/5 shadow-2xl">
              {perfume.image_url ? (
                <img 
                  src={perfume.image_url} 
                  alt={perfume.name}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-95 hover:scale-102 transition-transform duration-750"
                />
              ) : (
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-500 font-serif">
                  No Image
                </div>
              )}
              
              {/* Target gender overlay tag */}
              <div className="absolute top-4 end-4 z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/75 border border-white/10 backdrop-blur-md text-[10px] font-bold text-gold-400 tracking-wider capitalize">
                  {t(`gender_options.${perfume.gender}`)}
                </span>
              </div>

              {/* Volume tag */}
              <div className="absolute bottom-4 start-4 z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-burgundy-950/80 border border-gold-500/20 backdrop-blur-md text-[10px] font-mono text-gold-400 font-bold">
                  <Volume2 className="h-3 w-3" />
                  {perfume.volume_ml} ml
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions & CTAs */}
          <div className="md:col-span-7 flex flex-col gap-6">
            
            {/* Header info */}
            <div className="flex flex-col gap-2.5">
              
              {/* Brand and Country info */}
              <div className="flex justify-between items-center text-xs tracking-wider uppercase font-semibold text-gold-400">
                <span>{perfume.brands.name}</span>
                {perfume.brands.country && (
                  <span className="text-[10px] text-neutral-500 font-light">{perfume.brands.country}</span>
                )}
              </div>

              {/* Perfume title */}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                {perfume.name}
              </h1>

              {/* Dupe announcement notice */}
              {perfume.is_dupe_of && (
                <div className="inline-flex self-start items-center gap-2 border border-gold-500/30 bg-gold-500/5 rounded-xl px-4 py-1.5 text-xs text-gold-400 font-semibold my-1 shadow-sm">
                  <Tag className="h-3.5 w-3.5 animate-pulse" />
                  <span>{t('inspired_by_label', { perfume: perfume.is_dupe_of })}</span>
                </div>
              )}
            </div>

            {/* Price block and wishlisting */}
            <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-4.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                  {perfume.concentration.toUpperCase()}
                </span>
                <span className="text-2xl md:text-3xl font-serif font-black text-gold-400">
                  {perfume.price} $
                </span>
              </div>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(perfume.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                  wishlisted
                    ? 'bg-burgundy-750/30 border-burgundy-500 text-burgundy-400 shadow-md'
                    : 'bg-transparent border-white/10 text-neutral-300 hover:text-white hover:border-white/20'
                }`}
              >
                <Heart className={`h-4 w-4 ${wishlisted ? 'fill-burgundy-500 stroke-burgundy-500' : ''}`} />
                <span>{wishlisted ? t('wishlist_added') : t('wishlist_add')}</span>
              </button>
            </div>

            {/* Description details */}
            <div className="flex flex-col gap-2 text-start">
              <h3 className="text-xs text-neutral-400 uppercase tracking-widest font-bold">
                {t('about_fragrance')}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-light text-start">
                {getLocalizedDescription(perfume)}
              </p>
            </div>

            {/* CTA Order WhatsApp Button */}
            {perfume.in_stock ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-8 py-4.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-xl shadow-emerald-950/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer text-center"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{t('order_via_whatsapp')}</span>
              </a>
            ) : (
              <div className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-4 text-center text-xs text-neutral-500 font-semibold italic">
                {t('out_of_stock')}
              </div>
            )}

          </div>
        </section>

        {/* Olfactive Fragrance Pyramid Section */}
        <section className="border-t border-white/5 pt-12 flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Layers className="h-4 w-4 text-gold-500" />
            <h2 className="text-sm text-gold-400 uppercase tracking-widest font-bold">
              {t('scent_pyramid_header')}
            </h2>
          </div>

          <div className="relative w-full max-w-2xl mx-auto flex flex-col gap-4.5 items-center py-6">
            
            {/* Decorative SVG Pyramid Outline in background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
              <svg viewBox="0 0 100 100" className="w-[320px] h-[320px] text-white" stroke="currentColor" fill="none" strokeWidth="0.5">
                <polygon points="50,5 95,90 5,90" />
                <line x1="28" y1="45" x2="72" y2="45" />
                <line x1="16" y1="68" x2="84" y2="68" />
              </svg>
            </div>

            {/* 1. Top Notes Tier (Peak) */}
            <div className="relative z-10 w-[75%] sm:w-[55%] flex flex-col items-center text-center bg-burgundy-950/40 border border-gold-500/20 rounded-2xl p-4.5 hover:border-gold-500/40 hover:scale-[1.01] transition-all shadow-lg shadow-burgundy-950/40">
              <span className="text-[9px] uppercase tracking-widest font-bold text-gold-400 mb-1.5 block">
                {t('scent_pyramid_top')}
              </span>
              {topNotes.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-1.5">
                  {topNotes.map(note => (
                    <span 
                      key={note.id} 
                      className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-white font-semibold font-sans hover:border-gold-500/25 transition-colors"
                    >
                      {getLocalizedName(note)}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-neutral-500 italic">None</span>
              )}
            </div>

            {/* 2. Middle Notes Tier (Heart) */}
            <div className="relative z-10 w-[88%] sm:w-[75%] flex flex-col items-center text-center bg-burgundy-950/60 border border-gold-500/30 rounded-2xl p-5 hover:border-gold-500/50 hover:scale-[1.01] transition-all shadow-lg shadow-burgundy-950/60">
              <span className="text-[9px] uppercase tracking-widest font-bold text-gold-400 mb-1.5 block">
                {t('scent_pyramid_middle')}
              </span>
              {middleNotes.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-1.5">
                  {middleNotes.map(note => (
                    <span 
                      key={note.id} 
                      className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-white font-semibold font-sans hover:border-gold-500/25 transition-colors"
                    >
                      {getLocalizedName(note)}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-neutral-500 italic">None</span>
              )}
            </div>

            {/* 3. Base Notes Tier (Dry down) */}
            <div className="relative z-10 w-full flex flex-col items-center text-center bg-burgundy-950/80 border border-gold-500/40 rounded-2xl p-5.5 hover:border-gold-500/60 hover:scale-[1.01] transition-all shadow-xl shadow-burgundy-950/80">
              <span className="text-[9px] uppercase tracking-widest font-bold text-gold-400 mb-1.5 block">
                {t('scent_pyramid_base')}
              </span>
              {baseNotes.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-1.5">
                  {baseNotes.map(note => (
                    <span 
                      key={note.id} 
                      className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-white font-semibold font-sans hover:border-gold-500/25 transition-colors"
                    >
                      {getLocalizedName(note)}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-neutral-500 italic">None</span>
              )}
            </div>

          </div>
        </section>

        {/* Similar Perfumes Carousel Panel */}
        <section className="border-t border-white/5 pt-12 flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Compass className="h-4 w-4 text-gold-500" />
            <h2 className="text-sm text-gold-400 uppercase tracking-widest font-bold">
              {t('similar_perfumes_title')}
            </h2>
          </div>

          {similarPerfumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarPerfumes.map((p) => (
                <Link
                  key={p.id}
                  to={`/perfume/${p.id}`}
                  className="group bg-neutral-900/20 border border-white/5 hover:border-gold-500/20 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image */}
                  <div className="aspect-video w-full overflow-hidden bg-neutral-950 relative">
                    {p.image_url ? (
                      <img 
                        src={p.image_url} 
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-600 font-serif">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-gold-400 block mb-1">
                        {p.brands.name}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors leading-tight">
                        {p.name}
                      </h4>
                    </div>

                    <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[10px] font-medium font-mono text-neutral-400">
                      <span>{p.volume_ml}ml</span>
                      <span className="text-gold-400 font-bold font-serif">{p.price} $</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 italic py-4">
              {t('similar_empty')}
            </p>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center py-6 border-t border-white/5 backdrop-blur-sm flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-500 text-xs font-light px-4">
        <p>© 2026 ParfumWorld. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-gold-500" />
          <span>Designed with premium aesthetics</span>
        </div>
      </footer>

    </div>
  )
}
