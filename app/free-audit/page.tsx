import type { Metadata } from 'next'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import AuditForm from './_components/AuditForm'

export const metadata: Metadata = {
  title: 'Free Website Audit — MOSO | SEO, AEO & Performance Analysis',
  description:
    "Get a free, detailed audit of your website's SEO, AEO readiness, Core Web Vitals, and conversion signals. Real scores, real fixes — delivered to your inbox in minutes.",
  keywords: ['free SEO audit', 'AEO audit', 'website audit', 'Core Web Vitals', 'SEO analysis', 'MOSO free audit'],
  alternates: { canonical: 'https://www.moso.marketing/free-audit' },
  openGraph: {
    title: 'Free Website Audit — MOSO | SEO, AEO & Performance Analysis',
    description:
      'See exactly what is helping, hurting, and holding back your site. Free detailed report sent to your inbox in minutes.',
    url: 'https://www.moso.marketing/free-audit',
    siteName: 'MOSO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Website Audit — MOSO | SEO, AEO & Performance Analysis',
    description: 'See exactly what is helping, hurting, and holding back your site. Free detailed report sent to your inbox.',
  },
}

const features = [
  {
    icon: '⚡',
    label: 'Performance',
    description: 'Mobile + desktop PageSpeed scores and Core Web Vitals',
  },
  {
    icon: '🔍',
    label: 'Technical SEO',
    description: 'HTTPS, sitemaps, robots, structured data, canonical tags',
  },
  {
    icon: '🤖',
    label: 'AEO Readiness',
    description: 'How visible you are to AI answer engines like ChatGPT and Perplexity',
  },
  {
    icon: '📄',
    label: 'On-Page SEO',
    description: 'Titles, meta, headings, content depth, image optimization',
  },
  {
    icon: '🎯',
    label: 'UX & Conversion',
    description: 'CTA clarity, trust signals, mobile usability, contact accessibility',
  },
  {
    icon: '🗺️',
    label: 'Prioritized Roadmap',
    description: 'Quick wins and biggest blockers, ranked by impact and effort',
  },
]

export default function FreeAuditPage() {
  return (
    <>
      <Navbar currentPage="free-audit" />
      <main>
        {/* Hero */}
        <section className="audit-hero">
          <div className="audit-container">
            <div className="audit-hero-content">
              <div className="audit-eyebrow">Free Website Audit</div>
              <h1 className="audit-hero-headline">
                Is Your Site Built to Rank?
              </h1>
              <p className="audit-hero-subhead">
                Free SEO + AEO audit — real scores, real fixes, delivered to your inbox in minutes.
              </p>
              <div className="audit-hero-badges">
                <span className="audit-badge">Free</span>
                <span className="audit-badge">No credit card</span>
                <span className="audit-badge">Report delivered by email</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form + What's included */}
        <section className="audit-body">
          <div className="audit-container audit-body-grid">
            {/* Form */}
            <div className="audit-form-wrapper">
              <h2 className="audit-section-title">Run your free audit</h2>
              <AuditForm />
            </div>

            {/* Features list */}
            <div className="audit-features">
              <h2 className="audit-section-title">What we analyze</h2>
              <div className="audit-features-list">
                {features.map((f) => (
                  <div key={f.label} className="audit-feature-item">
                    <span className="audit-feature-icon" aria-hidden="true">
                      {f.icon}
                    </span>
                    <div>
                      <p className="audit-feature-label">{f.label}</p>
                      <p className="audit-feature-desc">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="audit-trust">
          <div className="audit-container">
            <p className="audit-trust-copy">
              Built by MOSO — a design and technology studio helping businesses grow with clarity, intention, and the right digital infrastructure. Born in Louisiana. Building futures worldwide.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
