import type { Note, NoteCategory, NoteLayer } from '../types/database'

/**
 * Strictly typed Olfactive Family IDs synchronized with `public.note_categories.family`
 * in `20260801200000_seed.sql` and `20260807200000_enrich_notes.sql`.
 */
export const OlfactiveFamilyID = {
  Floral: 'Floral',
  Woody: 'Woody',
  OrientalAmbery: 'Oriental/Ambery',
  FreshCitrus: 'Fresh/Citrus',
  Fruity: 'Fruity',
  GourmandSweet: 'Gourmand/Sweet',
  HerbalSpicy: 'Herbal/Spicy',
  LeatheryMusky: 'Leathery/Musky'
} as const

export type OlfactiveFamilyID =
  (typeof OlfactiveFamilyID)[keyof typeof OlfactiveFamilyID]

/**
 * Strictly typed conceptual Note IDs synchronized with canonical `public.notes.name_en` values.
 * Synonymous database strings (e.g., "Oud" and "Agarwood (Oud)", "Sea Notes" and "Sea Water")
 * map to a single conceptual `NoteID` inside `NOTE_NAME_LOOKUP` to prevent scoring dilution.
 */
export const NoteID = {
  // Floral & White Flowers
  Rose: 'Rose',
  Jasmine: 'Jasmine',
  Lavender: 'Lavender',
  Neroli: 'Neroli',
  YlangYlang: 'Ylang-Ylang',
  Tuberose: 'Tuberose',
  Peony: 'Peony',
  LilyOfTheValley: 'Lily of the Valley',
  Geranium: 'Geranium',
  Violet: 'Violet',
  Iris: 'Iris',
  OrangeBlossom: 'Orange Blossom',

  // Woody
  Sandalwood: 'Sandalwood',
  Cedarwood: 'Cedarwood',
  Patchouli: 'Patchouli',
  Vetiver: 'Vetiver',
  Oud: 'Oud',
  GuaiacWood: 'Guaiac Wood',
  CashmereWood: 'Cashmere Wood',
  Oakmoss: 'Oakmoss',
  Pine: 'Pine',
  Cypress: 'Cypress',
  Fir: 'Fir',
  Amberwood: 'Amberwood',
  Akigalawood: 'Akigalawood',

  // Oriental / Ambery & Resins
  Amber: 'Amber',
  Incense: 'Incense',
  Myrrh: 'Myrrh',
  Benzoin: 'Benzoin',
  Labdanum: 'Labdanum',
  Saffron: 'Saffron',
  Tobacco: 'Tobacco',
  OrientalSpices: 'Oriental Spices',

  // Fresh / Citrus & Greens
  Bergamot: 'Bergamot',
  Lemon: 'Lemon',
  Grapefruit: 'Grapefruit',
  Mandarin: 'Mandarin',
  Lime: 'Lime',
  BloodOrange: 'Blood Orange',
  Yuzu: 'Yuzu',
  Petitgrain: 'Petitgrain',
  LemonVerbena: 'Lemon Verbena',
  Mint: 'Mint',
  SeaNotes: 'Sea Notes',
  GreenTea: 'Green Tea',
  MatchaTea: 'Matcha Tea',
  BlackTea: 'Black Tea',
  GreenGrass: 'Green Grass',
  VioletLeaf: 'Violet Leaf',

  // Fruity
  Apple: 'Apple',
  Peach: 'Peach',
  Pear: 'Pear',
  Raspberry: 'Raspberry',
  Cherry: 'Cherry',
  Blackcurrant: 'Blackcurrant',
  Coconut: 'Coconut',
  Fig: 'Fig',
  Plum: 'Plum',
  Pineapple: 'Pineapple',
  Mango: 'Mango',
  Lychee: 'Lychee',
  Watermelon: 'Watermelon',
  Cucumber: 'Cucumber',

  // Gourmand / Sweet & Beverages
  Vanilla: 'Vanilla',
  Caramel: 'Caramel',
  Chocolate: 'Chocolate',
  Honey: 'Honey',
  TonkaBean: 'Tonka Bean',
  Almond: 'Almond',
  Praline: 'Praline',
  Coffee: 'Coffee',
  Chestnut: 'Chestnut',
  CottonCandy: 'Cotton Candy',
  Marshmallow: 'Marshmallow',
  Cupcake: 'Cupcake',
  Rum: 'Rum',
  Whiskey: 'Whiskey',
  Cognac: 'Cognac',
  Milk: 'Milk',

  // Herbal / Spicy
  Cinnamon: 'Cinnamon',
  Cardamom: 'Cardamom',
  BlackPepper: 'Black Pepper',
  PinkPepper: 'Pink Pepper',
  Ginger: 'Ginger',
  Basil: 'Basil',
  Rosemary: 'Rosemary',
  Sage: 'Sage',
  Thyme: 'Thyme',
  Nutmeg: 'Nutmeg',
  JuniperBerries: 'Juniper Berries',

  // Leathery / Musky & Synthetic
  Musk: 'Musk',
  Ambrette: 'Ambrette',
  Leather: 'Leather',
  Suede: 'Suede',
  Ambergris: 'Ambergris',
  Ambroxan: 'Ambroxan',
  IsoESuper: 'Iso E Super',
  Calone: 'Calone',
  Ozone: 'Ozone',
  Rain: 'Rain',
  Petrichor: 'Petrichor',
  Smoke: 'Smoke',
  MineralNotes: 'Mineral Notes'
} as const

export type NoteID = (typeof NoteID)[keyof typeof NoteID]

/**
 * Strictly lowercased lookup map from `public.notes.name_en` (`note.name_en.toLowerCase().trim()`)
 * to a single conceptual `NoteID`. Maps synonymous database rows (e.g., "oud" and "agarwood (oud)",
 * "sea notes", "sea water", and "sea salt") to the same `NoteID` to prevent scoring dilution.
 */
