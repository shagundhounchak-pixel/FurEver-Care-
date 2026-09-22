import { useState, useEffect } from 'react'
import { appointmentsAPI, petsAPI } from '../../services/api'

function Appointments() {
  const [showModal, setShowModal] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    petId: '', reason: 'General Checkup', appointmentDate: '',
    appointmentTime: '', veterinarian: '', notes: ''
  })

  const fetchData = async () => {
    try {
      const [aptRes, petRes] = await Promise.all([
        appointmentsAPI.getAll(),
        petsAPI.getAll()
      ])
      setAppointments(aptRes.data.appointments)
      setPets(petRes.data.pets)
      if (petRes.data.pets.length > 0 && !formData.petId) {
        setFormData(prev => ({ ...prev, petId: petRes.data.pets[0]._id }))
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await appointmentsAPI.create({
        petId: formData.petId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason,
        notes: formData.veterinarian ? `Vet: ${formData.veterinarian}. ${formData.notes}` : formData.notes
      })
      setShowModal(false)
      setFormData(prev => ({ ...prev, reason: 'General Checkup', appointmentDate: '', appointmentTime: '', veterinarian: '', notes: '' }))
      fetchData()
    } catch (err) {
      alert(err.message || 'Failed to create appointment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return
    try {
      await appointmentsAPI.cancel(id)
      fetchData()
    } catch (err) {
      alert(err.message || 'Failed to cancel')
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return {
      day: String(d.getDate()).padStart(2, '0'),
      month: d.toLocaleString('en', { month: 'short' }).toUpperCase()
    }
  }

  const upcoming = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed')
  const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled')

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
        <h2>📅 Appointments</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          New Appointment
        </button>
      </div>

      {/* Upcoming */}
      <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px', verticalAlign: 'middle', marginRight: '8px', color: 'var(--secondary)' }}>
          upcoming
        </span>
        Upcoming
      </h3>
      <div className="appointments-list" style={{ marginBottom: '32px' }}>
        {upcoming.length > 0 ? (
          upcoming.map((apt) => {
            const { day, month } = formatDate(apt.appointmentDate)
            const petName = apt.petId?.name || 'Pet'
            return (
              <div key={apt._id} className="appointment-card">
                <div className="appointment-date">
                  <span className="day">{day}</span>
                  <span className="month">{month}</span>
                </div>
                <div className="appointment-info">
                  <h4>{petName} — {apt.reason}</h4>
                  <p>{apt.notes || 'No additional notes'}</p>
                  <p style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                    {apt.appointmentTime}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`appointment-status ${apt.status === 'confirmed' ? 'upcoming' : 'upcoming'}`}>
                    {apt.status}
                  </span>
                  <button onClick={() => handleCancel(apt._id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)',
                    padding: '4px', borderRadius: '4px', transition: 'color 0.2s'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cancel</span>
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
            No upcoming appointments.
          </p>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', verticalAlign: 'middle', marginRight: '8px', color: '#A78BFA' }}>
              history
            </span>
            Past Appointments
          </h3>
          <div className="appointments-list">
            {past.map((apt) => {
              const { day, month } = formatDate(apt.appointmentDate)
              const petName = apt.petId?.name || 'Pet'
              return (
                <div key={apt._id} className="appointment-card" style={{ opacity: 0.7 }}>
                  <div className="appointment-date" style={{ background: 'rgba(167, 139, 250, 0.12)' }}>
                    <span className="day" style={{ color: '#A78BFA' }}>{day}</span>
                    <span className="month" style={{ color: '#A78BFA' }}>{month}</span>
                  </div>
                  <div className="appointment-info">
                    <h4>{petName} — {apt.reason}</h4>
                    <p>{apt.notes || ''}</p>
                  </div>
                  <span className={`appointment-status ${apt.status}`}>
                    {apt.status}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* New Appointment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📅 New Appointment</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Pet</label>
                <select name="petId" value={formData.petId} onChange={handleChange} required>
                  {pets.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Appointment Type</label>
                <select name="reason" value={formData.reason} onChange={handleChange}>
                  <option>General Checkup</option>
                  <option>Vaccination</option>
                  <option>Dental</option>
                  <option>Surgery</option>
                  <option>Follow-up</option>
                  <option>Emergency</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Veterinarian / Clinic</label>
                <input type="text" name="veterinarian" placeholder="e.g., Dr. Sarah Wilson — PetCare Clinic" value={formData.veterinarian} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea name="notes" placeholder="Preparation instructions or symptoms to discuss..." value={formData.notes} onChange={handleChange} />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{submitting ? 'progress_activity' : 'check'}</span>
                  {submitting ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments
