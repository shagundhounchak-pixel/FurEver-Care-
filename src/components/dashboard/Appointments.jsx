import { useState } from 'react'

function Appointments() {
  const [showModal, setShowModal] = useState(false)

  const appointments = [
    {
      id: 1, day: '02', month: 'SEP',
      title: 'Luna\'s Annual Checkup',
      vet: 'Dr. Sarah Wilson — PetCare Clinic',
      time: '10:00 AM',
      status: 'upcoming',
      pet: 'Luna'
    },
    {
      id: 2, day: '15', month: 'SEP',
      title: 'Buddy\'s Dental Cleaning',
      vet: 'Dr. James Lee — Happy Paws Hospital',
      time: '2:30 PM',
      status: 'upcoming',
      pet: 'Buddy'
    },
    {
      id: 3, day: '28', month: 'SEP',
      title: 'Buddy\'s Follow-up Visit',
      vet: 'Dr. Sarah Wilson — PetCare Clinic',
      time: '11:00 AM',
      status: 'upcoming',
      pet: 'Buddy'
    },
    {
      id: 4, day: '10', month: 'AUG',
      title: 'Luna\'s Vaccination',
      vet: 'Dr. Emily Chen — City Vet Center',
      time: '9:00 AM',
      status: 'completed',
      pet: 'Luna'
    },
    {
      id: 5, day: '25', month: 'JUL',
      title: 'Buddy\'s General Checkup',
      vet: 'Dr. Sarah Wilson — PetCare Clinic',
      time: '3:00 PM',
      status: 'completed',
      pet: 'Buddy'
    },
  ]

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
        {appointments.filter(a => a.status === 'upcoming').map((apt) => (
          <div key={apt.id} className="appointment-card">
            <div className="appointment-date">
              <span className="day">{apt.day}</span>
              <span className="month">{apt.month}</span>
            </div>
            <div className="appointment-info">
              <h4>{apt.title}</h4>
              <p>{apt.vet}</p>
              <p style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                {apt.time}
              </p>
            </div>
            <span className={`appointment-status ${apt.status}`}>
              {apt.status}
            </span>
          </div>
        ))}
      </div>

      {/* Past */}
      <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px', verticalAlign: 'middle', marginRight: '8px', color: '#A78BFA' }}>
          history
        </span>
        Past Appointments
      </h3>
      <div className="appointments-list">
        {appointments.filter(a => a.status === 'completed').map((apt) => (
          <div key={apt.id} className="appointment-card" style={{ opacity: 0.7 }}>
            <div className="appointment-date" style={{ background: 'rgba(167, 139, 250, 0.12)' }}>
              <span className="day" style={{ color: '#A78BFA' }}>{apt.day}</span>
              <span className="month" style={{ color: '#A78BFA' }}>{apt.month}</span>
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

      {/* Add Appointment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📅 New Appointment</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false) }}>
              <div className="form-group">
                <label>Pet</label>
                <select>
                  <option>Buddy</option>
                  <option>Luna</option>
                </select>
              </div>

              <div className="form-group">
                <label>Appointment Type</label>
                <select>
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
                  <input type="date" required />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" required />
                </div>
              </div>

              <div className="form-group">
                <label>Veterinarian / Clinic</label>
                <input type="text" placeholder="e.g., Dr. Sarah Wilson — PetCare Clinic" />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea placeholder="Preparation instructions or symptoms to discuss..." />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                  Schedule
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