export const NOTE_NAME_LOOKUP: Record<string, NoteID> = {
  // Floral & White Flowers (with synonymous database names)
  'rose': NoteID.Rose,
  'damask rose': NoteID.Rose,
  'bulgarian rose': NoteID.Rose,
  'turkish rose': NoteID.Rose,
  'may rose': NoteID.Rose,
  'jasmine': NoteID.Jasmine,
  'indian jasmine': NoteID.Jasmine,
  'jasmine sambac': NoteID.Jasmine,
  'lavender': NoteID.Lavender,
  'neroli': NoteID.Neroli,
  'ylang-ylang': NoteID.YlangYlang,
  'tuberose': NoteID.Tuberose,
  'peony': NoteID.Peony,
  'lily of the valley': NoteID.LilyOfTheValley,
  'lily-of-the-valley': NoteID.LilyOfTheValley,
  'geranium': NoteID.Geranium,
  'violet': NoteID.Violet,
  'iris': NoteID.Iris,
  'orris': NoteID.Iris,
  'orris root': NoteID.Iris,
  'orange blossom': NoteID.OrangeBlossom,

  // Woody (with synonymous database names)
  'sandalwood': NoteID.Sandalwood,
  'cedarwood': NoteID.Cedarwood,
  'cedar': NoteID.Cedarwood,
  'atlas cedar': NoteID.Cedarwood,
  'virginia cedar': NoteID.Cedarwood,
  'patchouli': NoteID.Patchouli,
  'vetiver': NoteID.Vetiver,
  'oud': NoteID.Oud,
  'agarwood (oud)': NoteID.Oud,
  'agarwood': NoteID.Oud,
  'guaiac wood': NoteID.GuaiacWood,
  'cashmere wood': NoteID.CashmereWood,
  'cashmeran': NoteID.CashmereWood,
  'oakmoss': NoteID.Oakmoss,
  'pine': NoteID.Pine,
  'cypress': NoteID.Cypress,
  'fir': NoteID.Fir,
  'balsam fir': NoteID.Fir,
  'amberwood': NoteID.Amberwood,
  'akigalawood': NoteID.Akigalawood,

  // Oriental / Ambery & Resins
  'amber': NoteID.Amber,
  'incense': NoteID.Incense,
  'frankincense': NoteID.Incense,
  'olibanum': NoteID.Incense,
  'myrrh': NoteID.Myrrh,
  'benzoin': NoteID.Benzoin,
  'labdanum': NoteID.Labdanum,
  'saffron': NoteID.Saffron,
  'tobacco': NoteID.Tobacco,
  'oriental spices': NoteID.OrientalSpices,

  // Fresh / Citrus & Greens (with synonymous database names)
  'bergamot': NoteID.Bergamot,
  'lemon': NoteID.Lemon,
  'grapefruit': NoteID.Grapefruit,
  'mandarin': NoteID.Mandarin,
  'mandarin orange': NoteID.Mandarin,
  'lime': NoteID.Lime,
  'blood orange': NoteID.BloodOrange,
  'yuzu': NoteID.Yuzu,
  'petitgrain': NoteID.Petitgrain,
  'lemon verbena': NoteID.LemonVerbena,
  'verbena': NoteID.LemonVerbena,
  'mint': NoteID.Mint,
  'sea notes': NoteID.SeaNotes,
  'sea water': NoteID.SeaNotes,
  'sea salt': NoteID.SeaNotes,
  'marine notes': NoteID.SeaNotes,
  'green tea': NoteID.GreenTea,
  'matcha tea': NoteID.MatchaTea,
  'black tea': NoteID.BlackTea,
  'green grass': NoteID.GreenGrass,
  'grass': NoteID.GreenGrass,
  'violet leaf': NoteID.VioletLeaf,

  // Fruity (with synonymous database names)
  'apple': NoteID.Apple,
  'green apple': NoteID.Apple,
  'yellow apple': NoteID.Apple,
  'peach': NoteID.Peach,
  'pear': NoteID.Pear,
  'raspberry': NoteID.Raspberry,
  'cherry': NoteID.Cherry,
  'sour cherry': NoteID.Cherry,
  'blackcurrant': NoteID.Blackcurrant,
  'black currant': NoteID.Blackcurrant,
  'cassis': NoteID.Blackcurrant,
  'coconut': NoteID.Coconut,
  'fig': NoteID.Fig,
  'plum': NoteID.Plum,
  'pineapple': NoteID.Pineapple,
  'mango': NoteID.Mango,
  'lychee': NoteID.Lychee,
  'litchi': NoteID.Lychee,
  'watermelon': NoteID.Watermelon,
  'cucumber': NoteID.Cucumber,

  // Gourmand / Sweet & Beverages (with synonymous database names)
  'vanilla': NoteID.Vanilla,
  'madagascar vanilla': NoteID.Vanilla,
  'bourbon vanilla': NoteID.Vanilla,
  'caramel': NoteID.Caramel,
  'chocolate': NoteID.Chocolate,
  'dark chocolate': NoteID.Chocolate,
  'cocoa': NoteID.Chocolate,
  'cacao': NoteID.Chocolate,
  'honey': NoteID.Honey,
  'tonka bean': NoteID.TonkaBean,
  'tonka': NoteID.TonkaBean,
  'almond': NoteID.Almond,
  'bitter almond': NoteID.Almond,
  'praline': NoteID.Praline,
  'coffee': NoteID.Coffee,
  'chestnut': NoteID.Chestnut,
  'cotton candy': NoteID.CottonCandy,
  'marshmallow': NoteID.Marshmallow,
  'cupcake': NoteID.Cupcake,
  'rum': NoteID.Rum,
  'whiskey': NoteID.Whiskey,
  'cognac': NoteID.Cognac,
  'milk': NoteID.Milk,

  // Herbal / Spicy
  'cinnamon': NoteID.Cinnamon,
  'cardamom': NoteID.Cardamom,
  'black pepper': NoteID.BlackPepper,
  'pepper': NoteID.BlackPepper,
  'pink pepper': NoteID.PinkPepper,
  'ginger': NoteID.Ginger,
  'basil': NoteID.Basil,
  'rosemary': NoteID.Rosemary,
  'sage': NoteID.Sage,
  'clary sage': NoteID.Sage,
  'thyme': NoteID.Thyme,
  'nutmeg': NoteID.Nutmeg,
  'juniper berries': NoteID.JuniperBerries,
  'juniper': NoteID.JuniperBerries,

  // Leathery / Musky & Synthetic (with synonymous database names)
  'musk': NoteID.Musk,
  'white musk': NoteID.Musk,
  'ambrette': NoteID.Ambrette,
  'ambrette (musk mallow)': NoteID.Ambrette,
  'leather': NoteID.Leather,
  'suede': NoteID.Suede,
  'ambergris': NoteID.Ambergris,
  'ambroxan': NoteID.Ambroxan,
  'iso e super': NoteID.IsoESuper,
  'calone': NoteID.Calone,
  'ozone': NoteID.Ozone,
  'ozonic notes': NoteID.Ozone,
  'rain': NoteID.Rain,
  'petrichor': NoteID.Petrichor,
  'smoke': NoteID.Smoke,
  'mineral notes': NoteID.MineralNotes
}

/**
 * Strictly lowercased lookup map from `public.note_categories.family` and `name_en`
 * (`category.family.toLowerCase().trim()`) to `OlfactiveFamilyID`.
 */
export const FAMILY_NAME_LOOKUP: Record<string, OlfactiveFamilyID> = {
  'floral': OlfactiveFamilyID.Floral,
  'white flowers': OlfactiveFamilyID.Floral,
  'woody': OlfactiveFamilyID.Woody,
  'oriental/ambery': OlfactiveFamilyID.OrientalAmbery,
  'oriental': OlfactiveFamilyID.OrientalAmbery,
  'ambery': OlfactiveFamilyID.OrientalAmbery,
  'resins & balsams': OlfactiveFamilyID.OrientalAmbery,
  'fresh/citrus': OlfactiveFamilyID.FreshCitrus,
  'fresh': OlfactiveFamilyID.FreshCitrus,
  'citrus': OlfactiveFamilyID.FreshCitrus,
  'greens & herbs': OlfactiveFamilyID.FreshCitrus,
  'fruity': OlfactiveFamilyID.Fruity,
  'gourmand/sweet': OlfactiveFamilyID.GourmandSweet,
  'gourmand': OlfactiveFamilyID.GourmandSweet,
  'sweet': OlfactiveFamilyID.GourmandSweet,
  'beverages': OlfactiveFamilyID.GourmandSweet,
  'herbal/spicy': OlfactiveFamilyID.HerbalSpicy,
  'herbal': OlfactiveFamilyID.HerbalSpicy,
  'spicy': OlfactiveFamilyID.HerbalSpicy,
  'spices': OlfactiveFamilyID.HerbalSpicy,
  'leathery/musky': OlfactiveFamilyID.LeatheryMusky,
  'leathery': OlfactiveFamilyID.LeatheryMusky,
  'musk': OlfactiveFamilyID.LeatheryMusky,
  'musky': OlfactiveFamilyID.LeatheryMusky,
  'synthetic & abstract': OlfactiveFamilyID.LeatheryMusky
}

