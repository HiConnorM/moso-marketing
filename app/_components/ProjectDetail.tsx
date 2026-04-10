"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { Project } from "../_data/projects"
import { projects } from "../_data/projects"

gsap.registerPlugin(ScrollTrigger)

export function ProjectDetail({ project }: { project: Project }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

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
    if (contentRef.current) {
      const sections = contentRef.current.querySelectorAll(".moso-detail-section")
      sections.forEach((section) => {
        gsap.set(section, { opacity: 0, y: 40 })
        gsap.to(section, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        })
      })
    }
  }, [])

  // Get next project for navigation
  const currentIndex = projects.findIndex((p) => p.slug === project.slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]

  return (
    <div className="div-block-4">
      {/* Hero */}
      <section className="section-hero" style={{ position: "relative" }}>
        <div className="hero-content-middle">
          <div className="container-fluid">
            <div className="align-center" ref={heroRef}>
              <div className="overflow-hidden">
                <div className="moso-hero-title-line">
                  <h1 className="page-title">{project.title}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-content-bottom">
          <div className="hero-captions-wrapper">
            <div className="w-layout-blockcontainer container-fluid w-container">
              <div className="opacity-80">
                <div className="w-layout-grid hero-caption-grid">
                  <div className="hero-caption-first">
                    <div className="hero-caption">{project.category}</div>
                  </div>
                  <div className="hero-caption-second">
                    <div className="hero-caption">{project.client} — {project.year}</div>
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
              style={{ backgroundImage: `url(${project.thumbnail})` }}
            />
          </div>
        </div>
      </section>

      {/* Detail Content */}
      <section className="section" ref={contentRef}>
        <div className="w-layout-blockcontainer container w-container">
          {/* Overview */}
          <div className="moso-detail-section">
            <div className="moso-detail-grid">
              <div className="moso-detail-label">
                <div className="caption">Overview</div>
              </div>
              <div className="moso-detail-body">
                <p className="paragraph-large no-text-indent">{project.description}</p>
              </div>
            </div>
          </div>

          {/* Project Info Bar */}
          <div className="moso-detail-section">
            <div className="divider" />
            <div className="moso-detail-info-bar">
              <div className="moso-detail-info-item">
                <div className="moso-detail-info-label">Client</div>
                <div className="moso-detail-info-value">{project.client}</div>
              </div>
              <div className="moso-detail-info-item">
                <div className="moso-detail-info-label">Category</div>
                <div className="moso-detail-info-value">{project.category}</div>
              </div>
              <div className="moso-detail-info-item">
                <div className="moso-detail-info-label">Year</div>
                <div className="moso-detail-info-value">{project.year}</div>
              </div>
              {project.liveUrl && project.liveUrl !== "#" && (
                <div className="moso-detail-info-item">
                  <div className="moso-detail-info-label">Live Site</div>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="moso-detail-info-value moso-link">
                    Visit →
                  </a>
                </div>
              )}
            </div>
            <div className="divider" />
          </div>

          {/* Challenge */}
          <div className="moso-detail-section">
            <div className="moso-detail-grid">
              <div className="moso-detail-label">
                <div className="caption">The Challenge</div>
              </div>
              <div className="moso-detail-body">
                <p className="paragraph-large no-text-indent">{project.challenge}</p>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="moso-detail-section">
            <div className="moso-detail-grid">
              <div className="moso-detail-label">
                <div className="caption">Our Approach</div>
              </div>
              <div className="moso-detail-body">
                <p className="paragraph-large no-text-indent">{project.solution}</p>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="moso-detail-section">
            <div className="moso-detail-gallery">
              {project.gallery.map((img, i) => (
                <div key={i} className="moso-detail-gallery-item">
                  <img src={img} alt={`${project.title} - Image ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="moso-detail-section">
            <div className="moso-detail-grid">
              <div className="moso-detail-label">
                <div className="caption">Results</div>
              </div>
              <div className="moso-detail-body">
                <div className="moso-results-list">
                  {project.results.map((result, i) => (
                    <div key={i} className="moso-result-item">
                      <span className="moso-result-number">{String(i + 1).padStart(2, "0")}</span>
                      <p className="paragraph-large no-text-indent">{result}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="moso-detail-section">
            <div className="divider" />
            <div className="moso-detail-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="moso-project-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Next Project */}
          {nextProject && (
            <div className="moso-detail-section moso-next-project">
              <div className="divider" />
              <a href={`/portfolio/${nextProject.slug}`} className="moso-next-project-link">
                <div className="moso-next-project-label">Next Project</div>
                <h2 className="moso-next-project-title">{nextProject.title}</h2>
                <div className="moso-next-project-arrow">
                  <img src="/images/arrow-up-right.svg" alt="" />
                </div>
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
