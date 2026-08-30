// Supabase Edge Function: search-external-perfumes
// Deno script to query external perfume databases or fallback to high-quality mocks.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// Mock dataset for immediate catalog search capabilities
const MOCK_CATALOG = [
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    const searchVal = query ? String(query).toLowerCase().trim() : ""

    if (!searchVal) {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      })
    }

    const rapidApiKey = Deno.env.get("RAPIDAPI_KEY")
    if (rapidApiKey) {
      // Propose real external API search logic if credentials exist
      try {
        const response = await fetch(`https://perfume-api.p.rapidapi.com/perfumes/search?q=${encodeURIComponent(searchVal)}`, {
          headers: {
            "X-RapidAPI-Key": rapidApiKey,
            "X-RapidAPI-Host": "perfume-api.p.rapidapi.com"
          }
        })
        if (response.ok) {
          const apiData = await response.json()
          // Map to standard normalized JSON response
          const results = (apiData.results || []).map((item: any) => ({
            name: item.name,
            brand: item.brand,
            description: item.description || `Signature fragrance by ${item.brand}`,
            image_url: item.image_url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400",
            top_notes: item.top_notes || [],
            heart_notes: item.heart_notes || [],
            base_notes: item.base_notes || []
          }))
          return new Response(JSON.stringify(results), {
            headers: { "Content-Type": "application/json", ...corsHeaders },
            status: 200,
          })
        }
      } catch (err) {
        console.error("External API query failed, falling back to mock search:", err)
      }
    }

    // Fallback: search within the high-quality mock catalog
    const results = MOCK_CATALOG.filter(item => 
      item.name.toLowerCase().includes(searchVal) || 
      item.brand.toLowerCase().includes(searchVal) ||
      item.top_notes.some(n => n.toLowerCase().includes(searchVal)) ||
      item.heart_notes.some(n => n.toLowerCase().includes(searchVal)) ||
      item.base_notes.some(n => n.toLowerCase().includes(searchVal))
    )

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 400,
    })
  }
})
