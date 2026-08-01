import { useTranslation } from 'react-i18next'
import { Sparkles, Globe, Heart, Award } from 'lucide-react'

function App() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const currentLanguage = i18n.language || 'ar'

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-950 via-neutral-900 to-black text-white flex flex-col items-center justify-between p-6 md:p-12 selection:bg-amber-500 selection:text-black">
      
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center py-4 border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="h-5 w-5 text-neutral-900 animate-pulse" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-rose-300">
            ParfumWorld
          </span>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-2 bg-neutral-900/80 border border-white/10 rounded-full p-1.5 shadow-xl backdrop-blur-md">
          <Globe className="h-4 w-4 text-amber-300/80 mx-2" />
          {[
            { code: 'ar', label: t('arabic') },
            { code: 'fr', label: t('french') },
            { code: 'en', label: t('english') }
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                currentLanguage.startsWith(lang.code)
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold shadow-md'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl text-center px-4 my-12">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="relative border border-amber-500/20 bg-neutral-900/60 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl max-w-2xl transform hover:scale-[1.01] transition-transform duration-500">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6">
              <Heart className="h-3 w-3 fill-amber-300 animate-ping" />
              <span>Session 0 : Infrastructure</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-rose-100 to-amber-200">
              {t('welcome')}
            </h1>

            <p className="text-lg md:text-xl text-neutral-300/90 leading-relaxed mb-8 max-w-lg mx-auto font-light">
              {t('description')}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/10 pt-8 mt-4 text-left rtl:text-right">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
                <span className="text-xs text-neutral-400 font-mono">01. Setup</span>
                <span className="text-sm font-semibold mt-1 text-neutral-200">React + Vite + TS</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
                <span className="text-xs text-neutral-400 font-mono">02. Design</span>
                <span className="text-sm font-semibold mt-1 text-neutral-200">Tailwind v4 + shadcn</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between col-span-2 md:col-span-1">
                <span className="text-xs text-neutral-400 font-mono">03. Database</span>
                <span className="text-sm font-semibold mt-1 text-neutral-200">Supabase Client</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl text-center py-6 border-t border-white/5 backdrop-blur-sm flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-500 text-xs font-light">
        <p>© 2026 ParfumWorld. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-500" />
          <span>Designed with premium aesthetics</span>
        </div>
      </footer>

    </div>
  )
}

export default App
