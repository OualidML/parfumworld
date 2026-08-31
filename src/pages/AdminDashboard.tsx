import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { 
  Sparkles, LogOut, Loader2, AlertCircle, TrendingUp, Package, Layers, Settings,
  Plus, Edit2, Trash2, XCircle, Search, Save, X, Upload, DollarSign,
  Tag, MapPin, MessageSquare, KeyRound
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

interface FailedSearch {
  id: string
  note_ids: string[]
  created_at: string
}

interface OutOfStockDemand {
  perfume_id: string
  perfume_name: string
  brand_name: string
  search_count: number
}

export default function AdminDashboard() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const currentLanguage = i18n.language || 'ar'

  // Auth Guard States
  const [authLoading, setAuthLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

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

  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    whatsapp_number: '',
    store_name: '',
    store_slogan: '',
    google_maps_link: ''
  })

  // Password Update States
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passLoading, setPassLoading] = useState(false)

  // Stats Analytics states
  const [statNotes, setStatNotes] = useState<SearchStatNote[]>([])
  const [statFailed, setStatFailed] = useState<FailedSearch[]>([])
  const [statOosDemand, setStatOosDemand] = useState<OutOfStockDemand[]>([])

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

        // Verify if user exists in admins table
        const { data: admin, error: adminErr } = await supabase
          .from('admins')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle()

        if (adminErr) throw adminErr

        if (!admin) {
          await supabase.auth.signOut()
          navigate('/admin/login')
          return
        }

        setIsAdmin(true)
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
  }, [isAdmin])

  // 3. Fetch Alternatives when selectedAnchorId changes
  useEffect(() => {
    async function fetchAlts() {
      if (!selectedAnchorId) {
        setAlternativesList([])
        return
      }
      setAltsLoading(true)
      try {
        const { data, error } = await supabase
          .from('perfume_alternatives')
          .select('*')
          .eq('perfume_id', selectedAnchorId)
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
      const { data: { session } } = await supabase.auth.getSession()
      const shopId = session?.user?.id
      if (!shopId) throw new Error('No active session user')

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
      // Fetch Brands
      const { data: brandsData } = await supabase.from('brands').select('*').order('name')
      setBrands(brandsData || [])

      // Fetch Categories
      const { data: catData } = await supabase.from('note_categories').select('*')
      setCategories(catData || [])

      // Fetch Notes
      const { data: notesData } = await supabase.from('notes').select('*').order('name_en')
      setNotes(notesData || [])

      // Fetch Perfumes with Brand details
      const { data: perfData } = await supabase
        .from('perfumes')
        .select('*, brands(*), perfume_notes(*)')
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
      const { data } = await supabase.from('store_settings').select('*')
      if (data) {
        const settingsMap: Record<string, string> = {}
        data.forEach(item => {
          settingsMap[item.key] = item.value
        })
        setSettingsForm({
          whatsapp_number: settingsMap['whatsapp_number'] || '',
          store_name: settingsMap['store_name'] || '',
          store_slogan: settingsMap['store_slogan'] || '',
          google_maps_link: settingsMap['google_maps_link'] || ''
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchStatsData = async () => {
    try {
      // 1. Top searched notes (last 30 days)
      const { data: topNotes } = await supabase.rpc('get_top_searched_notes', { days_count: 30 })
      setStatNotes(topNotes || [])

      // 2. Failed searches (no match)
      const { data: failedSearches } = await supabase.rpc('get_failed_searches', { limit_count: 10 })
      setStatFailed(failedSearches || [])

      // 3. Out of stock demand
      const { data: oosDemand } = await supabase.rpc('get_out_of_stock_demand')
      setStatOosDemand(oosDemand || [])
    } catch (e) {
      console.warn('Failed to load stats RPC queries:', e)
    }
  }

  // Sign out Handler
  const handleSignOut = async () => {
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
      const { data: { session } } = await supabase.auth.getSession()
      const shopId = session?.user?.id
      if (!shopId) throw new Error('No active session user')

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
      if (editingNote) {
        const { error } = await supabase
          .from('notes')
          .update(noteForm)
          .eq('id', editingNote.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('notes')
          .insert(noteForm)
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

  // --- Store Settings Save Handler ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const shopId = session?.user?.id
      if (!shopId) throw new Error('No active session user')

      const payload = Object.entries(settingsForm).map(([key, value]) => ({
        shop_id: shopId,
        key,
        value,
        description: `Store setting for ${key}`
      }))

      const { error } = await supabase
        .from('store_settings')
        .upsert(payload)

      if (error) throw error
      alert('Settings updated successfully!')
      fetchSettingsData()
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert(t('password_match_error'))
      return
    }
    if (newPassword.length < 6) {
      alert(t('password_length_error'))
      return
    }

    setPassLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      alert(t('password_change_success'))
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      alert(`Password update error: ${err.message}`)
    } finally {
      setPassLoading(false)
    }
  }

  // Text helpers matching languages
  const getLocalizedName = (obj: any) => {
    if (currentLanguage === 'ar') return obj.name_ar || obj.name_en || obj.name
    if (currentLanguage === 'fr') return obj.name_fr || obj.name_en || obj.name
    return obj.name_en || obj.name
  }

  const getLocalizedNoteNamesList = (noteIds: string[]) => {
    if (!noteIds || noteIds.length === 0) return '-'
    return noteIds.map(nid => {
      const note = notes.find(n => n.id === nid)
      return note ? getLocalizedName(note) : 'Scent'
    }).join(' • ')
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
          
          {/* Brand Title */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gold-500 to-burgundy-500 flex items-center justify-center shadow-lg">
              <Sparkles className="h-4 w-4 text-neutral-900" />
            </div>
            <span className="font-serif text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-gold-100 to-gold-400">
              ParfumWorld Admin
            </span>
          </div>

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

                {/* Dashboard Metrics grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Metric Block 1: Top 10 Scent Notes */}
                  <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-gold-400 flex items-center gap-2 pb-2 border-b border-white/5">
                      <Layers className="h-4 w-4" />
                      {t('stat_top_notes')}
                    </h4>
                    {statNotes.length > 0 ? (
                      <div className="space-y-3.5">
                        {statNotes.map((item, idx) => (
                          <div key={item.note_id} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-white flex items-center gap-1.5">
                                <span className="text-[10px] text-gold-500 font-mono">#{idx+1}</span>
                                {getLocalizedName(item)}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                {item.search_count} {t('searches_count', { count: item.search_count }).replace(/[0-9]/g, '')}
                              </span>
                            </div>
                            {/* Visual Progress bar */}
                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-burgundy-500 to-gold-500 rounded-full" 
                                style={{ width: `${Math.min((item.search_count / (statNotes[0]?.search_count || 1)) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-500 italic py-6 text-center">No search telemetry recorded yet.</p>
                    )}
                  </div>

                  {/* Metric Block 2: Zero-Match Searches */}
                  <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-gold-400 flex items-center gap-2 pb-2 border-b border-white/5">
                      <XCircle className="h-4 w-4" />
                      {t('stat_failed_searches')}
                    </h4>
                    {statFailed.length > 0 ? (
                      <div className="space-y-3">
                        {statFailed.map((item) => (
                          <div key={item.id} className="bg-black/20 border border-white/5 rounded-xl p-3 flex flex-col gap-1.5 hover:border-gold-500/20 transition-colors">
                            <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                              <span>Search Combinations</span>
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-gold-100 font-medium leading-relaxed">
                              {getLocalizedNoteNamesList(item.note_ids)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-500 italic py-6 text-center">Perfect! All customer queries matched successfully.</p>
                    )}
                  </div>

                  {/* Metric Block 3: Popular Out-of-Stock Products */}
                  <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-gold-400 flex items-center gap-2 pb-2 border-b border-white/5">
                      <Package className="h-4 w-4" />
                      {t('stat_out_of_stock_demand')}
                    </h4>
                    {statOosDemand.length > 0 ? (
                      <div className="space-y-3.5">
                        {statOosDemand.map((item) => (
                          <div key={item.perfume_id} className="flex items-center justify-between bg-black/20 border border-white/5 hover:border-burgundy-500/20 rounded-xl p-3">
                            <div className="flex flex-col">
                              <span className="text-[9px] uppercase tracking-wider font-semibold text-gold-500">
                                {item.brand_name}
                              </span>
                              <span className="text-xs font-bold text-white mt-0.5">
                                {item.perfume_name}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-burgundy-950/80 border border-burgundy-500/30 text-[9px] font-bold text-burgundy-400">
                                {item.search_count} Hits
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-500 italic py-6 text-center">All highly searched perfumes are in stock.</p>
                    )}
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

            {/* TAB 4: Store Settings Panel */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto bg-neutral-900/40 border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl animate-in fade-in duration-200">
                <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3 mb-6 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gold-500" />
                  {t('tab_settings')}
                </h3>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  
                  {/* Store Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-gold-400" />
                      {t('store_name_label')}
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.store_name}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, store_name: e.target.value }))}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-gold-500/50"
                    />
                  </div>

                  {/* Slogan */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-gold-400" />
                      {t('slogan_label')}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.store_slogan}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, store_slogan: e.target.value }))}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-gold-500/50"
                    />
                  </div>

                  {/* WhatsApp Order phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                      {t('whatsapp_number_label')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+212600000000"
                      value={settingsForm.whatsapp_number}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-gold-500/50 font-mono"
                    />
                  </div>

                  {/* Google Maps link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-rose-400" />
                      {t('maps_link_label')}
                    </label>
                    <input
                      type="url"
                      placeholder="https://maps.google.com/..."
                      value={settingsForm.google_maps_link}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, google_maps_link: e.target.value }))}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-gold-500/50 font-mono"
                    />
                  </div>

                  {/* Save Settings */}
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-xs shadow-xl shadow-gold-500/10 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {saveLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{t('save')}</span>
                  </button>

                </form>

                {/* Change Admin Password */}
                <div className="mt-10 pt-8 border-t border-white/5 space-y-6">
                  <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
                    <KeyRound className="h-4.5 w-4.5 text-gold-400" />
                    {t('change_password_title')}
                  </h4>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* New Password */}
                      <div className="space-y-1.5 text-start">
                        <label className="text-xs font-semibold text-neutral-400 block">{t('new_password_label')}</label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-gold-500/50"
                        />
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5 text-start">
                        <label className="text-xs font-semibold text-neutral-400 block">{t('confirm_password_label')}</label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-gold-500/50"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={passLoading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-xs shadow-xl shadow-gold-500/10 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {passLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>{t('update_password_button')}</span>
                    </button>
                  </form>
                </div>
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
