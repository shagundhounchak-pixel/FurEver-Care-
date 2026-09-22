import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { dashboardAPI } from '../../services/api'

function DashboardHome() {
  const { user } = useAuth()
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardAPI.get()
        setDashData(res.data)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const firstName = user?.name?.split(' ')[0] || 'there'

  // Determine greeting based on time
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  const stats = [
    {
      icon: 'pets', color: 'coral',
      value: dashData?.totalPets ?? '—',
      label: 'Active Pets',
      trend: dashData?.totalPets ? `${dashData.totalPets} registered` : 'Add a pet to start',
      trendDir: 'up'
    },
    {
      icon: 'vaccines', color: 'teal',
      value: dashData?.upcomingVaccinations?.length ?? '—',
      label: 'Upcoming Vaccines',
      trend: dashData?.overdueVaccinations ? `${dashData.overdueVaccinations} overdue` : 'All up to date',
      trendDir: dashData?.overdueVaccinations > 0 ? 'down' : 'up'
    },
    {
      icon: 'calendar_month', color: 'amber',
      value: dashData?.upcomingAppointments?.length ?? '—',
      label: 'Upcoming Visits',
      trend: dashData?.upcomingAppointments?.length ? 'Next visit scheduled' : 'No visits scheduled',
      trendDir: 'up'
    },
    {
      icon: 'notifications', color: 'purple',
      value: dashData?.activeReminders ?? '—',
      label: 'Active Reminders',
      trend: `${dashData?.activeReminders || 0} active`,
      trendDir: 'up'
    },
  ]

  const quickActions = [
    { icon: 'add_circle', color: 'coral', title: 'Add New Pet', description: 'Register a new pet profile' },
    { icon: 'event', color: 'teal', title: 'Schedule Visit', description: 'Book a vet appointment' },
    { icon: 'edit_note', color: 'amber', title: 'Log Activity', description: 'Record today\'s activities' },
  ]

  // Format appointments for display
  const upcomingAppointments = (dashData?.upcomingAppointments || []).map(apt => {
    const date = new Date(apt.appointmentDate)
    return {
      day: String(date.getDate()).padStart(2, '0'),
      month: date.toLocaleString('en', { month: 'short' }).toUpperCase(),
      title: `${apt.petId?.name || 'Pet'} — ${apt.reason}`,
      vet: apt.appointmentTime,
      status: apt.status
    }
  })

  if (loading) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)', animation: 'spin 1s linear infinite' }}>
          pets
        </span>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h1>{greeting}, {firstName}! 👋</h1>
          <p>Here&apos;s what&apos;s happening with your pets today.</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="notification-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            {dashData?.activeReminders > 0 && (
              <span className="notification-badge">{dashData.activeReminders}</span>
            )}
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
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt, index) => (
                <div key={index} className="appointment-card">
                  <div className="appointment-date">
                    <span className="day">{apt.day}</span>
                    <span className="month">{apt.month}</span>
                  </div>
                  <div className="appointment-info">
                    <h4>{apt.title}</h4>
                    <p>{apt.vet}</p>
                  </div>
                  <span className={`appointment-status ${apt.status === 'confirmed' ? 'upcoming' : apt.status}`}>
                    {apt.status}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                No upcoming appointments. Book one to get started!
              </p>
            )}
          </div>
        </div>

        {/* Pet Summary */}
        <div className="widget">
          <div className="widget-header">
            <h3>🐾 Your Pets</h3>
          </div>
          <div className="activity-timeline">
            {(dashData?.pets || []).length > 0 ? (
              dashData.pets.map((pet, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-dot ${pet.species === 'Dog' ? 'health' : 'food'}`}>
                    <span className="material-symbols-outlined">
                      {pet.species === 'Dog' ? 'pets' : pet.species === 'Cat' ? 'pets' : 'cruelty_free'}
                    </span>
                  </div>
                  <div className="activity-info">
                    <h4>{pet.name}</h4>
                    <p>{pet.breed || pet.species} · {pet.weight ? `${pet.weight} kg` : 'Weight not set'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                No pets yet. Add your first furry friend!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
