"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { BlogPost } from "../_data/posts"
import { formatDate, posts } from "../_data/posts"

gsap.registerPlugin(ScrollTrigger)

export function BlogPostDetail({ post }: { post: BlogPost }) {
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
      gsap.set(contentRef.current, { opacity: 0, y: 30 })
      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.6,
        ease: "power3.out",
      })
    }
  }, [])

  // Get next post
  const currentIndex = posts.findIndex((p) => p.slug === post.slug)
  const nextPost = posts[(currentIndex + 1) % posts.length]

  return (
    <>
      {/* Hero */}
      <section className="section-top">
        <div className="w-layout-blockcontainer container-fluid w-container">
          <div className="page-title-wrapper" ref={heroRef}>
            <div className="overflow-hidden">
              <div className="moso-hero-title-line">
                <h1 className="page-title moso-blog-detail-title">{post.title}</h1>
              </div>
            </div>
          </div>
          <div className="margin-bottom-medium">
            <div className="w-layout-grid hero-caption-grid">
              <div className="hero-caption-first">
                <div className="hero-caption">{post.category}</div>
              </div>
              <div className="hero-caption-second">
                <div className="hero-caption">{formatDate(post.date)}</div>
              </div>
              <div className="hero-caption-third">
                <div className="hero-caption-inner">
                  <div className="hero-caption">By {post.author}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="divider" />
        </div>
      </section>

      {/* Featured Image */}
      <section className="moso-blog-featured-image-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="moso-blog-featured-image">
            <img src={post.thumbnail} alt={post.title} loading="eager" />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section" ref={contentRef}>
        <div className="w-layout-blockcontainer container w-container">
          <div className="moso-blog-article">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Tags and share */}
          <div className="moso-detail-section">
            <div className="divider" />
            <div className="moso-detail-tags">
              <span className="moso-project-tag">{post.category}</span>
            </div>
          </div>

          {/* Next Post */}
          {nextPost && (
            <div className="moso-detail-section moso-next-project">
              <div className="divider" />
              <a href={`/blog/${nextPost.slug}`} className="moso-next-project-link">
                <div className="moso-next-project-label">Next Article</div>
                <h2 className="moso-next-project-title">{nextPost.title}</h2>
                <div className="moso-next-project-arrow">
                  <img src="/images/arrow-up-right.svg" alt="" />
                </div>
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
