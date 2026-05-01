import type { Metadata } from 'next'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import AuditFlow from './_components/AuditFlow'

export const metadata: Metadata = {
  title: 'Free SEO, AEO & GEO Website Audit — MOSO',
  description:
    'See how your website performs across traditional search engines, answer engines, and generative AI discovery systems. Free scores, real signals, and a prioritized roadmap — delivered to your inbox.',
  keywords: [
    'free SEO audit', 'AEO audit', 'GEO audit', 'generative engine optimization',
    'website audit', 'AI search readiness', 'MOSO free audit', 'answer engine optimization',
  ],
  alternates: { canonical: 'https://www.moso.marketing/free-audit' },
  openGraph: {
    title: 'Free SEO, AEO & GEO Website Audit — MOSO',
    description:
      'Is your website ready for search, answers, and AI? Get a free audit across SEO, AEO, and GEO — real scores, real signals.',
    url: 'https://www.moso.marketing/free-audit',
    siteName: 'MOSO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free SEO, AEO & GEO Website Audit — MOSO',
    description: 'See exactly how search engines, answer engines, and AI systems understand your website.',
  },
}

const pillars = [
  {
    label: 'SEO Foundation',
    description:
      'Technical structure, metadata, crawlability, indexing signals, site speed, mobile usability, and on-page optimization.',
  },
  {
    label: 'AEO Readiness',
    description:
      'How clearly your site answers real customer questions for answer-style search experiences and AI-assisted results.',
  },
  {
    label: 'GEO Visibility',
    description:
      'How well generative AI systems can understand, summarize, and recommend your brand — based on entity clarity, structured data, trust signals, and content depth.',
  },
  {
    label: 'Performance',
    description:
      'Mobile and desktop speed signals, Core Web Vitals readiness, and friction points that may affect visibility and conversion.',
  },
  {
    label: 'Brand & Entity Clarity',
    description:
      'Whether your business name, services, audience, location, and proof are clear enough for both people and machines.',
  },
  {
    label: 'UX & Conversion',
    description:
      'CTA clarity, contact accessibility, trust signals, page hierarchy, and whether your website reduces uncertainty for visitors.',
  },
  {
    label: 'Prioritized Roadmap',
    description:
      'Quick wins, priority fixes, and a 7-day, 30-day, and 90-day plan to strengthen your search and AI visibility foundation.',
  },
]

const definitions = [
  {
    term: 'SEO',
    def: 'Helps search engines crawl, understand, and rank your website.',
  },
  {
    term: 'AEO',
    def: 'Helps your content answer specific questions clearly enough to appear in answer-style search experiences.',
  },
  {
    term: 'GEO',
    def: 'Helps generative AI systems understand, summarize, cite, and recommend your brand accurately.',
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
              <div className="audit-eyebrow">Free SEO, AEO &amp; GEO Audit</div>
              <h1 className="audit-hero-headline">
                Is Your Website Ready for Search, Answers, and AI?
              </h1>
              <p className="audit-hero-subhead">
                See how your website performs across traditional search engines, answer engines,
                and generative AI discovery systems — with real scores, real signals, and a
                prioritized roadmap.
              </p>
              <div className="audit-hero-badges">
                <span className="audit-badge">Free</span>
                <span className="audit-badge">No credit card</span>
                <span className="audit-badge">Basic results instantly</span>
                <span className="audit-badge">Full report by email</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form + What's included */}
        <section className="audit-body">
          <div className="audit-container audit-body-grid">
            {/* Audit flow */}
            <div className="audit-form-wrapper">
              <h2 className="audit-section-title">Run your free audit</h2>
              <AuditFlow />
            </div>

            {/* What we analyze */}
            <div className="audit-features">
              <h2 className="audit-section-title">What we analyze</h2>
              <div className="audit-features-list">
                {pillars.map((p) => (
                  <div key={p.label} className="audit-feature-item">
                    <div>
                      <p className="audit-feature-label">{p.label}</p>
                      <p className="audit-feature-desc">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Definitions */}
        <section className="audit-definitions">
          <div className="audit-container">
            <h2 className="audit-section-title" style={{ marginBottom: '1.5rem' }}>
              SEO, AEO, and GEO — what&apos;s the difference?
            </h2>
            <div className="audit-definitions-grid">
              {definitions.map(({ term, def }) => (
                <div key={term} className="audit-definition-card">
                  <p className="audit-definition-term">{term}</p>
                  <p className="audit-definition-body">{def}</p>
                </div>
              ))}
            </div>
            <p className="audit-definitions-note">
              This audit measures <em>readiness</em> — visibility signals, machine-readable clarity, and
              the likelihood of being understood by search and AI systems. It is not a guarantee of
              rankings, traffic, AI citations, or placement.
            </p>
          </div>
        </section>

        {/* Secondary CTA */}
        <section className="audit-trust" style={{ borderTop: '1px solid #e5e5e5', paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="audit-container" style={{ textAlign: 'center' }}>
            <a href="/quote-builder" style={{ color: '#111', textDecoration: 'underline', fontSize: '0.95rem' }}>
              Not sure where to start? Build your MOSO project estimate →
            </a>
          </div>
        </section>

        {/* Trust strip */}
        <section className="audit-trust">
          <div className="audit-container">
            <p className="audit-trust-copy">
              Built by MOSO — a design and technology studio helping businesses grow with clarity,
              intention, and the right digital infrastructure. Born in Louisiana. Building futures worldwide.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
