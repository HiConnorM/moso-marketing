"use client"

import { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { projects } from "../_data/projects"
import { ProjectCard } from "./ProjectCard"

gsap.registerPlugin(ScrollTrigger)

export function PortfolioContent() {
  const [layout, setLayout] = useState<"grid" | "list">("grid")
  const [filter, setFilter] = useState<string>("All")
  const heroRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.tags[0])))]

  const filtered = filter === "All"
    ? projects
    : projects.filter((p) => p.tags.includes(filter))

  useEffect(() => {
    // Hero text animation
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

  return (
    <>
      {/* Hero Section */}
      <section className="section-hero" style={{ position: "relative" }}>
        <div className="hero-content-middle">
          <div className="container-fluid">
            <div className="align-center" ref={heroRef}>
              <div className="overflow-hidden">
                <div className="moso-hero-title-line">
                  <h1 className="page-title">Selected</h1>
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="moso-hero-title-line">
                  <h1 className="page-title">Work</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-content-bottom">
          <div className="hero-captions-wrapper">
            <div className="w-layout-blockcontainer container-fluid w-container">
              <div className="opacity-80" ref={captionRef}>
                <div className="w-layout-grid hero-caption-grid">
                  <div className="hero-caption-first">
                    <div className="hero-caption">Design &amp; Development</div>
                  </div>
                  <div className="hero-caption-second">
                    <div className="hero-caption">(©2021 — 2025)</div>
                  </div>
                  <div className="hero-caption-third">
                    <div className="hero-caption-inner">
                      <div className="hero-caption">Scroll Down</div>
                      <img src="/images/arrow-down-right-small-white.svg" loading="lazy" alt="" className="hero-caption-icon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-image-inner">
            <div
              className="moso-portfolio-hero-bg"
              style={{ backgroundImage: `url(/images/hero-work-1.jpg)` }}
            />
          </div>
        </div>
      </section>

      {/* Portfolio Controls + Grid */}
      <section className="section">
        <div className="w-layout-blockcontainer container-fluid w-container">
          {/* Header caption */}
          <div className="w-layout-grid grid-12-columns-small" style={{ marginBottom: "2rem" }}>
            <div className="section-header-caption">
              <div className="caption">Projects of years<br />©2021 — 2025</div>
            </div>
          </div>

          {/* Controls: Layout toggle + Category filter */}
          <div className="moso-portfolio-controls">
            <div className="moso-portfolio-tabs">
              <button
                className={`moso-tab-btn ${layout === "grid" ? "active" : ""}`}
                onClick={() => setLayout("grid")}
              >
                Grid
              </button>
              <button
                className={`moso-tab-btn ${layout === "list" ? "active" : ""}`}
                onClick={() => setLayout("list")}
              >
                List
              </button>
            </div>
            <div className="moso-portfolio-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`moso-filter-btn ${filter === cat ? "active" : ""}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Grid / List */}
          <div className={layout === "grid" ? "moso-projects-grid" : "moso-projects-list"}>
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                layout={layout}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
