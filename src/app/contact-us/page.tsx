// app/contact-us/page.tsx
import type { Metadata } from "next";
import React from "react";
import ContactUsClient from "./components/ContactUsClient";

// ============================================================================
// METADATA - CONTACT US PAGE
// ============================================================================

export const metadata: Metadata = {
  title: "Contact Us - Kaya Beauty Spa | Somerville, MA",
  description:
    "Visit Kaya Beauty Spa at 92 Highland Ave, Somerville, MA. Call 617-776-2510 for appointments. Open Mon-Fri 9AM-7PM, Sat 9AM-6PM, Sun 10AM-5PM. Expert Ayurvedic beauty treatments.",

  keywords: [
    "kaya beauty spa contact",
    "somerville beauty salon",
    "beauty spa near Davis Square",
    "somerville ma salon",
    "92 highland ave somerville",
    "beauty spa phone number",
    "salon booking somerville",
    "ayurvedic spa somerville",
    "beauty salon near me",
    "kaya beauty spa hours",
  ],

  openGraph: {
    title: "Contact Kaya Beauty Spa - Somerville, MA",
    description:
      "Visit us at 92 Highland Ave, Somerville. Call 617-776-2510. Expert Ayurvedic beauty treatments since 2003.",
    url: "https://kayaa-saloon.vercel.app/contact-us",
    type: "website",
    images: [
      {
        url: "https://kayaa-saloon.vercel.app/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Kaya Beauty Spa - Contact Us - 92 Highland Ave, Somerville, MA",
      },
    ],
    siteName: "Kaya Beauty Spa",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Kaya Beauty Spa",
    description:
      "Visit us in Somerville, MA. Call 617-776-2510 for appointments.",
    images: ["https://kayaa-saloon.vercel.app/og-contact.jpg"],
  },

  alternates: {
    canonical: "https://kayaa-saloon.vercel.app/contact-us",
  },

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

// ============================================================================
// STRUCTURED DATA - CONTACT PAGE WITH REAL BUSINESS INFO
// ============================================================================

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://kayaa-saloon.vercel.app/contact-us#webpage",
  name: "Contact Kaya Beauty Spa",
  description:
    "Contact information and location for Kaya Beauty Spa in Somerville, Massachusetts",
  url: "https://kayaa-saloon.vercel.app/contact-us",

  mainEntity: {
    "@type": "BeautySalon",
    "@id": "https://kayaa-saloon.vercel.app/#organization",
    name: "Kaya Beauty Spa",
    alternateName: "Kayaa Saloon",
    description:
      "Holistic, Ayurvedic, and cruelty-free beauty treatments in Somerville, Massachusetts since 2003",
    url: "https://kayaa-saloon.vercel.app/",
    logo: "https://kayaa-saloon.vercel.app/logo.png",
    image: "https://kayaa-saloon.vercel.app/og-image.jpg",

    // Contact Information
    telephone: "+1-617-776-2510",
    email: "kayabeautyspa@yahoo.com",

    // Address
    address: {
      "@type": "PostalAddress",
      streetAddress: "92 Highland Ave",
      addressLocality: "Somerville",
      addressRegion: "MA",
      postalCode: "02143",
      addressCountry: "US",
    },

    // Geographic Coordinates (Highland Ave, Somerville)
    geo: {
      "@type": "GeoCoordinates",
      latitude: 42.3956,
      longitude: -71.1097,
    },

    // Business Hours
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "17:00",
      },
    ],

    // Service Area
    areaServed: [
      {
        "@type": "City",
        name: "Somerville",
        "@id": "https://en.wikipedia.org/wiki/Somerville,_Massachusetts",
      },
      {
        "@type": "City",
        name: "Boston",
      },
      {
        "@type": "City",
        name: "Cambridge",
      },
      {
        "@type": "City",
        name: "Medford",
      },
    ],

    // Contact Points
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-617-776-2510",
        contactType: "customer service",
        areaServed: "US",
        availableLanguage: ["English"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "19:00",
        },
      },
      {
        "@type": "ContactPoint",
        telephone: "+1-617-776-2510",
        contactType: "reservations",
        areaServed: "US",
        availableLanguage: ["English"],
      },
    ],

    // Social Media (Add real URLs if available)
    sameAs: [
      "https://www.facebook.com/kayabeautyspa",
      "https://www.instagram.com/kayabeautyspa",
    ],

    // Price Range
    priceRange: "$$",

    // Payment Methods
    paymentAccepted: ["Cash", "Credit Card", "Debit Card"],

    // Special Features
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Parking",
        value: "Street parking available",
      },
      {
        "@type": "PropertyValue",
        name: "Location",
        value: "Minutes from Davis Square",
      },
      {
        "@type": "PropertyValue",
        name: "Cancellation Policy",
        value: "24 hour cancellation policy",
      },
    ],

    // Founding Date
    foundingDate: "2003",

    // Additional Services
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Beauty Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Ayurvedic Treatments",
            description:
              "Holistic beauty treatments using Ayurvedic principles",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "GlyMed Plus Facials",
            description: "Professional facials using GlyMed Plus products",
          },
        },
      ],
    },
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
        name: "Contact Us",
        item: "https://kayaa-saloon.vercel.app/contact-us",
      },
    ],
  },

  // Map Link
  hasMap:
    "https://www.google.com/maps/place/92+Highland+Ave,+Somerville,+MA+02143",
};

// ============================================================================
// SERVER COMPONENT
// ============================================================================
const contactus = () => {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ContactUsClient />
    </>
  );
};

export default contactus;