export interface QuizOptionWeight {
  /** Positive or negative weights keyed strictly by OlfactiveFamilyID */
  families?: Partial<Record<OlfactiveFamilyID, number>>
  /** Positive or negative weights keyed strictly by NoteID */
  notes?: Partial<Record<NoteID, number>>
  /** Optional layer emphasis (e.g., sillage/intensity questions) */
  layers?: Partial<Record<NoteLayer, number>>
}

export interface QuizOption {
  id: string
  labelKey: string
  subtitleKey: string
  fallbackLabel: {
    en: string
    fr: string
    ar: string
  }
  fallbackSubtitle: {
    en: string
    fr: string
    ar: string
  }
  weights: QuizOptionWeight
}

export interface QuizQuestion {
  id: string
  categoryTag: {
    en: string
    fr: string
    ar: string
  }
  titleKey: string
  fallbackTitle: {
    en: string
    fr: string
    ar: string
  }
  options: QuizOption[]
}

export interface FragrancePyramidSelection {
  top: Note[]
  heart: Note[]
  base: Note[]
  /** Representative Note objects (1 database row per winning NoteID) for clean UI rendering */
  uiNotes: Note[]
  /** Flat array of UUIDs for ALL synonymous database rows associated with the winning NoteIDs */
  rpcQueryIds: string[]
}

/**
 * Default universally appealing Fragrantica pyramid NoteIDs used as a silent fallback
 * whenever the quiz score tally yields fewer than `targetCount` (5) notes
 * (e.g., tied zero scores or skipped questions).
 * - Top: Bergamot, Lemon
 * - Heart: Rose, Jasmine
 * - Base: Musk, Vanilla
 */
export const SAFE_FALLBACK_NOTE_IDS: readonly NoteID[] = [
  NoteID.Bergamot,
  NoteID.Lemon,
  NoteID.Rose,
  NoteID.Jasmine,
  NoteID.Musk,
  NoteID.Vanilla
] as const

