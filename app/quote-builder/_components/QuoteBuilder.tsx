'use client'

import { useState, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Answers {
  buildGoals: string[]
  stage: string
  businessType: string
  outcome: string
  services: string[]
  pageCount: string
  needsCopywriting: string
  needsCMS: string
  websiteIntegrations: string[]
  appType: string
  appLevel: string
  monthlySupport: string
  timeline: string
  budget: string
  contactName: string
  contactEmail: string
  businessName: string
  websiteUrl: string
  phone: string
  description: string
  wantsMOSOReview: boolean
}

interface QuoteResult {
  packageName: string
  packageDesc: string
  rangeMin: number
  rangeMax: number
  monthlyPlanName: string
  monthlyMin: number
  monthlyMax: number
  whatsIncluded: string[]
  timeline: string
  leadScore: number
  leadTemp: 'hot' | 'warm' | 'cold'
}

// ─── Step data ────────────────────────────────────────────────────────────────

const BUILD_GOALS = [
  { id: 'brand',      label: 'Brand Identity',           desc: 'Logo, visual identity, and brand system' },
  { id: 'website',    label: 'Website',                  desc: 'A stronger, more credible digital home' },
  { id: 'app',        label: 'App or Software MVP',      desc: 'Build a tool, dashboard, portal, or SaaS product' },
  { id: 'seo',        label: 'SEO / AEO Visibility',     desc: 'Show up in Google and AI search results' },
  { id: 'content',    label: 'Social Content System',    desc: 'Build a consistent content engine' },
  { id: 'ads',        label: 'Ads / Lead Generation',    desc: 'Drive qualified leads with paid channels' },
  { id: 'automation', label: 'Automation or CRM System', desc: 'Organize operations and automate workflows' },
  { id: 'growth',     label: 'Full Growth System',       desc: 'Website, SEO, content, and campaigns together' },
  { id: 'unsure',     label: "I'm Not Sure Yet",         desc: 'Start with a strategy session to find the right path' },
]

const STAGES = [
  { id: 'scratch',  label: 'Starting from scratch',         desc: 'Brand new — nothing exists yet' },
  { id: 'rebuild',  label: 'Rebuilding something existing', desc: "What we have isn't working" },
  { id: 'improve',  label: 'Improving what already works',  desc: 'Refining and elevating the current state' },
  { id: 'scale',    label: 'Scaling after traction',        desc: 'We have momentum and need to grow' },
  { id: 'fix',      label: 'Fixing a messy system',         desc: 'Operations or marketing is disorganized' },
  { id: 'launch',   label: 'Launching something new',       desc: 'New product, service, or offering' },
]

const BUSINESS_TYPES = [
  { id: 'restaurant',   label: 'Restaurant / Hospitality',       desc: '' },
  { id: 'wellness',     label: 'Therapy / Wellness / Healthcare', desc: '' },
  { id: 'professional', label: 'Professional Services',           desc: '' },
  { id: 'local',        label: 'Local Service Business',          desc: '' },
  { id: 'creative',     label: 'Creative / Culture / Events',     desc: '' },
  { id: 'nonprofit',    label: 'Nonprofit / Mission-Based',       desc: '' },
  { id: 'startup',      label: 'Startup / Software',              desc: '' },
  { id: 'ecommerce',    label: 'Ecommerce / Product-Based',       desc: '' },
  { id: 'education',    label: 'Education / Coaching',            desc: '' },
  { id: 'other',        label: 'Other',                           desc: '' },
]

const OUTCOMES = [
  { id: 'credibility',     label: 'Look more credible',          desc: 'Build trust and professional presence' },
  { id: 'leads',           label: 'Get more leads',              desc: 'Drive qualified inquiries and conversions' },
  { id: 'clarity',         label: 'Explain our offer clearly',   desc: 'Make what we do obvious and compelling' },
  { id: 'launch',          label: 'Launch a new business',       desc: 'Go from idea to market' },
  { id: 'product',         label: 'Build a product or app',      desc: 'Ship a tool, platform, or SaaS' },
  { id: 'search',          label: 'Improve search visibility',   desc: 'Rank higher in Google results' },
  { id: 'ai-search',       label: 'Show up in AI search',        desc: 'Get cited in ChatGPT and Perplexity' },
  { id: 'content-system',  label: 'Create a content system',     desc: 'Build repeatable, consistent content' },
  { id: 'conversions',     label: 'Increase conversions',        desc: 'Turn more visitors into customers' },
  { id: 'operations',      label: 'Organize operations',         desc: 'Automate and structure workflows' },
]

const SERVICE_GROUPS = [
  {
    group: 'Strategy',
    items: [
      { id: 'brand-strategy', label: 'Brand Strategy' },
      { id: 'offer-clarity',  label: 'Offer Clarity' },
      { id: 'positioning',    label: 'Positioning' },
      { id: 'messaging',      label: 'Messaging' },
      { id: 'web-strategy',   label: 'Website Strategy' },
      { id: 'growth-roadmap', label: 'Growth Roadmap' },
    ],
  },
  {
    group: 'Brand',
    items: [
      { id: 'logo-system',       label: 'Logo System' },
      { id: 'visual-identity',   label: 'Visual Identity' },
      { id: 'brand-guidelines',  label: 'Brand Guidelines' },
      { id: 'brand-voice',       label: 'Brand Voice' },
      { id: 'social-templates',  label: 'Social Templates' },
      { id: 'pitch-deck',        label: 'Pitch Deck' },
    ],
  },
  {
    group: 'Website',
    items: [
      { id: 'web-design',    label: 'Website Design' },
      { id: 'web-dev',       label: 'Website Development' },
      { id: 'copywriting',   label: 'Copywriting' },
      { id: 'cms-blog',      label: 'CMS / Blog' },
      { id: 'landing-page',  label: 'Landing Page' },
      { id: 'local-seo',     label: 'Local SEO' },
      { id: 'technical-seo', label: 'Technical SEO' },
      { id: 'aeo',           label: 'AEO / AI Search' },
    ],
  },
  {
    group: 'App / Software',
    items: [
      { id: 'app-strategy',   label: 'Product Strategy' },
      { id: 'app-ux',         label: 'UI / UX Design' },
      { id: 'app-prototype',  label: 'Clickable Prototype' },
      { id: 'app-mvp',        label: 'MVP Development' },
      { id: 'app-dashboard',  label: 'Dashboard' },
      { id: 'app-payments',   label: 'Payment System' },
      { id: 'app-ai',         label: 'AI Feature Integration' },
    ],
  },
  {
    group: 'Growth',
    items: [
      { id: 'seo-growth',      label: 'SEO' },
      { id: 'aeo-growth',      label: 'AEO' },
      { id: 'social-system',   label: 'Social Media System' },
      { id: 'blog-content',    label: 'Blog Content' },
      { id: 'email-marketing', label: 'Email Marketing' },
      { id: 'paid-ads',        label: 'Paid Ads' },
      { id: 'lead-magnet',     label: 'Lead Magnet' },
      { id: 'crm-setup',       label: 'CRM Setup' },
      { id: 'automation',      label: 'Automation' },
    ],
  },
]

const PAGE_COUNTS = [
  { id: '1',     label: '1 landing page',  desc: 'Single-page focus' },
  { id: '3-5',   label: '3–5 pages',       desc: 'Small, focused site' },
  { id: '6-10',  label: '6–10 pages',      desc: 'Standard business site' },
  { id: '11-20', label: '11–20 pages',     desc: 'Larger site with depth' },
  { id: '20+',   label: '20+ pages',       desc: 'Full platform or enterprise' },
  { id: 'unsure',label: 'Not sure',        desc: "We'll help define the scope" },
]

const COPYWRITING_NEEDS = [
  { id: 'yes',   label: 'Yes, write it for us',         desc: 'Full copywriting service' },
  { id: 'edit',  label: 'Edit our rough copy',          desc: 'We have drafts that need polish' },
  { id: 'final', label: 'We have final copy',           desc: 'Ready to use as-is' },
  { id: 'unsure',label: 'Not sure yet',                 desc: '' },
]

const CMS_NEEDS = [
  { id: 'yes',   label: 'Yes',          desc: 'Blog, case studies, or news section' },
  { id: 'no',    label: 'No',           desc: 'Static content only' },
  { id: 'later', label: 'Maybe later',  desc: 'Not needed at launch' },
]

const WEBSITE_INTEGRATIONS = [
  { id: 'booking',      label: 'Booking System' },
  { id: 'payments',     label: 'Payments' },
  { id: 'crm',          label: 'CRM Integration' },
  { id: 'email-mkt',    label: 'Email Marketing' },
  { id: 'forms',        label: 'Forms / Lead Capture' },
  { id: 'analytics',    label: 'Analytics' },
  { id: 'membership',   label: 'Membership' },
  { id: 'donations',    label: 'Donations' },
  { id: 'portal',       label: 'Client Portal' },
  { id: 'menu',         label: 'Menu System' },
  { id: 'events',       label: 'Events Calendar' },
  { id: 'ordering',     label: 'Online Ordering' },
]

const APP_TYPES = [
  { id: 'mobile',      label: 'Mobile App',          desc: 'iOS and/or Android' },
  { id: 'web-app',     label: 'Web App',              desc: 'Browser-based application' },
  { id: 'saas',        label: 'SaaS Platform',        desc: 'Subscription-based software' },
  { id: 'portal',      label: 'Client Portal',        desc: 'Gated access for clients' },
  { id: 'dashboard',   label: 'Internal Dashboard',   desc: 'Internal tools and reporting' },
  { id: 'marketplace', label: 'Marketplace',          desc: 'Multi-vendor platform' },
  { id: 'ai-tool',     label: 'AI-Powered Tool',      desc: 'AI features or integrations' },
  { id: 'booking',     label: 'Booking Platform',     desc: 'Scheduling and reservations' },
  { id: 'community',   label: 'Community Platform',   desc: 'Member community or forum' },
  { id: 'unsure',      label: 'Not sure yet',         desc: '' },
]

const APP_LEVELS = [
  { id: 'strategy',   label: 'Product Strategy Only',  desc: 'Roadmap, scope, and recommendation' },
  { id: 'prototype',  label: 'Clickable Prototype',     desc: 'Interactive design to test and present' },
  { id: 'mvp',        label: 'MVP Build',               desc: 'Functional first version' },
  { id: 'production', label: 'Production-Ready App',    desc: 'Fully polished and scalable' },
  { id: 'platform',   label: 'Full Platform',           desc: 'Enterprise-grade system' },
]

const MONTHLY_SUPPORT_OPTIONS = [
  { id: 'none',    label: 'Project only',                desc: 'Just the build, no ongoing support' },
  { id: 'care',    label: 'Website care and updates',   desc: 'Keep the site healthy and current' },
  { id: 'seo',     label: 'SEO / AEO growth',           desc: 'Ongoing search and AI visibility' },
  { id: 'content', label: 'Content and social',         desc: 'Monthly content creation and posting' },
  { id: 'ads',     label: 'Ads and lead generation',    desc: 'Ongoing campaign management' },
  { id: 'product', label: 'App / Product support',      desc: 'Ongoing updates and iteration' },
  { id: 'full',    label: 'Full monthly growth partner',desc: 'Strategy, content, SEO, and campaigns' },
  { id: 'unsure',  label: 'Not sure yet',               desc: "We'll recommend the right plan" },
]

const TIMELINES = [
  { id: 'asap',       label: 'ASAP',          desc: 'Rush timeline — priority pricing applies' },
  { id: '2-4weeks',   label: '2–4 weeks',     desc: 'Accelerated start' },
  { id: '1-2months',  label: '1–2 months',    desc: 'Standard timeline' },
  { id: '3-6months',  label: '3–6 months',    desc: 'Flexible schedule' },
  { id: 'flexible',   label: 'Flexible',      desc: 'No set timeline' },
]

const BUDGETS = [
  { id: '1000-3000',   label: '$1,000–$3,000',   desc: 'Strategy and clarity packages' },
  { id: '3000-5000',   label: '$3,000–$5,000',   desc: 'Focused deliverables' },
  { id: '5000-10000',  label: '$5,000–$10,000',  desc: 'Core brand or web projects' },
  { id: '10000-20000', label: '$10,000–$20,000', desc: 'Full website or brand systems' },
  { id: '20000-50000', label: '$20,000–$50,000', desc: 'Growth systems and apps' },
  { id: '50000+',      label: '$50,000+',         desc: 'Full platforms and ecosystems' },
  { id: 'unsure',      label: 'Not sure yet',     desc: "We'll help define the right range" },
]

// ─── Step IDs ─────────────────────────────────────────────────────────────────

const ALL_STEP_IDS = [
  'welcome', 'buildGoals', 'stage', 'businessType', 'outcome',
  'services', 'websiteDetails', 'appDetails',
  'monthlySupport', 'timeline', 'budget', 'contact', 'results',
]

function getActiveSteps(answers: Answers): string[] {
  const wantsWebsite =
    answers.buildGoals.includes('website') ||
    answers.buildGoals.includes('growth') ||
    answers.services.some(s => ['web-design', 'web-dev', 'landing-page', 'local-seo', 'technical-seo', 'aeo'].includes(s))

  const wantsApp =
    answers.buildGoals.includes('app') ||
    answers.services.some(s => s.startsWith('app-'))

  return ALL_STEP_IDS.filter(id => {
    if (id === 'websiteDetails') return wantsWebsite
    if (id === 'appDetails') return wantsApp
    return true
  })
}

// ─── Quote calculation ────────────────────────────────────────────────────────

interface PackageDef {
  name: string
  desc: string
  min: number
  max: number
  included: string[]
  timeline: string
}

const PACKAGES: Record<string, PackageDef> = {
  'foundation-strategy': {
    name: 'Foundation Strategy Session',
    desc: 'A deep strategy session to clarify your path, diagnose your situation, and map the right next step.',
    min: 1000, max: 1000,
    included: ['90-minute strategy session', 'Brand, website, or growth diagnosis', 'Current state review', 'Priority roadmap', 'Recommended MOSO package', 'Investment range estimate', 'Next-step action plan'],
    timeline: '1–2 weeks',
  },
  'brand-clarity': {
    name: 'Brand Clarity System',
    desc: 'Positioning, messaging, offer clarity, and brand story — built for businesses that need to communicate with more precision.',
    min: 3000, max: 6000,
    included: ['Positioning strategy', 'Brand message development', 'Offer clarity framework', 'Audience direction', 'Voice and tone direction', 'Homepage message structure', 'Brand story foundation'],
    timeline: '3–5 weeks',
  },
  'growth-roadmap': {
    name: 'Growth Roadmap',
    desc: 'A complete audit of your digital presence with a 90-day action plan to fix the right things in the right order.',
    min: 3500, max: 7500,
    included: ['Digital presence audit', 'Website review', 'SEO / AEO review', 'Content system review', 'Lead flow analysis', 'Offer review', 'Funnel recommendations', '90-day growth plan'],
    timeline: '3–4 weeks',
  },
  'identity-foundation': {
    name: 'Identity Foundation',
    desc: 'A complete brand identity system — logo, color, type, visual direction, and assets — ready for launch.',
    min: 5000, max: 10000,
    included: ['Logo system', 'Color palette', 'Typography system', 'Visual direction', 'Brand guidelines', 'Social profile assets', 'Brand application examples'],
    timeline: '4–7 weeks',
  },
  'full-brand-system': {
    name: 'Full Brand System',
    desc: 'Strategy, identity, voice, and launch assets — everything needed to show up with authority.',
    min: 10000, max: 25000,
    included: ['Brand strategy', 'Positioning and messaging', 'Logo system', 'Visual identity', 'Brand voice guide', 'Art direction', 'Brand guidelines', 'Social templates', 'Launch assets'],
    timeline: '6–10 weeks',
  },
  'landing-page': {
    name: 'Landing Page System',
    desc: 'One high-converting page designed and built to capture attention and generate action.',
    min: 3500, max: 7500,
    included: ['Landing page strategy', 'Page structure and UX', 'Copy direction', 'Custom design', 'Development', 'Lead form', 'Analytics setup', 'Basic SEO', 'Launch support'],
    timeline: '3–5 weeks',
  },
  'website-foundation': {
    name: 'Website Foundation System',
    desc: 'A clean, credible, conversion-ready website — strategy, design, and development done right.',
    min: 8000, max: 15000,
    included: ['Website strategy', 'Sitemap', 'UX structure', 'Messaging support', 'Custom design', 'Development', '3–7 core pages', 'Responsive build', 'Basic SEO setup', 'AEO structure', 'Analytics', 'Launch QA'],
    timeline: '6–8 weeks',
  },
  'website-growth': {
    name: 'Website Growth System',
    desc: 'A full website built for leads — with content architecture, SEO/AEO structure, and conversion strategy baked in.',
    min: 15000, max: 35000,
    included: ['Everything in Website Foundation', 'Conversion strategy', 'Copywriting', 'Blog / CMS setup', 'SEO / AEO content structure', 'Lead magnet or conversion path', 'CRM integration', 'Email capture', 'Analytics dashboard', '30-day post-launch support'],
    timeline: '8–12 weeks',
  },
  'full-digital-platform': {
    name: 'Full Digital Platform',
    desc: 'A complete digital ecosystem — brand, website, content, automation, and integrations working as one.',
    min: 30000, max: 75000,
    included: ['Website strategy', 'Brand / messaging system', 'Advanced UX', 'Custom design', 'Custom development', 'CMS', 'CRM integration', 'Automations', 'Advanced SEO / AEO', 'Analytics', 'Performance optimization', 'Launch support'],
    timeline: '14–20 weeks',
  },
  'seo-sprint': {
    name: 'SEO / AEO Visibility Sprint',
    desc: 'A focused audit and action plan to improve how you show up in Google and AI-powered search.',
    min: 3000, max: 7500,
    included: ['SEO audit', 'AEO audit', 'Technical site review', 'Structured data recommendations', 'Search intent map', 'AI visibility recommendations', 'Priority action plan'],
    timeline: '3–4 weeks',
  },
  'seo-implementation': {
    name: 'SEO / AEO Implementation Package',
    desc: 'Full SEO and AEO implementation — every recommendation built, not just delivered.',
    min: 7500, max: 15000,
    included: ['Full audit', 'On-page optimization', 'Metadata updates', 'Heading structure', 'Internal linking', 'Schema implementation', 'Service page improvements', 'Blog content structure', 'Local SEO improvements'],
    timeline: '5–8 weeks',
  },
  'content-engine': {
    name: 'Content Engine Setup',
    desc: 'Build your content strategy, pillars, templates, and system — so you always know what to create.',
    min: 4000, max: 10000,
    included: ['Content strategy', 'Brand voice direction', 'Content pillars', 'Post format system', 'Caption system', 'Monthly calendar structure', 'Repurposing matrix', 'Social templates'],
    timeline: '4–6 weeks',
  },
  'app-strategy': {
    name: 'App / MVP Strategy Sprint',
    desc: 'Product strategy, user flows, MVP scope, tech stack recommendation, and build roadmap — before a single line of code.',
    min: 5000, max: 12000,
    included: ['Product strategy', 'User flows', 'Feature prioritization', 'MVP scope definition', 'Tech stack recommendation', 'Wireframe direction', 'Build roadmap', 'Investment estimate'],
    timeline: '4–6 weeks',
  },
  'app-prototype': {
    name: 'Clickable Prototype',
    desc: 'An interactive, investor-ready prototype that validates your idea and reduces build risk.',
    min: 8000, max: 20000,
    included: ['Product flow', 'Core screens', 'UX design', 'UI direction', 'Clickable prototype', 'Investor / demo-ready presentation', 'Build recommendations'],
    timeline: '6–8 weeks',
  },
  'mvp-build': {
    name: 'MVP Build',
    desc: 'A fully functional first version — designed, built, tested, and deployed.',
    min: 25000, max: 75000,
    included: ['Product strategy', 'UX / UI design', 'Frontend development', 'Backend development', 'Database', 'Authentication', 'Admin dashboard', 'Core feature build', 'QA', 'Deployment', 'Analytics setup'],
    timeline: '12–20 weeks',
  },
  'full-platform': {
    name: 'Full Product Platform',
    desc: 'A production-grade platform — architecture, design system, payments, admin, and DevOps.',
    min: 75000, max: 150000,
    included: ['Full product strategy', 'Technical architecture', 'UX / UI', 'Design system', 'Frontend', 'Backend', 'Database and API', 'Admin system', 'User accounts', 'Payments and subscriptions', 'Analytics', 'DevOps', 'Launch support'],
    timeline: '24–40 weeks',
  },
  'crm-foundation': {
    name: 'CRM Foundation',
    desc: 'A clean, organized CRM system — pipeline, contacts, automations, and lead flow built from scratch.',
    min: 3500, max: 8000,
    included: ['CRM setup', 'Pipeline stages', 'Contact fields', 'Lead source tracking', 'Forms', 'Basic automations', 'Follow-up tasks', 'Internal workflow'],
    timeline: '3–5 weeks',
  },
  'lead-system': {
    name: 'Lead System Buildout',
    desc: 'Everything needed to capture, track, nurture, and close leads — from form to pipeline.',
    min: 7500, max: 18000,
    included: ['CRM setup', 'Lead capture forms', 'Website integration', 'Email sequence', 'Booking integration', 'Internal notifications', 'Pipeline automation', 'Reporting dashboard'],
    timeline: '5–8 weeks',
  },
}

interface MonthlyPlanDef { name: string; price: number }
const MONTHLY_PLANS: Record<string, MonthlyPlanDef> = {
  'website-care':    { name: 'Website Care Plan',          price: 1000 },
  'website-growth':  { name: 'Website Growth Plan',        price: 2500 },
  'search-growth':   { name: 'Search Growth Plan',         price: 3000 },
  'content-engine':  { name: 'Content Engine Plan',        price: 3500 },
  'content-growth':  { name: 'Content Growth Plan',        price: 5000 },
  'lead-generation': { name: 'Lead Generation Plan',       price: 4000 },
  'full-growth':     { name: 'Full Growth Partner Plan',   price: 7500 },
  'product-support': { name: 'Product Support Plan',       price: 5000 },
  'product-growth':  { name: 'Product Growth Plan',        price: 8500 },
}

function selectPackage(answers: Answers): string {
  const { buildGoals, services, pageCount, appLevel, budget, outcome } = answers

  const hasWebsite    = buildGoals.includes('website') || buildGoals.includes('growth') || services.some(s => ['web-design','web-dev','landing-page'].includes(s))
  const hasApp        = buildGoals.includes('app') || services.some(s => s.startsWith('app-'))
  const hasBrand      = buildGoals.includes('brand') || services.some(s => ['logo-system','visual-identity','brand-guidelines'].includes(s))
  const hasSEO        = buildGoals.includes('seo') || services.some(s => ['local-seo','technical-seo','aeo','seo-growth','aeo-growth'].includes(s))
  const hasContent    = buildGoals.includes('content') || services.some(s => ['social-system','blog-content','social-templates'].includes(s))
  const hasAds        = buildGoals.includes('ads') || services.includes('paid-ads')
  const hasAutomation = buildGoals.includes('automation') || services.some(s => ['crm-setup','automation'].includes(s))
  const isUnsure      = buildGoals.includes('unsure') && buildGoals.length === 1
  const isBudgetLow   = budget === '1000-3000'
  const isBudgetHigh  = budget === '20000-50000' || budget === '50000+'

  if (isBudgetLow || isUnsure) return 'foundation-strategy'

  if (hasApp) {
    if (appLevel === 'strategy')  return 'app-strategy'
    if (appLevel === 'prototype') return 'app-prototype'
    if (appLevel === 'platform')  return 'full-platform'
    if (appLevel === 'mvp' || appLevel === 'production') return 'mvp-build'
    return 'app-strategy'
  }

  if (hasWebsite) {
    const hasExtras = hasSEO || hasContent || services.includes('crm-setup') || services.includes('email-marketing')
    if (pageCount === '1' && !hasExtras) return 'landing-page'
    if (isBudgetHigh || pageCount === '20+' || (hasWebsite && hasExtras && hasSEO)) return isBudgetHigh ? 'full-digital-platform' : 'website-growth'
    if (pageCount === '11-20' || hasExtras) return 'website-growth'
    return 'website-foundation'
  }

  if (hasBrand) {
    const hasFullIdentity = services.some(s => ['logo-system','visual-identity'].includes(s))
    const hasStratLayer   = services.some(s => ['brand-strategy','positioning','messaging'].includes(s))
    if (hasFullIdentity && hasStratLayer && isBudgetHigh) return 'full-brand-system'
    if (hasFullIdentity) return 'identity-foundation'
    return 'brand-clarity'
  }

  if (hasSEO && !hasWebsite) {
    if (services.some(s => ['technical-seo','aeo'].includes(s)) || budget === '5000-10000' || budget === '10000-20000') return 'seo-implementation'
    return 'seo-sprint'
  }

  if (hasContent && !hasWebsite) return 'content-engine'

  if (hasAds) return 'lead-system'
  if (hasAutomation) return 'crm-foundation'

  if (outcome === 'clarity' || services.some(s => ['positioning','messaging','offer-clarity'].includes(s))) return 'brand-clarity'

  return 'growth-roadmap'
}

function selectMonthlyKey(pkgKey: string, answers: Answers): string | null {
  const { monthlySupport } = answers
  if (monthlySupport === 'none') return null

  if (['full-platform','mvp-build','app-prototype','app-strategy'].includes(pkgKey)) {
    return monthlySupport === 'product' ? 'product-growth' : 'product-support'
  }
  if (['full-digital-platform','website-growth'].includes(pkgKey)) {
    return (monthlySupport === 'full' || monthlySupport === 'seo') ? 'full-growth' : 'search-growth'
  }
  if (['website-foundation','landing-page'].includes(pkgKey)) {
    return monthlySupport === 'seo' ? 'website-growth' : 'website-care'
  }
  if (['seo-sprint','seo-implementation'].includes(pkgKey)) return 'search-growth'
  if (['content-engine'].includes(pkgKey)) {
    return monthlySupport === 'full' ? 'content-growth' : 'content-engine'
  }
  if (['lead-system','crm-foundation'].includes(pkgKey)) return 'lead-generation'
  if (monthlySupport === 'full') return 'full-growth'
  if (monthlySupport === 'content') return 'content-engine'
  if (monthlySupport === 'seo') return 'search-growth'
  return null
}

function applyUrgency(price: number, timeline: string): number {
  if (timeline === 'asap')      return Math.round(price * 1.25)
  if (timeline === '2-4weeks')  return Math.round(price * 1.15)
  return price
}

function calcLeadScore(answers: Answers): { score: number; temp: 'hot' | 'warm' | 'cold' } {
  let score = 0

  const budgetPts: Record<string, number> = {
    '50000+': 40, '20000-50000': 35, '10000-20000': 30,
    '5000-10000': 20, '3000-5000': 15, '1000-3000': 5, 'unsure': 10,
  }
  score += budgetPts[answers.budget] ?? 10

  const timelinePts: Record<string, number> = {
    'asap': 25, '2-4weeks': 20, '1-2months': 15, '3-6months': 5, 'flexible': 0,
  }
  score += timelinePts[answers.timeline] ?? 0

  if (answers.buildGoals.length > 0 && !answers.buildGoals.includes('unsure')) score += 10
  if (answers.services.length >= 3) score += 8
  if (answers.outcome) score += 5
  if (answers.monthlySupport && !['none','unsure'].includes(answers.monthlySupport)) score += 15
  if (answers.businessName) score += 5
  if (answers.websiteUrl) score += 5

  const s = Math.min(score, 100)
  return { score: s, temp: s >= 80 ? 'hot' : s >= 50 ? 'warm' : 'cold' }
}

function calculateQuote(answers: Answers): QuoteResult {
  const pkgKey = selectPackage(answers)
  const pkg = PACKAGES[pkgKey]
  const monthlyKey = selectMonthlyKey(pkgKey, answers)
  const monthly = monthlyKey ? MONTHLY_PLANS[monthlyKey] : null
  const { score, temp } = calcLeadScore(answers)

  return {
    packageName:    pkg.name,
    packageDesc:    pkg.desc,
    rangeMin:       applyUrgency(pkg.min, answers.timeline),
    rangeMax:       applyUrgency(pkg.max, answers.timeline),
    monthlyPlanName: monthly?.name ?? '',
    monthlyMin:     monthly?.price ?? 0,
    monthlyMax:     monthly?.price ?? 0,
    whatsIncluded:  pkg.included,
    timeline:       pkg.timeline,
    leadScore:      score,
    leadTemp:       temp,
  }
}

function fmtMoney(n: number): string {
  if (n === 0) return ''
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`
  return `$${n}`
}

// ─── Default answers ──────────────────────────────────────────────────────────

const DEFAULT_ANSWERS: Answers = {
  buildGoals: [], stage: '', businessType: '', outcome: '', services: [],
  pageCount: '', needsCopywriting: '', needsCMS: '', websiteIntegrations: [],
  appType: '', appLevel: '',
  monthlySupport: '', timeline: '', budget: '',
  contactName: '', contactEmail: '', businessName: '', websiteUrl: '', phone: '',
  description: '', wantsMOSOReview: true,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuoteBuilder() {
  const [currentStepId, setCurrentStepId] = useState('welcome')
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS)
  const [stepKey, setStepKey] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null)

  const activeSteps = getActiveSteps(answers)
  const currentIndex = activeSteps.indexOf(currentStepId)
  const questionSteps = activeSteps.filter(s => !['welcome', 'results'].includes(s))
  const questionIndex = questionSteps.indexOf(currentStepId)
  const progress = currentStepId === 'welcome' ? 0
    : currentStepId === 'results'  ? 100
    : Math.round(((questionIndex + 1) / questionSteps.length) * 100)

  const navigate = useCallback((dir: 'next' | 'back') => {
    setStepKey(k => k + 1)
    setCurrentStepId(prev => {
      const idx = activeSteps.indexOf(prev)
      const next = dir === 'next' ? activeSteps[idx + 1] : activeSteps[idx - 1]
      return next ?? prev
    })
  }, [activeSteps])

  function toggleMulti(field: 'buildGoals' | 'services' | 'websiteIntegrations', id: string) {
    setAnswers(prev => {
      const arr = prev[field] as string[]
      return { ...prev, [field]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] }
    })
  }

  function setSingle(field: keyof Answers, value: string) {
    setAnswers(prev => ({ ...prev, [field]: value }))
  }

  async function handleContactSubmit() {
    if (!answers.contactName.trim() || !answers.contactEmail.trim()) {
      setSubmitError('Please enter your name and email to continue.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.contactEmail)) {
      setSubmitError('Please enter a valid email address.')
      return
    }

    setSubmitError('')
    setIsSubmitting(true)

    const result = calculateQuote(answers)
    setQuoteResult(result)

    try {
      await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, result }),
      })
    } catch {
      // Non-fatal — show results regardless
    }

    setIsSubmitting(false)
    setStepKey(k => k + 1)
    setCurrentStepId('results')
  }

  function restart() {
    setAnswers(DEFAULT_ANSWERS)
    setQuoteResult(null)
    setSubmitError('')
    setStepKey(k => k + 1)
    setCurrentStepId('welcome')
  }

  // ── Render helpers ───────────────────────────────────────────────────────────

  function OptionGrid({ options, field, multi, cols = 3 }: {
    options: { id: string; label: string; desc?: string }[]
    field: 'buildGoals' | 'services' | 'websiteIntegrations' | keyof Answers
    multi: boolean
    cols?: 2 | 3
  }) {
    const selected = multi ? (answers[field as 'buildGoals'] as string[]) : answers[field as keyof Answers] as string
    return (
      <div className={`qb-options cols-${cols}`}>
        {options.map(opt => {
          const isSelected = multi ? (selected as string[]).includes(opt.id) : selected === opt.id
          return (
            <button
              key={opt.id}
              className={`qb-option${isSelected ? ' selected' : ''}`}
              onClick={() => {
                if (multi) toggleMulti(field as 'buildGoals' | 'services' | 'websiteIntegrations', opt.id)
                else setSingle(field as keyof Answers, opt.id)
              }}
            >
              <div className="qb-option-label">{opt.label}</div>
              {opt.desc && <div className="qb-option-desc">{opt.desc}</div>}
            </button>
          )
        })}
      </div>
    )
  }

  function NavRow({ canNext, onNext, skipLabel }: { canNext: boolean; onNext?: () => void; skipLabel?: string }) {
    return (
      <div className="qb-nav">
        {currentStepId !== 'welcome' && currentIndex > 0 ? (
          <button className="qb-btn-back" onClick={() => navigate('back')}>← Back</button>
        ) : <span />}
        <div className="qb-nav-right">
          {skipLabel && (
            <button className="qb-skip-link" onClick={() => navigate('next')}>{skipLabel}</button>
          )}
          <button
            className="qb-btn-next"
            disabled={!canNext}
            onClick={onNext ?? (() => navigate('next'))}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  // ── Step renderers ────────────────────────────────────────────────────────────

  function renderWelcome() {
    return (
      <div className="qb-welcome">
        <div className="qb-welcome-eyebrow">MOSO Project Estimator</div>
        <h1 className="qb-welcome-headline">Let's shape your project.</h1>
        <p className="qb-welcome-body">
          This builder helps estimate the right starting point for your brand, website, app, content, or growth system.
          You'll receive a planning range, recommended package, monthly support options, and clear next steps.
        </p>
        <button className="qb-welcome-cta" onClick={() => navigate('next')}>
          Start My Estimate
        </button>
        <p className="qb-welcome-meta">Takes about 4 minutes · No commitment required</p>
      </div>
    )
  }

  function renderBuildGoals() {
    return (
      <>
        <div className="qb-step-counter">Step {questionIndex + 1} of {questionSteps.length}</div>
        <h2 className="qb-headline">What are you trying to build?</h2>
        <p className="qb-subhead">Select everything that applies. You can choose more than one.</p>
        <OptionGrid options={BUILD_GOALS} field="buildGoals" multi cols={3} />
        <NavRow canNext={answers.buildGoals.length > 0} />
      </>
    )
  }

  function renderStage() {
    return (
      <>
        <div className="qb-step-counter">Step {questionIndex + 1} of {questionSteps.length}</div>
        <h2 className="qb-headline">What stage are you in?</h2>
        <p className="qb-subhead">This helps determine whether your project needs strategy first or execution first.</p>
        <OptionGrid options={STAGES} field="stage" multi={false} cols={2} />
        <NavRow canNext={!!answers.stage} />
      </>
    )
  }

  function renderBusinessType() {
    return (
      <>
        <div className="qb-step-counter">Step {questionIndex + 1} of {questionSteps.length}</div>
        <h2 className="qb-headline">What best describes your business?</h2>
        <p className="qb-subhead">This helps MOSO tailor the recommendation to your industry.</p>
        <OptionGrid options={BUSINESS_TYPES} field="businessType" multi={false} cols={2} />
        <NavRow canNext={!!answers.businessType} />
      </>
    )
  }

  function renderOutcome() {
    return (
      <>
        <div className="qb-step-counter">Step {questionIndex + 1} of {questionSteps.length}</div>
        <h2 className="qb-headline">What outcome matters most?</h2>
        <p className="qb-subhead">Choose the one thing that would make this project a success.</p>
        <OptionGrid options={OUTCOMES} field="outcome" multi={false} cols={2} />
        <NavRow canNext={!!answers.outcome} />
      </>
    )
  }

  function renderServices() {
    return (
      <>
        <div className="qb-step-counter">Step {questionIndex + 1} of {questionSteps.length}</div>
        <h2 className="qb-headline">What do you need help with?</h2>
        <p className="qb-subhead">Select any specific services you're thinking about. These refine your recommendation.</p>
        <div className="qb-services-groups">
          {SERVICE_GROUPS.map(group => (
            <div key={group.group}>
              <div className="qb-service-group-label">{group.group}</div>
              <div className="qb-service-chips">
                {group.items.map(item => (
                  <button
                    key={item.id}
                    className={`qb-chip${answers.services.includes(item.id) ? ' selected' : ''}`}
                    onClick={() => toggleMulti('services', item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <NavRow canNext skipLabel="Skip this step →" />
      </>
    )
  }

  function renderWebsiteDetails() {
    return (
      <>
        <div className="qb-step-counter">Step {questionIndex + 1} of {questionSteps.length}</div>
        <h2 className="qb-headline">Website details</h2>
        <p className="qb-subhead">Help us understand the scope of your website project.</p>

        <div style={{ marginBottom: 22 }}>
          <div className="qb-service-group-label" style={{ marginBottom: 10 }}>How many pages do you need?</div>
          <OptionGrid options={PAGE_COUNTS} field="pageCount" multi={false} cols={3} />
        </div>
        <div style={{ marginBottom: 22 }}>
          <div className="qb-service-group-label" style={{ marginBottom: 10 }}>Do you need copywriting?</div>
          <OptionGrid options={COPYWRITING_NEEDS} field="needsCopywriting" multi={false} cols={2} />
        </div>
        <div style={{ marginBottom: 22 }}>
          <div className="qb-service-group-label" style={{ marginBottom: 10 }}>Do you need a CMS or blog?</div>
          <OptionGrid options={CMS_NEEDS} field="needsCMS" multi={false} cols={3} />
        </div>
        <div style={{ marginBottom: 36 }}>
          <div className="qb-service-group-label" style={{ marginBottom: 10 }}>Any integrations needed?</div>
          <div className="qb-service-chips">
            {WEBSITE_INTEGRATIONS.map(item => (
              <button
                key={item.id}
                className={`qb-chip${answers.websiteIntegrations.includes(item.id) ? ' selected' : ''}`}
                onClick={() => toggleMulti('websiteIntegrations', item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <NavRow canNext={!!answers.pageCount} skipLabel="Skip details →" />
      </>
    )
  }

  function renderAppDetails() {
    return (
      <>
        <div className="qb-step-counter">Step {questionIndex + 1} of {questionSteps.length}</div>
        <h2 className="qb-headline">App / Software details</h2>
        <p className="qb-subhead">Tell us about what you're building so we can estimate the right scope.</p>
        <div style={{ marginBottom: 22 }}>
          <div className="qb-service-group-label" style={{ marginBottom: 10 }}>What are you building?</div>
          <OptionGrid options={APP_TYPES} field="appType" multi={false} cols={3} />
        </div>
        <div style={{ marginBottom: 36 }}>
          <div className="qb-service-group-label" style={{ marginBottom: 10 }}>What level do you need?</div>
          <OptionGrid options={APP_LEVELS} field="appLevel" multi={false} cols={2} />
        </div>
        <NavRow canNext={!!answers.appLevel} skipLabel="Skip details →" />
      </>
    )
  }

  function renderMonthlySupport() {
    return (
      <>
        <div className="qb-step-counter">Step {questionIndex + 1} of {questionSteps.length}</div>
        <h2 className="qb-headline">After launch, what kind of support do you think you'll need?</h2>
        <p className="qb-subhead">This helps us recommend the right monthly plan alongside your project.</p>
        <OptionGrid options={MONTHLY_SUPPORT_OPTIONS} field="monthlySupport" multi={false} cols={2} />
        <NavRow canNext={!!answers.monthlySupport} />
      </>
    )
  }

  function renderTimeline() {
    return (
      <>
        <div className="qb-step-counter">Step {questionIndex + 1} of {questionSteps.length}</div>
        <h2 className="qb-headline">What's your timeline?</h2>
        <p className="qb-subhead">Rush timelines may carry a priority fee. Flexibility is always welcome.</p>
        <OptionGrid options={TIMELINES} field="timeline" multi={false} cols={2} />
        <NavRow canNext={!!answers.timeline} />
      </>
    )
  }

  function renderBudget() {
    return (
      <>
        <div className="qb-step-counter">Step {questionIndex + 1} of {questionSteps.length}</div>
        <h2 className="qb-headline">What investment range feels realistic for this project?</h2>
        <p className="qb-subhead">Be honest — this helps us recommend the right path, not the most expensive one.</p>
        <OptionGrid options={BUDGETS} field="budget" multi={false} cols={2} />
        <NavRow canNext={!!answers.budget} />
      </>
    )
  }

  function renderContact() {
    return (
      <>
        <div className="qb-step-counter">Step {questionIndex + 1} of {questionSteps.length}</div>
        <h2 className="qb-headline">One last thing.</h2>
        <p className="qb-subhead">We'll show your estimate and send a copy to your inbox so you can revisit it anytime.</p>
        <p className="qb-contact-note">Let's shape the right path before we price the work.</p>

        <div className="qb-contact-grid">
          <div className="qb-form-field">
            <label className="qb-form-label">Name *</label>
            <input
              className="qb-form-input"
              type="text"
              placeholder="Your full name"
              value={answers.contactName}
              onChange={e => setSingle('contactName', e.target.value)}
            />
          </div>
          <div className="qb-form-field">
            <label className="qb-form-label">Email *</label>
            <input
              className="qb-form-input"
              type="email"
              placeholder="you@company.com"
              value={answers.contactEmail}
              onChange={e => setSingle('contactEmail', e.target.value)}
            />
          </div>
          <div className="qb-form-field">
            <label className="qb-form-label">Business Name</label>
            <input
              className="qb-form-input"
              type="text"
              placeholder="Your company"
              value={answers.businessName}
              onChange={e => setSingle('businessName', e.target.value)}
            />
          </div>
          <div className="qb-form-field">
            <label className="qb-form-label">Website</label>
            <input
              className="qb-form-input"
              type="url"
              placeholder="https://yoursite.com"
              value={answers.websiteUrl}
              onChange={e => setSingle('websiteUrl', e.target.value)}
            />
          </div>
          <div className="qb-form-field">
            <label className="qb-form-label">Phone (optional)</label>
            <input
              className="qb-form-input"
              type="tel"
              placeholder="(555) 000-0000"
              value={answers.phone}
              onChange={e => setSingle('phone', e.target.value)}
            />
          </div>
          <div className="qb-form-field full">
            <label className="qb-form-label">Tell us about your project</label>
            <textarea
              className="qb-form-input qb-form-textarea"
              placeholder="A brief description of what you're working on and what you're hoping to achieve."
              value={answers.description}
              onChange={e => setSingle('description', e.target.value)}
            />
          </div>
        </div>

        <label className="qb-form-checkbox">
          <input
            type="checkbox"
            checked={answers.wantsMOSOReview}
            onChange={e => setAnswers(prev => ({ ...prev, wantsMOSOReview: e.target.checked }))}
          />
          <span className="qb-form-checkbox-label">
            I'd like MOSO to review this estimate and recommend the best next step.
          </span>
        </label>

        {submitError && <p className="qb-form-error">{submitError}</p>}

        <div className="qb-nav" style={{ marginTop: 24 }}>
          <button className="qb-btn-back" onClick={() => navigate('back')}>← Back</button>
          <button
            className="qb-submit-btn"
            disabled={isSubmitting}
            onClick={handleContactSubmit}
          >
            {isSubmitting ? 'Building your estimate…' : 'Show My Estimate →'}
          </button>
        </div>
      </>
    )
  }

  function renderResults() {
    if (!quoteResult) return null
    const { packageName, packageDesc, rangeMin, rangeMax, monthlyPlanName, monthlyMin, timeline, whatsIncluded } = quoteResult
    const rangeStr = rangeMax > rangeMin
      ? `${fmtMoney(rangeMin)}–${fmtMoney(rangeMax)}`
      : fmtMoney(rangeMin)

    return (
      <div className="qb-results">
        <div className="qb-results-eyebrow">Your MOSO Estimate</div>

        <div className="qb-results-label">Recommended path</div>
        <h2 className="qb-results-package-name">{packageName}</h2>
        <p className="qb-results-package-desc">{packageDesc}</p>

        <div className="qb-results-label">Estimated investment</div>
        <div className="qb-results-range-value">{rangeStr}</div>

        <div className="qb-results-grid">
          {monthlyPlanName && (
            <div className="qb-results-card">
              <div className="qb-results-card-label">Monthly Support</div>
              <div className="qb-results-card-value">{monthlyPlanName}</div>
              <div className="qb-results-card-sub">Starting at {fmtMoney(monthlyMin)}/mo</div>
            </div>
          )}
          <div className="qb-results-card">
            <div className="qb-results-card-label">Estimated Timeline</div>
            <div className="qb-results-card-value">{timeline}</div>
            <div className="qb-results-card-sub">From project kickoff</div>
          </div>
          <div className="qb-results-card">
            <div className="qb-results-card-label">Next Step</div>
            <div className="qb-results-card-value">
              {quoteResult.leadTemp === 'hot' ? 'Book a Project Fit Call' : 'Start with a Strategy Session'}
            </div>
            <div className="qb-results-card-sub">No obligation required</div>
          </div>
        </div>

        <div className="qb-results-included">
          <div className="qb-results-included-title">Likely included</div>
          <div className="qb-results-included-list">
            {whatsIncluded.map(item => (
              <div key={item} className="qb-results-included-item">{item}</div>
            ))}
          </div>
        </div>

        <div className="qb-results-cta-row">
          <a href="/contact" className="qb-results-cta-primary">Book a Project Fit Call</a>
          <a href="/contact" className="qb-results-cta-secondary">Start With a Strategy Session</a>
        </div>

        <button className="qb-results-restart" onClick={restart}>Start over</button>

        <p className="qb-results-note">
          This estimate is based on typical project scopes and may vary based on final requirements.
          {answers.contactEmail && ` A copy of your estimate has been sent to ${answers.contactEmail}.`}
        </p>
      </div>
    )
  }

  function renderCurrentStep() {
    switch (currentStepId) {
      case 'welcome':        return renderWelcome()
      case 'buildGoals':     return renderBuildGoals()
      case 'stage':          return renderStage()
      case 'businessType':   return renderBusinessType()
      case 'outcome':        return renderOutcome()
      case 'services':       return renderServices()
      case 'websiteDetails': return renderWebsiteDetails()
      case 'appDetails':     return renderAppDetails()
      case 'monthlySupport': return renderMonthlySupport()
      case 'timeline':       return renderTimeline()
      case 'budget':         return renderBudget()
      case 'contact':        return renderContact()
      case 'results':        return renderResults()
      default:               return null
    }
  }

  // ── Main render ───────────────────────────────────────────────────────────────

  return (
    <div className="qb-page">
      {/* Animated background */}
      <div className="qb-bg" aria-hidden="true">
        <div className="qb-orb qb-orb-1" />
        <div className="qb-orb qb-orb-2" />
        <div className="qb-orb qb-orb-3" />
        <div className="qb-orb qb-orb-4" />
        <div className="qb-grid-overlay" />
      </div>

      {/* Progress bar */}
      {!['welcome', 'results'].includes(currentStepId) && (
        <div
          className="qb-progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Estimate progress"
        >
          <div className="qb-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Content */}
      <div className="qb-content">
        <div key={stepKey} className="qb-step">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  )
}
