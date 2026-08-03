import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWishlist } from '../hooks/useWishlist'
import { supabase } from '../lib/supabase'
import { 
  Package, Award, Sun, Moon, Sparkles, ArrowLeft, Heart, Loader2, Mail, CheckCircle2, AlertCircle, LogOut
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
  const isRtl = currentLanguage === 'ar'

  const { wishlist, toggleWishlist } = useWishlist()

  // Perfumes catalog state
  const [perfumes, setPerfumes] = useState<Perfume[]>([])
  const [loading, setLoading] = useState(true)
  const [storeName, setStoreName] = useState('ParfumWorld')

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

  // Auth States
  const [sessionUser, setSessionUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  // Fetch Session & Catalog
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

    fetchPerfumes()

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

  const fetchPerfumes = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*, brands(*)')
      if (error) throw error
      setPerfumes(data || [])

      // Fetch Store Name
      const { data: settingsData } = await supabase
        .from('store_settings')
        .select('value')
        .eq('key', 'store_name')
        .maybeSingle()

      if (settingsData && settingsData.value) {
        setStoreName(settingsData.value)
      }
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
    await supabase.auth.signOut()
    setSessionUser(null)
  }

  // Filter wishlisted perfumes
  const wishlistedPerfumes = perfumes.filter(p => wishlist.includes(p.id))

  const getLocalizedDescription = (p: Perfume) => {
    if (currentLanguage === 'ar') return p.description_ar || p.description_en
    if (currentLanguage === 'fr') return p.description_fr || p.description_en
    return p.description_en
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-950 via-neutral-950 to-black text-white flex flex-col justify-between selection:bg-gold-500 selection:text-black font-sans text-start">
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-lg border-b border-white/5 py-4 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          <button
            onClick={() => navigate('/')}
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
              {storeName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggler */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-white/10 hover:border-gold-500/30 hover:bg-white/5 text-neutral-300 hover:text-white transition-all cursor-pointer shadow-md flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 text-gold-400" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-neutral-855" />
              )}
            </button>

            {/* Auth Widget */}
            {sessionUser ? (
              <div className="flex items-center gap-1.5 bg-neutral-950/90 border border-white/10 rounded-full p-0.5 shadow-md">
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="px-2.5 py-1 rounded-full bg-gold-500/10 text-[9px] text-gold-400 font-extrabold hover:bg-gold-500/20 transition-all cursor-pointer"
                  >
                    Admin
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 rounded-full hover:bg-red-500/10 text-[9px] text-neutral-400 hover:text-red-400 transition-all cursor-pointer font-bold flex items-center gap-1"
                >
                  <LogOut className="h-3 w-3" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/wishlist')}
                className="px-3 py-1.5 rounded-full border border-white/10 hover:border-gold-500/30 hover:bg-white/5 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer font-bold"
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-black text-white flex items-center gap-2">
              <Heart className="h-6 w-6 text-burgundy-500 fill-burgundy-500 animate-pulse" />
              {t('wishlist_page_title')}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Your personal catalog of favorite scent blends and luxury fragrances.
            </p>
          </div>

          {/* Sync user status */}
          {sessionUser ? (
            <div className="flex items-center gap-3 bg-neutral-900 border border-white/5 rounded-2xl p-3">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-neutral-500">Account Synced</span>
                <span className="text-xs font-mono text-gold-400 mt-0.5">{sessionUser.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 border border-white/5 transition-all cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        {/* Auth sync prompt banner */}
        {!sessionUser && (
          <section className="bg-gradient-to-r from-burgundy-950/45 to-neutral-900/40 border border-gold-500/20 backdrop-blur-md rounded-3xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-start max-w-lg">
              <h3 className="text-sm font-bold text-white flex items-center justify-center md:justify-start gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-gold-400" />
                Sync Across Devices
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-light">
                {t('sync_wishlist_banner')}
              </p>
            </div>

            {/* Email form trigger */}
            <form onSubmit={handleMagicLink} className="flex flex-col w-full md:w-auto gap-2.5 max-w-sm">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute start-3 top-3 h-4 w-4 text-neutral-500" />
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl py-2.5 ps-10 pe-4 text-xs text-white focus:outline-none focus:border-gold-500/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-xs shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {authLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-950" />}
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
          <div className="flex-1 py-32 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 text-gold-500 animate-spin" />
            <p className="text-neutral-400 text-xs italic">Loading favorites...</p>
          </div>
        ) : wishlistedPerfumes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlistedPerfumes.map((perfume) => (
              <div 
                key={perfume.id}
                className="group bg-neutral-900/40 border border-white/5 hover:border-gold-500/20 rounded-3xl overflow-hidden shadow-lg hover:shadow-gold-500/5 transition-all duration-300 flex flex-col h-full cursor-pointer relative"
                onClick={() => navigate(`/perfume/${perfume.id}`)}
              >
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWishlist(perfume.id)
                  }}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 border border-white/10 text-burgundy-400 hover:text-neutral-400 transition-colors"
                >
                  <Heart className="h-4.5 w-4.5 fill-burgundy-500 stroke-burgundy-500" />
                </button>

                {/* Scent Cover Image */}
                <div className="aspect-video w-full overflow-hidden bg-neutral-950 relative flex items-center justify-center text-neutral-600 font-serif text-xs">
                  <span>No Image</span>
                  {perfume.image_url && (
                    <img 
                      src={perfume.image_url} 
                      alt={perfume.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90 absolute z-10"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent z-10 pointer-events-none" />
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-gold-400 block">
                      {perfume.brands.name}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-gold-400 transition-colors">
                      {perfume.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-light mt-1">
                      {getLocalizedDescription(perfume)}
                    </p>
                  </div>

                  {/* Dupe announcement tag */}
                  {perfume.is_dupe_of && (
                    <span className="inline-flex self-start items-center text-[9px] font-bold text-gold-400/80 bg-gold-500/5 border border-gold-500/10 rounded-lg px-2.5 py-1">
                      {t('dupe_badge_text', { perfume: perfume.is_dupe_of })}
                    </span>
                  )}

                  {/* Price & stock */}
                  <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px] font-mono font-medium text-neutral-400">
                    <span>{perfume.volume_ml}ml • {perfume.concentration.toUpperCase()}</span>
                    <div className="flex items-center gap-3">
                      {perfume.in_stock ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-[9px]">
                          <Package className="h-3 w-3" />
                          {t('in_stock')}
                        </span>
                      ) : (
                        <span className="text-neutral-500 flex items-center gap-1 text-[9px]">
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
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto gap-4 bg-neutral-900/10 border border-white/5 rounded-3xl p-8 shadow-inner shadow-black">
            <Heart className="h-10 w-10 text-neutral-600" />
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              {t('wishlist_empty')}
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-2 text-xs text-gold-400 underline hover:text-white"
            >
              {t('back_to_picker')}
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center py-6 border-t border-white/5 bg-neutral-950/20 flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-500 text-xs font-light px-4">
        <p>© 2026 ParfumWorld. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-gold-500" />
          <span>Designed with premium aesthetics</span>
        </div>
      </footer>

    </div>
  )
}
