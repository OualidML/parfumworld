import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { KeyRound, Mail, Sparkles, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'

export default function ClientOnboarding() {
  const navigate = useNavigate()
  
  // Form States
  const [clientEmail, setClientEmail] = useState('')
  const [tempPassword, setTempPassword] = useState('')
  
  // Status States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Auth Guard State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  // Verify that a valid master admin session exists
  useEffect(() => {
    async function checkMasterAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session || !session.user) {
          navigate('/admin/login')
          return
        }

        // Verify that the logged-in user exists in public.admins
        const { data: admin, error: adminErr } = await supabase
          .from('admins')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle()

        if (adminErr) throw adminErr

        if (!admin) {
          setError('Unauthorized: Master access required.')
          setIsAuthenticated(false)
        } else {
          setIsAuthenticated(true)
        }
      } catch (err: any) {
        console.error('Master auth check failed:', err)
        setError(err.message || 'Authentication error')
      } finally {
        setAuthLoading(false)
      }
    }
    checkMasterAuth()
  }, [navigate])

  const handleProvisionShop = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (!clientEmail || !tempPassword) {
      setError('Please fill in both the client email and temporary password.')
      setLoading(false)
      return
    }

    if (tempPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    try {
      // Provision a new user with metadata role 'shop_owner'
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: clientEmail,
        password: tempPassword,
        options: {
          emailRedirectTo: window.location.origin + '/admin/login',
          data: {
            role: 'shop_owner'
          }
        }
      })

      if (signUpError) throw signUpError

      if (data?.user) {
        setSuccess(`Successfully provisioned new shop owner account for: ${clientEmail}. An email confirmation has been sent.`)
        setClientEmail('')
        setTempPassword('')
      } else {
        throw new Error('Provisioning failed. No user object returned.')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to provision new shop.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-300">
        <Loader2 className="h-6 w-6 animate-spin text-gold-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      {/* Header Back Link */}
      <button 
        onClick={() => navigate('/admin')}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-all cursor-pointer font-bold"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Dashboard</span>
      </button>

      <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-gold-500/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-burgundy-500/10 rounded-full blur-2xl" />

        <div className="flex flex-col items-center mb-6 relative">
          <div className="h-12 w-12 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-3">
            <Sparkles className="h-5 w-5 text-gold-500" />
          </div>
          <h2 className="text-xl font-extrabold text-white text-center">Master Client Onboarding</h2>
          <p className="text-xs text-neutral-400 text-center mt-1">Provision isolated multi-tenant shop partitions</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {!isAuthenticated ? (
          <div className="text-center py-6">
            <p className="text-sm text-neutral-400 mb-4">You must login as an administrator to access onboarding tools.</p>
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full py-2.5 rounded-2xl bg-gold-500 hover:bg-gold-400 text-neutral-950 font-bold transition-all text-xs cursor-pointer"
            >
              Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleProvisionShop} className="space-y-4 relative">
            <div>
              <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 pl-1">
                New Client Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 h-4 w-4 text-neutral-500" />
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="owner@newboutique.com"
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-gold-500 transition-all placeholder-neutral-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 pl-1">
                Temporary Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3 h-4 w-4 text-neutral-500" />
                <input
                  type="password"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-gold-500 transition-all placeholder-neutral-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gold-500 hover:bg-gold-400 text-neutral-950 font-extrabold transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-gold-500/10 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Provision New Shop</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
