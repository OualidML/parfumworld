import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { KeyRound, Mail, Sparkles, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const currentLanguage = i18n.language || 'ar'
  const isRtl = currentLanguage === 'ar'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!email || !password) {
      setError(t('general_error'))
      setLoading(false)
      return
    }

    try {
      // 1. Sign in via Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      const user = authData.user
      if (!user) throw new Error('Authentication failed.')

      // 2. Validate admin role from admins table
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (adminError) throw adminError

      if (!adminData) {
        // Sign out user since they are unauthorized
        await supabase.auth.signOut()
        throw new Error(t('unauthorized_error'))
      }

      // Save shop owner ID to local storage for kiosk persistence
      localStorage.setItem('parfumworld_shop_id', user.id)

      // Redirect to Admin Dashboard
      navigate('/admin')
    } catch (err: any) {
      setError(err.message || t('unauthorized_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-950 via-neutral-950 to-black text-white flex flex-col justify-between selection:bg-gold-500 selection:text-black font-sans">
      
      {/* Top Header */}
      <header className="w-full py-4 px-4 md:px-8 border-b border-white/5 bg-neutral-950/40 backdrop-blur-md">
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
              ParfumWorld
            </span>
          </div>

          <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-light text-end">
            {t('admin_sign_in')}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-900/60 border border-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl space-y-6 flex flex-col items-stretch text-start">
          
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500/20 to-burgundy-500/20 flex items-center justify-center border border-gold-500/20 shadow-lg">
              <KeyRound className="w-6 h-6 text-gold-400" />
            </div>
            <h2 className="text-xl font-serif font-black text-white">
              {t('admin_sign_in')}
            </h2>
            <p className="text-xs text-neutral-400 font-light">
              Enter your credentials to access the owner panel.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 text-red-400 text-xs">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">{t('email')}</label>
              <div className="relative">
                <Mail className="absolute start-3 top-3 h-4 w-4 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@parfumworld.com"
                  required
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2.5 ps-10 pe-4 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">{t('password')}</label>
              <div className="relative">
                <KeyRound className="absolute start-3 top-3 h-4 w-4 text-neutral-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2.5 ps-10 pe-4 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-sm shadow-xl shadow-gold-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>{t('sign_in_button')}</span>
              )}
            </button>

          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-white/5 bg-neutral-950/20 text-neutral-500 text-xs font-light">
        <p>© 2026 ParfumWorld. Owner Panel Access.</p>
      </footer>

    </div>
  )
}
