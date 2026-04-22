"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { Project } from "../_data/projects"

gsap.registerPlugin(ScrollTrigger)

interface ProjectCardProps {
  project: Project
  index: number
  layout: "grid" | "list"
}

export function ProjectCard({ project, index, layout }: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    gsap.set(card, { opacity: 0, y: 60 })

    // Animate immediately if already in viewport, otherwise on scroll
    const rect = card.getBoundingClientRect()
    const inView = rect.top < window.innerHeight && rect.bottom > 0

    let tl: gsap.core.Tween

    if (inView) {
      tl = gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: index * 0.06,
        ease: "power3.out",
      })
    } else {
      tl = gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: layout === "grid" ? (index % 2) * 0.12 : 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      })
    }

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === card) t.kill()
      })
    }
  }, [index, layout])

  const handleMouseEnter = () => {
    if (imageRef.current) {
      gsap.to(imageRef.current, { scale: 1.06, duration: 0.5, ease: "power2.out" })
    }
  }

  const handleMouseLeave = () => {
    if (imageRef.current) {
      gsap.to(imageRef.current, { scale: 1.0, duration: 0.5, ease: "power2.out" })
    }
  }

  // ─── List layout ──────────────────────────────────────────────────────────
  if (layout === "list") {
    return (
      <a
        ref={cardRef}
        href={`/portfolio/${project.slug}`}
        className="moso-project-list-item"
        style={{ willChange: "transform, opacity" }}
      >
        <div className="moso-project-list-divider" />
        <div className="moso-project-list-inner">
          <div className="moso-project-list-title">
            <h4>{project.title}</h4>
          </div>
          <div className="moso-project-list-meta">
            <span>{project.category}</span>
          </div>
          <div className="moso-project-list-year">
            <span>{project.year}</span>
            <div className="moso-project-list-arrow">
              <img src="/images/arrow-up-right.svg" alt="" />
            </div>
          </div>
        </div>
      </a>
    )
  }

  // ─── Grid / Behance card layout ───────────────────────────────────────────
  return (
    <a
      ref={cardRef}
      href={`/portfolio/${project.slug}`}
      className="moso-project-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Logo / brand image — fills the card, scales on hover via GSAP */}
      <div className="moso-project-card-image-wrap">
        <img
          ref={imageRef}
          className="moso-project-card-image"
          src={project.thumbnail}
          alt={`${project.title} logo`}
          loading="lazy"
        />
      </div>

      {/* Meta below the image — Behance style */}
      <div className="moso-project-card-body">
        <div className="moso-project-card-title-row">
          <h3 className="moso-project-card-title">{project.title}</h3>
          <div className="moso-project-card-arrow">
            <img src="/images/arrow-up-right.svg" alt="" />
          </div>
        </div>

        <div className="moso-project-card-meta">
          <span className="moso-project-card-client">{project.client}</span>
          <span className="moso-project-card-sep">·</span>
          <span className="moso-project-card-category">{project.category}</span>
        </div>

        <div className="moso-project-card-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="moso-project-tag">{tag}</span>
          ))}
        </div>
      </div>
    </a>
  )
}
