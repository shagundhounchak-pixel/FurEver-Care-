function Features() {
  const features = [
    {
      icon: 'monitor_heart',
      color: 'coral',
      title: 'Health Tracking',
      description: 'Monitor your pet\'s health metrics, weight, and vital signs with beautiful visual dashboards and trend analysis.'
    },
    {
      icon: 'notifications_active',
      color: 'teal',
      title: 'Smart Reminders',
      description: 'Never miss a feeding, medication, or grooming session. Intelligent reminders adapt to your pet\'s schedule.'
    },
    {
      icon: 'calendar_month',
      color: 'amber',
      title: 'Vet Appointments',
      description: 'Schedule and manage veterinary visits, track visit history, and receive preparation tips before each appointment.'
    },
    {
      icon: 'restaurant',
      color: 'teal',
      title: 'Diet Plans',
      description: 'Personalized nutrition plans based on your pet\'s breed, age, and health conditions. Track meals and water intake.'
    },
    {
      icon: 'trending_up',
      color: 'coral',
      title: 'Activity Log',
      description: 'Record daily activities, walks, playtime, and exercise. Visualize trends and set activity goals for your pet.'
    },
    {
      icon: 'groups',
      color: 'amber',
      title: 'Pet Community',
      description: 'Connect with fellow pet parents, share tips, and join local meetups. Build your pet\'s social circle.'
    }
  ]

  return (
    <section className="features-section section" id="features">
      <div className="container">
        <div className="features-header">
          <div className="section-label">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>star</span>
            Features
          </div>
          <h2 className="section-title">
            Everything You Need to Keep <span className="text-gradient">Your Pet Happy</span>
          </h2>
          <p className="section-subtitle">
            Comprehensive tools designed with love to help you provide the best care for your furry family members.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`feature-icon ${feature.color}`}>
                <span className="material-symbols-outlined">{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
