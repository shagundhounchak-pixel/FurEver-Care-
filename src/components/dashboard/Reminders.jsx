import { useState, useEffect } from 'react'
import { remindersAPI } from '../../services/api'

function Reminders() {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    category: 'medication', title: '', description: '', time: '',
    recurring: false, frequency: 'once'
  })

  const fetchReminders = async () => {
    try {
      const res = await remindersAPI.getAll()
      setReminders(res.data.reminders)
    } catch (err) {
      console.error('Error fetching reminders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReminders() }, [])

  const toggleReminder = async (id) => {
    try {
      await remindersAPI.toggle(id)
      setReminders(reminders.map(r =>
        r._id === id ? { ...r, active: !r.active } : r
      ))
    } catch (err) {
      console.error('Error toggling reminder:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await remindersAPI.create(formData)
      setShowModal(false)
      setFormData({ category: 'medication', title: '', description: '', time: '', recurring: false, frequency: 'once' })
      fetchReminders()
    } catch (err) {
      alert(err.message || 'Failed to create reminder')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this reminder?')) return
    try {
      await remindersAPI.delete(id)
      fetchReminders()
    } catch (err) {
      alert(err.message || 'Failed to delete')
    }
  }

  const categories = [
    { key: 'all', label: 'All', icon: 'apps' },
    { key: 'medication', label: 'Medication', icon: 'medication' },
    { key: 'feeding', label: 'Feeding', icon: 'restaurant' },
    { key: 'grooming', label: 'Grooming', icon: 'content_cut' },
    { key: 'vet', label: 'Vet Visit', icon: 'local_hospital' },
  ]

  const categoryIcons = {
    medication: 'medication',
    feeding: 'restaurant',
    grooming: 'content_cut',
    vet: 'local_hospital',
    other: 'notifications'
  }

  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? reminders
    : reminders.filter(r => r.category === activeFilter)

  if (loading) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)', animation: 'spin 1s linear infinite' }}>pets</span>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="section-header">
        <h2>🔔 Reminders</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Add Reminder
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '24px',
        overflowX: 'auto', paddingBottom: '4px'
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
            <h3>{reminders.filter(r => r.time && r.time.toLowerCase().includes('today')).length}</h3>
            <p>Due Today</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">
            <span className="material-symbols-outlined">event</span>
          </div>
          <div className="stat-content">
            <h3>{reminders.filter(r => r.recurring).length}</h3>
            <p>Recurring</p>
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
        {filtered.length > 0 ? (
          filtered.map((reminder) => (
            <div key={reminder._id} className="reminder-card" style={{
              opacity: reminder.active ? 1 : 0.5
            }}>
              <div className={`reminder-icon ${reminder.category}`}>
                <span className="material-symbols-outlined">
                  {categoryIcons[reminder.category] || 'notifications'}
                </span>
              </div>
              <div className="reminder-content">
                <h4>{reminder.title}</h4>
                <p>{reminder.description}</p>
              </div>
              <div className="reminder-time">{reminder.time}</div>
              <button
                className={`reminder-toggle ${reminder.active ? 'active' : ''}`}
                onClick={() => toggleReminder(reminder._id)}
                aria-label={`Toggle ${reminder.title}`}
              />
              <button onClick={() => handleDelete(reminder._id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-light)', padding: '4px', marginLeft: '4px'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
            No reminders found. Create one to stay on track!
          </p>
        )}
      </div>

      {/* Add Reminder Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔔 Add Reminder</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" placeholder="e.g., Heartgard Plus — Buddy" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="medication">Medication</option>
                    <option value="feeding">Feeding</option>
                    <option value="grooming">Grooming</option>
                    <option value="vet">Vet Visit</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="text" name="time" placeholder="e.g., Daily, 8:00 AM" value={formData.time} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" placeholder="Details about this reminder..." value={formData.description} onChange={handleChange} />
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" name="recurring" checked={formData.recurring} onChange={handleChange} id="recurring-check" />
                  <label htmlFor="recurring-check" style={{ margin: 0 }}>Recurring</label>
                </div>
                {formData.recurring && (
                  <div className="form-group">
                    <label>Frequency</label>
                    <select name="frequency" value={formData.frequency} onChange={handleChange}>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{submitting ? 'progress_activity' : 'check'}</span>
                  {submitting ? 'Adding...' : 'Add Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reminders
