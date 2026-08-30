import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Search, Loader2, AlertCircle, CheckCircle2, Download } from 'lucide-react'

interface ExternalPerfume {
  name: string
  brand: string
  description: string
  image_url: string
  top_notes: string[]
  heart_notes: string[]
  base_notes: string[]
}

// Client-side fallback catalog for seamless local testing
const MOCK_FALLBACK_CATALOG: ExternalPerfume[] = [
  {
    name: "Bleu de Chanel",
    brand: "Chanel",
    description: "A woody, aromatic fragrance for the free and independent man.",
    image_url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=400&auto=format&fit=crop",
    top_notes: ["Grapefruit", "Lemon", "Mint", "Pink Pepper"],
    heart_notes: ["Ginger", "Nutmeg", "Jasmine", "Iso E Super"],
    base_notes: ["Incense", "Vetiver", "Cedar", "Sandalwood", "Patchouli", "Labdanum"]
  },
  {
    name: "Sauvage",
    brand: "Dior",
    description: "A radically fresh composition, dictated by a name that has the ring of a manifesto.",
    image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400&auto=format&fit=crop",
    top_notes: ["Calabrian Bergamot", "Pepper"],
    heart_notes: ["Sichuan Pepper", "Lavender", "Pink Pepper", "Vetiver", "Patchouli", "Geranium", "Elemi"],
    base_notes: ["Ambroxan", "Cedar", "Labdanum"]
  },
  {
    name: "Aventus",
    brand: "Creed",
    description: "The exceptional Aventus was inspired by the dramatic life of a historic emperor, celebrating strength, power and success.",
    image_url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400&auto=format&fit=crop",
    top_notes: ["Pineapple", "Bergamot", "Blackcurrant", "Apple"],
    heart_notes: ["Birch", "Patchouli", "Moroccan Jasmine", "Rose"],
    base_notes: ["Musk", "Oakmoss", "Ambergris", "Vanille"]
  },
  {
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    description: "A poetic alchemy, a highly condensed and graphic olfactory signature.",
    image_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400&auto=format&fit=crop",
    top_notes: ["Saffron", "Jasmine"],
    heart_notes: ["Amberwood", "Ambergris"],
    base_notes: ["Fir Resin", "Cedar"]
  },
  {
    name: "Black Opium",
    brand: "Yves Saint Laurent",
    description: "A warm & spicy fragrance with notes of coffee, white flowers, and vanilla.",
    image_url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400&auto=format&fit=crop",
    top_notes: ["Pear", "Pink Pepper", "Orange Blossom"],
    heart_notes: ["Coffee", "Jasmine", "Bitter Almond", "Licorice"],
    base_notes: ["Vanilla", "Patchouli", "Cashmere Wood", "Cedar"]
  },
  {
    name: "Acqua di Gio",
    brand: "Giorgio Armani",
    description: "A fresh marine scent inspired by the beauty of the Mediterranean island of Pantelleria.",
    image_url: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400&auto=format&fit=crop",
    top_notes: ["Lime", "Lemon", "Bergamot", "Jasmine", "Orange", "Mandarin Orange", "Neroli"],
    heart_notes: ["Sea Notes", "Jasmine", "Calone", "Peach", "Freesia", "Honeysuckle", "Rosemary", "Hyacinth", "Coriander", "Nutmeg", "Rose", "Violet"],
    base_notes: ["White Musk", "Cedar", "Oakmoss", "Patchouli", "Amber"]
  }
]

interface ExternalCatalogImportProps {
  onImportSuccess?: () => void
}

