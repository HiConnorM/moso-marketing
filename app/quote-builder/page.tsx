import type { Metadata } from 'next'
import Navbar from '../../components/Navbar'
import QuoteBuilder from './_components/QuoteBuilder'

export const metadata: Metadata = {
  title: 'Build Your Project Estimate — MOSO',
  description:
    "Tell us what you're building, where you are now, and what kind of future you're designing. We'll map the right starting point, estimate the investment range, and recommend the best MOSO path.",
  keywords: [
    'MOSO quote builder',
    'project estimate',
    'website cost estimator',
    'brand strategy estimate',
    'app development cost',
    'digital agency pricing',
    'MOSO pricing',
  ],
  alternates: { canonical: 'https://www.moso.marketing/quote-builder' },
  openGraph: {
    title: 'Build Your Project Estimate — MOSO',
    description:
      "Not sure where to start? Build your MOSO project estimate. We'll map the right starting point, estimate the investment range, and recommend the best path.",
    url: 'https://www.moso.marketing/quote-builder',
    siteName: 'MOSO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build Your Project Estimate — MOSO',
    description:
      "Tell us what you're building. We'll map the right starting point and estimate the investment range.",
  },
}

export default function QuoteBuilderPage() {
  return (
    <>
      <Navbar currentPage="quote-builder" />
      <main>
        <QuoteBuilder />
      </main>
    </>
  )
}
