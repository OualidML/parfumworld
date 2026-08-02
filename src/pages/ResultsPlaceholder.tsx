import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Sparkles, Award } from 'lucide-react'

export default function ResultsPlaceholder() {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const currentLanguage = i18n.language || 'ar'

  const notesParam = searchParams.get('notes') || ''
  const selectedNoteIds = notesParam ? notesParam.split(',') : []

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-950 via-neutral-900 to-black text-white flex flex-col justify-between p-6 md:p-12 selection:bg-gold-500 selection:text-black">
      
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-4 border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gold-500 to-burgundy-500 flex items-center justify-center shadow-lg shadow-gold-500/20">
            <Sparkles className="h-5 w-5 text-neutral-900" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-gold-100 to-gold-400">
            ParfumWorld
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 my-12 text-center">
        <div className="relative border border-white/10 bg-neutral-900/60 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl max-w-2xl transform hover:scale-[1.01] transition-transform duration-500">
          
          <h1 className="text-3xl md:text-5xl font-serif font-extrabold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gold-100 via-cream-100 to-gold-400">
            {t('results_title')}
          </h1>

          <p className="text-base md:text-lg text-neutral-300 mb-8 font-light">
            {t('results_desc')}
          </p>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 text-left rtl:text-right font-mono">
            <p className="text-xs text-gold-400 mb-2 font-semibold tracking-wider uppercase">{t('selected_ids')}</p>
            {selectedNoteIds.length > 0 ? (
              <ul className="space-y-1.5 text-sm text-neutral-300">
                {selectedNoteIds.map((id, index) => (
                  <li key={id} className="flex items-center gap-2">
                    <span className="text-gold-500 font-bold">{index + 1}.</span>
                    <span className="break-all">{id}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500 italic">None</p>
            )}
          </div>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-sm shadow-lg shadow-gold-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className={`h-4 w-4 ${currentLanguage === 'ar' ? 'rotate-180' : ''}`} />
            <span>{t('back_to_picker')}</span>
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center py-6 border-t border-white/5 backdrop-blur-sm flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-500 text-xs font-light">
        <p>© 2026 ParfumWorld. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-gold-500" />
          <span>Designed with premium aesthetics</span>
        </div>
      </footer>

    </div>
  )
}
