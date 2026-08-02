import { useState, useEffect, useCallback } from 'react'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('parfumworld_wishlist')
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('Failed to parse wishlist from localStorage:', e)
      return []
    }
  })

  // Synchronize state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('parfumworld_wishlist', JSON.stringify(wishlist))
    } catch (e) {
      console.error('Failed to save wishlist to localStorage:', e)
    }
  }, [wishlist])

  // Check if a perfume is wishlisted
  const isWishlisted = useCallback((id: string) => {
    return wishlist.includes(id)
  }, [wishlist])

  // Toggle wishlist inclusion
  const toggleWishlist = useCallback((id: string) => {
    setWishlist(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }, [])

  // Sync placeholder for authenticated databases
  const syncWithDatabase = useCallback(async (userId?: string) => {
    if (!userId) return
    console.log('Synchronizing wishlist with user account database:', userId, wishlist)
    // Stub implementation to be hooked into wishlist table later
  }, [wishlist])

  return {
    wishlist,
    isWishlisted,
    toggleWishlist,
    syncWithDatabase
  }
}