/**
 * Standalone experiential questionnaire mapped to Fragrantica's olfactive classification system
 * using strictly typed `OlfactiveFamilyID` and `NoteID` identifiers.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'atmosphere',
    categoryTag: {
      en: 'Atmosphere & Setting',
      fr: 'Atmosphère & Cadre',
      ar: 'الأجواء والمحيط'
    },
    titleKey: 'quiz_q1_title',
    fallbackTitle: {
      en: 'Which environment makes you feel most alive?',
      fr: 'Quel environnement vous fait sentir le plus vivant ?',
      ar: 'أي بيئة أو أجواء تجعلك تشعر بأقصى درجات الحيوية؟'
    },
    options: [
      {
        id: 'pine_forest',
        labelKey: 'quiz_q1_o1',
        subtitleKey: 'quiz_q1_o1_sub',
        fallbackLabel: {
          en: 'Crisp Pine Forest after Dawn',
          fr: 'Forêt de pins fraîche à l’aube',
          ar: 'غابة صنوبر ندية عند الفجر'
        },
        fallbackSubtitle: {
          en: 'Aromatic woods, cedar needles, damp moss & earthy vetiver',
          fr: 'Bois aromatiques, aiguilles de cèdre, mousse humide & vétiver terreux',
          ar: 'أخشاب عطرية، إبر الأرز، طحلب السنديان ونجيل الهند الترابي'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.Woody]: 5,
            [OlfactiveFamilyID.FreshCitrus]: 2,
            [OlfactiveFamilyID.HerbalSpicy]: 2,
            [OlfactiveFamilyID.GourmandSweet]: -4,
            [OlfactiveFamilyID.Fruity]: -2
          },
          notes: {
            [NoteID.Pine]: 8,
            [NoteID.Cedarwood]: 7,
            [NoteID.Vetiver]: 7,
            [NoteID.Oakmoss]: 6,
            [NoteID.Cypress]: 6,
            [NoteID.Fir]: 6,
            [NoteID.JuniperBerries]: 6,
            [NoteID.Rosemary]: 5,
            [NoteID.Sage]: 5,
            [NoteID.Bergamot]: 4,
            [NoteID.Patchouli]: 4,
            [NoteID.GreenGrass]: 4,
            [NoteID.CottonCandy]: -6,
            [NoteID.Caramel]: -6,
            [NoteID.Marshmallow]: -6,
            [NoteID.Vanilla]: -3,
            [NoteID.Coconut]: -4
          }
        }
      },
      {
        id: 'ocean_breeze',
        labelKey: 'quiz_q1_o2',
        subtitleKey: 'quiz_q1_o2_sub',
        fallbackLabel: {
          en: 'Sunlit Ocean Breeze & Coastal Cliffs',
          fr: 'Brise océanique ensoleillée & falaises côtières',
          ar: 'نسيم المحيط المشمس والمنحدرات الساحلية'
        },
        fallbackSubtitle: {
          en: 'Sparkling citrus, mineral sea salt, crisp ozone & driftwood',
          fr: 'Agrumes pétillants, sel marin minéral, ozone pur & bois flotté',
          ar: 'حمضيات مشرقة، ملح البحر المعدني، أوزون نقي وأخشاب طافية'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.FreshCitrus]: 6,
            [OlfactiveFamilyID.Fruity]: 2,
            [OlfactiveFamilyID.Floral]: 1,
            [OlfactiveFamilyID.OrientalAmbery]: -4,
            [OlfactiveFamilyID.LeatheryMusky]: -4,
            [OlfactiveFamilyID.GourmandSweet]: -3
          },
          notes: {
            [NoteID.SeaNotes]: 8,
            [NoteID.Bergamot]: 7,
            [NoteID.Lemon]: 6,
            [NoteID.Grapefruit]: 6,
            [NoteID.Mandarin]: 5,
            [NoteID.Lime]: 5,
            [NoteID.Mint]: 5,
            [NoteID.Neroli]: 5,
            [NoteID.Ambergris]: 5,
            [NoteID.Calone]: 6,
            [NoteID.Ozone]: 5,
            [NoteID.Sage]: 4,
            [NoteID.Oud]: -7,
            [NoteID.Tobacco]: -6,
            [NoteID.Leather]: -6,
            [NoteID.Cinnamon]: -4,
            [NoteID.Chocolate]: -5
          }
        }
      },
      {
        id: 'cozy_bakery',
        labelKey: 'quiz_q1_o3',
        subtitleKey: 'quiz_q1_o3_sub',
        fallbackLabel: {
          en: 'Cozy Parisian Patisserie & Roastery',
          fr: 'Pâtisserie parisienne chaleureuse & torréfaction',
          ar: 'مخبز باريسي دافئ ومحمصة قهوة فاخرة'
        },
        fallbackSubtitle: {
          en: 'Warm vanilla bean, roasted coffee, praline, almond & cinnamon',
          fr: 'Gousse de vanille chaude, café torréfié, praliné, amande & cannelle',
          ar: 'فانيليا دافئة، قهوة محمصة، برالين، لوز وقرفة'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.GourmandSweet]: 6,
            [OlfactiveFamilyID.OrientalAmbery]: 3,
            [OlfactiveFamilyID.Fruity]: 2,
            [OlfactiveFamilyID.FreshCitrus]: -4
          },
          notes: {
            [NoteID.Vanilla]: 8,
            [NoteID.Caramel]: 7,
            [NoteID.TonkaBean]: 7,
            [NoteID.Coffee]: 7,
            [NoteID.Chocolate]: 6,
            [NoteID.Praline]: 6,
            [NoteID.Almond]: 6,
            [NoteID.Cinnamon]: 6,
            [NoteID.Honey]: 5,
            [NoteID.Chestnut]: 5,
            [NoteID.Milk]: 5,
            [NoteID.Cardamom]: 5,
            [NoteID.Pear]: 4,
            [NoteID.Cherry]: 4,
            [NoteID.SeaNotes]: -6,
            [NoteID.Oakmoss]: -5,
            [NoteID.Vetiver]: -3,
            [NoteID.GreenGrass]: -5
          }
        }
      },
      {
        id: 'jazz_club',
        labelKey: 'quiz_q1_o4',
        subtitleKey: 'quiz_q1_o4_sub',
        fallbackLabel: {
          en: 'Midnight Velvet Jazz Club',
          fr: 'Club de jazz feutré à minuit',
          ar: 'نادي جاز ليلي فاخر بأجواء مخملية'
        },
        fallbackSubtitle: {
          en: 'Rich tobacco leaf, aged rum, supple leather, dark spices & oud',
          fr: 'Feuille de tabac riche, rhum vieilli, cuir souple, épices noires & oud',
          ar: 'أوراق التبغ الغنية، الروم المعتق، الجلود الفاخرة، التوابل والعود'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.OrientalAmbery]: 5,
            [OlfactiveFamilyID.LeatheryMusky]: 5,
            [OlfactiveFamilyID.Woody]: 4,
            [OlfactiveFamilyID.HerbalSpicy]: 4,
            [OlfactiveFamilyID.FreshCitrus]: -5,
            [OlfactiveFamilyID.Fruity]: -2
          },
          notes: {
            [NoteID.Tobacco]: 9,
            [NoteID.Leather]: 8,
            [NoteID.Oud]: 8,
            [NoteID.Vanilla]: 6,
            [NoteID.Rum]: 7,
            [NoteID.Whiskey]: 6,
            [NoteID.Cognac]: 6,
            [NoteID.Saffron]: 6,
            [NoteID.Cardamom]: 6,
            [NoteID.Cinnamon]: 5,
            [NoteID.Amber]: 6,
            [NoteID.TonkaBean]: 6,
            [NoteID.Sandalwood]: 5,
            [NoteID.PinkPepper]: 4,
            [NoteID.BlackPepper]: 5,
            [NoteID.Lemon]: -6,
            [NoteID.Lime]: -6,
            [NoteID.SeaNotes]: -7,
            [NoteID.Watermelon]: -6,
            [NoteID.Cucumber]: -6
          }
        }
      },
      {
        id: 'blooming_garden',
        labelKey: 'quiz_q1_o5',
        subtitleKey: 'quiz_q1_o5_sub',
        fallbackLabel: {
          en: 'Sun-Drenched Royal Rose & Jasmine Garden',
          fr: 'Jardin royal de roses et de jasmin baigné de soleil',
          ar: 'حديقة ملكية مشمسة تفيض بالورد والياسمين'
        },
        fallbackSubtitle: {
          en: 'Velvety petals, orange blossom, juicy lychee, peony & soft musk',
          fr: 'Pétales veloutés, fleur d’oranger, litchi juteux, pivoine & musc doux',
          ar: 'بتلات مخملية، زهر البرتقال، ليتشي عصيري، فاوانيا ومسك ناعم'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.Floral]: 6,
            [OlfactiveFamilyID.Fruity]: 3,
            [OlfactiveFamilyID.FreshCitrus]: 2,
            [OlfactiveFamilyID.LeatheryMusky]: -5
          },
          notes: {
            [NoteID.Rose]: 8,
            [NoteID.Jasmine]: 8,
            [NoteID.OrangeBlossom]: 7,
            [NoteID.Neroli]: 6,
            [NoteID.Peony]: 7,
            [NoteID.Tuberose]: 6,
            [NoteID.Iris]: 6,
            [NoteID.Violet]: 5,
            [NoteID.Lychee]: 6,
            [NoteID.Peach]: 5,
            [NoteID.Pear]: 5,
            [NoteID.Bergamot]: 5,
            [NoteID.Musk]: 5,
            [NoteID.Smoke]: -6,
            [NoteID.Leather]: -6,
            [NoteID.Tobacco]: -6,
            [NoteID.Oud]: -4
          }
        }
      }
    ]
  },
  {
    id: 'scent_memory',
    categoryTag: {
      en: 'Olfactive Memory',
      fr: 'Mémoire Olfactive',
      ar: 'الذاكرة العطرية'
    },
    titleKey: 'quiz_q2_title',
    fallbackTitle: {
      en: 'Which of these sensory memories captivates you most?',
      fr: 'Lequel de ces souvenirs sensoriels vous captive le plus ?',
      ar: 'أي من هذه الذكريات الحسية تأسر حواسك أكثر؟'
    },
    options: [
      {
        id: 'crushed_herbs_citrus',
        labelKey: 'quiz_q2_o1',
        subtitleKey: 'quiz_q2_o1_sub',
        fallbackLabel: {
          en: 'Freshly Crushed Herbs & Zesty Citrus Peel',
          fr: 'Herbes fraîchement froissées & zeste d’agrumes vif',
          ar: 'أعشاب طازجة مقطوفة وقشور حمضيات لاذعة'
        },
        fallbackSubtitle: {
          en: 'Calabrian bergamot, mint leaves, basil, ginger & green tea',
          fr: 'Bergamote de Calabre, feuilles de menthe, basilic, gingembre & thé vert',
          ar: 'برغموت كالابريا، أوراق النعناع، ريحان، زنجبيل وشاي أخضر'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.FreshCitrus]: 5,
            [OlfactiveFamilyID.HerbalSpicy]: 3,
            [OlfactiveFamilyID.GourmandSweet]: -3,
            [OlfactiveFamilyID.OrientalAmbery]: -2
          },
          notes: {
            [NoteID.Bergamot]: 8,
            [NoteID.Lemon]: 7,
            [NoteID.Grapefruit]: 7,
            [NoteID.Lime]: 6,
            [NoteID.Mandarin]: 6,
            [NoteID.Mint]: 7,
            [NoteID.Basil]: 7,
            [NoteID.Rosemary]: 6,
            [NoteID.GreenTea]: 7,
            [NoteID.MatchaTea]: 5,
            [NoteID.Ginger]: 6,
            [NoteID.LemonVerbena]: 5,
            [NoteID.Petitgrain]: 5,
            [NoteID.Vetiver]: 5,
            [NoteID.Caramel]: -5,
            [NoteID.Chocolate]: -5,
            [NoteID.Oud]: -4
          }
        }
      },
      {
        id: 'rain_earth_woods',
        labelKey: 'quiz_q2_o2',
        subtitleKey: 'quiz_q2_o2_sub',
        fallbackLabel: {
          en: 'Rain on Warm Stone & Precious Woods',
          fr: 'Pluie sur la pierre chaude & bois précieux',
          ar: 'مطر على صخور دافئة وأخشاب ثمينة'
        },
        fallbackSubtitle: {
          en: 'Creamy sandalwood, iris root, mineral ambroxan, fig & vetiver',
          fr: 'Bois de santal crémeux, racine d’iris, ambroxan minéral, figue & vétiver',
          ar: 'خشب الصندل الكريمي، السوسن، أمبروكسان معدني، تين ونجيل الهند'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.Woody]: 5,
            [OlfactiveFamilyID.FreshCitrus]: 2,
            [OlfactiveFamilyID.LeatheryMusky]: 2,
            [OlfactiveFamilyID.GourmandSweet]: -3
          },
          notes: {
            [NoteID.Sandalwood]: 8,
            [NoteID.Cedarwood]: 7,
            [NoteID.Vetiver]: 7,
            [NoteID.Iris]: 7,
            [NoteID.Fig]: 6,
            [NoteID.Ambroxan]: 7,
            [NoteID.IsoESuper]: 6,
            [NoteID.CashmereWood]: 6,
            [NoteID.MineralNotes]: 6,
            [NoteID.Petrichor]: 6,
            [NoteID.Rain]: 5,
            [NoteID.VioletLeaf]: 5,
            [NoteID.BlackTea]: 5,
            [NoteID.Cardamom]: 5,
            [NoteID.CottonCandy]: -6,
            [NoteID.Cupcake]: -6
          }
        }
      },
      {
        id: 'vanilla_nectar',
        labelKey: 'quiz_q2_o3',
        subtitleKey: 'quiz_q2_o3_sub',
        fallbackLabel: {
          en: 'Warm Vanilla Pod, Golden Honey & Ripe Orchard Fruits',
          fr: 'Gousse de vanille chaude, miel doré & fruits mûrs du verger',
          ar: 'قرون الفانيليا الدافئة، العسل الذهبي وفواكه البستان الناضجة'
        },
        fallbackSubtitle: {
          en: 'Madagascar vanilla, luscious peach, dark cherry, mango & tonka',
          fr: 'Vanille de Madagascar, pêche succulente, cerise noire, mangue & tonka',
          ar: 'فانيليا مدغشقر، خوخ غني، كرز داكن، مانجو وحبوب التونكا'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.GourmandSweet]: 5,
            [OlfactiveFamilyID.Fruity]: 5,
            [OlfactiveFamilyID.Floral]: 2,
            [OlfactiveFamilyID.FreshCitrus]: -2
          },
          notes: {
            [NoteID.Vanilla]: 8,
            [NoteID.TonkaBean]: 7,
            [NoteID.Honey]: 7,
            [NoteID.Peach]: 7,
            [NoteID.Cherry]: 7,
            [NoteID.Mango]: 6,
            [NoteID.Apple]: 6,
            [NoteID.Pear]: 6,
            [NoteID.Plum]: 6,
            [NoteID.Pineapple]: 5,
            [NoteID.Blackcurrant]: 5,
            [NoteID.Raspberry]: 5,
            [NoteID.Coconut]: 5,
            [NoteID.Almond]: 6,
            [NoteID.Caramel]: 6,
            [NoteID.Smoke]: -5,
            [NoteID.Leather]: -4,
            [NoteID.Oakmoss]: -4
          }
        }
      },
      {
        id: 'smoldering_incense',
        labelKey: 'quiz_q2_o4',
        subtitleKey: 'quiz_q2_o4_sub',
        fallbackLabel: {
          en: 'Smoldering Temple Incense, Resins & Exotic Spices',
          fr: 'Encens de temple fumant, résines & épices exotiques',
          ar: 'بخور المعابد المتصاعد، الراتنجات والتوابل الشرقية النادرة'
        },
        fallbackSubtitle: {
          en: 'Sacred frankincense, golden myrrh, red saffron, labdanum & amber',
          fr: 'Encens sacré, myrrhe dorée, safran rouge, labdanum & ambre',
          ar: 'اللبان المقدس، المر الذهبي، الزعفران الأحمر، اللابدانوم والعنبر'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.OrientalAmbery]: 6,
            [OlfactiveFamilyID.HerbalSpicy]: 5,
            [OlfactiveFamilyID.Woody]: 4,
            [OlfactiveFamilyID.LeatheryMusky]: 3,
            [OlfactiveFamilyID.FreshCitrus]: -4,
            [OlfactiveFamilyID.Fruity]: -3
          },
          notes: {
            [NoteID.Incense]: 9,
            [NoteID.Myrrh]: 8,
            [NoteID.Amber]: 8,
            [NoteID.Saffron]: 8,
            [NoteID.Cardamom]: 7,
            [NoteID.Cinnamon]: 6,
            [NoteID.Nutmeg]: 6,
            [NoteID.BlackPepper]: 6,
            [NoteID.Benzoin]: 7,
            [NoteID.Labdanum]: 7,
            [NoteID.Oud]: 7,
            [NoteID.Patchouli]: 6,
            [NoteID.Smoke]: 5,
            [NoteID.Leather]: 5,
            [NoteID.OrientalSpices]: 6,
            [NoteID.Watermelon]: -6,
            [NoteID.SeaNotes]: -5,
            [NoteID.Lemon]: -4
          }
        }
      }
    ]
  },
  {
    id: 'intensity_sillage',
    categoryTag: {
      en: 'Intensity & Sillage',
      fr: 'Intensité & Sillage',
      ar: 'الفوحان والتركيز'
    },
    titleKey: 'quiz_q3_title',
    fallbackTitle: {
      en: 'How do you want your fragrance to project around you?',
      fr: 'Comment souhaitez-vous que votre parfum se projette autour de vous ?',
      ar: 'كيف تريد لعطرك أن يعبّر عن حضورك وفوحانه حولك؟'
    },
    options: [
      {
        id: 'intimate_skin',
        labelKey: 'quiz_q3_o1',
        subtitleKey: 'quiz_q3_o1_sub',
        fallbackLabel: {
          en: 'Intimate Skin Scent & Clean Aura',
          fr: 'Parfum de peau intime & aura propre',
          ar: 'همسة قريبة من البشرة وهالة نقية هادئة'
        },
        fallbackSubtitle: {
          en: 'Discovered only by those who step close—white musk, iris & soft tea',
          fr: 'Découvert uniquement de près — musc blanc, iris & thé doux',
          ar: 'يكتشفه فقط من يقترب منك — مسك أبيض، سوسن وشاي ناعم'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.FreshCitrus]: 4,
            [OlfactiveFamilyID.Floral]: 3,
            [OlfactiveFamilyID.OrientalAmbery]: -3
          },
          layers: {
            top: 2,
            middle: 2
          },
          notes: {
            [NoteID.Musk]: 8,
            [NoteID.Ambrette]: 7,
            [NoteID.Iris]: 7,
            [NoteID.Ambroxan]: 6,
            [NoteID.IsoESuper]: 6,
            [NoteID.CashmereWood]: 6,
            [NoteID.GreenTea]: 6,
            [NoteID.MatchaTea]: 6,
            [NoteID.Neroli]: 5,
            [NoteID.Bergamot]: 5,
            [NoteID.Fig]: 5,
            [NoteID.Peony]: 5,
            [NoteID.Violet]: 5,
            [NoteID.Sandalwood]: 5,
            [NoteID.Oud]: -6,
            [NoteID.Incense]: -4,
            [NoteID.Tobacco]: -4
          }
        }
      },
      {
        id: 'balanced_elegance',
        labelKey: 'quiz_q3_o2',
        subtitleKey: 'quiz_q3_o2_sub',
        fallbackLabel: {
          en: 'Refined & Balanced Signature Trail',
          fr: 'Sillage signature raffiné & équilibré',
          ar: 'حضور راقٍ ومتوازن يترك انطباعاً أنيقاً'
        },
        fallbackSubtitle: {
          en: 'Noticeable and polished without overwhelming the room',
          fr: 'Remarquable et élégant sans jamais saturer l’espace',
          ar: 'ملحوظ ومصقول بأناقة دون أن يطغى بشكل مفرط'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.Woody]: 3,
            [OlfactiveFamilyID.Floral]: 3,
            [OlfactiveFamilyID.FreshCitrus]: 3,
            [OlfactiveFamilyID.Fruity]: 2
          },
          layers: {
            top: 2,
            middle: 3,
            base: 2
          },
          notes: {
            [NoteID.Bergamot]: 6,
            [NoteID.Lavender]: 7,
            [NoteID.Rose]: 6,
            [NoteID.Jasmine]: 6,
            [NoteID.Cedarwood]: 6,
            [NoteID.Vetiver]: 6,
            [NoteID.Sandalwood]: 6,
            [NoteID.Cardamom]: 5,
            [NoteID.Apple]: 5,
            [NoteID.Pineapple]: 5,
            [NoteID.Patchouli]: 5,
            [NoteID.OrangeBlossom]: 5,
            [NoteID.Geranium]: 5
          }
        }
      },
      {
        id: 'bold_statement',
        labelKey: 'quiz_q3_o3',
        subtitleKey: 'quiz_q3_o3_sub',
        fallbackLabel: {
          en: 'Magnetic & Commanding Room-Filler',
          fr: 'Présence magnétique & sillage puissant',
          ar: 'حضور طاغٍ وجاذبية تعلن عن وصولك فوراً'
        },
        fallbackSubtitle: {
          en: 'Announces your arrival with rich woods, spices, amber & deep base notes',
          fr: 'Annonce votre arrivée avec des bois riches, épices, ambre & notes profondes',
          ar: 'يعلن عن حضورك بنوتات عميقة من الأخشاب، التوابل، العنبر والعود'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.OrientalAmbery]: 5,
            [OlfactiveFamilyID.Woody]: 4,
            [OlfactiveFamilyID.HerbalSpicy]: 4,
            [OlfactiveFamilyID.LeatheryMusky]: 4,
            [OlfactiveFamilyID.GourmandSweet]: 3,
            [OlfactiveFamilyID.FreshCitrus]: -3
          },
          layers: {
            middle: 2,
            base: 3
          },
          notes: {
            [NoteID.Oud]: 8,
            [NoteID.Amber]: 7,
            [NoteID.Vanilla]: 7,
            [NoteID.Tobacco]: 7,
            [NoteID.Leather]: 7,
            [NoteID.Saffron]: 7,
            [NoteID.Patchouli]: 7,
            [NoteID.Incense]: 6,
            [NoteID.TonkaBean]: 6,
            [NoteID.Cinnamon]: 6,
            [NoteID.BlackPepper]: 5,
            [NoteID.Tuberose]: 6,
            [NoteID.Ambergris]: 5,
            [NoteID.Amberwood]: 6,
            [NoteID.Akigalawood]: 5
          }
        }
      }
    ]
  },
  {
    id: 'season_time',
    categoryTag: {
      en: 'Seasonality & Moment',
      fr: 'Saison & Moment',
      ar: 'الموسم والتوقيت'
    },
    titleKey: 'quiz_q4_title',
    fallbackTitle: {
      en: 'When do you envision wearing this fragrance most?',
      fr: 'À quel moment envisagez-vous de porter ce parfum ?',
      ar: 'في أي موسم أو توقيت تتخيل ارتداء هذا العطر؟'
    },
    options: [
      {
        id: 'summer_day',
        labelKey: 'quiz_q4_o1',
        subtitleKey: 'quiz_q4_o1_sub',
        fallbackLabel: {
          en: 'Radiant Summer Days & Mediterranean Sun',
          fr: 'Journées d’été radieuses & soleil méditerranéen',
          ar: 'أيام الصيف المشرقة وتحت شمس البحر المتوسط'
        },
        fallbackSubtitle: {
          en: 'Refreshing citrus, tropical fruits, neroli & cooling marine breeze',
          fr: 'Agrumes rafraîchissants, fruits tropicaux, néroli & brise marine',
          ar: 'حمضيات منعشة، فواكه استوائية، نيرولي ونسيم بحري بارد'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.FreshCitrus]: 5,
            [OlfactiveFamilyID.Fruity]: 4,
            [OlfactiveFamilyID.Floral]: 2,
            [OlfactiveFamilyID.OrientalAmbery]: -4,
            [OlfactiveFamilyID.LeatheryMusky]: -4
          },
          layers: {
            top: 3,
            middle: 2
          },
          notes: {
            [NoteID.Lemon]: 7,
            [NoteID.Bergamot]: 7,
            [NoteID.Grapefruit]: 7,
            [NoteID.BloodOrange]: 6,
            [NoteID.Mandarin]: 6,
            [NoteID.Lime]: 6,
            [NoteID.Yuzu]: 5,
            [NoteID.Neroli]: 6,
            [NoteID.SeaNotes]: 6,
            [NoteID.Coconut]: 6,
            [NoteID.Mango]: 6,
            [NoteID.Pineapple]: 6,
            [NoteID.Fig]: 6,
            [NoteID.Mint]: 6,
            [NoteID.Musk]: 5
          }
        }
      },
      {
        id: 'spring_day',
        labelKey: 'quiz_q4_o2',
        subtitleKey: 'quiz_q4_o2_sub',
        fallbackLabel: {
          en: 'Crisp Spring Mornings & Blooming Afternoons',
          fr: 'Matins printaniers frais & après-midis fleuris',
          ar: 'صباحات الربيع الندية وأوقات النهار المزهرة'
        },
        fallbackSubtitle: {
          en: 'Dewy florals, crisp pear, lavender, green leaves & clean cedar',
          fr: 'Fleurs fraîches, poire croquante, lavande, feuilles vertes & cèdre',
          ar: 'أزهار ندية، كمثرى مقرمشة، خزامى، أوراق خضراء وخشب الأرز'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.Floral]: 5,
            [OlfactiveFamilyID.FreshCitrus]: 3,
            [OlfactiveFamilyID.Fruity]: 3,
            [OlfactiveFamilyID.Woody]: 2,
            [OlfactiveFamilyID.OrientalAmbery]: -2
          },
          notes: {
            [NoteID.Rose]: 6,
            [NoteID.Jasmine]: 6,
            [NoteID.Peony]: 6,
            [NoteID.LilyOfTheValley]: 6,
            [NoteID.OrangeBlossom]: 6,
            [NoteID.Lavender]: 6,
            [NoteID.Pear]: 6,
            [NoteID.Lychee]: 6,
            [NoteID.Apple]: 5,
            [NoteID.Blackcurrant]: 5,
            [NoteID.Bergamot]: 5,
            [NoteID.GreenTea]: 5,
            [NoteID.Cedarwood]: 5,
            [NoteID.Vetiver]: 5,
            [NoteID.Musk]: 5
          }
        }
      },
      {
        id: 'autumn_evening',
        labelKey: 'quiz_q4_o3',
        subtitleKey: 'quiz_q4_o3_sub',
        fallbackLabel: {
          en: 'Golden Autumn Twilights & Lounge Gatherings',
          fr: 'Crépuscules dorés d’automne & soirées élégantes',
          ar: 'أمسيات الخريف الذهبية واللقاءات المسائية الراقية'
        },
        fallbackSubtitle: {
          en: 'Warm cardamom, sandalwood, roasted coffee, plum & suede',
          fr: 'Cardamome chaude, bois de santal, café torréfié, prune & daim',
          ar: 'هيل دافئ، خشب الصندل، قهوة محمصة، برقوق وجلد السويد'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.Woody]: 5,
            [OlfactiveFamilyID.HerbalSpicy]: 4,
            [OlfactiveFamilyID.GourmandSweet]: 3,
            [OlfactiveFamilyID.LeatheryMusky]: 3
          },
          notes: {
            [NoteID.Cardamom]: 8,
            [NoteID.Sandalwood]: 7,
            [NoteID.Patchouli]: 6,
            [NoteID.Vetiver]: 5,
            [NoteID.Cinnamon]: 6,
            [NoteID.Nutmeg]: 6,
            [NoteID.Saffron]: 6,
            [NoteID.Plum]: 6,
            [NoteID.Cherry]: 5,
            [NoteID.Coffee]: 6,
            [NoteID.Chestnut]: 6,
            [NoteID.Suede]: 6,
            [NoteID.Leather]: 5,
            [NoteID.Vanilla]: 5,
            [NoteID.TonkaBean]: 6
          }
        }
      },
      {
        id: 'winter_night',
        labelKey: 'quiz_q4_o4',
        subtitleKey: 'quiz_q4_o4_sub',
        fallbackLabel: {
          en: 'Cold Winter Nights & Formal Galas',
          fr: 'Nuits d’hiver glacées & soirées de gala',
          ar: 'ليالي الشتاء الباردة والسهرات الفاخرة'
        },
        fallbackSubtitle: {
          en: 'Opulent amber, dark oud, smoky vanilla, bourbon, myrrh & tobacco',
          fr: 'Ambre opulent, oud noir, vanille fumée, bourbon, myrrhe & tabac',
          ar: 'عنبر فاخر، عود داكن، فانيليا مدخنة، مر وتبغ'
        },
        weights: {
          families: {
            [OlfactiveFamilyID.OrientalAmbery]: 6,
            [OlfactiveFamilyID.GourmandSweet]: 4,
            [OlfactiveFamilyID.LeatheryMusky]: 4,
            [OlfactiveFamilyID.Woody]: 4,
            [OlfactiveFamilyID.HerbalSpicy]: 3,
            [OlfactiveFamilyID.FreshCitrus]: -4
          },
          layers: {
            middle: 2,
            base: 3
          },
          notes: {
            [NoteID.Amber]: 8,
            [NoteID.Oud]: 8,
            [NoteID.Vanilla]: 8,
            [NoteID.Tobacco]: 7,
            [NoteID.Myrrh]: 7,
            [NoteID.Incense]: 7,
            [NoteID.Benzoin]: 7,
            [NoteID.Labdanum]: 6,
            [NoteID.TonkaBean]: 7,
            [NoteID.Chocolate]: 6,
            [NoteID.Rum]: 6,
            [NoteID.Cinnamon]: 6,
            [NoteID.Leather]: 6,
            [NoteID.Smoke]: 5
          }
        }
      }
    ]
  }
]

/**
 * Resolves a database `Note` row to its strict conceptual `NoteID` value exclusively by matching
 * the database payload's `name_en` property (`note.name_en.toLowerCase().trim()`) against `NOTE_NAME_LOOKUP`.
 */
