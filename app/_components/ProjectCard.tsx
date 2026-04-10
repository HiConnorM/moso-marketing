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
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    gsap.set(card, { opacity: 0, y: 60 })
    const tl = gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: layout === "grid" ? (index % 2) * 0.15 : 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === card) t.kill()
      })
    }
  }, [index, layout])

  const handleMouseEnter = () => {
    const img = imageRef.current
    if (img) {
      gsap.to(img, { scale: 1.05, filter: "brightness(0.85)", duration: 0.5, ease: "power2.out" })
    }
  }

  const handleMouseLeave = () => {
    const img = imageRef.current
    if (img) {
      gsap.to(img, { scale: 1.0, filter: "brightness(0.6)", duration: 0.5, ease: "power2.out" })
    }
  }

  if (layout === "list") {
    return (
      <a
        ref={cardRef}
        href={`/portfolio/${project.slug}`}
        className="moso-project-list-item"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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

  return (
    <a
      ref={cardRef}
      href={`/portfolio/${project.slug}`}
      className="moso-project-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: "transform, opacity" }}
    >
      <div className="moso-project-card-image-wrap">
        <div ref={imageRef} className="moso-project-card-image" style={{
          backgroundImage: `url(${project.thumbnail})`,
          filter: "brightness(0.6)",
        }} />
        <div className="moso-project-card-overlay">
          <div className="moso-project-card-info">
            <div className="moso-project-card-top">
              <div className="moso-project-card-title-row">
                <h3 className="moso-project-card-title">{project.title}</h3>
                <div className="moso-project-card-arrow">
                  <img src="/images/arrow-up-right-white.svg" alt="" />
                </div>
              </div>
              <div className="moso-project-card-divider" />
              <div className="moso-project-card-client">{project.client}</div>
            </div>
            <div className="moso-project-card-category">{project.category}</div>
          </div>
        </div>
      </div>
      <div className="moso-project-card-tags">
        {project.tags.map((tag) => (
          <span key={tag} className="moso-project-tag">{tag}</span>
        ))}
      </div>
    </a>
  )
}
