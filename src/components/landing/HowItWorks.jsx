function HowItWorks() {
  const steps = [
    {
      icon: 'person_add',
      label: '1',
      title: 'Create Your Profile',
      description: 'Sign up and add your pets with their basic information, breed, and photos. It takes less than 2 minutes.'
    },
    {
      icon: 'monitoring',
      label: '2',
      title: 'Track & Manage',
      description: 'Log health records, set reminders, schedule vet appointments, and monitor your pet\'s daily wellness.'
    },
    {
      icon: 'favorite',
      label: '3',
      title: 'Stay Connected',
      description: 'Get personalized insights, connect with vets, and join a community of loving pet parents.'
    }
  ]

  return (
    <section className="how-it-works-section section" id="how-it-works">
      <div className="container">
        <div className="how-it-works-header">
          <div className="section-label">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>route</span>
            How It Works
          </div>
          <h2 className="section-title">
            Get Started in <span className="text-gradient">Three Simple Steps</span>
          </h2>
          <p className="section-subtitle">
            Setting up FurEver Care is quick and easy. Your pet's personalized care dashboard is just minutes away.
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">
                <span className="material-symbols-outlined">{step.icon}</span>
                <div className="step-label">{step.label}</div>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
