"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ScrollAnimationProps {
  children: React.ReactNode
  animation?: "fade-up" | "fade-up-stagger" | "scale-in" | "slide-left" | "slide-right"
  delay?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export function ScrollAnimation({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.8,
  className = "",
  style,
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let fromVars: gsap.TweenVars = {}
    let toVars: gsap.TweenVars = {}

    switch (animation) {
      case "fade-up":
        fromVars = { opacity: 0, y: 60 }
        toVars = { opacity: 1, y: 0 }
        break
      case "scale-in":
        fromVars = { opacity: 0, scale: 0.9 }
        toVars = { opacity: 1, scale: 1 }
        break
      case "slide-left":
        fromVars = { opacity: 0, x: 80 }
        toVars = { opacity: 1, x: 0 }
        break
      case "slide-right":
        fromVars = { opacity: 0, x: -80 }
        toVars = { opacity: 1, x: 0 }
        break
      default:
        fromVars = { opacity: 0, y: 60 }
        toVars = { opacity: 1, y: 0 }
    }

    gsap.set(el, fromVars)
    gsap.to(el, {
      ...toVars,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill()
      })
    }
  }, [animation, delay, duration])

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, willChange: "transform, opacity" }}
    >
      {children}
    </div>
  )
}

// Stagger animation for a group of children
export function StaggerGroup({
  children,
  className = "",
  stagger = 0.1,
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.children

    gsap.set(items, { opacity: 0, y: 50 })
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill()
      })
    }
  }, [stagger])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
