// app/saloon-services/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  // This will be overridden by individual pages
  title: {
    default: "Salon Services - Kayaa Saloon",
    template: "%s | Kayaa Saloon",
  },
  openGraph: {
    siteName: "Kayaa Saloon",
    locale: "en_IN",
  },
};

export default function SaloonServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
