"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { posts } from "../_data/posts"
import { BlogCard } from "./BlogCard"

gsap.registerPlugin(ScrollTrigger)

// Ordered category list — only those present in posts will render
const CATEGORY_ORDER = [
  "Brand Strategy",
  "Website Strategy",
  "SEO + AEO",
  "Ethical Growth",
  "Sustainability + Eco Strategy",
  "Design + Creative Direction",
  "Content + Social Systems",
  "Apps + Software",
  "Automation + Operations",
  "Industry Guides",
  "Studio Notes",
  "Future Signals",
]

export function BlogContent() {
  const heroRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Derive unique categories that exist in posts, sorted by CATEGORY_ORDER
  const availableCategories = CATEGORY_ORDER.filter((cat) =>
    posts.some((p) => p.category === cat)
  )

  const filtered = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts

  useEffect(() => {
    if (heroRef.current) {
      const titles = heroRef.current.querySelectorAll(".moso-hero-title-line")
      gsap.set(titles, { y: "100%", opacity: 0 })
      gsap.to(titles, {
        y: "0%",
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.3,
      })
    }
    if (captionRef.current) {
      gsap.set(captionRef.current, { opacity: 0 })
      gsap.to(captionRef.current, {
        opacity: 1,
        duration: 0.8,
        delay: 0.8,
        ease: "power2.out",
      })
    }
  }, [])

  // Fade grid on category change
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    gsap.fromTo(grid, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" })
  }, [activeCategory])

  return (
    <>
      <section className="section-top">
        <div className="w-layout-blockcontainer container-fluid w-container">
          <div className="page-title-wrapper" ref={heroRef}>
            <div className="overflow-hidden">
              <div className="moso-hero-title-line">
                <h1 className="page-title">Latest News</h1>
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="moso-hero-title-line">
                <h1 className="page-title">&amp; Press</h1>
              </div>
            </div>
          </div>
          <div className="margin-bottom-medium">
            <div className="w-layout-grid hero-caption-grid" ref={captionRef}>
              <div className="hero-caption-first">
                <div className="hero-caption">Process, Events, Awards</div>
              </div>
              <div className="hero-caption-second">
                <div className="hero-caption">(©2021 — 2025)</div>
              </div>
              <div className="hero-caption-third">
                <div className="hero-caption-inner">
                  <div className="hero-caption">Scroll Down</div>
                  <img src="/images/arrow-down-right-small.svg" loading="lazy" alt="" className="hero-caption-icon" />
                </div>
              </div>
            </div>
          </div>
          <div className="divider" />

          {/* Category Filter */}
          <div className="moso-blog-filter-bar">
            <button
              className={`moso-blog-filter-btn${activeCategory === null ? " active" : ""}`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                className={`moso-blog-filter-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Result count */}
          <div className="moso-blog-filter-count">
            {activeCategory
              ? `${filtered.length} post${filtered.length !== 1 ? "s" : ""} in ${activeCategory}`
              : `${filtered.length} posts`}
          </div>

          {/* Blog Grid */}
          <div className="moso-blog-grid" ref={gridRef}>
            {filtered.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
