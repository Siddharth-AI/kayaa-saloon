// app/saloon-services/[slug]/layout.tsx
import { Metadata } from "next";

// ============================================================================
// ADVANCED SERVICE CATEGORY MAPPING (ALL 40+ CATEGORIES)
// ============================================================================

interface CategoryData {
  category: string;
  parentCategory: string;
  description: string;
  keywords: string[];
}

const CATEGORY_MAP: Record<string, CategoryData> = {
  // ===== HAIR SERVICES - FEMALE =====
  "hair cut & wash[female]": {
    category: "Hair Cut & Wash - Female",
    parentCategory: "Hair Services - Women",
    description: "Professional haircut and wash services for women",
    keywords: [
      "women haircut",
      "ladies hair wash",
      "female hair styling",
      "hair cut for women",
    ],
  },
  "hair cut & style (for female)": {
    category: "Hair Cut & Style - Female",
    parentCategory: "Hair Services - Women",
    description: "Expert haircut and styling for women",
    keywords: ["women hair styling", "ladies haircut", "female hair design"],
  },
  "hair styling": {
    category: "Hair Styling",
    parentCategory: "Hair Services",
    description: "Professional hair styling and design",
    keywords: ["hair styling", "hairstyle design", "professional styling"],
  },

  // ===== HAIR SERVICES - MALE =====
  "hair service – haircut men": {
    category: "Haircut - Men",
    parentCategory: "Hair Services - Men",
    description: "Expert haircut services for men",
    keywords: ["men haircut", "gents haircut", "male hair styling"],
  },
  "colour [male]": {
    category: "Hair Color - Men",
    parentCategory: "Hair Services - Men",
    description: "Professional hair coloring for men",
    keywords: ["men hair color", "gents hair dye", "male hair coloring"],
  },

  // ===== HAIR COLOR & HIGHLIGHTS =====
  "hair color": {
    category: "Hair Color",
    parentCategory: "Hair Color Services",
    description: "Professional hair coloring and dyeing",
    keywords: [
      "hair coloring",
      "hair dye",
      "color treatment",
      "permanent color",
    ],
  },
  "colour [female]": {
    category: "Hair Color - Female",
    parentCategory: "Hair Color Services",
    description: "Expert hair coloring for women",
    keywords: ["women hair color", "ladies hair dye", "female color treatment"],
  },
  "hair service - hair color women": {
    category: "Hair Color Services - Women",
    parentCategory: "Hair Color Services",
    description: "Comprehensive hair color services for women",
    keywords: ["women hair coloring", "ladies color services"],
  },
  "highlights [female]": {
    category: "Highlights - Female",
    parentCategory: "Hair Color Services",
    description: "Professional hair highlighting for women",
    keywords: ["hair highlights", "women highlights", "color highlights"],
  },
  "balayage highlights": {
    category: "Balayage Highlights",
    parentCategory: "Hair Color Services",
    description: "Expert balayage and ombré highlighting",
    keywords: ["balayage", "ombre highlights", "hand-painted highlights"],
  },

  // ===== HAIR TREATMENTS =====
  "hair service – hair spa": {
    category: "Hair Spa",
    parentCategory: "Hair Treatments",
    description: "Luxurious hair spa and deep conditioning",
    keywords: [
      "hair spa",
      "hair treatment",
      "deep conditioning",
      "hair therapy",
    ],
  },
  "hair spa": {
    category: "Hair Spa",
    parentCategory: "Hair Treatments",
    description: "Professional hair spa treatments",
    keywords: ["hair spa treatment", "scalp massage", "hair nourishment"],
  },
  kareting: {
    category: "Keratin Treatment",
    parentCategory: "Hair Treatments",
    description: "Professional keratin smoothing treatment",
    keywords: [
      "keratin treatment",
      "hair smoothing",
      "frizz control",
      "brazilian keratin",
    ],
  },
  "treatment blow dry": {
    category: "Treatment & Blow Dry",
    parentCategory: "Hair Treatments",
    description: "Hair treatment with professional blow dry",
    keywords: ["treatment blow dry", "styling with treatment"],
  },
  chemicals: {
    category: "Chemical Treatments",
    parentCategory: "Hair Treatments",
    description: "Advanced chemical hair treatments",
    keywords: ["chemical treatment", "perm", "relaxer", "rebonding"],
  },
  "hair naturica": {
    category: "Hair Naturica",
    parentCategory: "Hair Treatments",
    description: "Natural and organic hair treatments",
    keywords: ["natural hair treatment", "organic hair care"],
  },

  // ===== FACIAL SERVICES =====
  facial: {
    category: "Facial Treatments",
    parentCategory: "Face Care",
    description: "Professional facial treatments and skin care",
    keywords: [
      "facial",
      "face treatment",
      "skin care facial",
      "deep cleansing",
    ],
  },
  facial21: {
    category: "Premium Facial",
    parentCategory: "Face Care",
    description: "Advanced facial treatment service",
    keywords: ["premium facial", "advanced facial"],
  },
  "face care cleanups": {
    category: "Face Care Clean Ups",
    parentCategory: "Face Care",
    description: "Professional face cleanup and cleansing",
    keywords: ["face cleanup", "skin cleansing", "deep pore cleaning"],
  },
  "face clean up": {
    category: "Face Clean Up",
    parentCategory: "Face Care",
    description: "Basic face cleanup service",
    keywords: ["basic cleanup", "face cleansing"],
  },
  "clean ups": {
    category: "Clean Up Services",
    parentCategory: "Face Care",
    description: "Skin cleanup and cleansing services",
    keywords: ["cleanup", "cleansing service"],
  },
  mask: {
    category: "Face Mask",
    parentCategory: "Face Care",
    description: "Professional face mask treatments",
    keywords: ["face mask", "treatment mask", "hydrating mask"],
  },

  // ===== BLEACH & DE-TAN =====
  bleach: {
    category: "Bleach",
    parentCategory: "Face Care",
    description: "Professional skin bleaching and lightening",
    keywords: ["bleach", "skin lightening", "facial bleach"],
  },
  "de-tan": {
    category: "De-Tan",
    parentCategory: "Face Care",
    description: "De-tan and tan removal treatments",
    keywords: ["de-tan", "tan removal", "skin brightening"],
  },

  // ===== THREADING & WAXING =====
  "threading & peel off": {
    category: "Threading & Peel Off",
    parentCategory: "Hair Removal",
    description: "Threading and peel-off hair removal",
    keywords: ["threading", "peel off mask", "facial hair removal"],
  },
  threading: {
    category: "Threading",
    parentCategory: "Hair Removal",
    description: "Professional threading services",
    keywords: ["eyebrow threading", "face threading", "upper lip threading"],
  },
  "waxing [reg] female": {
    category: "Waxing Regular - Female",
    parentCategory: "Hair Removal - Women",
    description: "Regular waxing services for women",
    keywords: ["women waxing", "ladies waxing", "body waxing"],
  },
  "waxing [p] female": {
    category: "Waxing Premium - Female",
    parentCategory: "Hair Removal - Women",
    description: "Premium waxing services for women",
    keywords: ["premium waxing", "luxury waxing", "full body wax"],
  },

  // ===== BODY TREATMENTS =====
  "body polishing reg": {
    category: "Body Polishing",
    parentCategory: "Body Treatments",
    description: "Full body polishing and exfoliation",
    keywords: ["body polishing", "body scrub", "body exfoliation"],
  },
  reflexology: {
    category: "Reflexology",
    parentCategory: "Body Treatments",
    description: "Professional reflexology and massage",
    keywords: ["reflexology", "pressure point massage", "foot massage"],
  },

  // ===== BRIDAL & MAKEUP =====
  "bridal & make up": {
    category: "Bridal & Makeup",
    parentCategory: "Makeup Services",
    description: "Bridal makeup and special occasion styling",
    keywords: ["bridal makeup", "wedding makeup", "party makeup"],
  },
  "make up": {
    category: "Makeup",
    parentCategory: "Makeup Services",
    description: "Professional makeup services",
    keywords: ["makeup", "professional makeup", "party makeup"],
  },

  // ===== HAND & FOOT CARE =====
  "hand & foot care": {
    category: "Hand & Foot Care",
    parentCategory: "Grooming Services",
    description: "Comprehensive hand and foot care",
    keywords: ["hand care", "foot care", "manicure pedicure"],
  },
  manicure2: {
    category: "Manicure",
    parentCategory: "Nail Services",
    description: "Professional manicure services",
    keywords: ["manicure", "nail care", "hand treatment"],
  },
  pedicure: {
    category: "Pedicure",
    parentCategory: "Nail Services",
    description: "Professional pedicure services",
    keywords: ["pedicure", "foot care", "nail polish"],
  },
  "nail art": {
    category: "Nail Art",
    parentCategory: "Nail Services",
    description: "Creative nail art and designs",
    keywords: ["nail art", "nail design", "decorative nails"],
  },

  // ===== SPECIALIZED SERVICES =====
  organic: {
    category: "Organic Services",
    parentCategory: "Specialized Services",
    description: "Organic and natural beauty treatments",
    keywords: ["organic treatment", "natural products", "chemical-free"],
  },
  "hair wig": {
    category: "Hair Wig Services",
    parentCategory: "Specialized Services",
    description: "Hair wig styling and maintenance",
    keywords: ["hair wig", "wig styling", "hair extension"],
  },
  paridhan: {
    category: "Paridhan Services",
    parentCategory: "Specialized Services",
    description: "Traditional beauty and grooming",
    keywords: ["traditional beauty", "ethnic styling"],
  },
  shaving21: {
    category: "Shaving Services",
    parentCategory: "Men's Grooming",
    description: "Professional shaving and grooming",
    keywords: ["shaving", "beard shave", "clean shave"],
  },

  // ===== COMBO PACKS =====
  "hair combo pack1": {
    category: "Hair Combo Package",
    parentCategory: "Combo Packages",
    description: "Complete hair care combo packages",
    keywords: ["hair combo", "hair package", "combo deal"],
  },

  // ===== TECHNICAL SERVICES =====
  "hair technicalservices (for female)": {
    category: "Hair Technical Services - Female",
    parentCategory: "Advanced Hair Services",
    description: "Advanced technical hair services for women",
    keywords: ["technical hair services", "advanced treatments"],
  },

  // ===== DEFAULT/FALLBACK =====
  "automation category": {
    category: "General Services",
    parentCategory: "Beauty Services",
    description: "Professional beauty and grooming services",
    keywords: ["beauty services", "salon services"],
  },
  service: {
    category: "Salon Services",
    parentCategory: "Beauty Services",
    description: "Professional salon services",
    keywords: ["salon service", "beauty treatment"],
  },
  hair: {
    category: "Hair Services",
    parentCategory: "Hair Care",
    description: "Professional hair care services",
    keywords: ["hair care", "hair treatment"],
  },
  "hair cut": {
    category: "Hair Cut",
    parentCategory: "Hair Services",
    description: "Professional haircut services",
    keywords: ["haircut", "hair cutting", "trim"],
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Get category data with fallback
const getCategoryData = (slug: string): CategoryData => {
  const normalizedSlug = slug.toLowerCase().replace(/-/g, " ");

  // Direct match
  if (CATEGORY_MAP[normalizedSlug]) {
    return CATEGORY_MAP[normalizedSlug];
  }

  // Partial match
  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (normalizedSlug.includes(key) || key.includes(normalizedSlug)) {
      return value;
    }
  }

  // Default fallback
  return {
    category: formatServiceName(slug),
    parentCategory: "Beauty Services",
    description: `Professional ${formatServiceName(
      slug
    ).toLowerCase()} service`,
    keywords: [slug.replace(/-/g, " "), "beauty service", "salon service"],
  };
};

// Format service name from slug
const formatServiceName = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Generate comprehensive keywords
const generateKeywords = (
  categoryData: CategoryData,
  serviceName: string
): string[] => {
  const baseKeywords = [
    "kaya beauty spa",
    "somerville ma",
    "beauty salon near me",
    "book appointment online",
    "professional salon",
  ];

  const locationKeywords = [
    `${serviceName.toLowerCase()} somerville`,
    `${serviceName.toLowerCase()} near me`,
    `${serviceName.toLowerCase()} boston area`,
    `best ${serviceName.toLowerCase()} somerville ma`,
  ];

  return [
    ...categoryData.keywords,
    ...locationKeywords,
    ...baseKeywords,
    serviceName.toLowerCase(),
    categoryData.category.toLowerCase(),
    categoryData.parentCategory.toLowerCase(),
  ];
};

// ============================================================================
// GENERATE METADATA (DYNAMIC)
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const serviceName = formatServiceName(slug);
  const categoryData = getCategoryData(slug);
  const keywords = generateKeywords(categoryData, serviceName);

  return {
    title: `${serviceName} - ${categoryData.category} | Kaya Beauty Spa`,
    description: `Book ${serviceName} at Kaya Beauty Spa in Somerville, MA. ${
      categoryData.description
    }. Expert ${categoryData.parentCategory.toLowerCase()} with premium products. Online booking available.`,

    keywords,

    openGraph: {
      title: `${serviceName} | Kaya Beauty Spa Somerville`,
      description: `Professional ${serviceName} service at Kaya Beauty Spa. ${categoryData.description}. Book your appointment online today!`,
      url: `https://kayaa-saloon.vercel.app/saloon-services/${slug}`,
      type: "website",
      images: [
        {
          url: `https://kayaa-saloon.vercel.app/og-service-${categoryData.parentCategory
            .toLowerCase()
            .replace(/\s+/g, "-")}.jpg`,
          width: 1200,
          height: 630,
          alt: `${serviceName} - ${categoryData.category} - Kaya Beauty Spa`,
        },
      ],
      siteName: "Kaya Beauty Spa",
      locale: "en_US",
    },

    twitter: {
      card: "summary_large_image",
      title: `${serviceName} | Kaya Beauty Spa`,
      description: `Professional ${serviceName} in Somerville, MA. ${categoryData.description}. Book now!`,
      images: [
        `https://kayaa-saloon.vercel.app/og-service-${categoryData.parentCategory
          .toLowerCase()
          .replace(/\s+/g, "-")}.jpg`,
      ],
    },

    alternates: {
      canonical: `https://kayaa-saloon.vercel.app/saloon-services/${slug}`,
    },

    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },

    other: {
      "service-category": categoryData.category,
      "parent-category": categoryData.parentCategory,
    },
  };
}

// ============================================================================
// LAYOUT COMPONENT
// ============================================================================

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
