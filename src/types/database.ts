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
}
