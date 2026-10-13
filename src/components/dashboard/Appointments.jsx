import { useState, useEffect, useCallback } from 'react'
import { appointmentsAPI, petsAPI } from '../../services/api'

function Appointments({ initialOpenModal, onModalClosed, setActiveTab }) {
  const [showModal, setShowModal] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    petId: '', reason: 'General Checkup', appointmentDate: '',
    appointmentTime: '', veterinarian: '', notes: ''
  })

  const fetchData = useCallback(async () => {
    try {
      const [aptRes, petRes] = await Promise.all([
        appointmentsAPI.getAll(),
        petsAPI.getAll()
      ])
      if (aptRes?.data?.appointments) {
        setAppointments(aptRes.data.appointments)
        localStorage.setItem('furever_local_appointments', JSON.stringify(aptRes.data.appointments))
      }
      if (petRes?.data?.pets) {
        setPets(petRes.data.pets)
        localStorage.setItem('furever_local_pets', JSON.stringify(petRes.data.pets))
        if (petRes.data.pets.length > 0 && !formData.petId) {
          setFormData(prev => ({ ...prev, petId: petRes.data.pets[0]._id }))
        }
      }
    } catch (err) {
      console.error('Error fetching appointments from API, reading local storage:', err)
      const localApts = JSON.parse(localStorage.getItem('furever_local_appointments') || '[]')
      const localPets = JSON.parse(localStorage.getItem('furever_local_pets') || '[]')
      setAppointments(localApts)
      setPets(localPets)
      if (localPets.length > 0 && !formData.petId) {
        setFormData(prev => ({ ...prev, petId: localPets[0]._id }))
      }
    } finally {
      setLoading(false)
    }
  }, [formData.petId])

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-compiler/react-compiler
  useEffect(() => { fetchData() }, [fetchData])

  // Trigger modal when opened from Dashboard quick actions
  useEffect(() => {
    if (initialOpenModal) {
      setShowModal(true)
      if (onModalClosed) onModalClosed()
    }
  }, [initialOpenModal, onModalClosed])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const selectedPetObj = pets.find(p => p._id === formData.petId)
    const payload = {
      petId: formData.petId,
      petName: selectedPetObj?.name || 'Pet',
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      reason: formData.reason,
      notes: formData.veterinarian ? `Vet: ${formData.veterinarian}. ${formData.notes}` : formData.notes,
      status: 'confirmed'
    }

    try {
      await appointmentsAPI.create(payload)
      setShowModal(false)
      setFormData(prev => ({ ...prev, reason: 'General Checkup', appointmentDate: '', appointmentTime: '', veterinarian: '', notes: '' }))
      fetchData()
    } catch (err) {
      console.warn('API error creating appointment, saving locally:', err)
      const localApts = JSON.parse(localStorage.getItem('furever_local_appointments') || '[]')
      const newApt = {
        ...payload,
        _id: 'apt_' + Date.now(),
        createdAt: new Date().toISOString(),
        petId: selectedPetObj || { _id: formData.petId, name: selectedPetObj?.name || 'Pet' }
      }
      const updated = [newApt, ...localApts]
      localStorage.setItem('furever_local_appointments', JSON.stringify(updated))
      setAppointments(updated)
      setShowModal(false)
      setFormData(prev => ({ ...prev, reason: 'General Checkup', appointmentDate: '', appointmentTime: '', veterinarian: '', notes: '' }))
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
      console.warn('API cancel error, updating locally:', err)
      const localApts = JSON.parse(localStorage.getItem('furever_local_appointments') || '[]')
      const updated = localApts.map(a => a._id === id ? { ...a, status: 'cancelled' } : a)
      localStorage.setItem('furever_local_appointments', JSON.stringify(updated))
      setAppointments(updated)
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
          <div style={{ textAlign: 'center', padding: '36px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--text-light)', marginBottom: '8px', display: 'block' }}>event_busy</span>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', marginBottom: '14px' }}>
              No upcoming appointments scheduled.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              Schedule Visit
            </button>
          </div>
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
              {pets.length === 0 ? (
                <div style={{
                  padding: '16px',
                  background: 'var(--secondary-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--secondary-border)',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: 'var(--secondary-dark)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>
                    🐾 You haven't added any pets yet!
                  </p>
                  <p style={{ color: 'var(--text)', fontSize: '0.85rem', marginBottom: '14px' }}>
                    Please create a pet profile first before booking a vet appointment.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setShowModal(false)
                      if (setActiveTab) setActiveTab('pets')
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>pets</span>
                    Add a Pet Profile Now
                  </button>
                </div>
              ) : (
                <div className="form-group">
                  <label>Pet</label>
                  <select name="petId" value={formData.petId} onChange={handleChange} required>
                    {pets.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

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
