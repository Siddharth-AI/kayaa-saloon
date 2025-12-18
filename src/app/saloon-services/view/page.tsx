// app/saloon-services/view/page.tsx
import type { Metadata } from "next";
import View from "./components/ViewClient";

// ============================================================================
// METADATA - CART VIEW PAGE
// ============================================================================

export const metadata: Metadata = {
  title: "Review Booking - Confirm Appointment | Kayaa Saloon",
  description:
    "Review your selected services, appointment time, and complete your salon booking. Secure payment and instant confirmation.",

  keywords: [
    "review booking",
    "confirm appointment",
    "salon checkout",
    "booking summary",
    "appointment confirmation",
  ],

  openGraph: {
    title: "Review Your Booking | Kayaa Saloon",
    description: "Review services, time & complete your appointment booking.",
    url: "https://kayaa-saloon.vercel.app/saloon-services/view",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Review Your Booking",
    description: "Confirm your salon appointment details.",
  },

  alternates: {
    canonical: "https://kayaa-saloon.vercel.app/saloon-services/view",
  },

  robots: {
    index: false, // Don't index checkout pages
    follow: false,
  },
};

// ============================================================================
// STRUCTURED DATA - CHECKOUT PAGE
// ============================================================================

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Appointment Booking Confirmation",
  description: "Review and confirm your salon service booking",
  mainEntity: {
    "@type": "Order",
    orderStatus: "OrderProcessing",
    seller: {
      "@type": "BeautySalon",
      name: "Kayaa Saloon",
    },
  },
};

// ============================================================================
// SERVER COMPONENT
// ============================================================================

export default function ViewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <View />
    </>
  );
}