export default function ExternalCatalogImport({ onImportSuccess }: ExternalCatalogImportProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ExternalPerfume[]>([])
  
  // Status states
  const [importingId, setImportingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Debounced live autocomplete search trigger as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    const timer = setTimeout(async () => {
      try {
        // 1. Try invoking the Supabase Edge Function
        const { data, error: funcError } = await supabase.functions.invoke('search-external-perfumes', {
          body: { query: searchQuery }
        })

        if (funcError || !data) {
          throw new Error(funcError?.message || "Edge function failed, falling back to local search")
        }

        setResults(data)
      } catch (err: any) {
        console.warn("Edge function invoke failed. Performing client-side fallback search:", err.message)
        
        // 2. Fallback to searching the local mock catalog client-side
        const searchVal = searchQuery.toLowerCase().trim()
        const filteredMocks = MOCK_FALLBACK_CATALOG.filter(item => 
          item.name.toLowerCase().includes(searchVal) || 
          item.brand.toLowerCase().includes(searchVal) ||
          item.top_notes.some(n => n.toLowerCase().includes(searchVal)) ||
          item.heart_notes.some(n => n.toLowerCase().includes(searchVal)) ||
          item.base_notes.some(n => n.toLowerCase().includes(searchVal))
        )
        setResults(filteredMocks)
      } finally {
        setLoading(false)
      }
    }, 300) // 300ms debounce delay

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleImport = async (item: ExternalPerfume) => {
    const importKey = `${item.brand}-${item.name}`
    setImportingId(importKey)
    setError(null)
    setSuccess(null)

    try {
      // Trigger the secure transactional import RPC function
      const { error: importError } = await supabase.rpc('import_external_perfume', {
        p_name: item.name,
        p_brand: item.brand,
        p_description_en: item.description,
        p_image_url: item.image_url,
        p_top_notes: item.top_notes,
        p_heart_notes: item.heart_notes,
        p_base_notes: item.base_notes
      })

      if (importError) throw importError

      setSuccess(`Successfully imported "${item.brand} - ${item.name}" into your shop inventory!`)
      if (onImportSuccess) {
        onImportSuccess()
      }
    } catch (err: any) {
      console.error("Import failed:", err)
      setError(err.message || "Failed to import selected perfume. Ensure your database migration is run.")
    } finally {
      setImportingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search external perfumes (e.g. Dior, Chanel, Vanilla...)"
            className="w-full bg-neutral-950 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-gold-500 transition-all placeholder-neutral-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 rounded-2xl bg-gold-500 hover:bg-gold-400 text-neutral-950 font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Search className="h-3.5 w-3.5" />
              <span>Search</span>
            </>
          )}
        </button>
      </form>

      {/* Alerts */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((item) => {
            const key = `${item.brand}-${item.name}`
            const isImporting = importingId === key

            return (
              <div 
                key={key} 
                className="bg-neutral-900 border border-white/10 rounded-2xl p-4 flex gap-4 hover:border-gold-500/35 transition-all relative overflow-hidden group"
              >
                {/* Perfume Image */}
                <div className="h-24 w-24 rounded-xl overflow-hidden shrink-0 border border-white/5 bg-neutral-950 relative">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="h-full w-full object-cover group-hover:scale-105 transition-all duration-550"
                  />
                </div>

                {/* Details info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold-500 font-bold block mb-0.5">
                      {item.brand}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate mb-1">{item.name}</h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-2">
                      {item.description}
                    </p>

                    {/* Scent notes overview */}
                    <div className="flex flex-wrap gap-1 text-[9px] text-neutral-400">
                      <span className="bg-neutral-950 px-2 py-0.5 rounded-md border border-white/5">
                        T: {item.top_notes.slice(0, 2).join(', ')}
                      </span>
                      <span className="bg-neutral-950 px-2 py-0.5 rounded-md border border-white/5">
                        H: {item.heart_notes.slice(0, 2).join(', ')}
                      </span>
                      <span className="bg-neutral-950 px-2 py-0.5 rounded-md border border-white/5">
                        B: {item.base_notes.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Import Action Button */}
                  <button
                    onClick={() => handleImport(item)}
                    disabled={isImporting}
                    className="w-full mt-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-gold-500 hover:text-neutral-950 border border-white/10 hover:border-transparent text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isImporting ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Download className="h-3 w-3" />
                        <span>Import to My Shop</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        searchQuery && !loading && (
          <div className="text-center py-10 bg-neutral-900/40 border border-white/5 rounded-2xl">
            <p className="text-xs text-neutral-500">No results found on the external catalog.</p>
          </div>
        )
      )}
    </div>
  )
}
