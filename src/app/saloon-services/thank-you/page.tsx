// app/saloon-services/thank-you/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { ThankYouPage } from "./components/ThankYouClient";
// ============================================================================
// METADATA - THANK YOU PAGE
// ============================================================================

export const metadata: Metadata = {
  title: "Booking Confirmed - Thank You | Kayaa Saloon",
  description:
    "Your salon appointment is confirmed! Check your booking details and add to calendar. We look forward to seeing you.",

  keywords: [
    "booking confirmed",
    "appointment confirmed",
    "salon reservation",
    "booking success",
  ],

  openGraph: {
    title: "Booking Confirmed - Thank You | Kayaa Saloon",
    description:
      "Your appointment is confirmed! We look forward to seeing you.",
    url: "https://kayaa-saloon.vercel.app/saloon-services/thank-you",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Booking Confirmed",
    description: "Your appointment is confirmed! See you soon.",
  },

  alternates: {
    canonical: "https://kayaa-saloon.vercel.app/saloon-services/thank-you",
  },

  robots: {
    index: false, // Don't index confirmation pages
    follow: false,
  },
};

// ============================================================================
// STRUCTURED DATA - CONFIRMATION PAGE
// ============================================================================

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Appointment Confirmation",
  description: "Your salon appointment booking confirmation",
  mainEntity: {
    "@type": "Order",
    orderStatus: "OrderDelivered",
    confirmationNumber: "BOOKING_ID_PLACEHOLDER",
    seller: {
      "@type": "BeautySalon",
      name: "Kayaa Saloon",
    },
  },
};

// ============================================================================
// SERVER COMPONENT
// ============================================================================

export default function ThankYouPageServer() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Suspense fallback={<div>Loading confirmation...</div>}>
        <ThankYouPage />
      </Suspense>
    </>
  );
}
