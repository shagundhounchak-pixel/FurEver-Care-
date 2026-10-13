import { useEffect, useRef, useState } from 'react'
import heroImage from '../../assets/hero-pets.jpg'
import AnimatedCheckmark from '../shared/AnimatedCheckmark'
import { attachMagnetic, triggerRipple, prefersReducedMotion } from '../../utils/animationUtils'
import gsap from 'gsap'

function Hero() {
  const heroRef = useRef(null)
  const ctaBtnRef = useRef(null)
  const floatingElementsRef = useRef([])
  const statsRef = useRef(null)

  // Animated counters state
  const [petsCount, setPetsCount] = useState(() => (prefersReducedMotion() ? 50 : 0))
  const [ratingCount, setRatingCount] = useState(() => (prefersReducedMotion() ? 4.9 : 0))
  const [vetsCount, setVetsCount] = useState(() => (prefersReducedMotion() ? 200 : 0))
  const [statsAnimated, setStatsAnimated] = useState(() => prefersReducedMotion())

  // 1. Magnetic CTA Button & 2. Mouse Parallax for Floating Pet Elements
  useEffect(() => {
    // Magnetic hover for CTA button
    const cleanupMagnetic = attachMagnetic(ctaBtnRef.current, 0.28)

    // Mouse parallax for floating pet elements
    const heroEl = heroRef.current
    if (!heroEl || prefersReducedMotion()) return cleanupMagnetic

    const handleMouseMove = (e) => {
      const rect = heroEl.getBoundingClientRect()
      const mouseX = e.clientX - (rect.left + rect.width / 2)
      const mouseY = e.clientY - (rect.top + rect.height / 2)

      floatingElementsRef.current.forEach((item) => {
        if (!item) return
        const depth = parseFloat(item.dataset.depth || '0.04')
        gsap.to(item, {
          x: mouseX * depth,
          y: mouseY * depth,
          duration: 0.8,
          ease: 'power1.out',
          overwrite: 'auto',
        })
      })
    }

    const handleMouseLeave = () => {
      floatingElementsRef.current.forEach((item) => {
        if (!item) return
        gsap.to(item, {
          x: 0,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })
    }

    heroEl.addEventListener('mousemove', handleMouseMove)
    heroEl.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cleanupMagnetic()
      heroEl.removeEventListener('mousemove', handleMouseMove)
      heroEl.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // 3. Count-up animation for Stats when in viewport
  useEffect(() => {
    if (statsAnimated) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          setStatsAnimated(true)

          const targets = { pets: 0, rating: 0, vets: 0 }
          gsap.to(targets, {
            pets: 50,
            rating: 4.9,
            vets: 200,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              setPetsCount(Math.round(targets.pets))
              setRatingCount(parseFloat(targets.rating.toFixed(1)))
              setVetsCount(Math.round(targets.vets))
            },
          })
        }
      },
      { threshold: 0.2 }
    )

    if (statsRef.current) observer.observe(statsRef.current)

    return () => observer.disconnect()
  }, [statsAnimated])

  // Headline words for word-by-word reveal
  const headlinePart1 = ['Everything', 'Your', 'Pet', 'Needs,']
  const headlinePart2 = ['In', 'One', 'Place']

  return (
    <section className="hero-section" id="hero" ref={heroRef}>
      {/* Soft Morphed Animated Gradient Blobs in the Background */}
      <div className="hero-morph-blob blob-sage" aria-hidden="true" />
      <div className="hero-morph-blob blob-peach" aria-hidden="true" />

      {/* Floating Pet Illustrations drifting with Parallax */}
      <div
        className="hero-parallax-item float-bone"
        data-depth="0.05"
        ref={(el) => (floatingElementsRef.current[0] = el)}
        aria-hidden="true"
      >
        <span>🦴</span>
      </div>
      <div
        className="hero-parallax-item float-paw"
        data-depth="0.08"
        ref={(el) => (floatingElementsRef.current[1] = el)}
        aria-hidden="true"
      >
        <span>🐾</span>
      </div>
      <div
        className="hero-parallax-item float-cat"
        data-depth="0.04"
        ref={(el) => (floatingElementsRef.current[2] = el)}
        aria-hidden="true"
      >
        <span>🐱</span>
      </div>
      <div
        className="hero-parallax-item float-heart"
        data-depth="0.06"
        ref={(el) => (floatingElementsRef.current[3] = el)}
        aria-hidden="true"
      >
        <span>💚</span>
      </div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            {/* Hero Verified Badge */}
            <div className="hero-badge animate-badge">
              <span className="material-symbols-outlined">verified</span>
              #1 Pet Care Platform
            </div>

            {/* Word-by-Word Animated Headline */}
            <h1 className="hero-title" aria-label="Everything Your Pet Needs, In One Place">
              <span className="headline-line">
                {headlinePart1.map((word, index) => (
                  <span key={index} className="word-wrapper">
                    <span
                      className="word-inner"
                      style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                    >
                      {word}&nbsp;
                    </span>
                  </span>
                ))}
              </span>
              <span className="headline-line text-gradient">
                {headlinePart2.map((word, index) => (
                  <span key={index} className="word-wrapper">
                    <span
                      className="word-inner"
                      style={{ animationDelay: `${0.45 + index * 0.08}s` }}
                    >
                      {word}{index < headlinePart2.length - 1 ? '\u00A0' : ''}
                    </span>
                  </span>
                ))}
              </span>
            </h1>

            <p className="hero-description">
              The friendly digital companion for modern pet owners. Track health records,
              manage appointments, set smart reminders, and ensure your furry friend
              lives their best life — all in one beautiful app.
            </p>

            {/* CTA Buttons with Magnetic Hover, Pulsing Glow, & Click Ripple */}
            <div className="hero-cta">
              <a
                href="#pricing"
                className="btn btn-primary btn-lg btn-magnetic btn-pulse-glow"
                ref={ctaBtnRef}
                onClick={triggerRipple}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>rocket_launch</span>
                Get Started Free
              </a>
              <a
                href="#features"
                className="btn btn-secondary btn-lg btn-sweep"
                onClick={triggerRipple}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>play_circle</span>
                Learn More
              </a>
            </div>

            {/* Animated Count-up Numbers when Scrolled into View */}
            <div className="hero-stats" ref={statsRef}>
              <div className="hero-stat">
                <div className="hero-stat-value">{petsCount}K+</div>
                <div className="hero-stat-label">Happy Pets</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">{ratingCount}★</div>
                <div className="hero-stat-label">App Rating</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">{vetsCount}+</div>
                <div className="hero-stat-label">Vet Partners</div>
              </div>
            </div>
          </div>

          {/* Hero Image & Micro-Cards */}
          <div className="hero-image-wrapper">
            <img src={heroImage} alt="Happy pets with care icons" />

            {/* Floating Card 1 with Animated Checkmark */}
            <div className="hero-floating-card card-1 card-float-1">
              <div className="floating-card-row">
                <AnimatedCheckmark size={20} color="var(--primary)" />
                <span>Vaccination Complete</span>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="hero-floating-card card-2 card-float-2">
              <div className="floating-card-row">
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>schedule</span>
                <span>Next Checkup: 3 Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
