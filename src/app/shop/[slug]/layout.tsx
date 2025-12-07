import { Metadata } from 'next'

// Helper function to extract product name from slug
const getProductNameFromSlug = (slug: string): string => {
  const parts = slug.split('-');
  // Remove the last part (ID) and join the rest
  const nameParts = parts.slice(0, -1);
  return nameParts.join(' ').replace(/\b\w/g, l => l.toUpperCase());
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const productName = getProductNameFromSlug(slug);
  
  return {
    title: `${productName} | Kaya Beauty Salon`,
    description: `Shop ${productName} at Kaya Beauty Salon. Premium beauty products with expert curation and uncompromising quality.`,
    keywords: ['beauty products', 'skincare', 'cosmetics', 'luxury beauty', 'kaya salon', productName.toLowerCase()],
    openGraph: {
      title: `${productName} | Kaya Beauty Salon`,
      description: `Shop ${productName} at Kaya Beauty Salon. Premium beauty products with expert curation.`,
      type: 'website',
    },
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}