export function resolveDatabaseNoteId(note: Note): NoteID | undefined {
  if (!note.name_en) return undefined
  return NOTE_NAME_LOOKUP[note.name_en.toLowerCase().trim()]
}

/**
 * Resolves a database `NoteCategory` row to its strict `OlfactiveFamilyID` value
 * exclusively by matching the lowercased `family` and `name_en` string properties against `FAMILY_NAME_LOOKUP`.
 */
export function resolveDatabaseFamilyId(category?: NoteCategory): OlfactiveFamilyID | undefined {
  if (!category) return undefined

  const familyRaw = category.family?.toLowerCase().trim() || ''
  const nameRaw = category.name_en?.toLowerCase().trim() || ''

  return FAMILY_NAME_LOOKUP[familyRaw] ?? FAMILY_NAME_LOOKUP[nameRaw]
}

/**
 * Expands an array of representative UI `Note` objects into a flat deduplicated array of UUIDs
 * covering ALL synonymous database rows that share the same conceptual `NoteID`.
 */
export function expandNotesToRpcQueryIds(
  selectedUiNotes: Note[],
  allDatabaseNotes: Note[]
): string[] {
  if (!selectedUiNotes || selectedUiNotes.length === 0) return []

  const notesByNoteId = new Map<NoteID, Note[]>()
  for (const note of allDatabaseNotes) {
    const strictNoteId = resolveDatabaseNoteId(note)
    if (strictNoteId !== undefined) {
      const group = notesByNoteId.get(strictNoteId)
      if (group) {
        group.push(note)
      } else {
        notesByNoteId.set(strictNoteId, [note])
      }
    }
  }

  const rpcIds = new Set<string>()
  for (const uiNote of selectedUiNotes) {
    rpcIds.add(uiNote.id)
    const strictNoteId = resolveDatabaseNoteId(uiNote)
    if (strictNoteId !== undefined) {
      const synonyms = notesByNoteId.get(strictNoteId) || []
      for (const syn of synonyms) {
        rpcIds.add(syn.id)
      }
    }
  }

  return Array.from(rpcIds)
}

