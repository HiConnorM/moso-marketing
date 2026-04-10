export interface Project {
  slug: string
  title: string
  client: string
  category: string
  year: string
  tags: string[]
  thumbnail: string // path to image in /images/
  description: string
  challenge: string
  solution: string
  results: string[]
  gallery: string[] // additional image paths
  liveUrl?: string
  featured: boolean
}

// Add new projects here — they'll automatically appear on the portfolio page
// and generate their own detail pages via dynamic routing.
export const projects: Project[] = [
  {
    slug: "luxe-rebrand",
    title: "Luxe Rebrand",
    client: "Luxe Hospitality Group",
    category: "Branding & Identity",
    year: "2025",
    tags: ["Branding", "Identity", "Strategy"],
    thumbnail: "/images/hero-work-1.jpg",
    description:
      "A complete brand overhaul for a boutique hospitality group, redefining their visual identity to match their elevated guest experience.",
    challenge:
      "Luxe Hospitality had grown from a single property to a portfolio of five, but their brand still felt like a local bed-and-breakfast. They needed an identity that communicated sophistication without losing warmth.",
    solution:
      "We crafted a refined visual system rooted in rich earth tones, custom serif typography, and an iconic monogram. Every touchpoint — from key cards to the booking app — was redesigned for consistency and elegance.",
    results: [
      "42% increase in direct bookings within 3 months",
      "Brand recognition score improved by 67%",
      "Featured in Hospitality Design Magazine",
    ],
    gallery: [
      "/images/hero-work-1.jpg",
      "/images/service-1.jpg",
      "/images/service-2.jpg",
    ],
    liveUrl: "#",
    featured: true,
  },
  {
    slug: "pulse-fitness-app",
    title: "Pulse Fitness App",
    client: "Pulse Athletics",
    category: "UI/UX Design & Development",
    year: "2025",
    tags: ["UI/UX", "Mobile App", "Development"],
    thumbnail: "/images/hero-work-2.jpg",
    description:
      "Designed and developed a premium fitness tracking app that makes performance data beautiful and actionable.",
    challenge:
      "Fitness apps are crowded. Pulse needed to stand out with a design that felt premium and motivating, not clinical and cluttered.",
    solution:
      "We created a dark-mode-first interface with bold gradients, fluid micro-animations, and an AI-driven coaching layer that adapts to each user's patterns.",
    results: [
      "200K+ downloads in the first quarter",
      "4.8 star rating on the App Store",
      "Named 'App of the Day' by Apple",
    ],
    gallery: [
      "/images/hero-work-2.jpg",
      "/images/service-3.jpg",
      "/images/service-4.jpg",
    ],
    liveUrl: "#",
    featured: true,
  },
  {
    slug: "nova-ecommerce",
    title: "Nova E-Commerce",
    client: "Nova Skincare",
    category: "Web Design & Shopify",
    year: "2024",
    tags: ["E-Commerce", "Shopify", "Web Design"],
    thumbnail: "/images/service-1.jpg",
    description:
      "A conversion-optimized Shopify storefront that turns browsing into buying through immersive product storytelling.",
    challenge:
      "Nova's previous site had beautiful products but a confusing checkout flow and poor mobile experience, leading to a 78% cart abandonment rate.",
    solution:
      "We rebuilt the store on Shopify Plus with a streamlined single-page checkout, rich product videos, and scroll-driven storytelling that educates while it sells.",
    results: [
      "Cart abandonment dropped to 34%",
      "Average order value increased 28%",
      "Mobile conversion rate tripled",
    ],
    gallery: [
      "/images/service-1.jpg",
      "/images/service-2.jpg",
    ],
    featured: true,
  },
  {
    slug: "verdant-brand-system",
    title: "Verdant Brand System",
    client: "Verdant Agriculture",
    category: "Brand Strategy & Design",
    year: "2024",
    tags: ["Branding", "Strategy", "Print"],
    thumbnail: "/images/service-2.jpg",
    description:
      "An end-to-end brand system for a sustainable agriculture startup connecting regenerative farms with conscious consumers.",
    challenge:
      "Verdant needed to communicate complex sustainability concepts simply, and appeal to both B2B farm partners and B2C end consumers with one cohesive brand.",
    solution:
      "We developed a flexible brand system with two visual registers — earthy and technical for partners, warm and approachable for consumers — unified by a shared color palette and iconography inspired by topographic maps.",
    results: [
      "Secured $2.4M seed funding with the new brand deck",
      "Onboarded 40+ partner farms in the first year",
      "Won a D&AD New Blood Award",
    ],
    gallery: [
      "/images/service-2.jpg",
      "/images/service-3.jpg",
    ],
    featured: false,
  },
  {
    slug: "echo-podcast-platform",
    title: "Echo Podcast Platform",
    client: "Echo Media",
    category: "Product Design & Development",
    year: "2024",
    tags: ["Product Design", "SaaS", "Development"],
    thumbnail: "/images/service-3.jpg",
    description:
      "A next-generation podcast hosting and analytics platform designed for independent creators who want professional-grade tools without the enterprise price tag.",
    challenge:
      "Echo had a powerful backend but its interface was built by engineers for engineers. Creators found it intimidating and confusing.",
    solution:
      "We redesigned the entire platform around creator workflows — record, edit, publish, analyze — with an interface inspired by modern music production tools: dark, focused, and satisfying to use.",
    results: [
      "Creator retention improved 3x",
      "Time-to-publish reduced by 60%",
      "Featured in Product Hunt's Top 10",
    ],
    gallery: [
      "/images/service-3.jpg",
      "/images/service-4.jpg",
    ],
    featured: false,
  },
  {
    slug: "meridian-marketing-site",
    title: "Meridian Marketing Site",
    client: "Meridian Financial",
    category: "Webflow Development",
    year: "2023",
    tags: ["Webflow", "Marketing", "Animation"],
    thumbnail: "/images/service-4.jpg",
    description:
      "A high-converting marketing site for a fintech startup, built in Webflow with cinematic scroll animations and a conversion-focused layout.",
    challenge:
      "Meridian's existing WordPress site was slow, hard to update, and didn't reflect the innovation of their product.",
    solution:
      "We built a blazing-fast Webflow site with GSAP-powered scroll sequences, interactive data visualizations, and a CMS that their marketing team can update without touching code.",
    results: [
      "Page load time dropped from 6s to 1.2s",
      "Lead generation increased 156%",
      "Marketing team ships landing pages 4x faster",
    ],
    gallery: [
      "/images/service-4.jpg",
      "/images/hero-work-1.jpg",
    ],
    featured: false,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}
