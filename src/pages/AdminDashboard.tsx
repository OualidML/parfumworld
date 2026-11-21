import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { resolveShopId } from '../lib/utils'
import { useShopSettings } from '../context/ShopSettingsContext'
import ShopBrandHeader from '../components/ShopBrandHeader'
import type { ShopPublicProfile, WhatsappOrderIntent } from '../types/database'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList
} from 'recharts'
import { 
  Sparkles, LogOut, Loader2, AlertCircle, TrendingUp, Layers, Settings,
  Plus, Edit2, Trash2, Search, Save, X, Upload, DollarSign,
  Tag, MapPin, MessageSquare, KeyRound, CheckCircle2, RotateCcw,
  Globe, ShieldCheck, Bell, Check, ExternalLink
} from 'lucide-react'

// Interfaces mapping database columns
interface Brand {
  id: string
  name: string
  country?: string
}

interface NoteCategory {
  id: string
  family: string
  name_ar: string
  name_en: string
  name_fr: string
}

interface Note {
  id: string
  category_id: string
  name_ar: string
  name_en: string
  name_fr: string
  layer: 'top' | 'middle' | 'base'
  description_ar?: string
}

interface Perfume {
  id: string
  brand_id: string
  brands: Brand // relational join
  name: string
  gender: 'male' | 'female' | 'unisex'
  concentration: 'parfum' | 'edp' | 'edt' | 'edc'
  price: number
  volume_ml: number
  family?: string
  season_tags: string[]
  occasion_tags: string[]
  in_stock: boolean
  is_dupe_of?: string
  image_url?: string
  description_ar?: string
  description_en?: string
  description_fr?: string
  perfume_notes?: any[]
}

interface PerfumeNoteMapping {
  note_id: string
  layer: 'top' | 'middle' | 'base'
}

// Stats interface mappings
interface SearchStatNote {
  note_id: string
  name_ar: string
  name_en: string
  name_fr: string
  layer: string
  search_count: number
}

interface MatchedPerfumeStat {
  perfume_id: string
  perfume_name: string
  brand_name: string
  in_stock: boolean
  match_count: number
}

interface TopSoldPerfume {
  perfume_name: string
  brand_name: string
  sales_count: number
}

