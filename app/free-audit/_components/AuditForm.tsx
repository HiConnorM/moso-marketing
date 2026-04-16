'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuditForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)

    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      businessName: formData.get('businessName') as string,
      websiteUrl: formData.get('websiteUrl') as string,
      notes: formData.get('notes') as string,
    }

    try {
      const res = await fetch('/api/audit/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      router.push(`/free-audit/success?leadId=${data.leadId}`)
    } catch {
      setError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  return (
    <div className="audit-form-container">
      <form onSubmit={handleSubmit} className="audit-form" noValidate>
        <div className="audit-form-grid">
          {/* Name */}
          <div className="audit-field">
            <label htmlFor="audit-name" className="audit-label">
              First Name
            </label>
            <input
              id="audit-name"
              name="name"
              type="text"
              placeholder="Alex"
              className="audit-input"
              autoComplete="given-name"
            />
          </div>

          {/* Email */}
          <div className="audit-field">
            <label htmlFor="audit-email" className="audit-label">
              Email <span className="audit-required">*</span>
            </label>
            <input
              id="audit-email"
              name="email"
              type="email"
              placeholder="alex@company.com"
              className="audit-input"
              required
              autoComplete="email"
            />
          </div>

          {/* Business name */}
          <div className="audit-field">
            <label htmlFor="audit-business" className="audit-label">
              Business Name
            </label>
            <input
              id="audit-business"
              name="businessName"
              type="text"
              placeholder="Your Company"
              className="audit-input"
              autoComplete="organization"
            />
          </div>

          {/* Website URL */}
          <div className="audit-field">
            <label htmlFor="audit-url" className="audit-label">
              Website URL <span className="audit-required">*</span>
            </label>
            <input
              id="audit-url"
              name="websiteUrl"
              type="url"
              placeholder="https://yourwebsite.com"
              className="audit-input"
              required
              autoComplete="url"
            />
          </div>

          {/* Notes — full width */}
          <div className="audit-field audit-field--full">
            <label htmlFor="audit-notes" className="audit-label">
              Biggest Challenge <span className="audit-label-hint">(optional)</span>
            </label>
            <textarea
              id="audit-notes"
              name="notes"
              rows={3}
              placeholder="e.g. We're not showing up on Google, our site is slow, we want more leads..."
              className="audit-input audit-textarea"
            />
          </div>
        </div>

        {error && (
          <div className="audit-error" role="alert">
            {error}
          </div>
        )}

        <div className="audit-form-footer">
          <button
            type="submit"
            disabled={loading}
            className="audit-submit-btn"
          >
            {loading ? (
              <span className="audit-btn-loading">
                <span className="audit-spinner" aria-hidden="true" />
                Submitting…
              </span>
            ) : (
              'Send My Free Audit'
            )}
          </button>
          <p className="audit-consent">
            By submitting, you agree to receive your audit report and occasional
            insights from MOSO. No spam, ever.
          </p>
        </div>
      </form>
    </div>
  )
}
