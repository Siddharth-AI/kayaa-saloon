// app/about-us/page.tsx
import type { Metadata } from "next";
import AboutOurStory from "@/components/aboutus/aboutOurStory/AboutOurStory";
import Hero from "@/components/aboutus/hero/Hero";
import Newsletter from "@/components/aboutus/newsLetter/NewsLetter";
import OurStory from "@/components/aboutus/ourStory/OurStory";

// ============================================================================
// METADATA - ABOUT US PAGE
// ============================================================================

export const metadata: Metadata = {
  title: "About Us - Our Story | Kaya Beauty Spa",
  description:
    "Meet Anita, owner of Kaya Beauty Spa. 20+ years of Ayurvedic and holistic beauty expertise from India and the US. Enhancing beauty naturally since 2003 in Somerville, MA.",

  keywords: [
    "kaya beauty spa owner",
    "anita beauty spa",
    "ayurvedic beauty expert",
    "holistic skin care somerville",
    "punjab beauty traditions",
    "cosmetology instructor",
    "natural beauty products",
    "ayurvedic spa somerville",
    "beauty spa history",
    "indian beauty techniques",
  ],

  openGraph: {
    title: "About Kaya Beauty Spa - Our Ayurvedic Beauty Story",
    description:
      "Meet Anita, our founder. 20+ years combining US beauty training with Ayurvedic holistic care from India. Serving Somerville since 2003.",
    url: "https://kayaa-saloon.vercel.app/about-us",
    type: "website",
    images: [
      {
        url: "https://kayaa-saloon.vercel.app/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "Kaya Beauty Spa - About Our Ayurvedic Beauty Journey",
      },
    ],
    siteName: "Kaya Beauty Spa",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "About Kaya Beauty Spa - Our Story",
    description:
      "20+ years of Ayurvedic beauty expertise from Punjab to Somerville.",
    images: ["https://kayaa-saloon.vercel.app/og-about.jpg"],
  },

  alternates: {
    canonical: "https://kayaa-saloon.vercel.app/about-us",
  },

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

// ============================================================================
// STRUCTURED DATA - ABOUT PAGE WITH FOUNDER INFO
// ============================================================================

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://kayaa-saloon.vercel.app/about-us#webpage",
  name: "About Kaya Beauty Spa",
  description:
    "Learn about Anita and the Ayurvedic beauty philosophy behind Kaya Beauty Spa",
  url: "https://kayaa-saloon.vercel.app/about-us",

  mainEntity: {
    "@type": "BeautySalon",
    "@id": "https://kayaa-saloon.vercel.app/#organization",
    name: "Kaya Beauty Spa",
    description:
      "Holistic, Ayurvedic, and cruelty-free beauty treatments combining Indian traditions with modern US techniques",
    url: "https://kayaa-saloon.vercel.app/",
    logo: "https://kayaa-saloon.vercel.app/logo.png",
    image: "https://kayaa-saloon.vercel.app/og-about.jpg",

    // Founding Details
    foundingDate: "2003",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Somerville",
        addressRegion: "MA",
        addressCountry: "US",
      },
    },

    // Founder Information
    founder: {
      "@type": "Person",
      name: "Anita",
      jobTitle: "Owner & Cosmetology Instructor",
      description:
        "Licensed cosmetologist and instructor with 20+ years of experience combining Ayurvedic beauty traditions from Punjab, India with modern US techniques",
      nationality: {
        "@type": "Country",
        name: "India",
      },
      homeLocation: {
        "@type": "Place",
        name: "Punjab, India",
      },
      knowsAbout: [
        "Ayurvedic Beauty Care",
        "Holistic Skin Care",
        "Cosmetology",
        "Beauty Instruction",
        "Natural Beauty Products",
        "Indian Beauty Traditions",
      ],
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Cosmetology License",
          dateCreated: "2003",
        },
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Instructor's License",
          dateCreated: "2003",
        },
      ],
    },

    // Business Philosophy
    slogan: "Enhancing Your Beauty for 20 Years",

    knowsAbout: [
      "Ayurvedic Beauty Treatments",
      "Holistic Skin Care",
      "Natural Beauty Products",
      "Cruelty-Free Beauty",
      "Indian Beauty Traditions",
      "Modern Cosmetology",
    ],

    // Service Features
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Specialty",
        value: "Ayurvedic and Holistic Beauty Care",
      },
      {
        "@type": "PropertyValue",
        name: "Experience",
        value: "20+ years in cosmetology and instruction",
      },
      {
        "@type": "PropertyValue",
        name: "Products",
        value: "Natural, Ayurvedic, Cruelty-Free",
      },
      {
        "@type": "PropertyValue",
        name: "Training Background",
        value: "US Cosmetology + Indian Ayurvedic Traditions",
      },
    ],

    // Location
    address: {
      "@type": "PostalAddress",
      streetAddress: "92 Highland Ave",
      addressLocality: "Somerville",
      addressRegion: "MA",
      postalCode: "02143",
      addressCountry: "US",
    },

    // Contact
    telephone: "+1-617-776-2510",
    email: "kayabeautyspa@yahoo.com",
  },

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
        name: "About Us",
        item: "https://kayaa-saloon.vercel.app/about-us",
      },
    ],
  },

  // Organization Story
  about: {
    "@type": "Thing",
    name: "Ayurvedic Beauty Philosophy",
    description:
      "Kaya Beauty Spa combines ancient Ayurvedic beauty wisdom from Punjab, India with modern US cosmetology training to provide holistic, natural, and cruelty-free beauty treatments.",
  },
};

// ============================================================================
// SERVER COMPONENT
// ============================================================================

export default function AboutUsPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Page Content */}
      <Hero />
      <OurStory />
      <AboutOurStory />
      <Newsletter />
    </>
  );
}
