import * as fs from 'node:fs'
import * as path from 'node:path'
import * as dotenv from 'dotenv'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

dotenv.config()

// ============================================================================
// SESSION 3: MULTI-TENANT CSV CATALOG INGESTION CLI SCRIPT
// Usage:
//   npx ts-node scripts/ingestClientCatalog.ts <shop_id> <path_to_csv>
// Environment Variables Required:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
// ============================================================================

type NoteLayer = 'top' | 'middle' | 'base'
type GenderType = 'male' | 'female' | 'unisex'

interface CsvPerfumeRow {
  perfume_name: string
  brand: string
  description: string
  image_url: string
  gender: string
  top_notes: string
  heart_notes: string
  base_notes: string
}

interface CachedNoteEntry {
  id: string
  name_en: string
  layer: NoteLayer
  isGlobal: boolean
}

interface PerfumeNoteJunctionRow {
  perfume_id: string
  note_id: string
  layer: NoteLayer
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const BATCH_SIZE = 100

/**
 * RFC 4180-compliant CSV parser supporting quoted fields, embedded commas,
 * escaped quotes (`""`), and multi-line fields.
 */
function parseCsv(csvText: string): CsvPerfumeRow[] {
  const cleanText = csvText.replace(/^\uFEFF/, '')
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentField = ''
  let inQuotes = false

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i]
    const nextChar = cleanText[i + 1]

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        currentField += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        currentRow.push(currentField.trim())
        currentField = ''
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentField.trim())
        if (currentRow.some((cell) => cell.length > 0)) {
          rows.push(currentRow)
        }
        currentRow = []
        currentField = ''
        i++
      } else if (char === '\n' || char === '\r') {
        currentRow.push(currentField.trim())
        if (currentRow.some((cell) => cell.length > 0)) {
          rows.push(currentRow)
        }
        currentRow = []
        currentField = ''
      } else {
        currentField += char
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim())
    if (currentRow.some((cell) => cell.length > 0)) {
      rows.push(currentRow)
    }
  }

  if (rows.length < 2) {
    return []
  }

  const headers = rows[0].map((h) => h.toLowerCase().trim())
  const requiredColumns = [
    'perfume_name',
    'brand',
    'description',
    'image_url',
    'gender',
    'top_notes',
    'heart_notes',
    'base_notes',
  ]

  for (const col of requiredColumns) {
    if (!headers.includes(col)) {
      throw new Error(
        `CSV is missing required column "${col}". Found headers: [${headers.join(', ')}]`
      )
    }
  }

  const parsedRows: CsvPerfumeRow[] = []
  for (let r = 1; r < rows.length; r++) {
    const values = rows[r]
    const record: Record<string, string> = {}
    for (let c = 0; c < headers.length; c++) {
      record[headers[c]] = values[c] ?? ''
    }

    if (!record.perfume_name) continue

    parsedRows.push({
      perfume_name: record.perfume_name,
      brand: record.brand || 'Unknown Brand',
      description: record.description || '',
      image_url: record.image_url || '',
      gender: record.gender || 'unisex',
      top_notes: record.top_notes || '',
      heart_notes: record.heart_notes || '',
      base_notes: record.base_notes || '',
    })
  }

  return parsedRows
}

function normalizeGender(rawGender: string): GenderType {
  const normalized = rawGender.toLowerCase().trim()
  if (normalized === 'male' || normalized === 'men' || normalized === 'homme' || normalized === 'm') {
    return 'male'
  }
  if (
    normalized === 'female' ||
    normalized === 'women' ||
    normalized === 'femme' ||
    normalized === 'f'
  ) {
    return 'female'
  }
  return 'unisex'
}

function splitNoteList(rawNotes: string): string[] {
  if (!rawNotes) return []
  return rawNotes
    .split(',')
    .map((n) => n.trim())
    .filter((n) => n.length > 0)
}

/**
 * Resolves a default `category_id` from `public.note_categories` required when
 * inserting new custom local notes into `public.notes`.
 */
