import { useState } from 'react'

function Reminders() {
  const [reminders, setReminders] = useState([
    {
      id: 1, category: 'medication', icon: 'medication',
      title: 'Heartgard Plus — Buddy',
      description: 'Monthly heartworm prevention',
      time: 'Today, 8:00 AM',
      active: true
    },
    {
      id: 2, category: 'feeding', icon: 'restaurant',
      title: 'Morning Meal — Luna',
      description: '150g dry food + water',
      time: 'Today, 7:30 AM',
      active: true
    },
    {
      id: 3, category: 'grooming', icon: 'content_cut',
      title: 'Nail Trimming — Buddy',
      description: 'Bi-weekly grooming schedule',
      time: 'Tomorrow, 10:00 AM',
      active: true
    },
    {
      id: 4, category: 'vet', icon: 'local_hospital',
      title: 'Vet Checkup — Luna',
      description: 'Annual wellness exam',
      time: 'Sept 2, 10:00 AM',
      active: true
    },
    {
      id: 5, category: 'medication', icon: 'medication',
      title: 'Joint Supplement — Buddy',
      description: 'Daily joint health supplement',
      time: 'Daily, 9:00 AM',
      active: true
    },
    {
      id: 6, category: 'feeding', icon: 'restaurant',
      title: 'Evening Meal — Buddy',
      description: '200g wet food + kibble mix',
      time: 'Daily, 6:00 PM',
      active: false
    },
    {
      id: 7, category: 'grooming', icon: 'content_cut',
      title: 'Brushing — Luna',
      description: 'Weekly coat brushing',
      time: 'Every Saturday',
      active: true
    },
    {
      id: 8, category: 'vet', icon: 'local_hospital',
      title: 'Dental Cleaning — Buddy',
      description: 'Professional dental care',
      time: 'Sept 15, 2:30 PM',
      active: true
    },
  ])

  const toggleReminder = (id) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, active: !r.active } : r
    ))
  }

  const categories = [
    { key: 'all', label: 'All', icon: 'apps' },
    { key: 'medication', label: 'Medication', icon: 'medication' },
    { key: 'feeding', label: 'Feeding', icon: 'restaurant' },
    { key: 'grooming', label: 'Grooming', icon: 'content_cut' },
    { key: 'vet', label: 'Vet Visit', icon: 'local_hospital' },
  ]

  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? reminders
    : reminders.filter(r => r.category === activeFilter)

  return (
    <div className="page-content">
      <div className="section-header">
        <h2>🔔 Reminders</h2>
        <button className="btn btn-primary btn-sm">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Add Reminder
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveFilter(cat.key)}
            className={activeFilter === cat.key ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            style={{ whiteSpace: 'nowrap' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon coral">
            <span className="material-symbols-outlined">notifications_active</span>
          </div>
          <div className="stat-content">
            <h3>{reminders.filter(r => r.active).length}</h3>
            <p>Active Reminders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teal">
            <span className="material-symbols-outlined">today</span>
          </div>
          <div className="stat-content">
            <h3>{reminders.filter(r => r.time.includes('Today')).length}</h3>
            <p>Due Today</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">
            <span className="material-symbols-outlined">event</span>
          </div>
          <div className="stat-content">
            <h3>{reminders.filter(r => r.time.includes('Tomorrow')).length}</h3>
            <p>Due Tomorrow</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <span className="material-symbols-outlined">notifications_off</span>
          </div>
          <div className="stat-content">
            <h3>{reminders.filter(r => !r.active).length}</h3>
            <p>Paused</p>
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="reminders-list">
        {filtered.map((reminder) => (
          <div key={reminder.id} className="reminder-card" style={{
            opacity: reminder.active ? 1 : 0.5
          }}>
            <div className={`reminder-icon ${reminder.category}`}>
              <span className="material-symbols-outlined">{reminder.icon}</span>
            </div>
            <div className="reminder-content">
              <h4>{reminder.title}</h4>
              <p>{reminder.description}</p>
            </div>
            <div className="reminder-time">{reminder.time}</div>
            <button
              className={`reminder-toggle ${reminder.active ? 'active' : ''}`}
              onClick={() => toggleReminder(reminder.id)}
              aria-label={`Toggle ${reminder.title}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Reminders
