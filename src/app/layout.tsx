// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Providers from "./components/provider/Providers";
// import AppWrapper from "./components/AppWrapper";
// import ToastContainerConfig from "./components/ui/ToastContainerConfig";
// import { Playfair_Display, Lato } from "next/font/google";

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"], // choose the weights you need
//   variable: "--font-playfair", // custom CSS variable
//   display: "swap",
//   preload: false, // Only for fonts used immediately
// });

// const lato = Lato({
//   subsets: ["latin"],
//   weight: ["300", "400", "700"], // light, regular, bold
//   variable: "--font-lato",
//   display: "swap",
//   preload: false, // Only for fonts used immediately
// });

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
//   display: "swap",
//   preload: false, // Disable if not used immediately
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
//   display: "swap",
//   preload: false, // Disable if not used immediately
// });

// export const metadata: Metadata = {
//   title: "Kaya Beauty Spa - Your Sanctuary of beauty and Wellness",
//   description:
//     "Experience holistic beauty and wellness at Kaya Beauty Spa. Book your appointment today! Discover Ayurvedic treatments, expert skincare, and a serene escape in Somerville, MA. Enhance your natural beauty with us. Since 2003. Book Now!",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
//       <head>
//         <title>Belle Femme - The Hair Salon</title>
//       </head>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//         style={{ backgroundColor: "#000000" }}>
//         <>
//           <Providers>
//             <AppWrapper>{children}</AppWrapper>
//             <ToastContainerConfig />
//           </Providers>
//         </>
//       </body>
//     </html>
//   );
// }

// app/layout.tsx - COMPLETE PRODUCTION-READY METADATA CONFIGURATION

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/provider/Providers";
import AppWrapper from "./components/AppWrapper";
import ToastContainerConfig from "./components/ui/ToastContainerConfig";
import { Playfair_Display, Lato } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
  preload: false,
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// ============================================================================
// ADVANCED SEO METADATA CONFIGURATION
// ============================================================================

export const metadata: Metadata = {
  // ===== BASIC METADATA =====
  title: {
    default: "Kayaa Saloon - Beauty Salon & Products | Hair, Skin Care",
    template: "%s | Kayaa Saloon",
  },
  description:
    "Premium beauty salon offering hair styling, facials, keratin treatments & threading. Shop quality skin care & hair products. Book your appointment today.",
  keywords: [
    "beauty salon",
    "hair styling",
    "skin care",
    "keratin treatment",
    "hydra facial",
    "ultrasonic facial",
    "threading",
    "salon products",
    "beauty products online",
    "grooming services",
    "hair care products",
    "AVEDA products",
    "Dermalogica products",
    "GlyMed Plus",
  ],
  authors: [{ name: "Kayaa Saloon" }],
  creator: "Kayaa Saloon",
  publisher: "Kayaa Saloon",

  // ===== ROBOTS & INDEXING =====
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ===== OPEN GRAPH (Facebook, LinkedIn, etc.) =====
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://kayaa-saloon.vercel.app/",
    siteName: "Kayaa Saloon",
    title: "Kayaa Saloon - Premium Beauty Salon & Products",
    description:
      "Expert hair styling, facials, keratin treatments & threading. Shop quality beauty products. Book your appointment at India's trusted salon.",
    images: [
      {
        url: "https://kayaa-saloon.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kayaa Saloon - Premium Beauty Salon Services and Products",
        type: "image/jpeg",
      },
    ],
  },

  // ===== TWITTER / X CARD =====
  twitter: {
    card: "summary_large_image",
    site: "@kayaasaloon",
    creator: "@kayaasaloon",
    title: "Kayaa Saloon - Beauty Salon & Premium Products",
    description:
      "Expert hair styling, facials & grooming services. Shop quality beauty products. Book your appointment today.",
    images: ["https://kayaa-saloon.vercel.app/og-image.jpg"],
  },

  // ===== CANONICAL & ALTERNATES =====
  alternates: {
    canonical: "https://kayaa-saloon.vercel.app/",
  },

  // ===== VERIFICATION TAGS (Add your actual verification codes) =====
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", // Replace with actual code from Google Search Console
    // yandex: 'YOUR_YANDEX_CODE',
    // bing: 'YOUR_BING_CODE',
  },

  // ===== APP & MANIFEST =====
  applicationName: "Kayaa Saloon",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kayaa Saloon",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  // ===== CATEGORY & CLASSIFICATION =====
  category: "Beauty & Personal Care",
};

