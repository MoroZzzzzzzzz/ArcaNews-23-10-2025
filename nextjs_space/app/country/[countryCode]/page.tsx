
import { CountryNewsPage } from '@/components/country/country-news-page';
import { countries } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface CountryPageProps {
  params: {
    countryCode: string;
  };
}

export default function CountryPage({ params }: CountryPageProps) {
  const country = countries.find(c => c.code.toLowerCase() === params.countryCode.toLowerCase());
  
  if (!country) {
    notFound();
  }

  return <CountryNewsPage country={country} />;
}

export async function generateStaticParams() {
  return countries.map((country) => ({
    countryCode: country.code.toLowerCase(),
  }));
}
