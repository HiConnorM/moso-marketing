'use client'

import { useState, useEffect, useRef } from 'react'
import type { TeaserResults } from '../../../types/audit'

// ── Step types ────────────────────────────────────────────────────────────────
type Step = 'input' | 'loading' | 'teaser' | 'email-gate' | 'confirmation'

interface SessionState {
  sessionId: string
  teaserResults: TeaserResults
  websiteUrl: string
}

// ── Loading copy rotation ─────────────────────────────────────────────────────
const LOADING_MESSAGES = [
  'Reading your site structure…',
  'Checking search visibility signals…',
  'Reviewing answer-readiness…',
  'Mapping GEO clarity signals…',
  'Analyzing entity and brand clarity…',
  'Checking structured data and schema…',
  'Evaluating trust and proof signals…',
  'Reviewing UX and conversion patterns…',
  'Preparing your visibility snapshot…',
]

// ── Score color ────────────────────────────────────────────────────────────────
function scoreColor(s: number): string {
  if (s >= 75) return '#16a34a'
  if (s >= 50) return '#d97706'
  return '#dc2626'
}

function scoreLabel(s: number): string {
  if (s >= 75) return 'Strong'
  if (s >= 50) return 'Needs Work'
  return 'Critical'
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ScoreRing({ score, label }: { score: number; label: string }) {
  const color = scoreColor(score)
  const size  = 72
  const r     = 28
  const circ  = 2 * Math.PI * r
  const dash  = (score / 100) * circ

  return (
    <div className="audit-score-ring-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: 'Arial, sans-serif', fontSize: '15px', fontWeight: 700, fill: color }}>
          {score}
        </text>
      </svg>
      <p className="audit-score-ring-label">{label}</p>
    </div>
  )
}

function ScoreBar({ score }: { score: number }) {
  const color = scoreColor(score)
  return (
    <div className="audit-score-bar-track">
      <div
        className="audit-score-bar-fill"
        style={{ width: `${score}%`, background: color }}
      />
    </div>
  )
}

// ── Teaser card ───────────────────────────────────────────────────────────────

function TeaserCard({
  results,
  websiteUrl,
  onUnlock,
}: {
  results: TeaserResults
  websiteUrl: string
  onUnlock: () => void
}) {
  const overallColor = scoreColor(results.overallScore)

  return (
    <div className="audit-teaser-card">
      {/* Overall score */}
      <div className="audit-teaser-overall">
        <div className="audit-teaser-overall-score" style={{ color: overallColor }}>
          {results.overallScore}
          <span className="audit-teaser-overall-denom">/100</span>
        </div>
        <div>
          <p className="audit-teaser-overall-label">Overall Visibility Score</p>
          <p className="audit-teaser-overall-url">{websiteUrl.replace(/^https?:\/\//, '')}</p>
        </div>
      </div>

      {/* 4-pillar scores */}
      <div className="audit-teaser-pillars">
        {[
          { label: 'SEO', score: results.seoScore },
          { label: 'AEO', score: results.aeoScore },
          { label: 'GEO', score: results.geoScore },
          { label: 'UX', score: results.uxScore },
        ].map(({ label, score }) => (
          <div key={label} className="audit-teaser-pillar">
            <div className="audit-teaser-pillar-top">
              <span className="audit-teaser-pillar-name">{label}</span>
              <span className="audit-teaser-pillar-score" style={{ color: scoreColor(score) }}>{score}</span>
            </div>
            <ScoreBar score={score} />
            <span className="audit-teaser-pillar-label" style={{ color: scoreColor(score) }}>
              {scoreLabel(score)}
            </span>
          </div>
        ))}
      </div>

      {/* Strongest + Blocker */}
      <div className="audit-teaser-signals">
        <div className="audit-teaser-signal audit-teaser-signal--positive">
          <span className="audit-teaser-signal-icon" aria-hidden="true">✓</span>
          <div>
            <p className="audit-teaser-signal-title">Strongest Signal</p>
            <p className="audit-teaser-signal-body">{results.strongestArea}</p>
          </div>
        </div>
        <div className="audit-teaser-signal audit-teaser-signal--warning">
          <span className="audit-teaser-signal-icon" aria-hidden="true">!</span>
          <div>
            <p className="audit-teaser-signal-title">Biggest Blocker</p>
            <p className="audit-teaser-signal-body">{results.biggestBlocker}</p>
          </div>
        </div>
      </div>

      {/* Quick wins */}
      {results.quickWins.length > 0 && (
        <div className="audit-teaser-wins">
          <p className="audit-teaser-wins-title">3 Quick Wins</p>
          <ol className="audit-teaser-wins-list">
            {results.quickWins.map((win, i) => (
              <li key={i} className="audit-teaser-win-item">{win}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Gate CTA */}
      <div className="audit-teaser-gate">
        <p className="audit-teaser-gate-headline">Your full SEO + AEO + GEO report is ready.</p>
        <p className="audit-teaser-gate-body">
          We found the key signals affecting how search engines, answer engines, and AI systems
          understand your website. Enter your email and we&rsquo;ll send the full personalized workup.
        </p>
        <button onClick={onUnlock} className="audit-submit-btn">
          Unlock My Full Report
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AuditFlow() {
  const [step, setStep]             = useState<Step>('input')
  const [session, setSession]       = useState<SessionState | null>(null)
  const [error, setError]           = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Input step state
  const [url, setUrl]               = useState('')
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry]     = useState('')
  const [challenge, setChallenge]   = useState('')
  const [showOptional, setShowOptional] = useState(false)

  // Loading step state
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0])
  const [polls, setPolls]           = useState(0)
  const msgIndexRef                 = useRef(0)
  const pollingRef                  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Email gate state
  const [firstName, setFirstName]   = useState('')
  const [email, setEmail]           = useState('')
  const [phone, setPhone]           = useState('')
  const [consent, setConsent]       = useState(false)

  // Rotate loading messages
  useEffect(() => {
    if (step !== 'loading') return
    const interval = setInterval(() => {
      msgIndexRef.current = (msgIndexRef.current + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[msgIndexRef.current])
    }, 3200)
    return () => clearInterval(interval)
  }, [step])

  // Poll status while loading
  useEffect(() => {
    if (step !== 'loading' || !session?.sessionId) return

    let cancelled = false
    let count = 0
    const MAX = 75 // 5 minutes max

    async function poll() {
      if (cancelled) return
      try {
        const res = await fetch(`/api/audit/status/${session!.sessionId}`)
        if (!res.ok) {
          if (!cancelled) scheduleNext()
          return
        }
        const data = await res.json()
        count++
        setPolls(count)

        if (data.status === 'teaser_ready' || data.status === 'email_sent' || data.status === 'completed') {
          if (!cancelled) {
            setSession((prev) => ({
              ...prev!,
              teaserResults: data.teaserResults,
            }))
            setStep('teaser')
          }
          return
        }

        if (data.status === 'failed') {
          if (!cancelled) {
            setError(
              "We couldn’t fully access your site, but we can still create a partial visibility snapshot. Please try continuing or contact us for a manual review."
            )
            setStep('input')
          }
          return
        }

        if (count >= MAX) {
          if (!cancelled) {
            setError('This is taking longer than expected. Please try again in a few minutes.')
            setStep('input')
          }
          return
        }

        if (!cancelled) scheduleNext()
      } catch {
        if (!cancelled) scheduleNext(6000)
      }
    }

    function scheduleNext(delay = 4000) {
      pollingRef.current = setTimeout(poll, delay)
    }

    poll()
    return () => {
      cancelled = true
      if (pollingRef.current) clearTimeout(pollingRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, session?.sessionId])

  // ── Step handlers ──────────────────────────────────────────────────────────

  async function handleStart(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!url.trim()) {
      setError('Please enter your website URL.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/audit/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteUrl:   url.trim(),
          businessName: businessName.trim() || undefined,
          industry:     industry.trim() || undefined,
          challenge:    challenge.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }
      setSession({ sessionId: data.sessionId, teaserResults: null as unknown as TeaserResults, websiteUrl: url.trim() })
      setStep('loading')
    } catch {
      setError('Network error. Please check your connection and try again.')
    }
    setSubmitting(false)
  }

  async function handleComplete(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!firstName.trim() || !email.trim()) {
      setError('Please enter your name and email.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/audit/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session!.sessionId,
          firstName:  firstName.trim(),
          email:      email.trim(),
          phone:      phone.trim() || undefined,
          consent,
        }),
      })
      const data = await res.json()
      if (!res.ok && res.status !== 207) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }
      if (data.warning) {
        setError(data.warning)
      }
      setStep('confirmation')
    } catch {
      setError('Network error. Please check your connection and try again.')
    }
    setSubmitting(false)
  }

  // ── Render steps ───────────────────────────────────────────────────────────

  if (step === 'loading') {
    return (
      <div className="audit-flow-loading">
        <div className="audit-flow-loading-inner">
          <div className="audit-loading-spinner-wrap">
            <span className="audit-spinner audit-spinner--large" aria-hidden="true" />
          </div>
          <p className="audit-loading-message" aria-live="polite">{loadingMsg}</p>
          <p className="audit-loading-hint">
            Analyzing {session?.websiteUrl?.replace(/^https?:\/\//, '') ?? 'your site'}…
          </p>
          <div className="audit-loading-dots" aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>
      </div>
    )
  }

  if (step === 'teaser' && session?.teaserResults) {
    return (
      <div className="audit-flow-teaser">
        <TeaserCard
          results={session.teaserResults}
          websiteUrl={session.websiteUrl}
          onUnlock={() => setStep('email-gate')}
        />
      </div>
    )
  }

  if (step === 'email-gate') {
    return (
      <div className="audit-flow-email-gate">
        <div className="audit-email-gate-card">
          <p className="audit-email-gate-eyebrow">Your visibility snapshot is ready.</p>
          <h2 className="audit-email-gate-headline">
            Get your full SEO + AEO + GEO report.
          </h2>
          <p className="audit-email-gate-body">
            We found the key signals affecting how search engines, answer engines, and AI systems
            understand your website. Enter your email and we&rsquo;ll send the full personalized workup —
            complete score breakdown, biggest blockers, and prioritized next steps.
          </p>

          <form onSubmit={handleComplete} className="audit-form" noValidate>
            <div className="audit-form-grid">
              <div className="audit-field">
                <label htmlFor="gate-name" className="audit-label">
                  First Name <span className="audit-required">*</span>
                </label>
                <input
                  id="gate-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alex"
                  className="audit-input"
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="audit-field">
                <label htmlFor="gate-email" className="audit-label">
                  Email <span className="audit-required">*</span>
                </label>
                <input
                  id="gate-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="audit-input"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="audit-field audit-field--full">
                <label htmlFor="gate-phone" className="audit-label">
                  Phone <span className="audit-label-hint">(optional)</span>
                </label>
                <input
                  id="gate-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="audit-input"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="audit-consent-row">
              <label className="audit-consent-checkbox-label">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="audit-consent-checkbox"
                />
                <span className="audit-consent-text">
                  I agree to receive my audit report and occasional insights from MOSO.
                </span>
              </label>
            </div>

            {error && (
              <div className="audit-error" role="alert">{error}</div>
            )}

            <div className="audit-form-footer">
              <button type="submit" disabled={submitting} className="audit-submit-btn">
                {submitting ? (
                  <span className="audit-btn-loading">
                    <span className="audit-spinner" aria-hidden="true" />
                    Sending…
                  </span>
                ) : 'Send My Full Report'}
              </button>
              <p className="audit-consent">
                By submitting, you agree to receive your audit report and occasional
                insights from MOSO. No spam. You can unsubscribe anytime.
              </p>
            </div>
          </form>

          <button
            onClick={() => setStep('teaser')}
            className="audit-back-link"
          >
            ← Back to my snapshot
          </button>
        </div>
      </div>
    )
  }

  if (step === 'confirmation') {
    return (
      <div className="audit-flow-confirmation">
        <div className="audit-confirmation-card">
          <div className="audit-confirmation-icon" aria-hidden="true">✓</div>
          <h2 className="audit-confirmation-headline">Your full report is on its way.</h2>
          <p className="audit-confirmation-body">
            Your SEO + AEO + GEO audit for{' '}
            <strong>{session?.websiteUrl?.replace(/^https?:\/\//, '') ?? 'your site'}</strong>{' '}
            is being prepared. Check your inbox in a few minutes — it includes your complete score breakdown,
            biggest blockers, and a prioritized roadmap.
          </p>
          <p className="audit-confirmation-hint">
            Sent to <strong>{email}</strong>
          </p>
          <a href="/contact" className="audit-submit-btn" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none', marginTop: '1.5rem' }}>
            Book a Strategy Session →
          </a>
          <p className="audit-confirmation-sub">
            Want to walk through your results with our team? We&rsquo;re happy to help you prioritize.
          </p>
        </div>
      </div>
    )
  }

  // ── Step 1: URL input ──────────────────────────────────────────────────────
  return (
    <div className="audit-form-container">
      <form onSubmit={handleStart} className="audit-form" noValidate>
        {/* URL field — primary */}
        <div className="audit-field">
          <label htmlFor="audit-url" className="audit-label">
            Website URL <span className="audit-required">*</span>
          </label>
          <input
            id="audit-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="audit-input audit-input--large"
            required
            autoComplete="url"
            autoFocus
          />
        </div>

        {/* Optional context toggle */}
        {!showOptional ? (
          <button
            type="button"
            onClick={() => setShowOptional(true)}
            className="audit-optional-toggle"
          >
            + Add business context (optional)
          </button>
        ) : (
          <div className="audit-optional-fields">
            <div className="audit-form-grid">
              <div className="audit-field">
                <label htmlFor="audit-business" className="audit-label">
                  Business Name
                </label>
                <input
                  id="audit-business"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your Company"
                  className="audit-input"
                  autoComplete="organization"
                />
              </div>

              <div className="audit-field">
                <label htmlFor="audit-industry" className="audit-label">
                  Industry / Business Type
                </label>
                <input
                  id="audit-industry"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Healthcare, Legal, Retail"
                  className="audit-input"
                />
              </div>

              <div className="audit-field audit-field--full">
                <label htmlFor="audit-challenge" className="audit-label">
                  Biggest Challenge <span className="audit-label-hint">(optional)</span>
                </label>
                <textarea
                  id="audit-challenge"
                  rows={3}
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="e.g. We're not showing up on Google, our site is slow, we want more leads…"
                  className="audit-input audit-textarea"
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="audit-error" role="alert">{error}</div>
        )}

        <div className="audit-form-footer">
          <button type="submit" disabled={submitting} className="audit-submit-btn">
            {submitting ? (
              <span className="audit-btn-loading">
                <span className="audit-spinner" aria-hidden="true" />
                Starting audit…
              </span>
            ) : 'Run My Free Audit'}
          </button>
          <p className="audit-trust-line">
            No credit card. Basic results instantly. Full report delivered by email.
          </p>
        </div>
      </form>
    </div>
  )
}
