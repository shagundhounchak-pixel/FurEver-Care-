import { useEffect } from 'react'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Testimonials from '../components/landing/Testimonials'
import Pricing from '../components/landing/Pricing'
import Footer from '../components/landing/Footer'
import '../styles/landing.css'

function LandingPage() {
  useEffect(() => {
    // Setup lightweight intersection observer for smooth scroll reveals
    const revealTargets = document.querySelectorAll(
      '.feature-card, .step-card, .pricing-card, .testimonial-card, .features-header, .how-it-works-header, .pricing-header, .testimonials-header'
    )

    revealTargets.forEach((el, index) => {
      el.classList.add('reveal')
      // Apply staggered entrance delay for grid siblings
      if (
        el.classList.contains('feature-card') ||
        el.classList.contains('pricing-card') ||
        el.classList.contains('step-card')
      ) {
        el.style.transitionDelay = `${(index % 3) * 0.08}s`
      }
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    revealTargets.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing-page">
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