/**
 * Dynamically scores all database notes against the user's quiz answers using strict
 * `NoteID` and `OlfactiveFamilyID` lookups and builds a Fragrantica-accurate 3-tier pyramid:
 * - `uiNotes`: Exactly `targetCount` (5) distinct, representative `Note` objects (1 per winning `NoteID`).
 * - `rpcQueryIds`: Flat array of UUID strings for ALL synonymous database rows associated with the winning `NoteID`s.
 * - Silent fallback: If fewer than `targetCount` (5) positive notes are tallied, safely and silently
 *   injects universally appealing fallback notes (Top: Bergamot/Lemon, Heart: Rose/Jasmine, Base: Musk/Vanilla).
 */
export function calculateFragranticaPyramid(
  selectedOptionIds: string[],
  notes: Note[],
  categories: NoteCategory[],
  targetCount: number = 5
): FragrancePyramidSelection {
  if (!notes || notes.length === 0) {
    return { top: [], heart: [], base: [], uiNotes: [], rpcQueryIds: [] }
  }

  // Collect all chosen QuizOption objects
  const chosenOptions: QuizOption[] = []
  QUIZ_QUESTIONS.forEach((q, idx) => {
    const chosenId = selectedOptionIds[idx]
    if (!chosenId) return
    const found = q.options.find(opt => opt.id === chosenId)
    if (found) chosenOptions.push(found)
  })

  const categoryMap = new Map<string, NoteCategory>()
  categories.forEach(c => categoryMap.set(c.id, c))

  // Group all database Note rows by their resolved conceptual NoteID
  const notesByNoteId = new Map<NoteID, Note[]>()
  for (const note of notes) {
    const strictNoteId = resolveDatabaseNoteId(note)
    if (strictNoteId !== undefined) {
      const group = notesByNoteId.get(strictNoteId)
      if (group) {
        group.push(note)
      } else {
        notesByNoteId.set(strictNoteId, [note])
      }
    }
  }

  // Score every note in the catalog using strict ID lookups
  const scored = notes.map(note => {
    const strictNoteId = resolveDatabaseNoteId(note)
    const category = categoryMap.get(note.category_id)
    const strictFamilyId = resolveDatabaseFamilyId(category)

    let totalScore = 0
    let directNoteHits = 0

    for (const opt of chosenOptions) {
      const { families, notes: noteWeights, layers } = opt.weights

      // 1. Direct NoteID weight match
      if (noteWeights && strictNoteId !== undefined) {
        const weight = noteWeights[strictNoteId]
        if (typeof weight === 'number') {
          totalScore += weight
          if (weight > 0) directNoteHits += 1
        }
      }

      // 2. Strict OlfactiveFamilyID weight match
      if (families && strictFamilyId !== undefined) {
        const famWeight = families[strictFamilyId]
        if (typeof famWeight === 'number') {
          totalScore += famWeight
        }
      }

      // 3. Pyramid layer weight match
      if (layers && typeof layers[note.layer] === 'number') {
        totalScore += layers[note.layer]!
      }
    }

    // Synergy bonus for notes receiving direct positive hits across multiple questions
    totalScore += directNoteHits * 1.5

    return {
      note,
      strictNoteId,
      score: totalScore,
      directNoteHits
    }
  })

  // Filter out non-positive notes and sort descending by score
  const positiveScored = scored
    .filter(item => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.directNoteHits - a.directNoteHits
    })

  // Group positive candidates into Fragrantica pyramid layers: Top ('top'), Heart ('middle'), Base ('base')
  const topCandidates = positiveScored.filter(item => item.note.layer === 'top')
  const heartCandidates = positiveScored.filter(item => item.note.layer === 'middle')
  const baseCandidates = positiveScored.filter(item => item.note.layer === 'base')

  // Select balanced pyramid of conceptual winners: 1-2 Top, 2 Heart, 2 Base
  const topCount = targetCount >= 6 ? 2 : 1
  const heartCount = 2
  const baseCount = 2

  const selectedTop: Note[] = []
  const selectedHeart: Note[] = []
  const selectedBase: Note[] = []
  const uiNotes: Note[] = []
  const rpcQueryIdSet = new Set<string>()

  const usedConceptualKeys = new Set<string>()
  const usedUiNoteIds = new Set<string>()

  /**
   * Selects ONE canonical representative `Note` row for `uiNotes` (preventing UI duplicate badges),
   * while aggregating ALL synonymous database row UUIDs into `rpcQueryIdSet` for the backend RPC.
   */
  const addWinningConcept = (
    primaryNote: Note,
    strictNoteId?: NoteID
  ): boolean => {
    if (uiNotes.length >= targetCount) return false

    const conceptualKey =
      strictNoteId ?? `raw:${primaryNote.name_en.toLowerCase().trim()}`
    if (usedConceptualKeys.has(conceptualKey)) {
      return false
    }

    const matchingDbNotes =
      strictNoteId !== undefined
        ? notesByNoteId.get(strictNoteId) || [primaryNote]
        : [primaryNote]

    // Pick ONE representative Note object for UI display (preferring exact canonical NoteID name match)
    const canonicalTarget = strictNoteId?.toLowerCase().trim()
    const representativeNote =
      (canonicalTarget
        ? matchingDbNotes.find(
            n => n.name_en.toLowerCase().trim() === canonicalTarget
          )
        : undefined) || primaryNote

    if (usedUiNoteIds.has(representativeNote.id)) {
      return false
    }

    usedConceptualKeys.add(conceptualKey)
    usedUiNoteIds.add(representativeNote.id)
    uiNotes.push(representativeNote)

    if (representativeNote.layer === 'top') selectedTop.push(representativeNote)
    else if (representativeNote.layer === 'middle') selectedHeart.push(representativeNote)
    else selectedBase.push(representativeNote)

    // Push ALL synonymous database row UUIDs into rpcQueryIdSet
    for (const dbNote of matchingDbNotes) {
      rpcQueryIdSet.add(dbNote.id)
    }

    return true
  }

  const pickTierWinners = (
    candidates: (typeof positiveScored)[number][],
    maxConcepts: number
  ) => {
    let picked = 0
    for (const candidate of candidates) {
      if (picked >= maxConcepts || uiNotes.length >= targetCount) break
      if (addWinningConcept(candidate.note, candidate.strictNoteId)) {
        picked += 1
      }
    }
  }

  pickTierWinners(topCandidates, topCount)
  pickTierWinners(heartCandidates, heartCount)
  pickTierWinners(baseCandidates, baseCount)

  // Backfill from remaining positively scored notes if any tier had fewer winners than its quota
  if (uiNotes.length < targetCount) {
    for (const candidate of positiveScored) {
      if (uiNotes.length >= targetCount) break
      addWinningConcept(candidate.note, candidate.strictNoteId)
    }
  }

  // SAFE SILENT FALLBACK: If fewer than `targetCount` (5) notes were selected (e.g. tied zero scores or skipped questions),
  // silently inject universally appealing fallback NoteIDs (Top: Bergamot/Lemon, Heart: Rose/Jasmine, Base: Musk/Vanilla)
  if (uiNotes.length < targetCount) {
    for (const fallbackNoteId of SAFE_FALLBACK_NOTE_IDS) {
      if (uiNotes.length >= targetCount) break
      const matchingDbNotes = notesByNoteId.get(fallbackNoteId)
      if (matchingDbNotes && matchingDbNotes.length > 0) {
        addWinningConcept(matchingDbNotes[0], fallbackNoteId)
      }
    }
  }

  // Ultimate silent safety net if the database catalog is missing any of the standard fallback NoteIDs
  if (uiNotes.length < targetCount) {
    const remainingPool = [...scored].sort((a, b) => b.score - a.score)
    for (const candidate of remainingPool) {
      if (uiNotes.length >= targetCount) break
      addWinningConcept(candidate.note, candidate.strictNoteId)
    }
  }

  return {
    top: selectedTop,
    heart: selectedHeart,
    base: selectedBase,
    uiNotes,
    rpcQueryIds: Array.from(rpcQueryIdSet)
  }
}