export default function AdminDashboard() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const currentLanguage = i18n.language || 'ar'
  const { shopSettings, isLoadingSettings, refreshShopSettings } = useShopSettings()

  // Auth Guard States
  const [authLoading, setAuthLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState<string>('')

  // Active Tab: 'stats' | 'perfumes' | 'notes' | 'settings' | 'alternatives'
  const [activeTab, setActiveTab] = useState<'stats' | 'perfumes' | 'notes' | 'settings' | 'alternatives'>('stats')

  // Alternatives Finder States
  const [selectedAnchorId, setSelectedAnchorId] = useState<string>('')
  const [anchorSearchQuery, setAnchorSearchQuery] = useState<string>('')
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [alternativesList, setAlternativesList] = useState<any[]>([])
  const [altsLoading, setAltsLoading] = useState(false)
  const [uploadLoadingId, setUploadLoadingId] = useState<string | null>(null)
  const anchorSearchRef = useRef<HTMLDivElement>(null)

  // Global Data States
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<NoteCategory[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [perfumes, setPerfumes] = useState<Perfume[]>([])

  // Search & Filter state for catalog tables
  const [perfumeSearch, setPerfumeSearch] = useState('')
  const [noteSearch, setNoteSearch] = useState('')

  // Loading States for operations
  const [dataLoading, setDataLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  // --- Modal States ---
  // Perfume Modal
  const [perfumeModalOpen, setPerfumeModalOpen] = useState(false)
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null)
  const [perfumeForm, setPerfumeForm] = useState({
    brand_id: '',
    name: '',
    gender: 'unisex' as 'male' | 'female' | 'unisex',
    concentration: 'edp' as 'parfum' | 'edp' | 'edt' | 'edc',
    price: 0,
    volume_ml: 100,
    family: '',
    is_dupe_of: '',
    image_url: '',
    description_ar: '',
    description_en: '',
    description_fr: '',
    in_stock: true,
  })
  const [perfumeNotesForm, setPerfumeNotesForm] = useState<PerfumeNoteMapping[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)

  // Note Modal
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [noteForm, setNoteForm] = useState({
    category_id: '',
    name_ar: '',
    name_en: '',
    name_fr: '',
    layer: 'middle' as 'top' | 'middle' | 'base',
    description_ar: ''
  })
  const [noteError, setNoteError] = useState<string | null>(null)

  // Settings state (Session 12: 3-Tab General Settings)
  const [settingsSubTab, setSettingsSubTab] = useState<'identity' | 'contact' | 'security'>('identity')
  const [settingsForm, setSettingsForm] = useState<ShopPublicProfile>({
    shop_name: 'ParfumWorld',
    slogan: '',
    logo_url: null,
    whatsapp_number: '',
    location_url: '',
    instagram_handle: '',
    instagram_url: '',
    facebook_handle: '',
    facebook_url: '',
    tiktok_handle: '',
    tiktok_url: ''
  })
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [settingsToast, setSettingsToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Password Update States (Tab 3: Security & Password)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passLoading, setPassLoading] = useState(false)
  const [passwordToast, setPasswordToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Pending WhatsApp Order Intents (Owner Sale-Recording Reminder)
  const [pendingIntents, setPendingIntents] = useState<WhatsappOrderIntent[]>([])
  const [resolvingIntentId, setResolvingIntentId] = useState<string | null>(null)

  // Stats Analytics states
  const [topNotes, setTopNotes] = useState<SearchStatNote[]>([])
  const [matchedPerfumes, setMatchedPerfumes] = useState<MatchedPerfumeStat[]>([])
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const [topSoldPerfumes, setTopSoldPerfumes] = useState<TopSoldPerfume[]>([])
  const [topSoldLoading, setTopSoldLoading] = useState(false)

  // --- Inline Loading Helpers ---
  const [inlinePriceLoading, setInlinePriceLoading] = useState<Record<string, boolean>>({})

  // 1. Auth Guard Verification
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session || !session.user) {
          navigate('/admin/login')
          return
        }

        // Verify if user exists in admins table for the active shopId
        const shopId = resolveShopId()
        const { data: admin, error: adminErr } = await supabase
          .from('admins')
          .select('id, shop_id')
          .eq('id', session.user.id)
          .eq('shop_id', shopId)
          .maybeSingle()

        if (adminErr) throw adminErr

        if (!admin) {
          await supabase.auth.signOut()
          navigate('/admin/login')
          return
        }

        setIsAdmin(true)
        setAdminEmail(session.user.email || '')
        setAuthLoading(false)
      } catch (err: any) {
        console.error('Auth verification error:', err)
        setAuthLoading(false)
      }
    }
    checkAuth()
  }, [navigate])

  // 2. Fetch Catalog Data once authenticated
  useEffect(() => {
    if (!isAdmin) return

    fetchGlobalData()
    fetchStatsData()
    fetchSettingsData()
    fetchPendingWhatsappIntents()
  }, [isAdmin])

  // 2.1. Keep Tab 1 & Tab 2 settingsForm synchronized when ShopSettingsContext finishes loading
  useEffect(() => {
    if (isLoadingSettings) return
    setSettingsForm({
      shop_name: shopSettings.shop_name?.trim() || 'ParfumWorld',
      slogan: shopSettings.slogan ?? '',
      logo_url: shopSettings.logo_url ?? null,
      whatsapp_number: shopSettings.whatsapp_number ?? '',
      location_url: shopSettings.location_url ?? '',
      instagram_handle: shopSettings.instagram_handle ?? '',
      instagram_url: shopSettings.instagram_url ?? '',
      facebook_handle: shopSettings.facebook_handle ?? '',
      facebook_url: shopSettings.facebook_url ?? '',
      tiktok_handle: shopSettings.tiktok_handle ?? '',
      tiktok_url: shopSettings.tiktok_url ?? ''
    })
  }, [isLoadingSettings, shopSettings])

  const fetchTop5Sold = async (activeTimeframe: 'daily' | 'weekly' | 'monthly' = timeframe) => {
    setTopSoldLoading(true)
    try {
      const shopId = resolveShopId()
      const { data, error } = await supabase.rpc('get_top_5_sold', {
        p_shop_id: shopId,
        p_timeframe: activeTimeframe
      })
      if (error) throw error
      setTopSoldPerfumes(
        (data || []).map((row: any) => ({
          perfume_name: row.perfume_name,
          brand_name: row.brand_name,
          sales_count: Number(row.sales_count) || 0
        }))
      )
    } catch (e) {
      console.warn('Failed to load get_top_5_sold RPC:', e)
      setTopSoldPerfumes([])
    } finally {
      setTopSoldLoading(false)
    }
  }

  // 2.5. Fetch Top 5 Best Sellers whenever `isAdmin` or `timeframe` changes
  useEffect(() => {
    if (!isAdmin) return
    fetchTop5Sold(timeframe)
  }, [isAdmin, timeframe])

  // 3. Fetch Alternatives when selectedAnchorId changes
  useEffect(() => {
    async function fetchAlts() {
      if (!selectedAnchorId) {
        setAlternativesList([])
        return
      }
      setAltsLoading(true)
      try {
        const shopId = resolveShopId()
        const { data, error } = await supabase
          .from('perfume_alternatives')
          .select('*')
          .eq('perfume_id', selectedAnchorId)
          .eq('shop_id', shopId)
          .order('match_confidence', { ascending: false })
        
        if (error) throw error
        
        if (!data || data.length === 0) {
          const anchor = perfumes.find(p => p.id === selectedAnchorId)
          if (anchor) {
            // Compute dynamic fallback alternatives in-memory
            const candidates = perfumes
              .filter(p => p.id !== selectedAnchorId)
              .filter(p => p.gender === anchor.gender || p.gender === 'unisex')
              .sort((a, b) => {
                const aBrandMatch = a.brands.name === anchor.brands.name ? 1 : 0
                const bBrandMatch = b.brands.name === anchor.brands.name ? 1 : 0
                if (aBrandMatch !== bBrandMatch) return bBrandMatch - aBrandMatch
                
                const aFamilyMatch = a.family && anchor.family && a.family.toLowerCase().split(' ')[0] === anchor.family.toLowerCase().split(' ')[0] ? 1 : 0
                const bFamilyMatch = b.family && anchor.family && b.family.toLowerCase().split(' ')[0] === anchor.family.toLowerCase().split(' ')[0] ? 1 : 0
                return bFamilyMatch - aFamilyMatch
              })
              .slice(0, 6)

            const mapped = candidates.map((p, idx) => {
              const pNotes = p.perfume_notes || []
              const getNoteNamesForLayer = (layerName: string) => {
                return pNotes
                  .filter((pn: any) => pn.layer === layerName)
                  .map((pn: any) => {
                    const foundNote = notes.find(n => n.id === pn.note_id)
                    return foundNote ? (currentLanguage === 'ar' ? foundNote.name_ar : currentLanguage === 'fr' ? foundNote.name_fr : foundNote.name_en) : ''
                  })
                  .filter(Boolean)
              }

              return {
                id: `fallback-${p.id}`,
                perfume_id: selectedAnchorId,
                brand: p.brands.name,
                name: p.name,
                match_confidence: 85 - idx * 3,
                notes: {
                  top_notes: getNoteNamesForLayer('top'),
                  middle_notes: getNoteNamesForLayer('middle'),
                  base_notes: getNoteNamesForLayer('base')
                },
                image_url: p.image_url,
                shop_owner_pitch: `Suggested alternative in stock matching the character of ${anchor.name}.`,
                is_uploaded: true
              }
            })
            setAlternativesList(mapped)
          } else {
            setAlternativesList([])
          }
        } else {
          setAlternativesList(data)
        }
      } catch (err: any) {
        console.error('Error fetching alternatives:', err)
      } finally {
        setAltsLoading(false)
      }
    }
    fetchAlts()
  }, [selectedAnchorId, perfumes])

  const handleUploadAlternative = async (alt: any) => {
    if (!selectedAnchorId) return
    setUploadLoadingId(alt.id)
    try {
      const shopId = resolveShopId()
      if (!shopId) throw new Error('No active shop tenant')

      // 1. Resolve or Create Brand
      let brandId = ''
      const existingBrand = brands.find(b => b.name.toLowerCase() === alt.brand.toLowerCase())
      if (existingBrand) {
        brandId = existingBrand.id
      } else {
        const { data: newBrand, error: brandErr } = await supabase
          .from('brands')
          .insert({ name: alt.brand, country: 'France' })
          .select('id')
          .single()
        if (brandErr) throw brandErr
        brandId = newBrand.id
        setBrands(prev => [...prev, { id: brandId, name: alt.brand }])
      }

      // 2. Insert Perfume Record
      const { data: newPerfume, error: perfumeErr } = await supabase
        .from('perfumes')
        .insert({
          shop_id: shopId,
          brand_id: brandId,
          name: alt.name,
          gender: 'unisex',
          concentration: 'edp',
          price: 0,
          volume_ml: 100,
          family: 'Woody Oriental',
          season_tags: ['Winter', 'Autumn'],
          occasion_tags: ['Night', 'Casual'],
          in_stock: true,
          image_url: alt.image_url,
          description_ar: `بديل عطر مميز: ${alt.shop_owner_pitch}`,
          description_en: `Alternative signature fragrance: ${alt.shop_owner_pitch}`,
          description_fr: `Alternative: ${alt.shop_owner_pitch}`
        })
        .select('id')
        .single()
      if (perfumeErr) throw perfumeErr
      const newPerfumeId = newPerfume.id

      // 3. Map Scent Notes
      const noteMappings: any[] = []
      const mapNoteNameToId = (name: string) => {
        const found = notes.find(n => 
          n.name_en.toLowerCase() === name.toLowerCase() ||
          n.name_fr.toLowerCase() === name.toLowerCase() ||
          n.name_ar.toLowerCase() === name.toLowerCase()
        )
        return found ? found.id : null
      }

      for (const layer of ['top', 'middle', 'base']) {
        const key = `${layer}_notes`
        const noteList = alt.notes[key] || []
        for (const noteName of noteList) {
          const noteId = mapNoteNameToId(noteName)
          if (noteId) {
            noteMappings.push({
              perfume_id: newPerfumeId,
              note_id: noteId,
              layer: layer
            })
          }
        }
      }

      if (noteMappings.length > 0) {
        const { error: mappingErr } = await supabase
          .from('perfume_notes')
          .insert(noteMappings)
        if (mappingErr) throw mappingErr
      }

      // 4. Set alternative state to uploaded
      const { error: altErr } = await supabase
        .from('perfume_alternatives')
        .update({ is_uploaded: true })
        .eq('id', alt.id)
      if (altErr) throw altErr

      // Update Local State
      setAlternativesList(prev => prev.map(a => a.id === alt.id ? { ...a, is_uploaded: true } : a))
      // Refresh perfumes list
      fetchGlobalData()
      alert('Alternative uploaded successfully and added to stock!')
    } catch (err: any) {
      console.error(err)
      alert(`Upload failed: ${err.message}`)
    } finally {
      setUploadLoadingId(null)
    }
  }
  // 4. Click outside to close anchor search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (anchorSearchRef.current && !anchorSearchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchGlobalData = async () => {
    setDataLoading(true)
    try {
      const shopId = resolveShopId()

      // Fetch Brands
      const { data: brandsData } = await supabase.from('brands').select('*').order('name')
      setBrands(brandsData || [])

      // Fetch Categories
      const { data: catData } = await supabase.from('note_categories').select('*')
      setCategories(catData || [])

      // Fetch Notes (global + shop-local)
      const { data: notesData } = await supabase
        .from('notes')
        .select('*')
        .or(`shop_id.is.null,shop_id.eq.${shopId}`)
        .order('name_en')
      setNotes(notesData || [])

      // Fetch Perfumes with Brand details strictly isolated by shop_id
      const { data: perfData } = await supabase
        .from('perfumes')
        .select('*, brands(*), perfume_notes(*)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false })
      setPerfumes(perfData || [])
    } catch (e) {
      console.error(e)
    } finally {
      setDataLoading(false)
    }
  }

  const fetchSettingsData = async () => {
    try {
      const shopId = resolveShopId()
      const { data, error } = await supabase.rpc('get_shop_public_profile', {
        p_shop_id: shopId
      })
      if (!error && data) {
        const raw = (Array.isArray(data) ? data[0] : data) as Partial<ShopPublicProfile> | undefined
        if (raw) {
          setSettingsForm({
            shop_name: raw.shop_name?.trim() || 'ParfumWorld',
            slogan: raw.slogan ?? '',
            logo_url: raw.logo_url ?? null,
            whatsapp_number: raw.whatsapp_number ?? '',
            location_url: raw.location_url ?? '',
            instagram_handle: raw.instagram_handle ?? '',
            instagram_url: raw.instagram_url ?? '',
            facebook_handle: raw.facebook_handle ?? '',
            facebook_url: raw.facebook_url ?? '',
            tiktok_handle: raw.tiktok_handle ?? '',
            tiktok_url: raw.tiktok_url ?? ''
          })
          return
        }
      }
    } catch (e) {
      console.error('Failed to load shop public profile:', e)
    }
  }

  const fetchPendingWhatsappIntents = async () => {
    try {
      const shopId = resolveShopId()
      const { data, error } = await supabase.rpc('get_pending_whatsapp_intents', {
        p_shop_id: shopId
      })
      if (!error && Array.isArray(data)) {
        setPendingIntents(data as WhatsappOrderIntent[])
      }
    } catch (e) {
      console.warn('Failed to fetch pending WhatsApp intents:', e)
    }
  }

  const handleResolveWhatsappIntent = async (
    intentId: string,
    action: 'confirmed' | 'dismissed'
  ) => {
    if (resolvingIntentId) return
    setResolvingIntentId(intentId)
    try {
      const shopId = resolveShopId()
      const { error } = await supabase.rpc('resolve_whatsapp_intent', {
        p_shop_id: shopId,
        p_intent_id: intentId,
        p_action: action
      })
      if (error) throw error

      setPendingIntents(prev => prev.filter(item => item.id !== intentId))
      if (action === 'confirmed') {
        await fetchTop5Sold(timeframe)
      }
    } catch (err: any) {
      console.error('Failed to resolve WhatsApp intent:', err)
      alert(err.message || 'تعذر تحديث حالة طلب واتساب.')
    } finally {
      setResolvingIntentId(null)
    }
  }

  const fetchStatsData = async () => {
    try {
      const shopId = resolveShopId()

      // 1. Top searched notes (last 30 days) strictly scoped to shopId
      const { data: topNotesData } = await supabase.rpc('get_top_searched_notes', {
        p_shop_id: shopId,
        days_count: 30
      })
      setTopNotes(topNotesData || [])

      // 2. Most matched perfumes overall strictly scoped to shopId (limit 5)
      const { data: matchedPerfumesData } = await supabase.rpc('get_most_matched_perfumes', {
        p_shop_id: shopId,
        limit_count: 5
      })
      setMatchedPerfumes(matchedPerfumesData || [])
    } catch (e) {
      console.warn('Failed to load stats RPC queries:', e)
    }
  }

  // Sign out Handler
  const handleSignOut = async () => {
    localStorage.removeItem('parfumworld_shop_id')
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  // --- Inline Edit Inventory Handlers ---
  const handleToggleStock = async (perfume: Perfume) => {
    const nextStockState = !perfume.in_stock
    // Optimistic UI updates
    setPerfumes(prev => prev.map(p => p.id === perfume.id ? { ...p, in_stock: nextStockState } : p))

    try {
      const { error } = await supabase
        .from('perfumes')
        .update({ in_stock: nextStockState })
        .eq('id', perfume.id)
      
      if (error) throw error
    } catch (e) {
      // Revert optimistic change on error
      setPerfumes(prev => prev.map(p => p.id === perfume.id ? { ...p, in_stock: perfume.in_stock } : p))
      alert('Error updating stock toggle.')
    }
  }

  const handlePriceBlur = async (perfume: Perfume, newPriceStr: string) => {
    const nextPrice = parseFloat(newPriceStr)
    if (isNaN(nextPrice) || nextPrice === perfume.price) return

    setInlinePriceLoading(prev => ({ ...prev, [perfume.id]: true }))
    try {
      const { error } = await supabase
        .from('perfumes')
        .update({ price: nextPrice })
        .eq('id', perfume.id)

      if (error) throw error
      setPerfumes(prev => prev.map(p => p.id === perfume.id ? { ...p, price: nextPrice } : p))
    } catch (e) {
      alert('Error saving price change.')
    } finally {
      setInlinePriceLoading(prev => ({ ...prev, [perfume.id]: false }))
    }
  }

  // --- Scent Cover Image Upload Handler ---
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reject files exceeding 1.5MB
    if (file.size > 1.5 * 1024 * 1024) {
      alert(t('image_size_error') || 'Image size exceeds 1.5MB limit. Please compress it first.')
      return
    }

    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `perfume-covers/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('perfumes')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('perfumes')
        .getPublicUrl(filePath)

      setPerfumeForm(prev => ({ ...prev, image_url: publicUrl }))
    } catch (err: any) {
      alert(`Upload error: ${err.message}`)
    } finally {
      setUploadingImage(false)
    }
  }

  // --- Perfume CRUD Save Actions ---
  const openAddPerfumeModal = () => {
    setEditingPerfume(null)
    setPerfumeForm({
      brand_id: brands[0]?.id || '',
      name: '',
      gender: 'unisex',
      concentration: 'edp',
      price: 0,
      volume_ml: 100,
      family: '',
      is_dupe_of: '',
      image_url: '',
      description_ar: '',
      description_en: '',
      description_fr: '',
      in_stock: true,
    })
    setPerfumeNotesForm([])
    setPerfumeModalOpen(true)
  }

  const openEditPerfumeModal = async (perfume: Perfume) => {
    setEditingPerfume(perfume)
    setPerfumeForm({
      brand_id: perfume.brand_id,
      name: perfume.name,
      gender: perfume.gender,
      concentration: perfume.concentration,
      price: perfume.price,
      volume_ml: perfume.volume_ml,
      family: perfume.family || '',
      is_dupe_of: perfume.is_dupe_of || '',
      image_url: perfume.image_url || '',
      description_ar: perfume.description_ar || '',
      description_en: perfume.description_en || '',
      description_fr: perfume.description_fr || '',
      in_stock: perfume.in_stock,
    })

    // Fetch note layer mappings linked to this perfume
    try {
      const { data: mappings } = await supabase
        .from('perfume_notes')
        .select('note_id, layer')
        .eq('perfume_id', perfume.id)
      setPerfumeNotesForm(mappings || [])
    } catch (e) {
      setPerfumeNotesForm([])
    }
    setPerfumeModalOpen(true)
  }

  const handleSavePerfume = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveLoading(true)

    try {
      const shopId = resolveShopId()
      if (!shopId) throw new Error('No active shop tenant')

      let perfumeId = editingPerfume?.id

      if (editingPerfume) {
        // Update Perfume Properties
        const { error: editErr } = await supabase
          .from('perfumes')
          .update(perfumeForm)
          .eq('id', perfumeId)
        if (editErr) throw editErr
      } else {
        // Insert new perfume
        const { data: newPerf, error: addErr } = await supabase
          .from('perfumes')
          .insert({ ...perfumeForm, shop_id: shopId })
          .select('id')
          .single()
        if (addErr) throw addErr
        perfumeId = newPerf.id
      }

      // Re-map perfume notes (DELETE and INSERT)
      const { error: delErr } = await supabase
        .from('perfume_notes')
        .delete()
        .eq('perfume_id', perfumeId)
      if (delErr) throw delErr

      if (perfumeNotesForm.length > 0) {
        const payload = perfumeNotesForm.map(mapping => ({
          perfume_id: perfumeId,
          note_id: mapping.note_id,
          layer: mapping.layer
        }))
        const { error: insErr } = await supabase
          .from('perfume_notes')
          .insert(payload)
        if (insErr) throw insErr
      }

      setPerfumeModalOpen(false)
      fetchGlobalData()
      fetchStatsData()
    } catch (err: any) {
      alert(`Save error: ${err.message}`)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleDeletePerfume = async (perfume: Perfume) => {
    if (!window.confirm(`Are you sure you want to delete ${perfume.name}?`)) return
    try {
      const { error } = await supabase.from('perfumes').delete().eq('id', perfume.id)
      if (error) throw error
      fetchGlobalData()
      fetchStatsData()
    } catch (e: any) {
      alert(`Delete failed: ${e.message}`)
    }
  }

  // Toggle Scent Note in Perfumes Add/Edit form
  const togglePerfumeNoteSelection = (noteId: string) => {
    const idx = perfumeNotesForm.findIndex(m => m.note_id === noteId)
    if (idx >= 0) {
      // Remove
      setPerfumeNotesForm(prev => prev.filter(m => m.note_id !== noteId))
    } else {
      // Add with default layer from note record or middle
      const originalNote = notes.find(n => n.id === noteId)
      setPerfumeNotesForm(prev => [...prev, {
        note_id: noteId,
        layer: originalNote?.layer || 'middle'
      }])
    }
  }

  const changePerfumeNoteLayer = (noteId: string, layer: 'top' | 'middle' | 'base') => {
    setPerfumeNotesForm(prev => prev.map(m => m.note_id === noteId ? { ...m, layer } : m))
  }

  // --- Notes CRUD Action Handlers ---
  const openAddNoteModal = () => {
    setEditingNote(null)
    setNoteForm({
      category_id: categories[0]?.id || '',
      name_ar: '',
      name_en: '',
      name_fr: '',
      layer: 'middle',
      description_ar: ''
    })
    setNoteError(null)
    setNoteModalOpen(true)
  }

  const openEditNoteModal = (note: Note) => {
    setEditingNote(note)
    setNoteForm({
      category_id: note.category_id,
      name_ar: note.name_ar,
      name_en: note.name_en,
      name_fr: note.name_fr,
      layer: note.layer,
      description_ar: note.description_ar || ''
    })
    setNoteError(null)
    setNoteModalOpen(true)
  }

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveLoading(true)
    setNoteError(null)

    try {
      const shopId = resolveShopId()

      if (editingNote) {
        const { error } = await supabase
          .from('notes')
          .update(noteForm)
          .eq('id', editingNote.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('notes')
          .insert({ ...noteForm, shop_id: shopId })
        if (error) throw error
      }
      setNoteModalOpen(false)
      fetchGlobalData()
    } catch (err: any) {
      setNoteError(err.message || 'Failed to save note.')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleDeleteNote = async (note: Note) => {
    if (!window.confirm(t('note_delete_confirm'))) return

    try {
      // 1. Dependency check: is this note linked to any perfumes?
      const { data: countData, error: cntErr } = await supabase
        .from('perfume_notes')
        .select('perfume_id')
        .eq('note_id', note.id)
        .limit(1)

      if (cntErr) throw cntErr

      if (countData && countData.length > 0) {
        alert(t('note_delete_dependency_error'))
        return
      }

      // 2. Perform delete
      const { error } = await supabase.from('notes').delete().eq('id', note.id)
      if (error) throw error
      fetchGlobalData()
    } catch (e: any) {
      alert(`Delete failed: ${e.message}`)
    }
  }

  // --- Session 12: General Settings Helpers & Handlers ---
  const showSettingsFeedback = (type: 'success' | 'error', text: string) => {
    setSettingsToast({ type, text })
    setTimeout(() => {
      setSettingsToast(null)
    }, 4000)
  }

  // Normalize Algerian phone numbers (0550..., 06..., 07..., +213 0550..., 00213 06..., 21307...) to clean international digits (213...)
  const normalizeAlgerianWhatsapp = (raw: string): string => {
    let digits = (raw || '').replace(/[^0-9]/g, '')
    if (!digits) return ''
    if (digits.startsWith('00213')) {
      digits = '213' + digits.slice(5)
    }
    if (digits.startsWith('2130') && digits.length === 13 && /^2130[567]/.test(digits)) {
      digits = '213' + digits.slice(4)
    } else if (digits.startsWith('0') && digits.length === 10 && /^0[567]/.test(digits)) {
      digits = '213' + digits.slice(1)
    } else if (digits.length === 9 && /^[567]/.test(digits)) {
      digits = '213' + digits
    }
    return digits
  }

  // Validate and normalize optional external URLs (auto-prepend https://, verify hostname has dot, reject @handles & javascript:)
  const sanitizeHttpUrl = (raw: string): { valid: boolean; url: string } => {
    const trimmed = (raw || '').trim()
    if (!trimmed) return { valid: true, url: '' }
    if (
      /^(javascript|data|vbscript):/i.test(trimmed) ||
      trimmed.startsWith('@') ||
      /\s/.test(trimmed)
    ) {
      return { valid: false, url: trimmed }
    }
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    try {
      const parsed = new URL(withProtocol)
      if (
        (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') ||
        !parsed.hostname ||
        !parsed.hostname.includes('.') ||
        Boolean(parsed.username)
      ) {
        return { valid: false, url: trimmed }
      }
      return { valid: true, url: withProtocol }
    } catch {
      return { valid: false, url: trimmed }
    }
  }

  // Tab 1: Upload Shop Logo to `shop-logos/${shopId}/` with cache-busting & finally input reset
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.target
    const file = inputEl.files?.[0]
    if (!file) return

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      inputEl.value = ''
      showSettingsFeedback('error', 'يرجى اختيار صورة بصيغة PNG أو JPG أو WEBP فقط.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      inputEl.value = ''
      showSettingsFeedback('error', 'حجم الشعار يتجاوز الحد المسموح (2 ميغابايت كحد أقصى).')
      return
    }

    setUploadingLogo(true)
    try {
      const shopId = resolveShopId()
      const timestamp = Date.now()
      const ext = file.name.split('.').pop()?.toLowerCase() || 'webp'
      const filePath = `${shopId}/logo-${timestamp}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('shop-logos')
        .upload(filePath, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      const { data: pubData } = supabase.storage
        .from('shop-logos')
        .getPublicUrl(filePath)

      const publicLogoUrl = `${pubData.publicUrl}${
        pubData.publicUrl.includes('?') ? '&' : '?'
      }v=${timestamp}`

      const { error: rpcError } = await supabase.rpc('update_shop_settings', {
        p_shop_id: shopId,
        p_payload: {
          logo_url: publicLogoUrl
        }
      })

      if (rpcError) throw rpcError

      setSettingsForm(prev => ({ ...prev, logo_url: publicLogoUrl }))
      await refreshShopSettings()
      showSettingsFeedback('success', 'تم رفع وحفظ شعار المتجر بنجاح.')
    } catch (err: any) {
      console.error('Logo upload failed:', err)
      showSettingsFeedback('error', err.message || 'تعذر رفع الشعار، يرجى المحاولة مجدداً.')
    } finally {
      inputEl.value = ''
      setUploadingLogo(false)
    }
  }

  // Tab 1: Restore Default Built-in Logo (`logo_url: null`)
  const handleRestoreDefaultLogo = async () => {
    setUploadingLogo(true)
    try {
      const shopId = resolveShopId()
      const { error } = await supabase.rpc('update_shop_settings', {
        p_shop_id: shopId,
        p_payload: {
          logo_url: null
        }
      })
      if (error) throw error

      setSettingsForm(prev => ({ ...prev, logo_url: null }))
      await refreshShopSettings()
      showSettingsFeedback('success', 'تمت استعادة الشعار الافتراضي للمتجر.')
    } catch (err: any) {
      console.error('Restore default logo failed:', err)
      showSettingsFeedback('error', err.message || 'تعذر استعادة الشعار الافتراضي.')
    } finally {
      setUploadingLogo(false)
    }
  }

  // Tab 1: Save Brand Identity (Shop Name, Slogan, preserving current logo_url)
  const handleSaveIdentitySettings = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanName = settingsForm.shop_name.trim()
    if (!cleanName) {
      showSettingsFeedback('error', 'يرجى إدخال اسم المتجر.')
      return
    }
    const cleanSlogan = settingsForm.slogan.trim().slice(0, 80)

    setSaveLoading(true)
    try {
      const shopId = resolveShopId()
      const { error } = await supabase.rpc('update_shop_settings', {
        p_shop_id: shopId,
        p_payload: {
          shop_name: cleanName,
          slogan: cleanSlogan,
          logo_url: settingsForm.logo_url
        }
      })
      if (error) throw error

      setSettingsForm(prev => ({
        ...prev,
        shop_name: cleanName,
        slogan: cleanSlogan
      }))
      await refreshShopSettings()
      showSettingsFeedback('success', 'تم حفظ إعدادات الهوية والشعار بنجاح.')
    } catch (err: any) {
      console.error('Save identity settings failed:', err)
      showSettingsFeedback('error', err.message || 'تعذر حفظ إعدادات الهوية.')
    } finally {
      setSaveLoading(false)
    }
  }

  // Tab 2: Save Contact, Location & Social Links
  const handleSaveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault()

    const normalizedWhatsapp = normalizeAlgerianWhatsapp(settingsForm.whatsapp_number)
    const locCheck = sanitizeHttpUrl(settingsForm.location_url)
    const igCheck = sanitizeHttpUrl(settingsForm.instagram_url)
    const fbCheck = sanitizeHttpUrl(settingsForm.facebook_url)
    const ttCheck = sanitizeHttpUrl(settingsForm.tiktok_url)

    if (!locCheck.valid) {
      showSettingsFeedback('error', 'رابط موقع المتجر غير صالح. يرجى إدخال رابط خرائط جوجل صحيح (مثال: https://maps.google.com/...).')
      return
    }
    if (!igCheck.valid) {
      showSettingsFeedback('error', 'رابط حساب إنستغرام غير صالح. يرجى إدخال رابط كامل وليس اسم المستخدم فقط.')
      return
    }
    if (!fbCheck.valid) {
      showSettingsFeedback('error', 'رابط حساب فيسبوك غير صالح. يرجى إدخال رابط كامل وليس اسم الصفحة فقط.')
      return
    }
    if (!ttCheck.valid) {
      showSettingsFeedback('error', 'رابط حساب تيك توك غير صالح. يرجى إدخال رابط كامل وليس اسم المستخدم فقط.')
      return
    }

    setSaveLoading(true)
    try {
      const shopId = resolveShopId()
      const { error } = await supabase.rpc('update_shop_settings', {
        p_shop_id: shopId,
        p_payload: {
          whatsapp_number: normalizedWhatsapp,
          location_url: locCheck.url,
          instagram_handle: settingsForm.instagram_handle.trim(),
          instagram_url: igCheck.url,
          facebook_handle: settingsForm.facebook_handle.trim(),
          facebook_url: fbCheck.url,
          tiktok_handle: settingsForm.tiktok_handle.trim(),
          tiktok_url: ttCheck.url
        }
      })
      if (error) throw error

      setSettingsForm(prev => ({
        ...prev,
        whatsapp_number: normalizedWhatsapp,
        location_url: locCheck.url,
        instagram_handle: prev.instagram_handle.trim(),
        instagram_url: igCheck.url,
        facebook_handle: prev.facebook_handle.trim(),
        facebook_url: fbCheck.url,
        tiktok_handle: prev.tiktok_handle.trim(),
        tiktok_url: ttCheck.url
      }))
      await refreshShopSettings()
      showSettingsFeedback('success', 'تم حفظ بيانات التواصل والموقع بنجاح.')
    } catch (err: any) {
      console.error('Save contact settings failed:', err)
      showSettingsFeedback('error', err.message || 'تعذر حفظ بيانات التواصل والموقع.')
    } finally {
      setSaveLoading(false)
    }
  }

  // Password Strength Evaluator (Tab 3)
  const getPasswordStrength = (pwd: string): { score: number; label: string; colorClass: string } => {
    if (!pwd) return { score: 0, label: '', colorClass: 'bg-neutral-700' }
    let score = 0
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1

    if (pwd.length < 8) {
      return { score: 1, label: 'ضعيفة (8 أحرف على الأقل)', colorClass: 'bg-red-500' }
    }
    if (score <= 2) {
      return { score: 2, label: 'متوسطة', colorClass: 'bg-[#F59E0B]' }
    }
    return { score: 3, label: 'قوية وآمنة', colorClass: 'bg-emerald-500' }
  }

  // Tab 3: Change Password with Current Password Re-Verification & Arabic Error Localization
  const localizeSupabasePasswordError = (rawMessage: string): string => {
    const msg = (rawMessage || '').toLowerCase()
    if (msg.includes('invalid login credentials') || msg.includes('كلمة المرور الحالية غير صحيحة')) {
      return 'كلمة المرور الحالية غير صحيحة.'
    }
    if (
      msg.includes('different from the old password') ||
      msg.includes('same_password') ||
      msg.includes('same password')
    ) {
      return 'كلمة المرور الجديدة يجب أن تختلف عن كلمة المرور الحالية.'
    }
    if (msg.includes('at least') || msg.includes('weak_password')) {
      return 'يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل.'
    }
    if (msg.includes('rate limit') || msg.includes('too many requests')) {
      return 'تم تجاوز عدد المحاولات المسموح بها. يرجى الانتظار قليلاً ثم المحاولة مجدداً.'
    }
    return rawMessage || 'تعذر تحديث كلمة المرور.'
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordToast(null)

    if (!currentPassword) {
      setPasswordToast({ type: 'error', text: 'يرجى إدخال كلمة المرور الحالية للتحقق من الهوية.' })
      return
    }
    if (newPassword.length < 8) {
      setPasswordToast({ type: 'error', text: 'يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordToast({ type: 'error', text: 'كلمتا المرور غير متطابقتين.' })
      return
    }
    if (newPassword === currentPassword) {
      setPasswordToast({
        type: 'error',
        text: 'كلمة المرور الجديدة يجب أن تختلف عن كلمة المرور الحالية.'
      })
      return
    }

    setPassLoading(true)
    try {
      // 1. Retrieve active admin email and re-verify Current Password via signInWithPassword
      let emailToVerify = adminEmail
      if (!emailToVerify) {
        const { data: { session } } = await supabase.auth.getSession()
        emailToVerify = session?.user?.email || ''
      }

      if (!emailToVerify) {
        throw new Error('تعذر التحقق من جلسة المسؤول الحالية. يرجى إعادة تسجيل الدخول.')
      }

      const { error: verifyErr } = await supabase.auth.signInWithPassword({
        email: emailToVerify,
        password: currentPassword
      })

      if (verifyErr) {
        throw new Error('كلمة المرور الحالية غير صحيحة.')
      }

      // 2. Update to New Password
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (updateErr) throw updateErr

      // 3. Clear password inputs cleanly on success
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordToast({ type: 'success', text: 'تم تحديث كلمة المرور بنجاح.' })
    } catch (err: any) {
      setPasswordToast({
        type: 'error',
        text: localizeSupabasePasswordError(err?.message || '')
      })
    } finally {
      setPassLoading(false)
    }
  }

  // Relative timestamp formatter for pending WhatsApp order intents
  const formatRelativeTime = (isoDate: string): string => {
    const diffMs = Date.now() - new Date(isoDate).getTime()
    const diffMin = Math.max(1, Math.floor(diffMs / 60000))
    if (diffMin < 60) {
      return `منذ ${diffMin} دقيقة`
    }
    const diffHours = Math.floor(diffMin / 60)
    if (diffHours < 24) {
      return `منذ ${diffHours} ساعة`
    }
    const diffDays = Math.floor(diffHours / 24)
    return `منذ ${diffDays} يوم`
  }

  // Text helpers matching languages
  const getLocalizedName = (obj: any) => {
    if (currentLanguage === 'ar') return obj.name_ar || obj.name_en || obj.name
    if (currentLanguage === 'fr') return obj.name_fr || obj.name_en || obj.name
    return obj.name_en || obj.name
  }

  // Filters search queries
  const filteredPerfumes = perfumes.filter(p => {
    const q = perfumeSearch.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.brands.name.toLowerCase().includes(q)
  })

  const filteredNotes = notes.filter(n => {
    const q = noteSearch.toLowerCase()
    return n.name_en.toLowerCase().includes(q) || n.name_ar.toLowerCase().includes(q) || n.name_fr.toLowerCase().includes(q)
  })

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-gold-500 animate-spin" />
        <p className="text-neutral-400 text-sm italic font-light">Loading Admin Space...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-950 via-neutral-950 to-black text-white flex flex-col justify-between selection:bg-gold-500 selection:text-black font-sans text-start">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-neutral-950/80 backdrop-blur-lg border-b border-white/5 py-4 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Brand Title (Reflects Shop Name & Logo dynamically) */}
          <ShopBrandHeader badgeSuffix="Admin" onClick={() => navigate('/')} />

          {/* Navigation Tab Links (Large screens) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-neutral-900/60 p-1 border border-white/5 rounded-xl">
            {(['stats', 'perfumes', 'notes', 'settings', 'alternatives'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-gold-500 text-neutral-950 shadow-md font-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab === 'alternatives' ? 'Reminds Me Of' : t(`tab_${tab}`)}
              </button>
            ))}
          </nav>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 hover:bg-red-500/10 text-xs text-red-400 hover:text-red-300 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('sign_out_button')}</span>
          </button>

        </div>
      </header>

      {/* Sub Navigation (Mobile screen) */}
      <div className="md:hidden w-full px-4 pt-4">
        <div className="grid grid-cols-5 bg-neutral-900/60 p-1 border border-white/5 rounded-xl text-center font-bold">
          {(['stats', 'perfumes', 'notes', 'settings', 'alternatives'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 rounded-lg text-[9px] font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-gold-500 text-neutral-950 font-black'
                  : 'text-neutral-400'
              }`}
            >
              {tab === 'alternatives' ? 'Alts' : t(`tab_${tab}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dashboard Panel Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 my-4">
        {dataLoading ? (
          <div className="w-full py-32 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 text-gold-500 animate-spin" />
            <p className="text-neutral-400 text-xs italic">Syncing catalog data...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: Stats Panel */}
            {activeTab === 'stats' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                
                {/* Intro message */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-gold-500/10 to-transparent border-l-2 border-gold-500 p-4.5 rounded-r-2xl">
                  <TrendingUp className="h-5 w-5 text-gold-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Olfactive Store Analytics</h3>
                    <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                      Understanding custom scent note combinations, failed matches, and out-of-stock demands to expand your perfume catalog.
                    </p>
                  </div>
                </div>

                {/* Session 12: Owner WhatsApp Sale-Recording Reminder (Hidden when zero pending intents) */}
                {pendingIntents && pendingIntents.length > 0 && (
                  <div
                    dir="rtl"
                    className="oud-card-surface rounded-3xl p-6 flex flex-col gap-4 border border-[#D4AF37]/35 shadow-2xl"
                  >
                    <div className="flex items-start sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3.5">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-[#2D1B14] border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                          <Bell className="h-5 w-5 text-[#F9E29C]" />
                        </div>
                        <div>
                          <h4 className="font-arabic-display text-base sm:text-lg font-bold text-[#F9E29C]">
                            طلبات واتساب بانتظار التأكيد — إذا اكتملت المعاملة، لا تنسَ تسجيل البيع ليظل نظام الإحصائيات دقيقاً
                          </h4>
                          <p className="text-xs text-[#A8988A] mt-0.5">
                            {`لديك ${pendingIntents.length} استفسار عبر واتساب بانتظار المراجعة`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {pendingIntents?.map((intent) => {
                        const isBusy = resolvingIntentId === intent.id
                        return (
                          <div
                            key={intent.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#120A07] border border-[#D4AF37]/20 px-4 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF37] shrink-0" />
                              <div>
                                <p className="text-sm font-bold text-[#F5EFE6]">
                                  {intent.perfume_name}
                                </p>
                                <p className="text-[11px] text-[#A8988A] mt-0.5">
                                  {formatRelativeTime(intent.created_at)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleResolveWhatsappIntent(intent.id, 'confirmed')}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl gold-metallic-bg font-extrabold text-xs cursor-pointer transition-transform duration-150 active:scale-95 disabled:opacity-50"
                              >
                                {isBusy ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#120A07]" />
                                ) : (
                                  <Check className="h-3.5 w-3.5 text-[#120A07] stroke-[3]" />
                                )}
                                <span>تأكيد البيع (+1)</span>
                              </button>

                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleResolveWhatsappIntent(intent.id, 'dismissed')}
                                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#1E120D] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-xs font-semibold text-[#A8988A] hover:text-[#F5EFE6] cursor-pointer transition-colors disabled:opacity-50"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span>تجاهل</span>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Top 5 Best Sellers Interactive Bar Chart Section */}
                <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <h4 className="text-xs uppercase tracking-widest font-bold text-gold-400 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Top 5 Best Sellers
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-light mt-1">
                        Verified in-store & WhatsApp sales tallies (Y-axis: Perfume Name • X-axis: Sales Count)
                      </p>
                    </div>

                    {/* Timeframe Toggle */}
                    <div className="inline-flex items-center bg-neutral-950/80 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                      {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                        <button
                          key={period}
                          type="button"
                          onClick={() => setTimeframe(period)}
                          className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                            timeframe === period
                              ? 'bg-gold-500 text-neutral-950 shadow-md font-black'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  {topSoldLoading ? (
                    <div className="py-12 flex items-center justify-center gap-2 text-xs text-neutral-400">
                      <Loader2 className="h-4 w-4 animate-spin text-gold-500" />
                      <span>Loading sales tallies...</span>
                    </div>
                  ) : topSoldPerfumes.length > 0 ? (
                    <div dir="ltr" className="w-full bg-white rounded-2xl p-4 shadow-inner">
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                          data={topSoldPerfumes}
                          layout="vertical"
                          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                        >
                          <XAxis type="number" hide />
                          <YAxis
                            dataKey="perfume_name"
                            type="category"
                            width={150}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#374151', fontSize: 12, fontWeight: 700 }}
                          />
                          <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                              backgroundColor: '#FFFFFF',
                              color: '#111827',
                              fontSize: '12px'
                            }}
                            formatter={(value: any, _name: any, item: any) => [
                              `${value} sold (${item?.payload?.brand_name || ''})`,
                              'Verified Sales'
                            ]}
                          />
                          <Bar
                            dataKey="sales_count"
                            fill="#F59E0B"
                            radius={[0, 4, 4, 0]}
                            activeBar={{ fill: '#D97706' }}
                            barSize={32}
                            minPointSize={30}
                          >
                            <LabelList
                              dataKey="sales_count"
                              position="insideRight"
                              fill="#FFFFFF"
                              fontSize={14}
                              fontWeight="bold"
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 italic py-8 text-center">
                      No verified sales recorded for the selected {timeframe} timeframe yet. Use "✅ Confirm Sale (+1)" on any perfume page to tally sales.
                    </p>
                  )}
                </div>

                {/* Dashboard Metrics grid (Royal Oud & Gold Aesthetic) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                  {/* Column 1: Top 10 Searched Scent Notes (أكثر 10 نوتات بحثاً) */}
                  <div className="bg-gradient-to-br from-[#3E2723] to-[#2d1b14] border border-yellow-600/30 rounded-3xl p-6 shadow-2xl shadow-black/50 flex flex-col gap-4">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-[#D4AF37] flex items-center gap-2 pb-3 border-b border-yellow-600/20">
                      <Layers className="h-4 w-4 text-[#FFD700]" />
                      {t('stat_top_notes')}
                    </h4>
                    {!topNotes || topNotes.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                        <Sparkles className="h-5 w-5 text-[#D4AF37]/70 mb-2 animate-pulse" />
                        <p className="text-xs font-semibold text-[#D4AF37] tracking-wide">
                          في انتظار أول عملية بحث...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {topNotes?.map((item, idx) => (
                          <div
                            key={item.note_id}
                            className="group rounded-2xl bg-[#1e110c]/70 border border-yellow-600/20 hover:border-[#D4AF37]/60 hover:shadow-[0_0_18px_rgba(212,175,55,0.22)] px-4 py-3 transition-all duration-300 space-y-2"
                          >
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-[#FAF3E0] group-hover:text-[#FFD700] transition-colors flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#D4AF37]/15 border border-yellow-600/30 text-[10px] text-[#FFD700] font-mono">
                                  {idx + 1}
                                </span>
                                {getLocalizedName(item)}
                              </span>
                              <span className="text-[10px] text-[#D4AF37] font-mono font-semibold">
                                {item.search_count} {t('searches_count', { count: item.search_count }).replace(/[0-9]/g, '')}
                              </span>
                            </div>
                            {/* Visual Progress bar */}
                            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-yellow-600/10">
                              <div 
                                className="h-full bg-gradient-to-r from-[#b9982f] via-[#D4AF37] to-[#FFD700] rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min((item.search_count / (topNotes?.[0]?.search_count || 1)) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Column 2: Most Matched Perfumes + Bottom-Left Antique Parfum World Ambient Sanctuary */}
                  <div className="flex flex-col gap-6">

                    {/* Metric Block: Most Matched Perfumes (أكثر العطور تطابقاً مع البحث) */}
                    <div className="bg-gradient-to-br from-[#3E2723] to-[#2d1b14] border border-yellow-600/30 rounded-3xl p-6 shadow-2xl shadow-black/50 flex flex-col gap-4">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-[#D4AF37] flex items-center gap-2 pb-3 border-b border-yellow-600/20">
                        <TrendingUp className="h-4 w-4 text-[#FFD700]" />
                        {t('stat_most_matched_perfumes')}
                      </h4>
                      {!matchedPerfumes || matchedPerfumes.length === 0 ? (
                        <div className="py-10 flex flex-col items-center justify-center text-center">
                          <Sparkles className="h-5 w-5 text-[#D4AF37]/70 mb-2 animate-pulse" />
                          <p className="text-xs font-semibold text-[#D4AF37] tracking-wide">
                            في انتظار أول عملية بحث...
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {matchedPerfumes?.map((item, idx) => (
                            <div
                              key={item.perfume_id}
                              className="group flex items-center justify-between rounded-2xl bg-[#1e110c]/70 border border-yellow-600/20 hover:border-[#D4AF37]/60 hover:shadow-[0_0_18px_rgba(212,175,55,0.22)] px-4 py-3 transition-all duration-300"
                            >
                              <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-wider font-bold text-[#D4AF37]">
                                  #{idx + 1} • {item.brand_name}
                                </span>
                                <span className="text-xs font-bold text-[#FAF3E0] group-hover:text-[#FFD700] transition-colors mt-0.5">
                                  {item.perfume_name}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-yellow-600/40 text-[10px] font-bold text-[#FFD700] shadow-sm">
                                  {item.match_count} {t('matches_count_label')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom-Left Space: Slow-Moving Animated Antique "Parfum World" Sanctuary */}
                    <div className="relative overflow-hidden isolate z-0 flex-1 min-h-[210px] rounded-3xl border border-yellow-600/30 bg-[#2d1b14] shadow-2xl shadow-black/60 flex flex-col items-center justify-center p-6 text-center select-none">
                      {/* Slow 18s CSS breathing radial gold aura */}
                      <div className="absolute inset-0 royal-oud-ambient-canvas pointer-events-none" />

                      {/* CSS-only floating golden dust particles */}
                      <span
                        className="royal-gold-dust-slow absolute top-6 left-10 h-2 w-2 rounded-full bg-[#FFD700]/60 blur-[1px] pointer-events-none"
                      />
                      <span
                        className="royal-gold-dust-slower absolute bottom-8 left-1/4 h-1.5 w-1.5 rounded-full bg-[#D4AF37]/70 blur-[0.5px] pointer-events-none"
                      />
                      <span
                        className="royal-gold-dust-slow absolute top-10 right-14 h-2.5 w-2.5 rounded-full bg-[#F59E0B]/40 blur-[1px] pointer-events-none"
                      />
                      <span
                        className="royal-gold-dust-slower absolute bottom-6 right-12 h-1.5 w-1.5 rounded-full bg-[#FFD700]/65 pointer-events-none"
                      />

                      {/* Antique Parfum World Crest & Motto */}
                      <div className="relative z-10 flex flex-col items-center gap-2.5 max-w-xs">
                        <div className="h-11 w-11 rounded-full bg-[#1e110c]/80 border border-yellow-600/40 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.28)]">
                          <Sparkles className="h-5 w-5 text-[#FFD700]" />
                        </div>
                        <span className="font-serif text-sm tracking-[0.22em] uppercase font-bold text-[#FFD700]">
                          Maison Royal Oud
                        </span>
                        <p className="text-[11px] text-[#e6d5b8]/80 font-light leading-relaxed">
                          حيث تلتقي نفحات العود الملكي بالذهب الخالص في تناغم عطري خالد
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* TAB 2: Perfumes CRUD Panel */}
            {activeTab === 'perfumes' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Search and Quick Add Header bar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-900/40 border border-white/5 p-4 rounded-2xl">
                  {/* Search Bar */}
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute start-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder={t('search_perfumes_placeholder')}
                      value={perfumeSearch}
                      onChange={(e) => setPerfumeSearch(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 ps-9 pe-4 text-xs text-white focus:outline-none focus:border-gold-500/50"
                    />
                  </div>

                  {/* Add Scent Button */}
                  <button
                    onClick={openAddPerfumeModal}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-xs shadow-lg shadow-gold-500/5 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('add_perfume')}</span>
                  </button>
                </div>

                {/* Perfumes Table List */}
                <div className="bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-xs border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-wider text-neutral-400 font-semibold text-start">
                          <th className="p-4 text-start font-bold">Image</th>
                          <th className="p-4 text-start font-bold">Perfume</th>
                          <th className="p-4 text-start font-bold">Brand</th>
                          <th className="p-4 text-start font-bold">Concentration</th>
                          <th className="p-4 text-start font-bold">Volume</th>
                          <th className="p-4 text-start font-bold">Price ($)</th>
                          <th className="p-4 text-start font-bold">Stock</th>
                          <th className="p-4 text-center font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPerfumes.length > 0 ? (
                          filteredPerfumes.map((perfume) => (
                            <tr key={perfume.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                              
                              {/* 1. Image cover preview */}
                              <td className="p-4">
                                <div className="h-10 w-10 rounded-lg overflow-hidden bg-neutral-950 border border-white/5">
                                  {perfume.image_url ? (
                                    <img src={perfume.image_url} alt={perfume.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-[8px] text-neutral-600">No Image</div>
                                  )}
                                </div>
                              </td>

                              {/* 2. Scent Name */}
                              <td className="p-4 font-bold text-white">{perfume.name}</td>

                              {/* 3. Brand name */}
                              <td className="p-4 text-neutral-300">{perfume.brands.name}</td>

                              {/* 4. Scent concentration */}
                              <td className="p-4 uppercase text-neutral-400 font-mono">{perfume.concentration}</td>

                              {/* 5. Scent volume */}
                              <td className="p-4 text-neutral-400 font-mono">{perfume.volume_ml} ml</td>

                              {/* 6. Pricing (Inline Quick Edit!) */}
                              <td className="p-4">
                                <div className="relative w-20 flex items-center">
                                  <DollarSign className="absolute start-1.5 h-3.5 w-3.5 text-neutral-500" />
                                  <input
                                    type="number"
                                    defaultValue={perfume.price}
                                    onBlur={(e) => handlePriceBlur(perfume, e.target.value)}
                                    disabled={inlinePriceLoading[perfume.id]}
                                    className="w-full bg-neutral-950/80 border border-white/10 hover:border-gold-500/30 focus:border-gold-500/50 rounded-lg py-1 ps-5 pe-1.5 text-xs text-white font-mono focus:outline-none transition-colors"
                                  />
                                  {inlinePriceLoading[perfume.id] && (
                                    <Loader2 className="absolute end-1.5 h-3.5 w-3.5 animate-spin text-gold-500" />
                                  )}
                                </div>
                              </td>

                              {/* 7. Stock status toggle checkbox */}
                              <td className="p-4">
                                <label className="relative inline-flex items-center cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={perfume.in_stock}
                                    onChange={() => handleToggleStock(perfume)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-neutral-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-neutral-500 peer-checked:after:bg-gold-500 after:border-neutral-700 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-burgundy-950 border border-white/10 peer-checked:border-gold-500/40"></div>
                                  <span className="ms-2 text-[10px] font-semibold text-neutral-400">
                                    {perfume.in_stock ? t('in_stock') : t('out_of_stock')}
                                  </span>
                                </label>
                              </td>

                              {/* 8. CRUD Actions */}
                              <td className="p-4 text-center">
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    onClick={() => openEditPerfumeModal(perfume)}
                                    className="p-1.5 rounded-lg border border-white/5 hover:border-gold-500/30 hover:bg-gold-500/10 text-neutral-400 hover:text-gold-400 transition-all cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePerfume(perfume)}
                                    className="p-1.5 rounded-lg border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-all cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-neutral-500 italic">
                              {t('no_search_results')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: Notes CRUD Panel */}
            {activeTab === 'notes' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Note Search & Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-900/40 border border-white/5 p-4 rounded-2xl">
                  {/* Search Notes */}
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute start-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search scent notes by name..."
                      value={noteSearch}
                      onChange={(e) => setNoteSearch(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 ps-9 pe-4 text-xs text-white focus:outline-none focus:border-gold-500/50"
                    />
                  </div>

                  {/* Add Scent Note Button */}
                  <button
                    onClick={openAddNoteModal}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-xs shadow-lg shadow-gold-500/5 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('add_note')}</span>
                  </button>
                </div>

                {/* Notes Table */}
                <div className="bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-xs border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-wider text-neutral-400 font-semibold text-start">
                          <th className="p-4 text-start font-bold">English Name</th>
                          <th className="p-4 text-start font-bold">Arabic Name</th>
                          <th className="p-4 text-start font-bold">French Name</th>
                          <th className="p-4 text-start font-bold">Category</th>
                          <th className="p-4 text-start font-bold">Default Layer</th>
                          <th className="p-4 text-center font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNotes.length > 0 ? (
                          filteredNotes.map((note) => {
                            const cat = categories.find(c => c.id === note.category_id)
                            return (
                              <tr key={note.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                                <td className="p-4 font-semibold text-white">{note.name_en}</td>
                                <td className="p-4 text-neutral-300 font-serif">{note.name_ar}</td>
                                <td className="p-4 text-neutral-300">{note.name_fr}</td>
                                <td className="p-4 text-neutral-400">
                                  {cat ? getLocalizedName(cat) : 'Uncategorized'}
                                </td>
                                <td className="p-4">
                                  <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                    note.layer === 'top' 
                                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                      : note.layer === 'middle'
                                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                  }`}>
                                    {t(`layer_${note.layer}`)}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  <div className="inline-flex items-center gap-2">
                                    <button
                                      onClick={() => openEditNoteModal(note)}
                                      className="p-1.5 rounded-lg border border-white/5 hover:border-gold-500/30 hover:bg-gold-500/10 text-neutral-400 hover:text-gold-400 transition-all cursor-pointer"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteNote(note)}
                                      className="p-1.5 rounded-lg border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-all cursor-pointer"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-neutral-500 italic">
                              {t('no_search_results')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: Store Settings Panel (Session 12: 3-Tab Royal Oud General Settings) */}
            {activeTab === 'settings' && (
              <div
                dir="rtl"
                className="max-w-3xl mx-auto oud-card-surface rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-start"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-[#2D1B14] border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                      <Settings className="h-5 w-5 text-[#F9E29C]" />
                    </div>
                    <div>
                      <h3 className="font-arabic-display text-xl font-bold gold-metallic-text">
                        الإعدادات العامة
                      </h3>
                      <p className="text-xs text-[#A8988A] mt-0.5">
                        إدارة هوية المتجر، قنوات التواصل، وإعدادات الأمان الخاصة بالمالك
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 Royal Oud Sub-Tabs Navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#120A07] p-1.5 rounded-2xl border border-[#D4AF37]/20">
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsSubTab('identity')
                      setSettingsToast(null)
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      settingsSubTab === 'identity'
                        ? 'bg-[#2D1B14] border border-[#D4AF37] text-[#F9E29C]'
                        : 'text-[#A8988A] hover:text-[#F5EFE6]'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>الهوية والشعار</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSettingsSubTab('contact')
                      setSettingsToast(null)
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      settingsSubTab === 'contact'
                        ? 'bg-[#2D1B14] border border-[#D4AF37] text-[#F9E29C]'
                        : 'text-[#A8988A] hover:text-[#F5EFE6]'
                    }`}
                  >
                    <Globe className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>التواصل والموقع</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSettingsSubTab('security')
                      setPasswordToast(null)
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      settingsSubTab === 'security'
                        ? 'bg-[#2D1B14] border border-[#D4AF37] text-[#F9E29C]'
                        : 'text-[#A8988A] hover:text-[#F5EFE6]'
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>الأمان وكلمة المرور</span>
                  </button>
                </div>

                {/* Feedback Banner for Tab 1 & Tab 2 */}
                {settingsToast && settingsSubTab !== 'security' && (
                  <div
                    role="status"
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-bold ${
                      settingsToast.type === 'success'
                        ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                        : 'bg-red-500/15 border-red-500/35 text-red-300'
                    }`}
                  >
                    {settingsToast.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                    )}
                    <span>{settingsToast.text}</span>
                  </div>
                )}

                {/* TAB 1: الهوية والشعار (Brand Identity & Logo) */}
                {settingsSubTab === 'identity' && (
                  <form onSubmit={handleSaveIdentitySettings} className="space-y-6">
                    {/* Live Header Mini-Preview (Clean horizontal layout, zero overlapping shapes) */}
                    <div className="bg-[#120A07] border border-[#D4AF37]/25 rounded-2xl p-4 space-y-2.5">
                      <span className="text-[11px] font-bold text-[#D4AF37] block">
                        معاينة حية لرأس المتجر
                      </span>
                      <div className="flex items-center justify-between bg-[#1E120D] border border-[#D4AF37]/20 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3">
                          {settingsForm.logo_url ? (
                            <img
                              src={settingsForm.logo_url}
                              alt={settingsForm.shop_name || 'Shop Logo'}
                              className="h-11 w-11 rounded-full object-cover border border-[#D4AF37]/50 shrink-0 bg-[#120A07]"
                            />
                          ) : (
                            <div className="h-11 w-11 rounded-full bg-[#2D1B14] border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                              <Sparkles className="h-5 w-5 text-[#F9E29C]" />
                            </div>
                          )}
                          <div className="text-start">
                            <span className="font-arabic-display text-xl font-bold gold-metallic-text block leading-tight">
                              {settingsForm.shop_name.trim() || 'ParfumWorld'}
                            </span>
                            <span className="text-xs text-[#A8988A] block mt-0.5">
                              {settingsForm.slogan.trim() || 'اكتشف توقيعك العطري'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-[#A8988A] bg-[#120A07] border border-[#D4AF37]/15 px-2.5 py-1 rounded-full">
                          {settingsForm.logo_url ? 'شعار مخصص' : 'الشعار الافتراضي'}
                        </span>
                      </div>
                    </div>

                    {/* Shop Name Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#F5EFE6] flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>اسم المتجر</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={60}
                        value={settingsForm.shop_name}
                        onChange={(e) =>
                          setSettingsForm(prev => ({ ...prev, shop_name: e.target.value }))
                        }
                        placeholder="ParfumWorld"
                        className="w-full bg-[#120A07] border border-[#D4AF37]/25 rounded-xl py-2.5 px-4 text-sm text-[#F5EFE6] placeholder:text-[#A8988A]/50 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    {/* Personal Slogan Input (max 80 chars) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#F5EFE6] flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-[#D4AF37]" />
                          <span>العبارة الترحيبية (الشعار اللفظي)</span>
                        </label>
                        <span dir="ltr" className="text-[10px] font-mono text-[#A8988A]">
                          {settingsForm.slogan.length} / 80
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={80}
                        value={settingsForm.slogan}
                        onChange={(e) =>
                          setSettingsForm(prev => ({
                            ...prev,
                            slogan: e.target.value.slice(0, 80)
                          }))
                        }
                        placeholder="اكتشف توقيعك العطري"
                        className="w-full bg-[#120A07] border border-[#D4AF37]/25 rounded-xl py-2.5 px-4 text-sm text-[#F5EFE6] placeholder:text-[#A8988A]/50 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    {/* Shop Logo Uploader & Restore Default Logo */}
                    <div className="space-y-2.5 bg-[#120A07] border border-[#D4AF37]/20 rounded-2xl p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-[#F5EFE6] block">
                            شعار المتجر (PNG / JPG / WEBP — بحد أقصى 2MB)
                          </span>
                          <span className="text-[11px] text-[#A8988A] block mt-0.5">
                            يتم الحفاظ على شعارك الحالي تلقائياً عند تعديل الاسم أو العبارة الترحيبية
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2D1B14] border border-[#D4AF37] text-[#F9E29C] text-xs font-bold cursor-pointer hover:bg-[#3E2723] transition-colors">
                            {uploadingLogo ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#F9E29C]" />
                            ) : (
                              <Upload className="h-3.5 w-3.5 text-[#D4AF37]" />
                            )}
                            <span>رفع شعار جديد</span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={handleLogoUpload}
                              disabled={uploadingLogo}
                              className="hidden"
                            />
                          </label>

                          {settingsForm.logo_url && (
                            <button
                              type="button"
                              disabled={uploadingLogo}
                              onClick={handleRestoreDefaultLogo}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E120D] border border-[#D4AF37]/25 hover:border-[#D4AF37] text-xs font-semibold text-[#A8988A] hover:text-[#F9E29C] transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>استعادة الشعار الافتراضي</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Save Identity Button */}
                    <button
                      type="submit"
                      disabled={saveLoading || uploadingLogo}
                      className="w-full py-3.5 rounded-2xl gold-metallic-bg font-extrabold text-xs sm:text-sm shadow-xl transition-transform duration-150 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {saveLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#120A07]" />
                      ) : (
                        <Save className="h-4 w-4 text-[#120A07]" />
                      )}
                      <span>حفظ الهوية والشعار</span>
                    </button>
                  </form>
                )}

                {/* TAB 2: التواصل والموقع (Contact, Location & Socials) */}
                {settingsSubTab === 'contact' && (
                  <form onSubmit={handleSaveContactSettings} className="space-y-6">
                    {/* WhatsApp Number & Live wa.me Preview */}
                    <div className="space-y-2 bg-[#120A07] border border-[#D4AF37]/20 rounded-2xl p-4">
                      <label className="text-xs font-bold text-[#F5EFE6] flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>رقم واتساب لاستقبال الطلبات</span>
                      </label>
                      <input
                        dir="ltr"
                        type="text"
                        placeholder="0550123456 أو +213550123456"
                        value={settingsForm.whatsapp_number}
                        onChange={(e) =>
                          setSettingsForm(prev => ({
                            ...prev,
                            whatsapp_number: e.target.value
                          }))
                        }
                        className="w-full bg-[#1E120D] border border-[#D4AF37]/25 rounded-xl py-2.5 px-4 text-sm text-[#F5EFE6] font-mono placeholder:text-[#A8988A]/50 focus:outline-none focus:border-[#D4AF37] text-left"
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[#A8988A]">
                        <span>يقبل الأرقام الجزائرية (05 / 06 / 07) ويحولها تلقائياً للصيغة الدولية</span>
                        {normalizeAlgerianWhatsapp(settingsForm.whatsapp_number) && (
                          <span
                            dir="ltr"
                            className="font-mono text-[#F9E29C] bg-[#2D1B14] border border-[#D4AF37]/35 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3 text-[#D4AF37]" />
                            {`https://wa.me/${normalizeAlgerianWhatsapp(settingsForm.whatsapp_number)}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Google Maps Location Link */}
                    <div className="space-y-1.5 bg-[#120A07] border border-[#D4AF37]/20 rounded-2xl p-4">
                      <label className="text-xs font-bold text-[#F5EFE6] flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>رابط موقع المتجر (خرائط جوجل — اختياري)</span>
                      </label>
                      <input
                        dir="ltr"
                        type="text"
                        placeholder="https://maps.google.com/..."
                        value={settingsForm.location_url}
                        onChange={(e) =>
                          setSettingsForm(prev => ({ ...prev, location_url: e.target.value }))
                        }
                        className="w-full bg-[#1E120D] border border-[#D4AF37]/25 rounded-xl py-2.5 px-4 text-sm text-[#F5EFE6] font-mono placeholder:text-[#A8988A]/50 focus:outline-none focus:border-[#D4AF37] text-left"
                      />
                    </div>

                    {/* Social Media Platforms (Instagram, Facebook, TikTok) */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F9E29C]">
                          حسابات التواصل الاجتماعي (اختيارية — الحقول الفارغة لا تظهر للزبائن)
                        </span>
                      </div>

                      {/* Instagram */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#120A07] border border-[#D4AF37]/20 rounded-2xl p-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#A8988A] block">
                            اسم حساب إنستغرام (Instagram)
                          </label>
                          <input
                            type="text"
                            placeholder="@maison_oud"
                            value={settingsForm.instagram_handle}
                            onChange={(e) =>
                              setSettingsForm(prev => ({
                                ...prev,
                                instagram_handle: e.target.value
                              }))
                            }
                            className="w-full bg-[#1E120D] border border-[#D4AF37]/20 rounded-xl py-2 px-3 text-xs text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#A8988A] block">
                            رابط إنستغرام (URL)
                          </label>
                          <input
                            dir="ltr"
                            type="text"
                            placeholder="https://instagram.com/..."
                            value={settingsForm.instagram_url}
                            onChange={(e) =>
                              setSettingsForm(prev => ({
                                ...prev,
                                instagram_url: e.target.value
                              }))
                            }
                            className="w-full bg-[#1E120D] border border-[#D4AF37]/20 rounded-xl py-2 px-3 text-xs text-[#F5EFE6] font-mono focus:outline-none focus:border-[#D4AF37] text-left"
                          />
                        </div>
                      </div>

                      {/* Facebook */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#120A07] border border-[#D4AF37]/20 rounded-2xl p-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#A8988A] block">
                            اسم صفحة فيسبوك (Facebook)
                          </label>
                          <input
                            type="text"
                            placeholder="Maison Royal Oud"
                            value={settingsForm.facebook_handle}
                            onChange={(e) =>
                              setSettingsForm(prev => ({
                                ...prev,
                                facebook_handle: e.target.value
                              }))
                            }
                            className="w-full bg-[#1E120D] border border-[#D4AF37]/20 rounded-xl py-2 px-3 text-xs text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#A8988A] block">
                            رابط فيسبوك (URL)
                          </label>
                          <input
                            dir="ltr"
                            type="text"
                            placeholder="https://facebook.com/..."
                            value={settingsForm.facebook_url}
                            onChange={(e) =>
                              setSettingsForm(prev => ({
                                ...prev,
                                facebook_url: e.target.value
                              }))
                            }
                            className="w-full bg-[#1E120D] border border-[#D4AF37]/20 rounded-xl py-2 px-3 text-xs text-[#F5EFE6] font-mono focus:outline-none focus:border-[#D4AF37] text-left"
                          />
                        </div>
                      </div>

                      {/* TikTok */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#120A07] border border-[#D4AF37]/20 rounded-2xl p-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#A8988A] block">
                            اسم حساب تيك توك (TikTok)
                          </label>
                          <input
                            type="text"
                            placeholder="@maison_oud"
                            value={settingsForm.tiktok_handle}
                            onChange={(e) =>
                              setSettingsForm(prev => ({
                                ...prev,
                                tiktok_handle: e.target.value
                              }))
                            }
                            className="w-full bg-[#1E120D] border border-[#D4AF37]/20 rounded-xl py-2 px-3 text-xs text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#A8988A] block">
                            رابط تيك توك (URL)
                          </label>
                          <input
                            dir="ltr"
                            type="text"
                            placeholder="https://tiktok.com/@..."
                            value={settingsForm.tiktok_url}
                            onChange={(e) =>
                              setSettingsForm(prev => ({
                                ...prev,
                                tiktok_url: e.target.value
                              }))
                            }
                            className="w-full bg-[#1E120D] border border-[#D4AF37]/20 rounded-xl py-2 px-3 text-xs text-[#F5EFE6] font-mono focus:outline-none focus:border-[#D4AF37] text-left"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Contact & Socials Button */}
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="w-full py-3.5 rounded-2xl gold-metallic-bg font-extrabold text-xs sm:text-sm shadow-xl transition-transform duration-150 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {saveLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#120A07]" />
                      ) : (
                        <Save className="h-4 w-4 text-[#120A07]" />
                      )}
                      <span>حفظ بيانات التواصل والموقع</span>
                    </button>
                  </form>
                )}

                {/* TAB 3: الأمان وكلمة المرور (Security & Password) */}
                {settingsSubTab === 'security' && (
                  <form onSubmit={handleChangePassword} className="space-y-5">
                    <div className="bg-[#120A07] border border-[#D4AF37]/20 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#F5EFE6] block">
                          حساب المالك المسجل حالياً
                        </span>
                        <span dir="ltr" className="text-xs font-mono text-[#F9E29C] mt-0.5 block">
                          {adminEmail || 'Admin Account'}
                        </span>
                      </div>
                      <KeyRound className="h-5 w-5 text-[#D4AF37]" />
                    </div>

                    {passwordToast && (
                      <div
                        role="status"
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-bold ${
                          passwordToast.type === 'success'
                            ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                            : 'bg-red-500/15 border-red-500/35 text-red-300'
                        }`}
                      >
                        {passwordToast.type === 'success' ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                        )}
                        <span>{passwordToast.text}</span>
                      </div>
                    )}

                    {/* Current Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#F5EFE6] block">
                        كلمة المرور الحالية (لإعادة التحقق)
                      </label>
                      <input
                        type="password"
                        required
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#120A07] border border-[#D4AF37]/25 rounded-xl py-2.5 px-4 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    {/* New Password + Strength Indicator */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#F5EFE6] block">
                          كلمة المرور الجديدة (8 أحرف على الأقل)
                        </label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          autoComplete="new-password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#120A07] border border-[#D4AF37]/25 rounded-xl py-2.5 px-4 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#F5EFE6] block">
                          تأكيد كلمة المرور الجديدة
                        </label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#120A07] border border-[#D4AF37]/25 rounded-xl py-2.5 px-4 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    {/* Live Password Strength Meter */}
                    {newPassword.length > 0 && (
                      <div className="space-y-1.5 bg-[#120A07] border border-[#D4AF37]/15 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#A8988A]">قوة كلمة المرور الجديدة:</span>
                          <span className="font-bold text-[#F9E29C]">
                            {getPasswordStrength(newPassword).label}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 h-1.5">
                          {[1, 2, 3].map((level) => {
                            const strength = getPasswordStrength(newPassword)
                            return (
                              <div
                                key={level}
                                className={`rounded-full transition-colors ${
                                  strength.score >= level ? strength.colorClass : 'bg-[#2D1B14]'
                                }`}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={passLoading}
                      className="w-full py-3.5 rounded-2xl gold-metallic-bg font-extrabold text-xs sm:text-sm shadow-xl transition-transform duration-150 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {passLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#120A07]" />
                      ) : (
                        <KeyRound className="h-4 w-4 text-[#120A07]" />
                      )}
                      <span>تحديث كلمة المرور</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 5: Alternatives Panel */}
            {activeTab === 'alternatives' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center gap-3 bg-gradient-to-r from-gold-500/10 to-transparent border-l-2 border-gold-500 p-4.5 rounded-r-2xl">
                  <Sparkles className="h-5 w-5 text-gold-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-white">{t('tab_alternatives')}</h3>
                    <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                      Surface twin scents, cross-sell alternatives, and clones for stock bridging. Click "Upload to Stock" to expand your catalog.
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
                  <div ref={anchorSearchRef} className="space-y-1.5 max-w-md relative">
                    <label className="text-xs text-neutral-400 font-semibold text-start block">
                      {t('search_anchor_placeholder').split('...')[0]}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={anchorSearchQuery}
                        onChange={(e) => {
                          setAnchorSearchQuery(e.target.value)
                          setShowSuggestions(true)
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder={t('search_anchor_placeholder')}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-gold-500/50"
                      />
                      {anchorSearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setAnchorSearchQuery('')
                            setSelectedAnchorId('')
                            setAlternativesList([])
                          }}
                          className="absolute right-3 top-2.5 text-neutral-500 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {showSuggestions && anchorSearchQuery.trim().length > 0 && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-white/5">
                        {perfumes
                          .filter(p => 
                            p.name.toLowerCase().includes(anchorSearchQuery.toLowerCase()) ||
                            p.brands.name.toLowerCase().includes(anchorSearchQuery.toLowerCase())
                          )
                          .slice(0, 10)
                          .map((p) => (
                            <button
                              type="button"
                              key={p.id}
                              onClick={() => {
                                setSelectedAnchorId(p.id)
                                setAnchorSearchQuery(`${p.brands.name} - ${p.name} (${p.gender === 'male' ? t('gender_options.male') : p.gender === 'female' ? t('gender_options.female') : t('gender_options.unisex')})`)
                                setShowSuggestions(false)
                              }}
                              className="w-full text-start px-4 py-3 hover:bg-gold-500/10 text-xs text-white flex justify-between items-center transition-colors"
                            >
                              <span className="font-semibold">{p.brands.name} - {p.name}</span>
                              <span className="text-[10px] text-gold-500 font-bold uppercase tracking-wider">
                                {p.gender === 'male' ? t('gender_options.male') : p.gender === 'female' ? t('gender_options.female') : t('gender_options.unisex')}
                              </span>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>

                  {altsLoading ? (
                    <div className="py-12 flex justify-center items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-gold-400" />
                      <span className="text-xs text-neutral-400">Loading alternatives...</span>
                    </div>
                  ) : selectedAnchorId && alternativesList.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic py-6 text-start">{t('no_alternatives_found')}</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {alternativesList.map((alt) => (
                        <div key={alt.id} className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4">
                          <div className="flex gap-4">
                            {alt.image_url ? (
                              <img 
                                src={alt.image_url} 
                                alt={alt.name} 
                                className="w-16 h-16 rounded-xl object-contain bg-white/5 shrink-0 border border-white/10"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0 border border-white/10 text-neutral-500 text-[10px]">
                                No Image
                              </div>
                            )}
                            <div className="space-y-1 text-start">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">{alt.brand}</span>
                                <span className="px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 font-mono text-[9px] font-bold">
                                  {alt.match_confidence}% {t('match_confidence')}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-white leading-tight">{alt.name}</h4>
                              <p className="text-[11px] text-neutral-400 leading-normal italic mt-1 font-light">
                                "{alt.id.startsWith('fallback-') ? t('dynamic_alt_pitch') : alt.shop_owner_pitch}"
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-white/5 pt-3 space-y-2 text-start">
                            <span className="text-[10px] text-neutral-400 font-semibold block uppercase tracking-wider">{t('olfactory_notes')}</span>
                            <div className="grid grid-cols-3 gap-2">
                              {['top', 'middle', 'base'].map((layer) => {
                                const key = `${layer}_notes`;
                                const layerNotes = alt.notes[key] || [];
                                return (
                                  <div key={layer} className="space-y-1">
                                    <span className="text-[8px] text-gold-500 font-bold uppercase block">
                                      {layer === 'middle' ? t('layer_middle') : layer === 'top' ? t('layer_top') : t('layer_base')}
                                    </span>
                                    <p className="text-[10px] text-neutral-400 leading-tight">
                                      {layerNotes.join(', ') || '-'}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                            {alt.is_uploaded ? (
                              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                {t('available_stock')}
                              </span>
                            ) : (
                              <>
                                <span className="text-[10px] text-amber-500 font-bold">
                                  {t('not_in_catalog')}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUploadAlternative(alt)}
                                  disabled={uploadLoadingId !== null}
                                  className="px-3.5 py-1.5 rounded-xl bg-burgundy-750 border border-gold-500/20 hover:border-gold-500/50 text-xs text-gold-400 hover:text-gold-300 font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                                >
                                  {uploadLoadingId === alt.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Plus className="h-3.5 w-3.5" />
                                  )}
                                  <span>{t('upload_to_stock')}</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </>
        )}
      </main>

      {/* --- MODAL DIALOGS --- */}

      {/* 1. PERFUME CRUD FORM MODAL */}
      {perfumeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 flex flex-col gap-6 text-start">
            
            {/* Modal header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">
                {editingPerfume ? t('edit_perfume') : t('add_perfume')}
              </h3>
              <button 
                onClick={() => setPerfumeModalOpen(false)} 
                className="p-1 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePerfume} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left side parameters */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-semibold">{t('perfume_name')}</label>
                    <input
                      type="text"
                      required
                      value={perfumeForm.name}
                      onChange={(e) => setPerfumeForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-gold-500/50"
                    />
                  </div>

                  {/* Brand select */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-semibold">{t('brand_label')}</label>
                    <select
                      value={perfumeForm.brand_id}
                      onChange={(e) => setPerfumeForm(prev => ({ ...prev, brand_id: e.target.value }))}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-gold-500/50"
                    >
                      {brands.map(b => (
                        <option key={b.id} value={b.id} className="bg-neutral-950 text-white">{b.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Gender selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-semibold">{t('gender_label')}</label>
                    <div className="flex bg-neutral-950 border border-white/10 p-1 rounded-xl gap-1">
                      {['male', 'female', 'unisex'].map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setPerfumeForm(prev => ({ ...prev, gender: g as any }))}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            perfumeForm.gender === g
                              ? 'bg-burgundy-750 text-gold-400 shadow-md'
                              : 'text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          {t(`gender_options.${g}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Concentration */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-semibold">{t('concentration_label')}</label>
                    <select
                      value={perfumeForm.concentration}
                      onChange={(e) => setPerfumeForm(prev => ({ ...prev, concentration: e.target.value as any }))}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-gold-500/50"
                    >
                      <option value="parfum">Parfum</option>
                      <option value="edp">Eau de Parfum (EDP)</option>
                      <option value="edt">Eau de Toilette (EDT)</option>
                      <option value="edc">Eau de Cologne (EDC)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Volume */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-400 font-semibold">{t('volume_label')}</label>
                      <input
                        type="number"
                        required
                        value={perfumeForm.volume_ml}
                        onChange={(e) => setPerfumeForm(prev => ({ ...prev, volume_ml: parseInt(e.target.value) }))}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-gold-500/50 font-mono"
                      />
                    </div>
                    {/* Price */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-400 font-semibold">{t('price_label')}</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={perfumeForm.price}
                        onChange={(e) => setPerfumeForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-gold-500/50 font-mono"
                      />
                    </div>
                  </div>

                  {/* Scent Family */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-semibold">{t('family_label')}</label>
                    <input
                      type="text"
                      placeholder="Oriental, Woody, Floral..."
                      value={perfumeForm.family}
                      onChange={(e) => setPerfumeForm(prev => ({ ...prev, family: e.target.value }))}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-gold-500/50"
                    />
                  </div>

                  {/* Dupes info */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-semibold">{t('is_dupe_of_label')}</label>
                    <input
                      type="text"
                      placeholder="e.g. Dior Sauvage"
                      value={perfumeForm.is_dupe_of}
                      onChange={(e) => setPerfumeForm(prev => ({ ...prev, is_dupe_of: e.target.value }))}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-gold-500/50"
                    />
                  </div>

                  {/* Image cover cover upload field */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-semibold">{t('image_url_label')}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={perfumeForm.image_url}
                        onChange={(e) => setPerfumeForm(prev => ({ ...prev, image_url: e.target.value }))}
                        className="flex-1 bg-neutral-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      />
                      <label className="px-4 py-2 rounded-xl bg-neutral-800 border border-white/10 hover:bg-neutral-750 text-xs font-bold text-neutral-300 hover:text-white cursor-pointer flex items-center justify-center gap-1.5">
                        {uploadingImage ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Upload className="h-3.5 w-3.5" />
                        )}
                        <span>{t('upload_image').split(' ')[0]}</span>
                        <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                </div>

                {/* Right side descriptions & note mapping chips */}
                <div className="space-y-4 flex flex-col justify-between">
                  
                  {/* Descriptions */}
                  <div className="space-y-3">
                    <label className="text-xs text-neutral-400 font-semibold">Olfactive Descriptions</label>
                    <textarea
                      placeholder="Arabic description..."
                      value={perfumeForm.description_ar}
                      onChange={(e) => setPerfumeForm(prev => ({ ...prev, description_ar: e.target.value }))}
                      className="w-full h-16 bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50 resize-none font-serif"
                    />
                    <textarea
                      placeholder="English description..."
                      value={perfumeForm.description_en}
                      onChange={(e) => setPerfumeForm(prev => ({ ...prev, description_en: e.target.value }))}
                      className="w-full h-16 bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50 resize-none"
                    />
                  </div>

                  {/* Notes association with layer selecting */}
                  <div className="flex-1 flex flex-col gap-2 mt-2">
                    <label className="text-xs text-neutral-400 font-semibold">{t('select_notes_layers')}</label>
                    
                    {/* Horizontal list of categorized notes */}
                    <div className="bg-neutral-950 border border-white/10 rounded-2xl p-3 flex-1 overflow-y-auto max-h-[160px] space-y-3">
                      {categories.map((cat) => {
                        const catNotes = notes.filter(n => n.category_id === cat.id)
                        if (catNotes.length === 0) return null
                        return (
                          <div key={cat.id} className="space-y-1.5">
                            <span className="text-[9px] uppercase tracking-wider text-gold-500 font-bold">
                              {getLocalizedName(cat)}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {catNotes.map((note) => {
                                const isSelected = perfumeNotesForm.some(m => m.note_id === note.id)
                                return (
                                  <button
                                    type="button"
                                    key={note.id}
                                    onClick={() => togglePerfumeNoteSelection(note.id)}
                                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-colors cursor-pointer ${
                                      isSelected
                                        ? 'bg-burgundy-750 border-gold-500 text-gold-400'
                                        : 'bg-white/2 border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                                    }`}
                                  >
                                    {getLocalizedName(note)}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Layers selections list for selected notes */}
                    {perfumeNotesForm.length > 0 && (
                      <div className="bg-neutral-950 border border-gold-500/20 rounded-2xl p-3 max-h-[140px] overflow-y-auto space-y-2">
                        <span className="text-[10px] text-neutral-400 font-bold block">Configure Layers</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {perfumeNotesForm.map((mapping) => {
                            const note = notes.find(n => n.id === mapping.note_id)
                            if (!note) return null
                            return (
                              <div key={mapping.note_id} className="bg-white/2 border border-white/5 rounded-lg p-1.5 flex items-center justify-between gap-2">
                                <span className="text-[10px] text-white truncate max-w-[90px]">{getLocalizedName(note)}</span>
                                <select
                                  value={mapping.layer}
                                  onChange={(e) => changePerfumeNoteLayer(mapping.note_id, e.target.value as any)}
                                  className="bg-neutral-900 border border-white/10 rounded px-1 py-0.5 text-[9px] text-gold-400 focus:outline-none"
                                >
                                  <option value="top">Top</option>
                                  <option value="middle">Heart</option>
                                  <option value="base">Base</option>
                                </select>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* Modal actions */}
              <div className="border-t border-white/5 pt-4.5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPerfumeModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-neutral-300 hover:text-white cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-xs shadow-lg shadow-gold-500/10 cursor-pointer flex items-center justify-center gap-1"
                >
                  {saveLoading && <Loader2 className="h-3 w-3 animate-spin text-neutral-950" />}
                  <span>{t('save')}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 2. NOTE CRUD FORM MODAL */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-5 text-start">
            
            {/* Modal header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="font-serif text-base font-bold text-white">
                {editingNote ? t('edit_note') : t('add_note')}
              </h3>
              <button 
                onClick={() => setNoteModalOpen(false)} 
                className="p-1 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {noteError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex gap-2 text-red-400 text-xs">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <p>{noteError}</p>
              </div>
            )}

            <form onSubmit={handleSaveNote} className="space-y-4">
              
              {/* English Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">{t('note_name_en')}</label>
                <input
                  type="text"
                  required
                  value={noteForm.name_en}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, name_en: e.target.value }))}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Arabic Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">{t('note_name_ar')}</label>
                <input
                  type="text"
                  required
                  value={noteForm.name_ar}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, name_ar: e.target.value }))}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none font-serif"
                />
              </div>

              {/* French Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">{t('note_name_fr')}</label>
                <input
                  type="text"
                  required
                  value={noteForm.name_fr}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, name_fr: e.target.value }))}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">{t('category_label')}</label>
                <select
                  value={noteForm.category_id}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-neutral-950 text-white">
                      {getLocalizedName(cat)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Default Note Layer */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">{t('default_layer_label')}</label>
                <select
                  value={noteForm.layer}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, layer: e.target.value as any }))}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                >
                  <option value="top">Top Notes (Opening)</option>
                  <option value="middle">Heart Notes (Middle)</option>
                  <option value="base">Base Notes (Dry Down)</option>
                </select>
              </div>

              {/* Modal actions */}
              <div className="border-t border-white/5 pt-4.5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-neutral-350 hover:text-white"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-xs shadow-lg"
                >
                  <span>{t('save')}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}
