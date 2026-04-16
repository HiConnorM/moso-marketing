import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../../lib/db/supabase-admin'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  const { data: lead, error } = await supabase
    .from('audit_leads')
    .select('id, status, score, created_at, website_url, business_name, name')
    .eq('id', id)
    .single()

  if (error || !lead) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Only return public-safe fields
  return NextResponse.json({
    id: lead.id,
    status: lead.status,
    score: lead.score,
    websiteUrl: lead.website_url,
    businessName: lead.business_name,
    createdAt: lead.created_at,
  })
}