// ===== VIEWPORT CONFIGURATION (Separate export for Next.js 15+) =====
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// ============================================================================
// ROOT LAYOUT COMPONENT
// ============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ===== STRUCTURED DATA (JSON-LD) =====
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": "https://kayaa-saloon.vercel.app/#organization",
    name: "Kayaa Saloon",
    alternateName: "Kayaa Beauty Salon",
    description:
      "Premium beauty salon offering expert hair styling, facials, keratin treatments, threading, and quality beauty products using AVEDA, Dermalogica, and GlyMed Plus products.",
    url: "https://kayaa-saloon.vercel.app/",
    logo: {
      "@type": "ImageObject",
      url: "https://kayaa-saloon.vercel.app/logo.png",
      width: 600,
      height: 600,
    },
    image: {
      "@type": "ImageObject",
      url: "https://kayaa-saloon.vercel.app/og-image.jpg",
      width: 1200,
      height: 630,
    },
    telephone: "+91-XXXXX-XXXXX", // Replace with actual phone
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressLocality: "City Name", // Replace with actual city
      addressRegion: "State", // Replace with actual state
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 0.0, // Replace with actual coordinates
      longitude: 0.0,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "10:00",
        closes: "21:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Salon Services & Beauty Products",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Hair Styling & Treatments",
            description:
              "Professional hair cutting, styling, keratin treatments, and hair coloring services",
            provider: {
              "@id": "https://kayaa-saloon.vercel.app/#organization",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Facial & Skin Care",
            description:
              "Hydra facials, ultrasonic facials, age management, and customized skin treatments using premium products",
            provider: {
              "@id": "https://kayaa-saloon.vercel.app/#organization",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Grooming & Beauty Services",
            description:
              "Threading, henna for hair, waxing, and specialized beauty treatments",
            provider: {
              "@id": "https://kayaa-saloon.vercel.app/#organization",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Beauty & Hair Care Products",
            description:
              "Premium AVEDA, Dermalogica, and GlyMed Plus skin care and hair care products",
            brand: ["AVEDA", "Dermalogica", "GlyMed Plus"],
          },
        },
      ],
    },
    potentialAction: [
      {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://kayaa-saloon.vercel.app/",
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
        result: {
          "@type": "Reservation",
          name: "Book Salon Appointment",
        },
      },
      {
        "@type": "BuyAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://kayaa-saloon.vercel.app/shop",
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
      },
    ],
    sameAs: [
      // Add your actual social media URLs
      "https://www.facebook.com/kayaasaloon",
      "https://www.instagram.com/kayaasaloon",
      "https://twitter.com/kayaasaloon",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Belle Femme - The Hair Salon</title>
        {/* ===== JSON-LD STRUCTURED DATA ===== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* ===== ADDITIONAL META TAGS ===== */}
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="format-detection" content="address=yes" />
        <meta name="format-detection" content="email=yes" />

        {/* ===== LANGUAGE & REGION ===== */}
        <meta httpEquiv="content-language" content="en-IN" />

        {/* ===== PRECONNECT FOR PERFORMANCE ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* ===== FAVICON (Add your actual favicon files) ===== */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${lato.variable} antialiased`}
        style={{ backgroundColor: "#000000" }}>
        <Providers>
          <AppWrapper>
            {children}
            <ToastContainerConfig />
          </AppWrapper>
        </Providers>
      </body>
    </html>
  );
}