async function resolveDefaultCategoryId(supabase: SupabaseClient): Promise<string> {
  const { data: preferredCategory } = await supabase
    .from('note_categories')
    .select('id')
    .or('name_en.ilike.%Other%,name_en.ilike.%Floral%')
    .limit(1)
    .maybeSingle()

  if (preferredCategory?.id) {
    return preferredCategory.id
  }

  const { data: anyCategory } = await supabase
    .from('note_categories')
    .select('id')
    .limit(1)
    .maybeSingle()

  if (anyCategory?.id) {
    return anyCategory.id
  }

  const { data: createdCategory, error: createCatErr } = await supabase
    .from('note_categories')
    .insert({
      family: 'Custom',
      name_en: 'Custom Notes',
      name_fr: 'Notes Personnalisées',
      name_ar: 'نوتات خاصة',
      icon_name: 'Sparkles',
    })
    .select('id')
    .single()

  if (createCatErr || !createdCategory) {
    throw new Error(`Failed to resolve or create a default note category: ${createCatErr?.message}`)
  }

  return createdCategory.id
}

/**
 * Preloads the entire global `public.notes` catalog (`shop_id IS NULL`) and any
 * existing local notes for `shopId` ONCE at startup into an in-memory Map to
 * eliminate N+1 database queries.
 */
async function preloadNotesDictionary(
  supabase: SupabaseClient,
  shopId: string
): Promise<Map<string, CachedNoteEntry>> {
  const noteMap = new Map<string, CachedNoteEntry>()

  // 1. Fetch all global notes (shop_id IS NULL) in a single query
  const { data: globalNotes, error: globalErr } = await supabase
    .from('notes')
    .select('id, name_en, layer, shop_id')
    .is('shop_id', null)

  if (globalErr) {
    throw new Error(`Failed to preload global notes from public.notes: ${globalErr.message}`)
  }

  for (const note of globalNotes || []) {
    if (note.name_en) {
      noteMap.set(note.name_en.toLowerCase().trim(), {
        id: note.id,
        name_en: note.name_en,
        layer: (note.layer as NoteLayer) || 'middle',
        isGlobal: true,
      })
    }
  }

  // 2. Fetch any existing custom local notes for this shopId in a single query
  const { data: localNotes, error: localErr } = await supabase
    .from('notes')
    .select('id, name_en, layer, shop_id')
    .eq('shop_id', shopId)

  if (localErr) {
    throw new Error(
      `Failed to preload shop-local notes for shop ${shopId}: ${localErr.message}`
    )
  }

  for (const note of localNotes || []) {
    if (note.name_en) {
      const key = note.name_en.toLowerCase().trim()
      // Global notes always take precedence over local notes
      if (!noteMap.has(key)) {
        noteMap.set(key, {
          id: note.id,
          name_en: note.name_en,
          layer: (note.layer as NoteLayer) || 'middle',
          isGlobal: false,
        })
      }
    }
  }

  console.log(
    `[Preload] Loaded ${globalNotes?.length ?? 0} global note(s) and ${localNotes?.length ?? 0} existing local note(s) into memory.`
  )

  return noteMap
}

/**
 * Preloads all existing brands from `public.brands` ONCE at startup into an in-memory Map.
 */
async function preloadBrandsDictionary(
  supabase: SupabaseClient
): Promise<Map<string, string>> {
  const brandMap = new Map<string, string>()

  const { data: brands, error: brandErr } = await supabase
    .from('brands')
    .select('id, name')

  if (brandErr) {
    throw new Error(`Failed to preload brands from public.brands: ${brandErr.message}`)
  }

  for (const b of brands || []) {
    if (b.name) {
      brandMap.set(b.name.toLowerCase().trim(), b.id)
    }
  }

  console.log(`[Preload] Loaded ${brandMap.size} brand(s) into memory.`)
  return brandMap
}

/**
 * Resolves a brand against the in-memory dictionary, inserting into `public.brands`
 * only if it does not yet exist.
 */
async function resolveOrCreateBrandId(
  supabase: SupabaseClient,
  brandName: string,
  brandMap: Map<string, string>
): Promise<string> {
  const cleanBrand = brandName.trim() || 'Unknown Brand'
  const lookupKey = cleanBrand.toLowerCase()
  const existingId = brandMap.get(lookupKey)
  if (existingId) {
    return existingId
  }

  const { data: createdBrand, error: insertErr } = await supabase
    .from('brands')
    .insert({ name: cleanBrand })
    .select('id')
    .single()

  if (insertErr || !createdBrand) {
    throw new Error(`Failed to create brand "${cleanBrand}": ${insertErr?.message}`)
  }

  console.log(`  [Brand] Created brand "${cleanBrand}" (${createdBrand.id})`)
  brandMap.set(lookupKey, createdBrand.id)
  return createdBrand.id
}

