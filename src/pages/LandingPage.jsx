import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Testimonials from '../components/landing/Testimonials'
import Pricing from '../components/landing/Pricing'
import Footer from '../components/landing/Footer'
import ScrollProgressBar from '../components/shared/ScrollProgressBar'
import PageLoader from '../components/shared/PageLoader'
import { prefersReducedMotion } from '../utils/animationUtils'
import '../styles/landing.css'

gsap.registerPlugin(ScrollTrigger)

function LandingPage() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    // 1. Parallax scrolling on hero background shapes and hero image
    const heroTrigger = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      animation: gsap.timeline()
        .to('.hero-image-wrapper', { yPercent: 12, ease: 'none' }, 0)
        .to('.blob-sage', { yPercent: 24, ease: 'none' }, 0)
        .to('.blob-peach', { yPercent: -18, ease: 'none' }, 0)
    })

    // 2. Staggered Entrance & Scale for Sections with GSAP ScrollTrigger
    const sections = ['#features', '#how-it-works', '#pricing', '#testimonials']
    const triggers = []

    sections.forEach((secId) => {
      const sec = document.querySelector(secId)
      if (!sec) return

      const headers = sec.querySelectorAll('.section-label, .section-title, .section-subtitle')
      const cards = sec.querySelectorAll('.feature-card, .step-card, .pricing-card, .testimonial-card')

      if (headers.length) {
        const headerAnim = gsap.from(headers, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 82%',
          },
        })
        if (headerAnim.scrollTrigger) triggers.push(headerAnim.scrollTrigger)
      }

      if (cards.length) {
        const cardsAnim = gsap.from(cards, {
          opacity: 0,
          y: 35,
          scale: 0.96,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cards[0],
            start: 'top 86%',
          },
        })
        if (cardsAnim.scrollTrigger) triggers.push(cardsAnim.scrollTrigger)
      }
    })

    return () => {
      heroTrigger.kill()
      triggers.forEach((t) => t.kill())
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div className="landing-page">
      {/* Page Extras: Preloader & Scroll Progress Bar */}
      <PageLoader />
      <ScrollProgressBar />

      {/* Main Landing Page Structure */}
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  )
}

export default LandingPage
