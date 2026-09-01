function Pricing() {
  const plans = [
    {
      name: 'Free',
      icon: 'pets',
      iconColor: 'teal',
      price: '0',
      period: '',
      description: 'Perfect for getting started with one pet',
      features: [
        { text: '1 Pet Profile', available: true },
        { text: 'Basic Health Tracking', available: true },
        { text: 'Vaccination Reminders', available: true },
        { text: 'Appointment Scheduling', available: true },
        { text: 'Activity Log', available: false },
        { text: 'Diet Plans', available: false },
        { text: 'Priority Support', available: false }
      ],
      buttonText: 'Get Started',
      buttonClass: 'btn btn-secondary',
      popular: false
    },
    {
      name: 'Premium',
      icon: 'workspace_premium',
      iconColor: 'coral',
      price: '9.99',
      period: '/mo',
      description: 'Best for dedicated pet parents',
      features: [
        { text: '3 Pet Profiles', available: true },
        { text: 'Advanced Health Analytics', available: true },
        { text: 'Smart Reminders', available: true },
        { text: 'Vet Appointment History', available: true },
        { text: 'Activity & Exercise Log', available: true },
        { text: 'Custom Diet Plans', available: true },
        { text: 'Priority Support', available: false }
      ],
      buttonText: 'Start Free Trial',
      buttonClass: 'btn btn-primary',
      popular: true
    },
    {
      name: 'Family',
      icon: 'family_restroom',
      iconColor: 'amber',
      price: '14.99',
      period: '/mo',
      description: 'For the ultimate multi-pet household',
      features: [
        { text: 'Unlimited Pet Profiles', available: true },
        { text: 'Full Health Suite', available: true },
        { text: 'AI-Powered Reminders', available: true },
        { text: 'Vet Partnership Network', available: true },
        { text: 'Family Activity Dashboard', available: true },
        { text: 'Personalized Diet Plans', available: true },
        { text: '24/7 Priority Support', available: true }
      ],
      buttonText: 'Start Free Trial',
      buttonClass: 'btn btn-secondary',
      popular: false
    }
  ]

  return (
    <section className="pricing-section section" id="pricing">
      <div className="container">
        <div className="pricing-header">
          <div className="section-label">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>sell</span>
            Pricing
          </div>
          <h2 className="section-title">
            Simple, <span className="text-gradient">Transparent Pricing</span>
          </h2>
          <p className="section-subtitle">
            Start free and upgrade as your fur family grows. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="pricing-badge">🔥 Most Popular</div>}
              <div className={`pricing-icon ${plan.iconColor}`}>
                <span className="material-symbols-outlined">{plan.icon}</span>
              </div>
              <h3 className="pricing-name">{plan.name}</h3>
              <div className="pricing-price">
                <span className="currency">$</span>
                {plan.price}
                {plan.period && <span className="period">{plan.period}</span>}
              </div>
              <p className="pricing-description">{plan.description}</p>
              <ul className="pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <span className={`material-symbols-outlined ${!feature.available ? 'disabled' : ''}`}>
                      {feature.available ? 'check_circle' : 'cancel'}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>
              <button className={plan.buttonClass}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