/**
 * Resolves a note against the preloaded in-memory dictionary (`noteMap`).
 * - If it exists in `noteMap` (global or existing local), returns the UUID immediately with 0 DB queries.
 * - If it does NOT exist in `noteMap`, inserts it into `public.notes` with `shop_id: shopId`
 *   AND the explicit `layer` ('top' | 'middle' | 'base') from the CSV column, then caches it in `noteMap`.
 */
async function resolveOrCreateNoteId(
  supabase: SupabaseClient,
  csvNoteName: string,
  layer: NoteLayer,
  shopId: string,
  defaultCategoryId: string,
  noteMap: Map<string, CachedNoteEntry>
): Promise<string | null> {
  if (!csvNoteName || !csvNoteName.trim()) return null

  const normalizedName = csvNoteName.toLowerCase().trim()
  const cleanName = csvNoteName.trim()

  const existing = noteMap.get(normalizedName)
  if (existing) {
    if (existing.isGlobal) {
      console.log(`  Linked global note ${existing.name_en}`)
    } else {
      console.log(`  Linked local note ${existing.name_en}`)
    }
    return existing.id
  }

  // Insert new client-specific custom note WITH explicit `layer` ('top' | 'middle' | 'base') and `shop_id`
  const { data: createdLocalNote, error: createNoteErr } = await supabase
    .from('notes')
    .insert({
      category_id: defaultCategoryId,
      name_en: cleanName,
      name_fr: cleanName,
      name_ar: cleanName,
      layer: layer,
      shop_id: shopId,
    })
    .select('id')
    .single()

  if (createNoteErr || !createdLocalNote) {
    throw new Error(
      `Failed to insert custom local note "${cleanName}" (layer: ${layer}) for shop ${shopId}: ${createNoteErr?.message}`
    )
  }

  noteMap.set(normalizedName, {
    id: createdLocalNote.id,
    name_en: cleanName,
    layer: layer,
    isGlobal: false,
  })

  console.log(`  Created local note ${cleanName} (layer: ${layer})`)
  return createdLocalNote.id
}

