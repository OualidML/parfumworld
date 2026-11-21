export interface NoteCategory {
  id: string;
  family: string;
  name_ar: string;
  name_fr: string;
  name_en: string;
  icon_name: string;
}

export type NoteLayer = 'top' | 'middle' | 'base';

export interface Note {
  id: string;
  category_id: string;
  name_ar: string;
  name_fr: string;
  name_en: string;
  layer: NoteLayer;
  description_ar: string | null;
  shop_id?: string | null;
}

export interface ShopPublicProfile {
  shop_name: string;
  slogan: string;
  logo_url: string | null;
  whatsapp_number: string;
  location_url: string;
  instagram_handle: string;
  instagram_url: string;
  facebook_handle: string;
  facebook_url: string;
  tiktok_handle: string;
  tiktok_url: string;
}

export type WhatsappOrderIntentStatus = 'pending' | 'confirmed' | 'dismissed';

export interface WhatsappOrderIntent {
  id: string;
  shop_id: string;
  perfume_id: string;
  perfume_name: string;
  status: WhatsappOrderIntentStatus;
  created_at: string;
}
