'use client'

import { useEffect, useState } from 'react'

type Status = 'queued' | 'running' | 'completed' | 'failed'

interface StatusData {
  id: string
  status: Status
  score: number | null
  websiteUrl: string
  businessName: string | null
  createdAt: string
}

const POLL_INTERVAL = 4000
const MAX_POLLS = 60 // 4 minutes max

const STATUS_STEPS: { key: Status | 'queued' | 'running'; label: string }[] = [
  { key: 'queued', label: 'Queued' },
  { key: 'running', label: 'Analyzing your site' },
  { key: 'completed', label: 'Report ready' },
]

function getStepIndex(status: Status) {
  if (status === 'queued') return 0
  if (status === 'running') return 1
  if (status === 'completed') return 2
  return 0
}

export default function AuditStatus({ leadId }: { leadId: string }) {
  const [data, setData] = useState<StatusData | null>(null)
  const [polls, setPolls] = useState(0)
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (!leadId) return

    let cancelled = false
    let count = 0

    async function poll() {
      if (cancelled) return

      try {
        const res = await fetch(`/api/audit/status/${leadId}`)
        if (!res.ok) return

        const json = (await res.json()) as StatusData
        if (cancelled) return

        setData(json)
        setPolls((p) => p + 1)
        count++

        if (json.status === 'completed' || json.status === 'failed') return

        if (count >= MAX_POLLS) {
          setTimedOut(true)
          return
        }

        setTimeout(poll, POLL_INTERVAL)
      } catch {
        if (!cancelled) setTimeout(poll, POLL_INTERVAL * 2)
      }
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [leadId])

  if (timedOut) {
    return (
      <div className="audit-status-card audit-status--timeout">
        <p className="audit-status-title">Still processing…</p>
        <p className="audit-status-body">
          This is taking longer than usual. Your report will be emailed to you
          as soon as it completes.
        </p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="audit-status-card">
        <div className="audit-status-loading">
          <span className="audit-spinner audit-spinner--large" aria-hidden="true" />
          <p>Loading your audit status…</p>
        </div>
      </div>
    )
  }

  const stepIndex = getStepIndex(data.status)
  const isFailed = data.status === 'failed'

  return (
    <div className={`audit-status-card${isFailed ? ' audit-status--failed' : ''}`}>
      {/* Steps */}
      {!isFailed && (
        <div className="audit-steps">
          {STATUS_STEPS.map((step, i) => (
            <div
              key={step.key}
              className={`audit-step${i <= stepIndex ? ' audit-step--active' : ''}${i === stepIndex && data.status !== 'completed' ? ' audit-step--current' : ''}`}
            >
              <div className="audit-step-dot">
                {i < stepIndex || data.status === 'completed' ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : i === stepIndex ? (
                  <span className="audit-spinner audit-spinner--small" aria-hidden="true" />
                ) : null}
              </div>
              <span className="audit-step-label">{step.label}</span>
            </div>
          ))}
        </div>
      )}

      {data.status === 'completed' && data.score !== null && (
        <div className="audit-status-score">
          <p className="audit-status-score-label">Your Score</p>
          <p className="audit-status-score-value">{data.score}<span>/100</span></p>
          <p className="audit-status-score-hint">
            Your full report is on its way to your inbox.
          </p>
        </div>
      )}

      {data.status === 'completed' && (
        <div className="audit-status-cta">
          <p>Want to talk through your results with our team?</p>
          <a href="/contact" className="audit-cta-link">
            Book a strategy call →
          </a>
        </div>
      )}

      {isFailed && (
        <div className="audit-status-failed">
          <p className="audit-status-title">Audit could not complete</p>
          <p className="audit-status-body">
            We ran into an issue analyzing <strong>{data.websiteUrl}</strong>.
            This can happen with sites that block automated requests. Please{' '}
            <a href="/contact">contact us</a> and we will run it manually.
          </p>
        </div>
      )}
    </div>
  )
}
