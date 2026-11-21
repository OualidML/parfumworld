import { useEffect, useState, type ReactNode } from 'react'
import { Loader2, WifiOff, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import TrialLockScreen from './TrialLockScreen'

interface ShopGuardProps {
  children: ReactNode
}

interface CheckShopAccessResponse {
  status: 'trial' | 'active' | 'suspended' | 'not_found'
  is_locked: boolean
}

export default function ShopGuard({ children }: ShopGuardProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLocked, setIsLocked] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [errorDetail, setErrorDetail] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const verifyShopAccess = async () => {
      const shopId = import.meta.env.VITE_SHOP_ID?.trim()

      if (!shopId) {
        if (isMounted) {
          setIsLocked(false)
          setIsError(false)
          setErrorDetail(null)
          setIsLoading(false)
        }
        return
      }

      let rpcError: unknown = null
      let rpcData: unknown = null

      try {
        const { data, error } = await supabase.rpc('check_shop_access', {
          p_shop_id: shopId
        })

        rpcData = data
        rpcError = error

        const result: CheckShopAccessResponse | undefined = Array.isArray(data)
          ? data[0]
          : (data as CheckShopAccessResponse)

        if (error || !result || typeof result.is_locked !== 'boolean') {
          console.error('[ShopGuard] check_shop_access failed:', { shopId, error, data })
          const detailMessage = error
            ? `${error.code ? `[${error.code}] ` : ''}${error.message}${error.details ? ` (${error.details})` : ''}`
            : `Unexpected empty or malformed RPC payload for shopId=${shopId}: ${JSON.stringify(data)}`
          throw new Error(detailMessage)
        }

        if (isMounted) {
          setIsLocked(Boolean(result.is_locked))
          setIsError(false)
          setErrorDetail(null)
        }
      } catch (err) {
        if (!rpcError && rpcData === null) {
          console.error('[ShopGuard] check_shop_access failed:', {
            shopId,
            error: err,
            data: rpcData
          })
        }
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : typeof err === 'string'
                ? err
                : JSON.stringify(err)
          setErrorDetail(message)
          setIsError(true)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    verifyShopAccess()

    return () => {
      isMounted = false
    }
  }, [])

  // Strict loading gate: never flash the catalog while the RPC is in flight
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#2d1b14] flex items-center justify-center select-none">
        <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
      </div>
    )
  }

  // Graceful network / configuration fail-safe screen
  if (isError) {
    return (
      <div className="min-h-screen w-full bg-[#2d1b14] text-[#D4AF37] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-full max-w-md rounded-3xl bg-gradient-to-br from-[#3E2723]/95 to-[#1e110c]/95 border border-yellow-600/40 p-8 shadow-2xl shadow-black/70 flex flex-col items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-[#2d1b14] border border-[#D4AF37]/50 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)]">
            <WifiOff className="h-7 w-7 text-[#FFD700]" />
          </div>
          <p className="text-sm sm:text-base font-semibold text-[#FAF3E0] leading-relaxed">
            Unable to connect to the catalog. Please check your connection and refresh.
          </p>
          {import.meta.env.DEV && errorDetail && (
            <p className="text-[11px] font-mono text-[#D4AF37]/75 bg-black/35 border border-yellow-600/20 rounded-xl px-3.5 py-2 max-w-full break-words">
              {errorDetail}
            </p>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#b9982f] via-[#D4AF37] to-[#FFD700] text-[#1e110c] font-bold text-xs sm:text-sm py-3 px-6 shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_28px_rgba(255,215,0,0.6)] transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    )
  }

  if (isLocked) {
    return <TrialLockScreen />
  }

  return <>{children}</>
}
