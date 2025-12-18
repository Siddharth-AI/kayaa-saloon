// app/saloon-services/slots/page.tsx
import type { Metadata } from "next";
import Slots from "./components/SlotsClient";

// ============================================================================
// METADATA - SLOT BOOKING PAGE
// ============================================================================

export const metadata: Metadata = {
  title: "Choose Time Slot - Book Appointment | Kayaa Saloon",
  description:
    "Select your preferred date, time slot, and expert stylist for your salon appointment. Easy online booking with instant confirmation.",

  keywords: [
    "salon appointment booking",
    "choose time slot",
    "book stylist",
    "salon scheduling",
    "appointment time",
    "select date time",
  ],

  openGraph: {
    title: "Choose Your Appointment Time | Kayaa Saloon",
    description:
      "Select date, time slot & expert stylist. Quick booking with instant confirmation.",
    url: "https://kayaa-saloon.vercel.app/saloon-services/slots",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Choose Your Appointment Time",
    description: "Select date, time slot & stylist for your salon visit.",
  },

  alternates: {
    canonical: "https://kayaa-saloon.vercel.app/saloon-services/slots",
  },

  robots: {
    index: false, // Don't index booking flow pages
    follow: true,
  },
};

// ============================================================================
// STRUCTURED DATA - BOOKING PAGE
// ============================================================================

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Salon Appointment Booking",
  description: "Select your preferred appointment time and stylist",
  mainEntity: {
    "@type": "ReserveAction",
    name: "Book Salon Appointment",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://kayaa-saloon.vercel.app/saloon-services/slots",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: {
      "@type": "Reservation",
      name: "Salon Service Reservation",
    },
  },
};

// ============================================================================
// SERVER COMPONENT
// ============================================================================

export default function SlotsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Slots />
    </>
  );
}
