// app/saloon-services/page.tsx
import type { Metadata } from "next";
import Services from "./components/ServicesClient";

// ============================================================================
// METADATA - SERVICES LISTING PAGE
// ============================================================================

export const metadata: Metadata = {
  title: "Salon Services - Hair, Skin Care & Grooming | Kayaa Saloon",
  description:
    "Browse premium salon services: haircuts, hair color, facials, makeup, waxing & beard grooming. Book your appointment with expert stylists.",

  keywords: [
    "salon services",
    "haircut booking",
    "hair color services",
    "facial treatments",
    "makeup services",
    "waxing services",
    "beard grooming",
    "beauty services",
    "salon booking online",
  ],

  openGraph: {
    title: "Salon Services - Book Your Perfect Look | Kayaa Saloon",
    description:
      "Expert hair styling, facials, makeup & grooming services. Browse our complete service menu and book online today.",
    url: "https://kayaa-saloon.vercel.app/saloon-services",
    type: "website",
    images: [
      {
        url: "https://kayaa-saloon.vercel.app/og-services.jpg",
        width: 1200,
        height: 630,
        alt: "Kayaa Saloon Services Menu",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Salon Services - Book Your Perfect Look",
    description:
      "Expert hair styling, facials, makeup & grooming. Browse services and book online.",
    images: ["https://kayaa-saloon.vercel.app/og-services.jpg"],
  },

  alternates: {
    canonical: "https://kayaa-saloon.vercel.app/saloon-services",
  },

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

// ============================================================================
// STRUCTURED DATA - SERVICE CATALOG
// ============================================================================

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Kayaa Saloon Services",
  description: "Complete menu of salon services available for booking",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "Hair Styling Services",
        description: "Professional haircuts, styling, and treatments",
        provider: {
          "@type": "BeautySalon",
          name: "Kayaa Saloon",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Hair Coloring",
        description: "Expert hair coloring and highlighting services",
        provider: {
          "@type": "BeautySalon",
          name: "Kayaa Saloon",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Facial Treatments",
        description: "Hydra facials, ultrasonic facials, and skin care",
        provider: {
          "@type": "BeautySalon",
          name: "Kayaa Saloon",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Service",
        name: "Makeup Services",
        description: "Professional makeup for all occasions",
        provider: {
          "@type": "BeautySalon",
          name: "Kayaa Saloon",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "Service",
        name: "Waxing & Hair Removal",
        description: "Professional waxing services",
        provider: {
          "@type": "BeautySalon",
          name: "Kayaa Saloon",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 6,
      item: {
        "@type": "Service",
        name: "Beard Grooming",
        description: "Expert beard trimming and styling",
        provider: {
          "@type": "BeautySalon",
          name: "Kayaa Saloon",
        },
      },
    },
  ],
};

// ============================================================================
// SERVER COMPONENT
// ============================================================================

export default function ServicesPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Client Component (Your existing code) */}
      <Services />
    </>
  );
}
