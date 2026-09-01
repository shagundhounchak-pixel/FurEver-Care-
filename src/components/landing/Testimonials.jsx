import { useRef } from 'react'

function Testimonials() {
  const trackRef = useRef(null)

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      pet: 'Owner of Max (Golden Retriever)',
      text: 'FurEver Care has completely transformed how I manage Max\'s health. The vaccination reminders alone have been a lifesaver. I never miss an appointment anymore!',
      rating: 5,
      avatar: '🐕'
    },
    {
      name: 'James Chen',
      pet: 'Owner of Luna & Mochi (Cats)',
      text: 'Managing two cats used to be chaotic. Now I have all their records, feeding schedules, and vet appointments in one place. The interface is beautiful and so intuitive.',
      rating: 5,
      avatar: '🐱'
    },
    {
      name: 'Emily Rodriguez',
      pet: 'Owner of Buddy (Beagle)',
      text: 'The health tracking feature is incredible. I can see Buddy\'s weight trends and activity levels over time. My vet was impressed when I showed her the reports!',
      rating: 5,
      avatar: '🐶'
    },
    {
      name: 'David Park',
      pet: 'Owner of Whiskers (Persian Cat)',
      text: 'As a first-time cat owner, this app has been my guide. The diet plans and grooming reminders help me give Whiskers the best care possible.',
      rating: 4,
      avatar: '🐈'
    },
    {
      name: 'Lisa Thompson',
      pet: 'Owner of 3 rescue dogs',
      text: 'The Family plan is perfect for multi-pet households. I can manage all three of my rescues effortlessly. The community feature helped me find amazing local dog parks!',
      rating: 5,
      avatar: '🐕‍🦺'
    }
  ]

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = 380
      trackRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="testimonials-section section" id="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <div className="section-label">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>format_quote</span>
            Testimonials
          </div>
          <h2 className="section-title">
            Loved by <span className="text-gradient">Pet Parents</span> Everywhere
          </h2>
          <p className="section-subtitle">
            Hear from thousands of happy pet owners who trust FurEver Care for their pets' wellbeing.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <div className="testimonials-track" ref={trackRef}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined"
                      style={{
                        fontVariationSettings: i < testimonial.rating ? "'FILL' 1" : "'FILL' 0",
                        opacity: i < testimonial.rating ? 1 : 0.3
                      }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--primary-glow)'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.pet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '24px'
          }}>
            <button
              onClick={() => scroll('left')}
              className="btn btn-secondary btn-sm"
              style={{ width: '44px', height: '44px', padding: 0, borderRadius: '50%' }}
              aria-label="Scroll left"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => scroll('right')}
              className="btn btn-secondary btn-sm"
              style={{ width: '44px', height: '44px', padding: 0, borderRadius: '50%' }}
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
