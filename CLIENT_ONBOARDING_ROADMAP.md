# New Client B2B Onboarding Roadmap (`ParfumWorld` Multi-Tenant Engine)

This guide contains the exact, copy-paste-ready SQL snippets, catalog ingestion templates, Vercel deployment checklist, and Day-1 handover steps to onboard a new perfume boutique client with strict multi-tenant data isolation and an automatic 3-day trial window.

---

## 1. Register a New Shop Tenant & Owner Account (Supabase SQL Editor)

### Step 1A: Create the Shop Owner User in Supabase Auth
1. Open **Supabase Dashboard → Authentication → Users → Add User → Create New User**.
2. Enter the client's email (e.g. `owner@clientboutique.dz`) and a temporary password (at least 8 characters, e.g. `RoyalOud#2026`), and check **Auto Confirm User**.
3. Copy the newly created user's **Auth User UUID** (or let the SQL snippet below look it up automatically by email).

### Step 1B: Provision the Shop Row (Starts 3-Day Trial) & Link Admin Ownership
Run the following SQL block in the **Supabase SQL Editor** (replace the placeholder values in the `params` CTE):

```sql
-- ============================================================================
-- STEP 1B: PROVISION NEW SHOP TENANT (3-DAY TRIAL) & LINK OWNER ACCOUNT
-- ============================================================================
WITH params AS (
  SELECT
    'owner@clientboutique.dz'::text AS owner_email,
    'دار العود الملكي'::text        AS initial_shop_name,
    'اكتشف توقيعك العطري'::text     AS initial_slogan,
    '213550123456'::text            AS initial_whatsapp
),
new_shop AS (
  INSERT INTO public.shops (
    name,
    shop_name,
    slogan,
    whatsapp_number,
    subscription_status,
    trial_ends_at
  )
  SELECT
    p.initial_shop_name,
    p.initial_shop_name,
    p.initial_slogan,
    p.initial_whatsapp,
    'trial',
    now() + interval '3 days'
  FROM params p
  RETURNING id, shop_name, subscription_status, trial_ends_at
),
target_user AS (
  SELECT u.id AS user_id
  FROM auth.users u
  JOIN params p ON lower(u.email) = lower(p.owner_email)
  LIMIT 1
),
link_admin AS (
  INSERT INTO public.admins (id, shop_id)
  SELECT tu.user_id, ns.id
  FROM target_user tu
  CROSS JOIN new_shop ns
  ON CONFLICT (id) DO UPDATE
    SET shop_id = EXCLUDED.shop_id
  RETURNING id, shop_id
),
stamp_jwt AS (
  UPDATE auth.users u
  SET raw_app_meta_data = COALESCE(u.raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object('shop_id', (SELECT id::text FROM new_shop))
  WHERE u.id = (SELECT user_id FROM target_user)
  RETURNING u.id
)
SELECT
  ns.id                  AS new_shop_id,
  ns.shop_name,
  ns.subscription_status,
  ns.trial_ends_at,
  la.id                  AS linked_admin_user_id
FROM new_shop ns
LEFT JOIN link_admin la ON la.shop_id = ns.id;
```

> **Important:** Copy the returned `new_shop_id` UUID — you will use it in Step 2 (Catalog Seeding) and Step 3 (`VITE_SHOP_ID` in Vercel).

---

## 2. Seed / Import the Client's Perfume Catalog & Verify Tenant Isolation

You can seed a client's catalog either via the **Automated CSV Ingestion CLI** (`scripts/ingestClientCatalog.ts`) or directly via **SQL Template** in the Supabase SQL Editor.

### Option A: Automated CSV Ingestion CLI (Recommended for 20+ Perfumes)
Run from the project root with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set in `.env`:

```bash
npx tsx scripts/ingestClientCatalog.ts --shopId "<NEW_SHOP_UUID>" --csv "./client_catalog.csv"
```

- Automatically normalizes note names (`.toLowerCase().trim()`), reuses global notes (`shop_id IS NULL`), creates shop-isolated custom notes (`shop_id = <NEW_SHOP_UUID>`) only when a note doesn't exist globally, and upserts `perfumes` + `perfume_notes` strictly scoped to `<NEW_SHOP_UUID>`.

### Option B: Direct SQL Template (Copy-Paste in Supabase SQL Editor)
Replace `<NEW_SHOP_UUID>` with the UUID returned in Step 1B:

