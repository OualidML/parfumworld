// Supabase Edge Function: search-external-perfumes
// Deno script to strictly query the live external perfume API.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const rapidApiKey = Deno.env.get("RAPIDAPI_KEY")
    if (!rapidApiKey) {
      return new Response(
        JSON.stringify({ error: "RAPIDAPI_KEY secret is missing. Please configure it in Supabase." }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 500,
        }
      )
    }

    const { query } = await req.json()
    const searchVal = query ? String(query).toLowerCase().trim() : ""

    if (!searchVal) {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      })
    }

    // Call the live external API via RapidAPI
    const response = await fetch(`https://perfume-api.p.rapidapi.com/perfumes/search?q=${encodeURIComponent(searchVal)}`, {
      headers: {
        "X-RapidAPI-Key": rapidApiKey,
        "X-RapidAPI-Host": "perfume-api.p.rapidapi.com"
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`External API returned status ${response.status}: ${errorText}`)
    }

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
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 400,
    })
  }
})
