import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { dashboardAPI } from '../../services/api'
import { attach3DTilt, triggerRipple } from '../../utils/animationUtils'

function DashboardHome({ setActiveTab, onAction }) {
  const { user } = useAuth()
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading] = useState(true)
  const statCardsRef = useRef([])
  const actionCardsRef = useRef([])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardAPI.get()
        setDashData(res.data)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
        // Check localStorage fallback for demo/offline resilience
        try {
          const localPets = JSON.parse(localStorage.getItem('furever_local_pets') || '[]')
          const localApts = JSON.parse(localStorage.getItem('furever_local_appointments') || '[]')
          const localReminders = JSON.parse(localStorage.getItem('furever_local_reminders') || '[]')
          setDashData({
            totalPets: localPets.length,
            pets: localPets,
            upcomingAppointments: localApts,
            activeReminders: localReminders.filter(r => r.active !== false).length,
            upcomingVaccinations: []
          })
        } catch (e) {
          console.error('Local fallback error:', e)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  // Attach 3D tilt to cards
  useEffect(() => {
    const cleanups = []
    statCardsRef.current.forEach((el) => {
      if (el) cleanups.push(attach3DTilt(el, 6))
    })
    actionCardsRef.current.forEach((el) => {
      if (el) cleanups.push(attach3DTilt(el, 6))
    })

    return () => cleanups.forEach((c) => c && c())
  }, [dashData])

  const firstName = user?.name?.split(' ')[0] || 'there'

  // Determine greeting based on time
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  const stats = [
    {
      id: 'pets',
      icon: 'pets', color: 'coral',
      value: dashData?.totalPets ?? '—',
      label: 'Active Pets',
      trend: dashData?.totalPets ? `${dashData.totalPets} registered` : 'Add a pet to start',
      trendDir: 'up',
      tab: 'pets'
    },
    {
      id: 'vaccines',
      icon: 'vaccines', color: 'teal',
      value: dashData?.upcomingVaccinations?.length ?? '—',
      label: 'Upcoming Vaccines',
      trend: dashData?.overdueVaccinations ? `${dashData.overdueVaccinations} overdue` : 'All up to date',
      trendDir: dashData?.overdueVaccinations > 0 ? 'down' : 'up',
      tab: 'health'
    },
    {
      id: 'visits',
      icon: 'calendar_month', color: 'amber',
      value: dashData?.upcomingAppointments?.length ?? '—',
      label: 'Upcoming Visits',
      trend: dashData?.upcomingAppointments?.length ? 'Next visit scheduled' : 'No visits scheduled',
      trendDir: 'up',
      tab: 'appointments'
    },
    {
      id: 'reminders',
      icon: 'notifications', color: 'purple',
      value: dashData?.activeReminders ?? '—',
      label: 'Active Reminders',
      trend: `${dashData?.activeReminders || 0} active`,
      trendDir: 'up',
      tab: 'reminders'
    },
  ]

  const quickActions = [
    {
      actionKey: 'add-pet',
      icon: 'add_circle',
      color: 'coral',
      title: 'Add New Pet',
      description: 'Register a new pet profile',
      tab: 'pets'
    },
    {
      actionKey: 'schedule-visit',
      icon: 'event',
      color: 'teal',
      title: 'Schedule Visit',
      description: 'Book a vet appointment',
      tab: 'appointments'
    },
    {
      actionKey: 'log-activity',
      icon: 'edit_note',
      color: 'amber',
      title: 'Log Activity',
      description: "Record today's activities",
      tab: 'health'
    },
  ]

  const handleQuickActionClick = (e, action) => {
    triggerRipple(e)
    if (onAction) {
      onAction(action.actionKey)
    } else if (setActiveTab) {
      setActiveTab(action.tab)
    }
  }

  // Format appointments for display
  const upcomingAppointments = (dashData?.upcomingAppointments || []).map(apt => {
    const date = new Date(apt.appointmentDate || Date.now())
    return {
      id: apt._id,
      day: String(date.getDate()).padStart(2, '0'),
      month: date.toLocaleString('en', { month: 'short' }).toUpperCase(),
      title: `${apt.petId?.name || apt.petName || 'Pet'} — ${apt.reason || 'Checkup'}`,
      vet: apt.appointmentTime || 'Time not set',
      status: apt.status || 'confirmed'
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
          <button
            className="notification-btn"
            aria-label="Notifications"
            onClick={(e) => {
              triggerRipple(e)
              if (setActiveTab) setActiveTab('reminders')
            }}
            title="View Reminders"
          >
            <span className="material-symbols-outlined">notifications</span>
            {dashData?.activeReminders > 0 && (
              <span className="notification-badge">{dashData.activeReminders}</span>
            )}
          </button>
        </div>
      </div>

      {/* Stats with 3D Tilt */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            ref={(el) => (statCardsRef.current[index] = el)}
            className="stat-card tilt-card"
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              triggerRipple(e)
              if (setActiveTab) setActiveTab(stat.tab)
            }}
            role="button"
            tabIndex={0}
            title={`View ${stat.label}`}
          >
            <div className={`stat-icon ${stat.color} icon-bounce`}>
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

      {/* Quick Actions with 3D Tilt */}
      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <div
            key={index}
            ref={(el) => (actionCardsRef.current[index] = el)}
            className="quick-action-card tilt-card"
            onClick={(e) => handleQuickActionClick(e, action)}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            title={`Click to ${action.title}`}
          >
            <div className={`quick-action-icon stat-icon ${action.color} icon-bounce`}>
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
            <button
              className="btn btn-secondary btn-sm btn-sweep"
              onClick={(e) => {
                triggerRipple(e)
                if (setActiveTab) setActiveTab('appointments')
              }}
            >
              View All
            </button>
          </div>
          <div className="appointments-list">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt, index) => (
                <div
                  key={index}
                  className="appointment-card"
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    triggerRipple(e)
                    if (setActiveTab) setActiveTab('appointments')
                  }}
                  title="View in Appointments"
                >
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
              <div style={{ textAlign: 'center', padding: '24px 16px' }}>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '14px' }}>
                  No upcoming appointments. Book one to get started!
                </p>
                <button
                  className="btn btn-primary btn-sm btn-sweep"
                  onClick={(e) => {
                    triggerRipple(e)
                    if (onAction) onAction('schedule-visit')
                    else if (setActiveTab) setActiveTab('appointments')
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>event</span>
                  Schedule Visit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pet Summary */}
        <div className="widget">
          <div className="widget-header">
            <h3>🐾 Your Pets</h3>
            <button
              className="btn btn-secondary btn-sm btn-sweep"
              onClick={(e) => {
                triggerRipple(e)
                if (onAction) onAction('add-pet')
                else if (setActiveTab) setActiveTab('pets')
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
              Add Pet
            </button>
          </div>
          <div className="activity-timeline">
            {(dashData?.pets || []).length > 0 ? (
              dashData.pets.map((pet, index) => (
                <div
                  key={index}
                  className="activity-item"
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    triggerRipple(e)
                    if (setActiveTab) setActiveTab('pets')
                  }}
                  title="View Pet Profile"
                >
                  <div className={`activity-dot ${pet.species === 'Dog' ? 'health' : 'food'} icon-bounce`}>
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
              <div style={{ textAlign: 'center', padding: '24px 16px' }}>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '14px' }}>
                  No pets yet. Add your first furry friend!
                </p>
                <button
                  className="btn btn-primary btn-sm btn-sweep"
                  onClick={(e) => {
                    triggerRipple(e)
                    if (onAction) onAction('add-pet')
                    else if (setActiveTab) setActiveTab('pets')
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                  Add New Pet
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
