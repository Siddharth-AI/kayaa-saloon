// import { Metadata } from 'next'

// // Helper function to extract product name from slug
// const getProductNameFromSlug = (slug: string): string => {
//   const parts = slug.split('-');
//   // Remove the last part (ID) and join the rest
//   const nameParts = parts.slice(0, -1);
//   return nameParts.join(' ').replace(/\b\w/g, l => l.toUpperCase());
// };

// export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
//   const { slug } = await params;
//   const productName = getProductNameFromSlug(slug);

//   return {
//     title: `${productName} | Kaya Beauty Salon`,
//     description: `Shop ${productName} at Kaya Beauty Salon. Premium beauty products with expert curation and uncompromising quality.`,
//     keywords: ['beauty products', 'skincare', 'cosmetics', 'luxury beauty', 'kaya salon', productName.toLowerCase()],
//     openGraph: {
//       title: `${productName} | Kaya Beauty Salon`,
//       description: `Shop ${productName} at Kaya Beauty Salon. Premium beauty products with expert curation.`,
//       type: 'website',
//     },
//   }
// }

// export default function ProductLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return children
// }

// app/shop/[slug]/layout.tsx
import { Metadata } from "next";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Extract product name from slug (removes ID at the end)
const getProductNameFromSlug = (slug: string): string => {
  const parts = slug.split("-");
  // Remove the last part (ID) and join the rest
  const nameParts = parts.slice(0, -1);
  // Capitalize each word
  return nameParts
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Extract product ID from slug
const getProductIdFromSlug = (slug: string): string => {
  const parts = slug.split("-");
  return parts[parts.length - 1]; // Last part is the ID
};

// Determine product category from name
const getCategoryFromName = (name: string): string => {
  const lowerName = name.toLowerCase();

  // Hair Care
  if (
    lowerName.includes("shampoo") ||
    lowerName.includes("conditioner") ||
    lowerName.includes("hair oil") ||
    lowerName.includes("hair mask") ||
    lowerName.includes("hair treatment")
  ) {
    return "Hair Care";
  }

  // Skin Care
  if (
    lowerName.includes("cream") ||
    lowerName.includes("moisturizer") ||
    lowerName.includes("facial") ||
    lowerName.includes("serum") ||
    lowerName.includes("eye care")
  ) {
    return "Skin Care";
  }

  // Makeup
  if (
    lowerName.includes("makeup") ||
    lowerName.includes("lipstick") ||
    lowerName.includes("foundation") ||
    lowerName.includes("mascara")
  ) {
    return "Makeup & Cosmetics";
  }

  // Men's Grooming
  if (
    lowerName.includes("beard") ||
    lowerName.includes("men") ||
    lowerName.includes("grooming")
  ) {
    return "Men's Grooming";
  }

  // Default
  return "Beauty Products";
};

// Generate keywords based on product name
const generateKeywords = (productName: string, category: string): string[] => {
  const baseKeywords = [
    "buy online",
    "premium beauty",
    "kaya beauty spa",
    "beauty products online",
    "luxury cosmetics",
  ];

  const productKeywords = productName.toLowerCase().split(" ");
  const categoryKeywords = category.toLowerCase().split(" ");

  return [
    ...productKeywords,
    ...categoryKeywords,
    ...baseKeywords,
    `${productName.toLowerCase()} online`,
    `buy ${productName.toLowerCase()}`,
    `${category.toLowerCase()} products`,
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
  const productName = getProductNameFromSlug(slug);
  const productId = getProductIdFromSlug(slug);
  const category = getCategoryFromName(productName);
  const keywords = generateKeywords(productName, category);

  return {
    title: `${productName} - Buy Online | Kaya Beauty Spa`,
    description: `Shop ${productName} at Kaya Beauty Spa. Premium ${category.toLowerCase()} with expert curation. Free shipping on orders over ₹999. Authentic products guaranteed.`,

    keywords,

    openGraph: {
      title: `${productName} | Kaya Beauty Spa`,
      description: `Premium ${productName} available at Kaya Beauty Spa. Shop authentic ${category.toLowerCase()} products online.`,
      url: `https://kayaa-saloon.vercel.app/shop/${slug}`,
      type: "website",
      images: [
        {
          url: `https://kayaa-saloon.vercel.app/og-product.jpg`, // Fallback image
          width: 1200,
          height: 630,
          alt: `${productName} - Kaya Beauty Spa`,
        },
      ],
      siteName: "Kaya Beauty Spa",
      locale: "en_US",
    },

    twitter: {
      card: "summary_large_image",
      title: `${productName} | Kaya Beauty Spa`,
      description: `Shop ${productName} - Premium ${category.toLowerCase()} products`,
      images: [`https://kayaa-saloon.vercel.app/og-product.jpg`],
    },

    alternates: {
      canonical: `https://kayaa-saloon.vercel.app/shop/${slug}`,
    },

    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  };
}

// ============================================================================
// LAYOUT COMPONENT
// ============================================================================

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
