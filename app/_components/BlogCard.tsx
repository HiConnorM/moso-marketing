"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { BlogPost } from "../_data/posts"
import { formatDate } from "../_data/posts"

gsap.registerPlugin(ScrollTrigger)

interface BlogCardProps {
  post: BlogPost
  index: number
}

export function BlogCard({ post, index }: BlogCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    gsap.set(card, { opacity: 0, y: 50 })
    const tl = gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: (index % 3) * 0.12,
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
  }, [index])

  const handleMouseEnter = () => {
    const img = imageRef.current
    if (img) {
      gsap.to(img, { scale: 1.05, duration: 0.5, ease: "power2.out" })
    }
  }

  const handleMouseLeave = () => {
    const img = imageRef.current
    if (img) {
      gsap.to(img, { scale: 1.0, duration: 0.5, ease: "power2.out" })
    }
  }

  return (
    <a
      ref={cardRef}
      href={`/blog/${post.slug}`}
      className="moso-blog-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: "transform, opacity" }}
    >
      <div className="moso-blog-card-image-wrap">
        <div
          ref={imageRef}
          className="moso-blog-card-image"
          style={{ backgroundImage: `url(${post.thumbnail})` }}
        />
        <div className="moso-blog-card-fader" />
      </div>
      <div className="moso-blog-card-content">
        <div className="moso-blog-card-meta">
          <span className="moso-blog-card-category">{post.category}</span>
          <span className="moso-blog-card-date">{formatDate(post.date)}</span>
        </div>
        <h3 className="moso-blog-card-title">{post.title}</h3>
        <p className="moso-blog-card-excerpt">{post.excerpt}</p>
      </div>
    </a>
  )
}
