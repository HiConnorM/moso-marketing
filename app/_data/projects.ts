export interface Project {
  slug: string
  title: string
  client: string
  category: string
  year: string
  tags: string[]
  thumbnail: string   // logo / brand mark — shown on portfolio cards
  heroImage?: string  // full-bleed atmospheric image for the detail page header
  description: string
  challenge: string
  solution: string
  results: string[]
  gallery: string[] // additional image paths shown on detail page
  liveUrl?: string
  featured: boolean
}

// Add new projects here — they'll automatically appear on the portfolio page
// and generate their own detail pages via dynamic routing.
export const projects: Project[] = [
  {
    slug: "blooming-minds",
    title: "Blooming Minds",
    client: "Blooming Minds Therapy",
    category: "Branding & Digital",
    year: "2025",
    tags: ["Branding", "Website", "Marketing", "Software"],
    thumbnail: "/images/projects/blooming-minds-3.png",
    heroImage: "/images/projects/blooming-minds-1.png",
    description:
      "A full-service brand and digital ecosystem built for a mental health practice that needed to feel as warm and trustworthy as the therapists inside it. From logo to software, every touchpoint was designed to reduce the anxiety of seeking help.",
    challenge:
      "Blooming Minds was a growing therapy group operating on a patchwork of generic tools — no cohesive brand, a dated website that buried their booking flow, and no client management software tailored to their workflow. They were losing prospective clients to competitors who simply looked more credible online.",
    solution:
      "We developed an identity rooted in soft, grounding tones and organic forms — a brand that felt human, not clinical. A custom marketing site brought the practice to life with clear service pages, therapist profiles, and a frictionless intake form. We then built proprietary scheduling and client management software to replace the disconnected tools they were relying on.",
    results: [
      "New patient inquiries increased significantly after launch",
      "Booking-to-appointment conversion improved with streamlined intake",
      "Staff reduced administrative time with custom practice software",
      "Brand identity positioned the practice as a premium provider in the market",
    ],
    gallery: [
      "/images/projects/blooming-minds-1.png",
      "/images/projects/blooming-minds-2.png",
      "/images/projects/blooming-minds-4.png",
      "/images/projects/blooming-minds-3.png",
    ],
    featured: true,
  },
  {
    slug: "blue-sky",
    title: "Blue Sky",
    client: "Blue Sky Counseling",
    category: "Web Design & Marketing",
    year: "2025",
    tags: ["Website", "Marketing", "Design"],
    thumbnail: "/images/projects/bluesky-2.png",
    heroImage: "/images/projects/bluesky-1.png",
    description:
      "A serene digital presence for a wellness-focused therapy practice. The design language mirrors the calm and clarity the practice provides — airy, open, and immediately trustworthy.",
    challenge:
      "Blue Sky had an established client base but no digital home that matched the quality of care they delivered. Their online presence was an afterthought, making it hard for new clients to find them and understand what made the practice different.",
    solution:
      "We led with visual design — developing a brand identity and design language built around calm blues, warm oranges, and an approachable wordmark. The website was then built to guide prospective clients from curiosity to contact with minimal friction, supported by targeted marketing campaigns to drive qualified traffic.",
    results: [
      "Online visibility increased through targeted SEO and paid campaigns",
      "Website design matched the elevated quality of the client experience",
      "Brand identity created a distinctive, ownable visual system",
      "Inquiries from new clients grew month-over-month post-launch",
    ],
    gallery: [
      "/images/projects/bluesky-1.png",
      "/images/projects/bluesky-2.png",
      "/images/projects/bluesky-3.png",
    ],
    featured: true,
  },
  {
    slug: "georges",
    title: "George's",
    client: "George's Restaurant",
    category: "Web Design & Marketing",
    year: "2025",
    tags: ["Website", "Marketing", "Software"],
    thumbnail: "/images/projects/georges-4.png",
    heroImage: "/images/projects/georges-3.png",
    description:
      "A vibrant digital experience for an authentic Hispanic restaurant that brings the energy and warmth of the dining room online — paired with smart software to keep operations running as well as the kitchen.",
    challenge:
      "George's had built a loyal local following, but their digital presence was holding them back. No online ordering, a static website that didn't capture the culture of the food, and manual reservation and waitlist management that was costing time and turning away guests.",
    solution:
      "We built a website that felt like walking through the door — rich photography, a menu experience that made you hungry just reading it, and seamless online reservation flow. Behind the scenes, we implemented custom restaurant management software to handle reservations, waitlists, and order flow — giving the team back time to focus on hospitality.",
    results: [
      "Online reservations launched and filled weeks out at opening",
      "Custom software eliminated manual reservation bottlenecks",
      "Digital marketing campaigns drove consistent foot traffic",
      "Website became a brand asset, not just a business listing",
    ],
    gallery: [
      "/images/projects/georges-3.png",
      "/images/projects/georges-1.png",
      "/images/projects/georges-2.png",
      "/images/projects/georges-4.png",
    ],
    featured: true,
  },
  {
    slug: "satora",
    title: "Satora",
    client: "Satora Bio-engineering Labs",
    category: "Branding & UI/UX",
    year: "2025",
    tags: ["Branding", "Software", "UI/UX"],
    thumbnail: "/images/projects/satora-1.png",
    heroImage: "/images/projects/satora-6.png",
    description:
      "A complete brand identity and software UI for a biotech consulting firm operating at the intersection of science and strategy — designed to communicate credibility, clarity, and cutting-edge capability.",
    challenge:
      "Satora was doing sophisticated work for major life sciences clients, but their brand and software interfaces looked like they were built in a different era. They were walking into enterprise pitches with tools that undercut the quality of their thinking.",
    solution:
      "We built a brand system that felt both rigorous and forward-looking — technical without being cold, premium without being inaccessible. The UI design for their consulting platform brought that same precision to the product: clean data visualization, intuitive navigation, and an interface that felt worthy of the insights it delivered.",
    results: [
      "New brand identity strengthened positioning in enterprise client pitches",
      "UI redesign reduced onboarding time for new platform users",
      "Visual system created consistency across all client-facing materials",
      "Software interface positioned Satora as a technology-forward consultancy",
    ],
    gallery: [
      "/images/projects/satora-6.png",
      "/images/projects/satora-3.png",
      "/images/projects/satora-2.png",
      "/images/projects/satora-4.png",
      "/images/projects/satora-1.png",
    ],
    featured: true,
  },
  {
    slug: "tower-hotel",
    title: "Tower Hotel",
    client: "The Tower Hotel Tokyo",
    category: "Branding & Design",
    year: "2025",
    tags: ["Branding", "Design"],
    thumbnail: "/images/projects/tower-hotel-3.png",
    heroImage: "/images/projects/tower-hotel-9.png",
    description:
      "A world-class brand identity for a luxury hotel in Tokyo — where Japanese elegance meets contemporary sophistication, and every detail of the visual system reflects the standard of the property itself.",
    challenge:
      "Tower Hotel was entering a competitive luxury hospitality market in one of the world's most design-literate cities. They needed a brand that could hold its own against international five-star competitors while feeling deeply rooted in Tokyo's cultural identity.",
    solution:
      "We created a brand system that drew from Tokyo's duality — ancient and ultramodern, intimate and grand. The identity used architectural geometry, restrained luxury typography, and a palette that shifted between deep ink black and warm gold. Every touchpoint — keycard holders, stationery, packaging, wayfinding, and the digital experience — was designed with the same level of craft.",
    results: [
      "Brand identity positioned Tower as a premium destination from day one",
      "Design system extended seamlessly across physical and digital touchpoints",
      "Visual language resonated with both local and international luxury travelers",
      "Branding collateral became a guest experience differentiator in itself",
    ],
    gallery: [
      "/images/projects/tower-hotel-9.png",
      "/images/projects/tower-hotel-7.png",
      "/images/projects/tower-hotel-10.png",
      "/images/projects/tower-hotel-5.png",
      "/images/projects/tower-hotel-6.png",
      "/images/projects/tower-hotel-3.png",
      "/images/projects/tower-hotel-1.png",
      "/images/projects/tower-hotel-2.png",
      "/images/projects/tower-hotel-4.png",
      "/images/projects/tower-hotel-8.png",
    ],
    featured: true,
  },
  {
    slug: "helix",
    title: "Helix",
    client: "Helix Capital",
    category: "Branding & App Development",
    year: "2025",
    tags: ["Branding", "App Development", "UI/UX"],
    thumbnail: "/images/projects/helix-2.png",
    heroImage: "/images/projects/helix-1.png",
    description:
      "A bold brand identity and custom application for a crypto underwriting firm operating in one of finance's most technically demanding frontiers — built to communicate trust, precision, and forward-thinking capability.",
    challenge:
      "Crypto underwriting sits at the crossroads of financial rigor and technological complexity. Helix needed a brand and product that could earn the confidence of institutional clients while clearly differentiating from the noise of the broader crypto market.",
    solution:
      "We built a brand identity anchored in structure and precision — a distinctive geometric mark, a dark high-contrast palette, and typography that communicated authority without stiffness. The application UI brought that same discipline to the product: a custom-built underwriting platform with clear risk visualization, streamlined deal flow management, and an interface built for speed and accuracy.",
    results: [
      "Brand identity gave Helix institutional credibility in client-facing contexts",
      "Custom app replaced manual underwriting workflows with a purpose-built platform",
      "UI design reduced analysis time with optimized data presentation",
      "Visual system positioned Helix as a serious operator in a crowded market",
    ],
    gallery: [
      "/images/projects/helix-1.png",
      "/images/projects/helix-3.png",
      "/images/projects/helix-2.png",
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
