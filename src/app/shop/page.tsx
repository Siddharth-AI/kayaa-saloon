// app/shop/page.tsx
import type { Metadata } from "next";
import ShopClient from "./components/ShopClient";

// ============================================================================
// METADATA - SHOP PAGE (E-COMMERCE)
// ============================================================================

export const metadata: Metadata = {
  title:
    "Shop Beauty Products Online - Premium Cosmetics & Skincare | Kaya Beauty Spa",
  description:
    "Shop premium beauty products: hair care, skin care, makeup, grooming essentials, dental care & wellness. GlyMed Plus, AVEDA, Dermalogica. Free shipping available.",

  keywords: [
    // Hair Care Products
    "hair shampoo online",
    "hair conditioner",
    "hair treatment products",
    "hair mask",
    "hair oil",
    "professional hair care",

    // Skin Care Products
    "facial cream",
    "moisturizer",
    "eye care products",
    "face skin care",
    "anti-aging cream",
    "hydrating moisturizer",

    // Makeup & Cosmetics
    "makeup products online",
    "face makeup",
    "eye makeup",
    "lip products",
    "makeup brushes",
    "cosmetics online",

    // Men's Grooming
    "men grooming products",
    "beard care",
    "men skincare",

    // General
    "beauty products online",
    "premium cosmetics",
    "glymed plus products",
    "aveda products",
    "dermalogica",
    "personal care products",
    "dental care products",
    "beauty shop online",
  ],

  openGraph: {
    title: "Shop Premium Beauty Products - Kaya Beauty Spa",
    description:
      "Discover luxury hair care, skin care, makeup & grooming products. GlyMed Plus, AVEDA, Dermalogica available. Shop now!",
    url: "https://kayaa-saloon.vercel.app/shop",
    type: "website",
    images: [
      {
        url: "https://kayaa-saloon.vercel.app/og-shop.jpg",
        width: 1200,
        height: 630,
        alt: "Kaya Beauty Spa - Premium Beauty Products Shop",
      },
    ],
    siteName: "Kaya Beauty Spa",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Shop Premium Beauty Products Online",
    description:
      "GlyMed Plus, AVEDA, Dermalogica & more. Luxury beauty essentials delivered.",
    images: ["https://kayaa-saloon.vercel.app/og-shop.jpg"],
  },

  alternates: {
    canonical: "https://kayaa-saloon.vercel.app/shop",
  },

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

// ============================================================================
// STRUCTURED DATA - PRODUCT CATALOG (COMPLETE)
// ============================================================================

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://kayaa-saloon.vercel.app/shop#webpage",
  name: "Kaya Beauty Spa Product Shop",
  description:
    "Premium beauty products catalog including hair care, skin care, makeup, and grooming essentials",
  url: "https://kayaa-saloon.vercel.app/shop",

  mainEntity: {
    "@type": "ItemList",
    name: "Beauty Products Catalog",
    numberOfItems: 100, // Update with actual count
    itemListElement: [
      // ===== HAIR CARE CATEGORY =====
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "ProductGroup",
          name: "Hair Care Products",
          description:
            "Professional shampoo, conditioner, treatment, masks & oils",
          hasVariant: [
            {
              "@type": "Product",
              name: "Shampoo",
              category: "Hair Care",
              brand: ["GlyMed Plus", "AVEDA", "Dermalogica"],
            },
            {
              "@type": "Product",
              name: "Conditioner",
              category: "Hair Care",
              brand: ["GlyMed Plus", "AVEDA"],
            },
            {
              "@type": "Product",
              name: "Hair Treatment",
              category: "Hair Care",
            },
            {
              "@type": "Product",
              name: "Hair Mask",
              category: "Hair Care",
            },
            {
              "@type": "Product",
              name: "Hair Oil",
              category: "Hair Care",
            },
          ],
        },
      },

      // ===== SKIN CARE CATEGORY =====
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "ProductGroup",
          name: "Skin Care Products",
          description:
            "Facial creams, moisturizers, eye care & face treatments",
          hasVariant: [
            {
              "@type": "Product",
              name: "Facial Cream",
              category: "Skin Care",
              brand: ["GlyMed Plus", "Dermalogica"],
            },
            {
              "@type": "Product",
              name: "Moisturizer",
              category: "Skin Care",
            },
            {
              "@type": "Product",
              name: "Eye Care",
              category: "Skin Care",
            },
            {
              "@type": "Product",
              name: "Face Treatment",
              category: "Skin Care",
            },
          ],
        },
      },

      // ===== MAKEUP & COSMETICS =====
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "ProductGroup",
          name: "Makeup & Cosmetics",
          description: "Face makeup, eye makeup, lip products & brushes",
          hasVariant: [
            {
              "@type": "Product",
              name: "Face Makeup",
              category: "Cosmetics",
            },
            {
              "@type": "Product",
              name: "Eye Makeup",
              category: "Cosmetics",
            },
            {
              "@type": "Product",
              name: "Lip Products",
              category: "Cosmetics",
            },
            {
              "@type": "Product",
              name: "Makeup Brushes",
              category: "Cosmetics",
            },
          ],
        },
      },

      // ===== MEN'S GROOMING =====
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "ProductGroup",
          name: "Men's Grooming",
          description: "Beard care, men's skincare & grooming essentials",
          hasVariant: [
            {
              "@type": "Product",
              name: "Grooming - Men",
              category: "Men's Care",
            },
          ],
        },
      },

      // ===== PERSONAL CARE =====
      {
        "@type": "ListItem",
        position: 5,
        item: {
          "@type": "ProductGroup",
          name: "Personal Care",
          description: "Dental care, skin brushes & wellness products",
          hasVariant: [
            {
              "@type": "Product",
              name: "Dental Care",
              category: "Personal Care",
            },
            {
              "@type": "Product",
              name: "Skin Brushes",
              category: "Personal Care",
            },
          ],
        },
      },

      // ===== HOUSEKEEPING & OTHER =====
      {
        "@type": "ListItem",
        position: 6,
        item: {
          "@type": "ProductGroup",
          name: "Other Products",
          description: "Housekeeping and specialty beauty items",
          hasVariant: [
            {
              "@type": "Product",
              name: "Housekeeping",
              category: "Other",
            },
            {
              "@type": "Product",
              name: "Other Beauty Items",
              category: "Other",
            },
          ],
        },
      },
    ],
  },

  // Brand Information
  provider: {
    "@type": "BeautySalon",
    "@id": "https://kayaa-saloon.vercel.app/#organization",
    name: "Kaya Beauty Spa",
    url: "https://kayaa-saloon.vercel.app/",
    logo: "https://kayaa-saloon.vercel.app/logo.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "92 Highland Ave",
      addressLocality: "Somerville",
      addressRegion: "MA",
      postalCode: "02143",
      addressCountry: "US",
    },
    telephone: "+1-617-776-2510",
  },

  // Shopping Features
  potentialAction: [
    {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://kayaa-saloon.vercel.app/shop?search={search_term}",
      },
      "query-input": "required name=search_term",
    },
    {
      "@type": "BuyAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://kayaa-saloon.vercel.app/shop",
      },
    },
  ],

  // Breadcrumb
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kayaa-saloon.vercel.app/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: "https://kayaa-saloon.vercel.app/shop",
      },
    ],
  },
};

// ============================================================================
// ADDITIONAL SCHEMA - OFFERS & FEATURES
// ============================================================================

const offerSchema = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Kaya Beauty Spa Products",
  provider: {
    "@type": "BeautySalon",
    name: "Kaya Beauty Spa",
  },
  itemListElement: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "ProductGroup",
        name: "Premium Beauty Brands",
        description: "GlyMed Plus, AVEDA, Dermalogica products",
      },
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "BeautySalon",
        name: "Kaya Beauty Spa",
      },
    },
  ],
};

// ============================================================================
// SERVER COMPONENT
// ============================================================================

export default function ShopPage() {
  return (
    <>
      {/* Primary Structured Data - Product Catalog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Secondary Structured Data - Offers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(offerSchema),
        }}
      />

      {/* Client Component */}
      <ShopClient />
    </>
  );
}
