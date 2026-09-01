import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="container">
          <Link to="/" className="navbar-logo">
            <span className="material-symbols-outlined paw-icon">pets</span>
            <span>FurEver Care</span>
          </Link>

          <div className="navbar-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Testimonials</a>
          </div>

          <div className="navbar-actions">
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>dashboard</span>
              Dashboard
            </Link>
            <button
              className="navbar-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
        <a href="#how-it-works" onClick={() => setMobileOpen(false)}>How It Works</a>
        <a href="#pricing" onClick={() => setMobileOpen(false)}>Pricing</a>
        <a href="#testimonials" onClick={() => setMobileOpen(false)}>Testimonials</a>
        <Link to="/dashboard" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
          Go to Dashboard
        </Link>
      </div>
    </>
  )
}

export default Navbar