```sql
-- ============================================================================
-- STEP 2: SEED CLIENT PERFUME, BRAND, CUSTOM NOTE & 3-TIER SCENT PYRAMID
-- ============================================================================
DO $$
DECLARE
  v_shop_id    uuid := '<NEW_SHOP_UUID>'::uuid;
  v_brand_id   uuid;
  v_perfume_id uuid;
  v_top_note   uuid;
  v_heart_note uuid;
  v_base_note  uuid;
BEGIN
  -- 1. Resolve or insert brand
  SELECT id INTO v_brand_id FROM public.brands WHERE lower(name) = lower('Xerjoff') LIMIT 1;
  IF v_brand_id IS NULL THEN
    INSERT INTO public.brands (name, country)
    VALUES ('Xerjoff', 'Italy')
    RETURNING id INTO v_brand_id;
  END IF;

  -- 2. Insert perfume strictly scoped to v_shop_id
  INSERT INTO public.perfumes (
    shop_id,
    brand_id,
    name,
    gender,
    concentration,
    price,
    volume_ml,
    family,
    in_stock,
    is_dupe_of,
    image_url,
    description_ar,
    description_en,
    description_fr
  )
  VALUES (
    v_shop_id,
    v_brand_id,
    'Alexandria II',
    'unisex',
    'parfum',
    45000,
    100,
    'Oriental Woody',
    true,
    NULL,
    'https://your-cdn-or-storage-url/alexandria-ii.webp',
    'تحفة شرقية فاخرة تمزج الخزامى وخشب الورد مع العود الملكي والعنبر والفانيليا.',
    'A regal oriental woody fragrance blending lavender, rosewood, royal oud, and amber.',
    'Un parfum oriental boisé mêlant lavande, bois de rose, oud royal et ambre.'
  )
  RETURNING id INTO v_perfume_id;

  -- 3. Resolve global notes (or create shop-isolated custom notes if needed)
  SELECT id INTO v_top_note   FROM public.notes WHERE lower(name_en) = 'lavender' AND (shop_id IS NULL OR shop_id = v_shop_id) LIMIT 1;
  SELECT id INTO v_heart_note FROM public.notes WHERE lower(name_en) = 'rose'     AND (shop_id IS NULL OR shop_id = v_shop_id) LIMIT 1;
  SELECT id INTO v_base_note  FROM public.notes WHERE lower(name_en) = 'oud'      AND (shop_id IS NULL OR shop_id = v_shop_id) LIMIT 1;

  -- 4. Link 3-Tier Fragrance Pyramid (Top / Middle / Base)
  IF v_top_note IS NOT NULL THEN
    INSERT INTO public.perfume_notes (perfume_id, note_id, layer)
    VALUES (v_perfume_id, v_top_note, 'top')
    ON CONFLICT DO NOTHING;
  END IF;

  IF v_heart_note IS NOT NULL THEN
    INSERT INTO public.perfume_notes (perfume_id, note_id, layer)
    VALUES (v_perfume_id, v_heart_note, 'middle')
    ON CONFLICT DO NOTHING;
  END IF;

  IF v_base_note IS NOT NULL THEN
    INSERT INTO public.perfume_notes (perfume_id, note_id, layer)
    VALUES (v_perfume_id, v_base_note, 'base')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
```

### Step 2C: Quick RLS & Tenant Isolation Verification Query
Run this query in the **Supabase SQL Editor** to confirm that the new shop only sees its own perfumes and global/own notes:

```sql
-- Verify exact perfume count and public profile for the new tenant
SELECT
  s.id AS shop_id,
  s.shop_name,
  s.subscription_status,
  s.trial_ends_at,
  public.check_shop_access(s.id)       AS lock_check,
  public.get_shop_public_profile(s.id) AS public_profile,
  (SELECT count(*) FROM public.perfumes p WHERE p.shop_id = s.id) AS isolated_perfume_count,
  (SELECT count(*) FROM public.notes n WHERE n.shop_id = s.id)    AS custom_note_count
FROM public.shops s
WHERE s.id = '<NEW_SHOP_UUID>'::uuid;
```

---

## 3. Vercel Deployment & Environment Variable Checklist

Each B2B client gets their own lightweight Vercel deployment (or custom domain/subdomain) pointing to the same Git repository with their unique `VITE_SHOP_ID`:

1. In **Vercel Dashboard → Add New Project**, import this repository.
2. Under **Environment Variables**, configure the following **3 required variables** for **Production, Preview, and Development**:

```env
VITE_SUPABASE_URL=https://<YOUR_PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_PUBLIC_KEY>
VITE_SHOP_ID=<NEW_SHOP_UUID>
```

3. Click **Deploy**.
4. Verify SPA routing (`vercel.json` rewrites all routes to `/index.html`) by opening:
   - Customer Storefront: `https://<client-domain>.vercel.app/`
   - Owner Admin Login: `https://<client-domain>.vercel.app/admin/login`

---

## 4. Day-1 Client Handover & Full Subscription Activation

### Day-1 Handover Steps for the Shop Owner
Send the client their live URL (`https://<client-domain>.vercel.app`) and their temporary credentials:
1. **Sign In:** Go to `https://<client-domain>.vercel.app/admin/login` and sign in with the email and temporary password created in Step 1A.
2. **Customize Branding & Logo:** Open **الإعدادات العامة (General Settings) → الهوية والشعار (Tab 1)** to update the Shop Name, Personal Slogan, and upload their boutique logo (`PNG/JPG/WEBP` up to 2 MB, or keep/restore the default Royal Oud emblem).
3. **Configure WhatsApp, Google Maps & Socials:** Open **التواصل والموقع (Tab 2)** to enter their Algerian WhatsApp number (`05...` / `06...` / `07...` or `+213...`), Google Maps location link, and optional Instagram / Facebook / TikTok accounts.
4. **Change Password Immediately:** Open **الأمان وكلمة المرور (Tab 3)**, enter the temporary password in **كلمة المرور الحالية**, and set their private permanent password (minimum 8 characters).
5. **Confirm Sales:** Remind the owner that whenever a customer completes an order via WhatsApp (or in-store), they can click **تأكيد البيع (+1)** directly on the **طلبات واتساب بانتظار التأكيد** reminder banner in the Admin Dashboard (or on any perfume's details page) to keep their Top 5 Best Sellers chart accurate.

### 1-Line SQL to Activate Full Subscription Upon Payment
When the client pays after (or during) their 3-day trial, run this single statement in the **Supabase SQL Editor** to unlock their storefront permanently:

```sql
UPDATE public.shops SET subscription_status = 'active', trial_ends_at = now() + interval '100 years' WHERE id = '<NEW_SHOP_UUID>'::uuid;
```

To suspend a shop at any time (immediately displaying `TrialLockScreen.tsx`):

```sql
UPDATE public.shops SET subscription_status = 'suspended' WHERE id = '<NEW_SHOP_UUID>'::uuid;
```
