import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../../lib/db/supabase-admin'
import type { TeaserResults } from '../../../../../types/audit'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: lead, error } = await db
    .from('audit_leads')
    .select('id, status, score, seo_score, aeo_score, geo_score, ux_score, teaser_results_json, created_at, website_url, business_name')
    .eq('id', id)
    .single()

  if (error || !lead) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    id:            lead.id,
    status:        lead.status,
    score:         lead.score,
    seoScore:      lead.seo_score,
    aeoScore:      lead.aeo_score,
    geoScore:      lead.geo_score,
    uxScore:       lead.ux_score,
    teaserResults: (lead.teaser_results_json as TeaserResults) ?? null,
    websiteUrl:    lead.website_url,
    businessName:  lead.business_name,
    createdAt:     lead.created_at,
  })
}
