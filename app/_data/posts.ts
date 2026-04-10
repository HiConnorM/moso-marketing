export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string // YYYY-MM-DD
  author: string
  category: string
  thumbnail: string
  content: string // HTML content for the blog detail page
  featured: boolean
}

// Add new blog posts here — they'll automatically appear on the blog page
// and generate their own detail pages via dynamic routing.
export const posts: BlogPost[] = [
  {
    slug: "why-brand-strategy-matters-more-than-ever",
    title: "Why Brand Strategy Matters More Than Ever in 2025",
    excerpt:
      "In a world of infinite scroll and shrinking attention spans, a strong brand strategy isn't a luxury — it's the difference between being remembered and being noise.",
    date: "2025-03-15",
    author: "MOSO Team",
    category: "Brand Strategy",
    thumbnail: "/images/hero-work-1.jpg",
    content: `
      <p>The digital landscape has never been more crowded. Every day, thousands of new brands enter the market, each fighting for a sliver of consumer attention. In this environment, visual identity alone isn't enough — you need a <strong>brand strategy</strong> that creates genuine connection.</p>
      <h3>The Attention Economy Has Changed</h3>
      <p>Consumers now encounter an estimated 10,000 brand messages per day. The brands that break through aren't necessarily the loudest — they're the most consistent and authentic. A well-crafted brand strategy ensures every touchpoint reinforces who you are and what you stand for.</p>
      <h3>Strategy Before Aesthetics</h3>
      <p>A beautiful logo on a weak foundation is just decoration. Before we touch a single pixel, we dig into positioning, audience mapping, competitive analysis, and brand architecture. The visual work that follows isn't arbitrary — it's the natural expression of strategic decisions.</p>
      <h3>The Compound Effect</h3>
      <p>Brand strategy compounds over time. Each consistent interaction builds recognition. Each authentic message builds trust. After 12 months of disciplined execution, brands we've worked with report an average 3x increase in unaided recall.</p>
    `,
    featured: true,
  },
  {
    slug: "designing-for-conversion-without-dark-patterns",
    title: "Designing for Conversion Without Dark Patterns",
    excerpt:
      "You can build a high-converting experience that respects your users. Here's how we approach ethical UX design at MOSO.",
    date: "2025-02-28",
    author: "MOSO Team",
    category: "UX Design",
    thumbnail: "/images/hero-work-2.jpg",
    content: `
      <p>There's a persistent myth in digital design: that high conversion rates require manipulation. Confusing opt-out flows, hidden fees, urgency timers on products that aren't scarce — these tactics might boost short-term numbers, but they erode trust and destroy lifetime value.</p>
      <h3>Clarity Is the Best Conversion Tool</h3>
      <p>When users understand exactly what they're getting and why it's valuable, they convert at higher rates — and they stay. Our approach prioritizes information architecture and clear value communication over psychological tricks.</p>
      <h3>Reducing Friction, Not Adding Pressure</h3>
      <p>Every unnecessary form field, every confusing navigation choice, every ambiguous button label is friction. We systematically identify and remove these barriers. The result: users who convert because they <em>want</em> to, not because they were tricked into it.</p>
      <h3>Measuring What Matters</h3>
      <p>We track retention and satisfaction alongside conversion rates. A 5% conversion rate with 80% retention beats a 10% conversion rate with 20% retention every time.</p>
    `,
    featured: true,
  },
  {
    slug: "webflow-vs-custom-code",
    title: "Webflow vs. Custom Code: Choosing the Right Stack",
    excerpt:
      "Not every project needs a custom-built React app, and not every project can live in Webflow. Here's our framework for choosing.",
    date: "2025-02-10",
    author: "MOSO Team",
    category: "Development",
    thumbnail: "/images/service-1.jpg",
    content: `
      <p>One of the most common questions we get from clients: "Should we build in Webflow or go custom?" The answer, like most things in technology, is "it depends." But we've developed a clear framework for making that decision.</p>
      <h3>When Webflow Wins</h3>
      <p>Marketing sites, landing pages, blogs, and portfolios where the team needs to make frequent content updates without developer involvement. Webflow's visual CMS and hosting are hard to beat for these use cases.</p>
      <h3>When Custom Code Wins</h3>
      <p>Complex web applications, e-commerce with custom logic, platforms with user authentication, real-time features, or anything that needs to integrate deeply with external APIs and services.</p>
      <h3>The Hybrid Approach</h3>
      <p>Sometimes the best answer is both. We've built marketing sites in Webflow that feed into custom-built application dashboards, giving marketing teams autonomy while engineering teams maintain full control over the product.</p>
    `,
    featured: false,
  },
  {
    slug: "the-psychology-of-color-in-branding",
    title: "The Psychology of Color in Branding",
    excerpt:
      "Color isn't decoration — it's communication. How we use color theory to build brands that resonate on an emotional level.",
    date: "2025-01-20",
    author: "MOSO Team",
    category: "Branding",
    thumbnail: "/images/service-2.jpg",
    content: `
      <p>Before a single word is read, color has already communicated something about your brand. It's one of the fastest-processing signals the human brain receives, and it shapes perception in ways that are both profound and measurable.</p>
      <h3>Beyond the Color Wheel</h3>
      <p>We go deeper than "blue means trust" generalizations. Color perception is contextual — it depends on your industry, your audience's cultural background, and what your competitors are doing. A color that feels luxurious in fashion might feel cold in healthcare.</p>
      <h3>Building a Color System</h3>
      <p>A great brand color palette isn't one color — it's a system. Primary, secondary, accent, and neutral tones that work together across every medium, from a tiny app icon to a building-sized billboard.</p>
    `,
    featured: false,
  },
  {
    slug: "motion-design-principles-for-web",
    title: "Motion Design Principles for the Web",
    excerpt:
      "Meaningful motion isn't just eye candy — it guides attention, communicates state, and makes interfaces feel alive.",
    date: "2025-01-05",
    author: "MOSO Team",
    category: "Animation",
    thumbnail: "/images/service-3.jpg",
    content: `
      <p>The best web animations are the ones you barely notice. They make an interface feel responsive and alive without calling attention to themselves. Here's how we approach motion design at MOSO.</p>
      <h3>Purpose First</h3>
      <p>Every animation should answer the question: "What does this help the user understand?" If the answer is "nothing," it's decoration and should probably be removed. Motion should guide focus, show relationships between elements, and communicate state changes.</p>
      <h3>Performance Is Non-Negotiable</h3>
      <p>A beautiful animation that causes jank is worse than no animation at all. We build on GSAP and CSS transforms, stay on the compositor thread, and test on real mid-range devices — not just our M3 MacBooks.</p>
    `,
    featured: false,
  },
  {
    slug: "building-scalable-design-systems",
    title: "Building Scalable Design Systems That Teams Actually Use",
    excerpt:
      "A design system nobody uses is just a Figma graveyard. Here's how we build systems that stick.",
    date: "2024-12-15",
    author: "MOSO Team",
    category: "Design Systems",
    thumbnail: "/images/service-4.jpg",
    content: `
      <p>We've seen it too many times: a team invests months building a comprehensive design system, only for it to be abandoned within a quarter. The components are technically perfect but nobody uses them. Why?</p>
      <h3>Start With Adoption, Not Perfection</h3>
      <p>The most successful design systems we've built started with 10-15 components that solved real, immediate pain points. Not 200 components covering every hypothetical scenario.</p>
      <h3>Documentation Is the Product</h3>
      <p>If a component isn't documented with clear usage guidelines and examples, it effectively doesn't exist. We treat documentation as a first-class deliverable, not an afterthought.</p>
    `,
    featured: false,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
