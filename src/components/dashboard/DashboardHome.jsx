function DashboardHome() {
  const stats = [
    { icon: 'pets', color: 'coral', value: '2', label: 'Active Pets', trend: '+1 this month', trendDir: 'up' },
    { icon: 'monitor_heart', color: 'teal', value: '92%', label: 'Avg Health Score', trend: '+5% from last month', trendDir: 'up' },
    { icon: 'calendar_month', color: 'amber', value: '3', label: 'Upcoming Visits', trend: 'Next: Sept 2', trendDir: 'up' },
    { icon: 'notifications', color: 'purple', value: '7', label: 'Active Reminders', trend: '2 due today', trendDir: 'up' },
  ]

  const quickActions = [
    { icon: 'add_circle', color: 'coral', title: 'Add New Pet', description: 'Register a new pet profile' },
    { icon: 'event', color: 'teal', title: 'Schedule Visit', description: 'Book a vet appointment' },
    { icon: 'edit_note', color: 'amber', title: 'Log Activity', description: 'Record today\'s activities' },
  ]

  const activities = [
    { type: 'health', icon: 'vaccines', title: 'Vaccination Updated', desc: 'Buddy\'s rabies vaccine recorded', time: '2 hours ago' },
    { type: 'food', icon: 'restaurant', title: 'Feeding Logged', desc: 'Luna\'s morning meal — 150g dry food', time: '4 hours ago' },
    { type: 'walk', icon: 'directions_walk', title: 'Walk Completed', desc: 'Buddy — 45 min walk at Central Park', time: '6 hours ago' },
    { type: 'vet', icon: 'local_hospital', title: 'Vet Visit Scheduled', desc: 'Luna\'s checkup — Sept 2, 10:00 AM', time: 'Yesterday' },
  ]

  const upcomingAppointments = [
    { day: '02', month: 'SEP', title: 'Luna\'s Annual Checkup', vet: 'Dr. Sarah Wilson', status: 'upcoming' },
    { day: '15', month: 'SEP', title: 'Buddy\'s Dental Cleaning', vet: 'Dr. James Lee', status: 'upcoming' },
    { day: '28', month: 'SEP', title: 'Buddy\'s Follow-up', vet: 'Dr. Sarah Wilson', status: 'upcoming' },
  ]

  return (
    <div className="page-content">
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h1>Good Morning, Alex! 👋</h1>
          <p>Here&apos;s what&apos;s happening with your pets today.</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="notification-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            <span className="notification-badge">3</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
              <div className={`stat-trend ${stat.trendDir}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  {stat.trendDir === 'up' ? 'trending_up' : 'trending_down'}
                </span>
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <div key={index} className="quick-action-card">
            <div className={`quick-action-icon stat-icon ${action.color}`}>
              <span className="material-symbols-outlined">{action.icon}</span>
            </div>
            <div>
              <h4>{action.title}</h4>
              <p>{action.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Widgets */}
      <div className="dashboard-widgets">
        {/* Upcoming Appointments */}
        <div className="widget">
          <div className="widget-header">
            <h3>📅 Upcoming Appointments</h3>
            <button className="btn btn-secondary btn-sm">View All</button>
          </div>
          <div className="appointments-list">
            {upcomingAppointments.map((apt, index) => (
              <div key={index} className="appointment-card">
                <div className="appointment-date">
                  <span className="day">{apt.day}</span>
                  <span className="month">{apt.month}</span>
                </div>
                <div className="appointment-info">
                  <h4>{apt.title}</h4>
                  <p>{apt.vet}</p>
                </div>
                <span className={`appointment-status ${apt.status}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="widget">
          <div className="widget-header">
            <h3>⚡ Recent Activity</h3>
          </div>
          <div className="activity-timeline">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-dot ${activity.type}`}>
                  <span className="material-symbols-outlined">{activity.icon}</span>
                </div>
                <div className="activity-info">
                  <h4>{activity.title}</h4>
                  <p>{activity.desc}</p>
                  <p style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.6 }}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
