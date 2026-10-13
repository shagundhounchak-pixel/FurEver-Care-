import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { triggerRipple } from '../../utils/animationUtils'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
  }

  const handleNavLinkClick = (e, targetId) => {
    setMobileOpen(false)
    const target = document.querySelector(targetId)
    if (target) {
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled shrink' : ''}`} id="navbar">
        <div className="container">
          <Link to="/" className="navbar-logo">
            <span className="material-symbols-outlined paw-icon">pets</span>
            <span>FurEver Care</span>
          </Link>

          <div className="navbar-links">
            <a href="#features" onClick={(e) => handleNavLinkClick(e, '#features')}>Features</a>
            <a href="#how-it-works" onClick={(e) => handleNavLinkClick(e, '#how-it-works')}>How It Works</a>
            <a href="#pricing" onClick={(e) => handleNavLinkClick(e, '#pricing')}>Pricing</a>
            <a href="#testimonials" onClick={(e) => handleNavLinkClick(e, '#testimonials')}>Testimonials</a>
          </div>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="btn btn-primary btn-sm btn-sweep"
                  onClick={triggerRipple}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>dashboard</span>
                  Dashboard
                </Link>
                <button
                  onClick={(e) => { triggerRipple(e); handleLogout(); }}
                  className="btn btn-secondary btn-sm"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary btn-sm"
                  onClick={triggerRipple}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm btn-sweep"
                  onClick={triggerRipple}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                  Sign Up
                </Link>
              </>
            )}
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
        <a href="#features" onClick={(e) => handleNavLinkClick(e, '#features')}>Features</a>
        <a href="#how-it-works" onClick={(e) => handleNavLinkClick(e, '#how-it-works')}>How It Works</a>
        <a href="#pricing" onClick={(e) => handleNavLinkClick(e, '#pricing')}>Pricing</a>
        <a href="#testimonials" onClick={(e) => handleNavLinkClick(e, '#testimonials')}>Testimonials</a>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
              Go to Dashboard
            </Link>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </>
  )
}

export default Navbar
