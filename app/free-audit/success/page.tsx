import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import AuditStatus from '../_components/AuditStatus'

export const metadata: Metadata = {
  title: 'Audit In Progress — MOSO',
  description: 'Your free AEO + SEO audit is being prepared.',
  robots: { index: false },
}

function StatusLoader({ leadId }: { leadId: string }) {
  return (
    <div className="audit-success-wrapper">
      <div className="audit-success-header">
        <div className="audit-success-icon" aria-hidden="true">✓</div>
        <h1 className="audit-success-title">Your audit is running</h1>
        <p className="audit-success-subhead">
          We are analyzing search performance, AI answer readiness, speed,
          structure, and conversion signals. This usually takes 60–90 seconds.
        </p>
      </div>
      <AuditStatus leadId={leadId} />
      <div className="audit-success-email-note">
        <p>Your full report will also be sent to your email when complete.</p>
      </div>
    </div>
  )
}

function MissingId() {
  return (
    <div className="audit-success-wrapper">
      <h1 className="audit-success-title">Audit submitted</h1>
      <p>Your report will be emailed to you shortly.</p>
    </div>
  )
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string }>
}) {
  const { leadId } = await searchParams

  return (
    <>
      <Navbar />
      <main>
        <section className="audit-hero audit-hero--success">
          <div className="audit-container">
            <Suspense fallback={<div className="audit-loading-placeholder" />}>
              {leadId ? <StatusLoader leadId={leadId} /> : <MissingId />}
            </Suspense>
          </div>
        </section>

        {/* What's next */}
        {leadId && (
          <section className="audit-next">
            <div className="audit-container">
              <h2 className="audit-section-title">What happens next</h2>
              <div className="audit-next-steps">
                <div className="audit-next-step">
                  <span className="audit-next-num">01</span>
                  <p>Your report is emailed to you with scores, findings, and a prioritized action plan.</p>
                </div>
                <div className="audit-next-step">
                  <span className="audit-next-num">02</span>
                  <p>Review your quick wins and biggest blockers — most sites have 3–5 high-impact fixes.</p>
                </div>
                <div className="audit-next-step">
                  <span className="audit-next-num">03</span>
                  <p>Want help executing? Book a free strategy call and we will walk through the report together.</p>
                </div>
              </div>
              <div className="audit-next-cta">
                <a href="/contact" className="button w-inline-block">
                  <div className="button-container">
                    <div className="overflow-hidden">
                      <div className="button-inner">
                        <div className="button-text-wrapper">
                          <div className="button-text-front">Book a strategy call</div>
                          <div aria-hidden="true" className="button-text-back">Book a strategy call</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
