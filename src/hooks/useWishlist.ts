import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

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

  const [userId, setUserId] = useState<string | null>(null)

  // Listen to Auth State changes to capture login/logout
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Sync state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('parfumworld_wishlist', JSON.stringify(wishlist))
    } catch (e) {
      console.error('Failed to save wishlist to localStorage:', e)
    }
  }, [wishlist])

  // Fetch and merge wishlist from database if authenticated
  const syncWithDatabase = useCallback(async (uid: string) => {
    try {
      const { data: dbItems, error } = await supabase
        .from('wishlists')
        .select('perfume_id')
        .eq('user_id', uid)

      if (error) throw error

      const dbIds = (dbItems || []).map(item => item.perfume_id)
      
      // Merge: Unique union of local + db items
      const merged = Array.from(new Set([...wishlist, ...dbIds]))

      // Push any local item not in db to Supabase
      const missingInDb = wishlist.filter(id => !dbIds.includes(id))
      if (missingInDb.length > 0) {
        await supabase
          .from('wishlists')
          .insert(missingInDb.map(pid => ({ user_id: uid, perfume_id: pid })))
      }

      setWishlist(merged)
    } catch (e) {
      console.error('Error synchronizing wishlist with Supabase:', e)
    }
  }, [wishlist])

  // Trigger sync on login
  useEffect(() => {
    if (userId) {
      syncWithDatabase(userId)
    }
  }, [userId])

  // Check if a perfume is wishlisted
  const isWishlisted = useCallback((id: string) => {
    return wishlist.includes(id)
  }, [wishlist])

  // Toggle wishlist inclusion
  const toggleWishlist = useCallback(async (id: string) => {
    const isCurrentlyWishlisted = wishlist.includes(id)
    
    // Toggle state locally first
    setWishlist(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id)
      } else {
        return [...prev, id]
      }
    })

    // If authenticated, sync change to Supabase database
    if (userId) {
      try {
        if (isCurrentlyWishlisted) {
          await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', userId)
            .eq('perfume_id', id)
        } else {
          await supabase
            .from('wishlists')
            .insert({ user_id: userId, perfume_id: id })
        }
      } catch (e) {
        console.error('Failed to sync toggle to remote database:', e)
      }
    }
  }, [wishlist, userId])

  return {
    wishlist,
    isWishlisted,
    toggleWishlist,
    syncWithDatabase
  }
}