async function main(): Promise<void> {
  const [shopIdArg, csvPathArg] = process.argv.slice(2)

  if (!shopIdArg || !csvPathArg) {
    console.error(
      'Usage: npx ts-node scripts/ingestClientCatalog.ts <shop_id> <path_to_csv>'
    )
    process.exit(1)
  }

  const shopId = shopIdArg.trim()
  if (!UUID_REGEX.test(shopId)) {
    throw new Error(`Invalid <shop_id> UUID provided: "${shopId}"`)
  }

  const resolvedCsvPath = path.resolve(process.cwd(), csvPathArg)
  if (!fs.existsSync(resolvedCsvPath)) {
    throw new Error(`CSV file not found at path: "${resolvedCsvPath}"`)
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL environment variable.')
  }

  if (!serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. A service role key is required to bypass RLS during ingestion.'
    )
  }

  // Initialize Supabase client with SUPABASE_SERVICE_ROLE_KEY to bypass RLS
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  console.log('============================================================')
  console.log('Starting Multi-Tenant Catalog Ingestion')
  console.log(`Target Shop ID : ${shopId}`)
  console.log(`CSV Source     : ${resolvedCsvPath}`)
  console.log('============================================================')

  // Verify or provision the target shop in `public.shops`
  const { data: existingShop, error: shopCheckErr } = await supabase
    .from('shops')
    .select('id, name')
    .eq('id', shopId)
    .maybeSingle()

  if (shopCheckErr) {
    throw new Error(`Failed to verify shop in public.shops: ${shopCheckErr.message}`)
  }

  if (!existingShop) {
    const { error: createShopErr } = await supabase
      .from('shops')
      .insert({ id: shopId, name: `Shop ${shopId.slice(0, 8)}` })

    if (createShopErr) {
      throw new Error(
        `Shop ID ${shopId} does not exist in public.shops and could not be auto-provisioned: ${createShopErr.message}`
      )
    }
    console.log(`[Shop] Auto-provisioned shop record in public.shops for ${shopId}`)
  } else {
    console.log(`[Shop] Verified tenant shop: "${existingShop.name}" (${existingShop.id})`)
  }

  const csvContent = fs.readFileSync(resolvedCsvPath, 'utf-8')
  const rows = parseCsv(csvContent)

  if (rows.length === 0) {
    console.warn('No perfume rows found in CSV. Exiting.')
    return
  }

  console.log(`Parsed ${rows.length} perfume(s) from CSV.\n`)

  // Preload default category, all global/local notes, and brands ONCE at startup
  const defaultCategoryId = await resolveDefaultCategoryId(supabase)
  const noteMap = await preloadNotesDictionary(supabase, shopId)
  const brandMap = await preloadBrandsDictionary(supabase)
  console.log('')

  // Accumulate all `perfume_notes` relationships for batch insertion at the end
  const allPerfumeNoteLinks: PerfumeNoteJunctionRow[] = []
  let ingestedPerfumesCount = 0

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx]
    console.log(
      `[${idx + 1}/${rows.length}] Processing perfume: "${row.perfume_name}" by "${row.brand}"`
    )

    // 1. Resolve or create Brand via in-memory dictionary
    const brandId = await resolveOrCreateBrandId(supabase, row.brand, brandMap)

    // 2. Resolve Global or create Local Notes across Top ('top'), Heart ('middle'), and Base ('base') layers
    const layerColumns: Array<{ raw: string; layer: NoteLayer }> = [
      { raw: row.top_notes, layer: 'top' },
      { raw: row.heart_notes, layer: 'middle' },
      { raw: row.base_notes, layer: 'base' },
    ]

    const currentPerfumeNotes = new Map<string, NoteLayer>()

    for (const { raw, layer } of layerColumns) {
      const noteNames = splitNoteList(raw)
      for (const noteName of noteNames) {
        const noteId = await resolveOrCreateNoteId(
          supabase,
          noteName,
          layer,
          shopId,
          defaultCategoryId,
          noteMap
        )
        if (!noteId) continue
        if (!currentPerfumeNotes.has(noteId)) {
          currentPerfumeNotes.set(noteId, layer)
        }
      }
    }

    // 3. Insert the perfume into `public.perfumes` tagged with the client's `shop_id`
    const { data: insertedPerfume, error: perfumeInsertErr } = await supabase
      .from('perfumes')
      .insert({
        shop_id: shopId,
        brand_id: brandId,
        name: row.perfume_name.trim(),
        gender: normalizeGender(row.gender),
        concentration: 'edp',
        price: 0,
        volume_ml: 100,
        in_stock: true,
        season_tags: [],
        occasion_tags: [],
        image_url: row.image_url.trim() || null,
        description_en: row.description.trim() || null,
        description_fr: row.description.trim() || null,
        description_ar: row.description.trim() || null,
      })
      .select('id')
      .single()

    if (perfumeInsertErr || !insertedPerfume) {
      throw new Error(
        `Failed to insert perfume "${row.perfume_name}": ${perfumeInsertErr?.message}`
      )
    }

    // 4. Accumulate `perfume_notes` junction rows for bulk insertion
    for (const [note_id, layer] of currentPerfumeNotes.entries()) {
      allPerfumeNoteLinks.push({
        perfume_id: insertedPerfume.id,
        note_id,
        layer,
      })
    }

    ingestedPerfumesCount++
    console.log(
      `  -> Inserted perfume "${row.perfume_name}" (${insertedPerfume.id}) [queued ${currentPerfumeNotes.size} note link(s)]\n`
    )
  }

  // 5. Bulk insert accumulated `perfume_notes` relationships in batches of 100
  if (allPerfumeNoteLinks.length > 0) {
    console.log(
      `[Batch Insert] Inserting ${allPerfumeNoteLinks.length} perfume_notes relationship(s) in batches of ${BATCH_SIZE}...`
    )

    for (let i = 0; i < allPerfumeNoteLinks.length; i += BATCH_SIZE) {
      const batch = allPerfumeNoteLinks.slice(i, i + BATCH_SIZE)
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1
      const totalBatches = Math.ceil(allPerfumeNoteLinks.length / BATCH_SIZE)

      const { error: batchErr } = await supabase
        .from('perfume_notes')
        .upsert(batch, { onConflict: 'perfume_id,note_id' })

      if (batchErr) {
        throw new Error(
          `Failed during perfume_notes batch ${batchNumber}/${totalBatches}: ${batchErr.message}`
        )
      }

      console.log(
        `  [Batch ${batchNumber}/${totalBatches}] Linked ${batch.length} perfume_notes row(s).`
      )
    }
  }

  console.log('\n============================================================')
  console.log(
    `Ingestion Complete: ${ingestedPerfumesCount}/${rows.length} perfume(s) and ${allPerfumeNoteLinks.length} note link(s) ingested for shop ${shopId}.`
  )
  console.log('============================================================')
}

main().catch((err) => {
  console.error('\n[FATAL INGESTION ERROR]:', err instanceof Error ? err.message : err)
  process.exit(1)
})
