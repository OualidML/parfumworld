import { Lock, MessageCircle, Sparkles } from 'lucide-react'

// Replace with the developer's WhatsApp phone number in international format (no + or spaces)
const DEVELOPER_WHATSAPP_NUMBER = '213XXXXXXXXX'

export default function TrialLockScreen() {
  const whatsappUrl = `https://wa.me/${DEVELOPER_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'مرحباً، أود تفعيل النسخة الكاملة لمتجر العطور الخاص بي.'
  )}`

  return (
    <div
      dir="rtl"
      className="relative overflow-hidden isolate z-0 min-h-screen w-full bg-[#2d1b14] text-[#D4AF37] flex flex-col items-center justify-center p-6 select-none"
    >
      {/* Slow-moving Royal Oud & Gold ambient radial aura */}
      <div className="absolute inset-0 royal-oud-ambient-canvas pointer-events-none" />

      {/* Floating gold dust particles */}
      <span className="royal-gold-dust-slow absolute top-16 left-12 h-2.5 w-2.5 rounded-full bg-[#FFD700]/60 blur-[1px] pointer-events-none" />
      <span className="royal-gold-dust-slower absolute bottom-20 left-1/4 h-2 w-2 rounded-full bg-[#D4AF37]/70 blur-[0.5px] pointer-events-none" />
      <span className="royal-gold-dust-slow absolute top-1/4 right-16 h-3 w-3 rounded-full bg-[#F59E0B]/40 blur-[1px] pointer-events-none" />
      <span className="royal-gold-dust-slower absolute bottom-16 right-16 h-2 w-2 rounded-full bg-[#FFD700]/65 pointer-events-none" />

      {/* Lock Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-gradient-to-br from-[#3E2723]/95 to-[#1e110c]/95 border border-yellow-600/40 p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.75)] backdrop-blur-md flex flex-col items-center text-center gap-6">
        {/* Royal Gold Emblem */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-3 rounded-full bg-[#D4AF37]/20 blur-xl animate-pulse pointer-events-none" />
          <div className="relative h-20 w-20 rounded-full bg-[#2d1b14] border-2 border-[#D4AF37]/60 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.35)]">
            <Lock className="h-9 w-9 text-[#FFD700]" />
          </div>
        </div>

        {/* Brand Header */}
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-[#D4AF37]/80 font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-[#FFD700]" />
            Maison Royal Oud
            <Sparkles className="h-3.5 w-3.5 text-[#FFD700]" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#FFD700] tracking-wide pt-1">
            انتهت الفترة التجريبية
          </h1>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

        {/* Message Body */}
        <p className="text-sm sm:text-base text-[#FAF3E0]/90 leading-relaxed font-medium">
          يرجى التواصل مع الإدارة لتفعيل النسخة الكاملة
        </p>

        {/* Glowing Gold WhatsApp CTA Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#b9982f] via-[#D4AF37] to-[#FFD700] text-[#1e110c] font-extrabold text-sm sm:text-base py-4 px-6 shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:shadow-[0_0_35px_rgba(255,215,0,0.75)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300"
        >
          <MessageCircle className="h-5 w-5 fill-[#1e110c] text-[#1e110c]" />
          <span>تواصل عبر واتساب للتفعيل</span>
        </a>
      </div>
    </div>
  )
}
