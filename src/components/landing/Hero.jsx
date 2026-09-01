import heroImage from '../../assets/hero-pets.jpg'

function Hero() {
  return (
    <section className="hero-section" id="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="material-symbols-outlined">verified</span>
              #1 Pet Care Platform
            </div>
            <h1 className="hero-title">
              Everything Your Pet Needs,{' '}
              <span className="text-gradient">In One Place</span>
            </h1>
            <p className="hero-description">
              The friendly digital companion for modern pet owners. Track health records,
              manage appointments, set smart reminders, and ensure your furry friend
              lives their best life — all in one beautiful app.
            </p>
            <div className="hero-cta">
              <a href="#pricing" className="btn btn-primary btn-lg">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>rocket_launch</span>
                Get Started Free
              </a>
              <a href="#features" className="btn btn-secondary btn-lg">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>play_circle</span>
                Learn More
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">50K+</div>
                <div className="hero-stat-label">Happy Pets</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">4.9★</div>
                <div className="hero-stat-label">App Rating</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">200+</div>
                <div className="hero-stat-label">Vet Partners</div>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <img src={heroImage} alt="Happy pets with care icons" />

            <div className="hero-floating-card card-1">
              <div className="floating-card-row">
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>check_circle</span>
                <span>Vaccination Complete</span>
              </div>
            </div>

            <div className="hero-floating-card card-2">
              <div className="floating-card-row">
                <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>schedule</span>
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
