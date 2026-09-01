import { useState } from 'react'

function Footer() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      alert('Thanks for subscribing! 🐾')
      setEmail('')
    }
  }

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="material-symbols-outlined">pets</span>
              FurEver Care
            </div>
            <p>
              The friendly digital companion for modern pet owners. Track health,
              manage appointments, and ensure your furry friend lives their best life.
            </p>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-column footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Get pet care tips and product updates delivered to your inbox.</p>
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 FurEver Care. Made with ❤️ for pets everywhere.</p>
          <div className="footer-social">
            <a href="#twitter" aria-label="Twitter">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>public</span>
            </a>
            <a href="#instagram" aria-label="Instagram">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>photo_camera</span>
            </a>
            <a href="#facebook" aria-label="Facebook">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>group</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
