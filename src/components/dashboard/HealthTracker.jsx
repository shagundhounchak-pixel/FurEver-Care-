import { useState, useEffect } from 'react'
import { vaccinationsAPI, petsAPI } from '../../services/api'

function HealthTracker() {
  const [pets, setPets] = useState([])
  const [selectedPet, setSelectedPet] = useState(null)
  const [vaccinations, setVaccinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    vaccineName: '', dateGiven: '', nextDueDate: '', veterinarian: '', notes: ''
  })

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await petsAPI.getAll()
        setPets(res.data.pets)
        if (res.data.pets.length > 0) {
          setSelectedPet(res.data.pets[0])
        }
      } catch (err) {
        console.error('Error fetching pets:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPets()
  }, [])

  useEffect(() => {
    if (selectedPet) {
      fetchVaccinations(selectedPet._id)
    }
  }, [selectedPet])

  const fetchVaccinations = async (petId) => {
    try {
      const res = await vaccinationsAPI.getAll(petId)
      setVaccinations(res.data.vaccinations)
    } catch (err) {
      console.error('Error fetching vaccinations:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPet) return
    setSubmitting(true)
    try {
      await vaccinationsAPI.create({
        petId: selectedPet._id,
        ...formData
      })
      setShowModal(false)
      setFormData({ vaccineName: '', dateGiven: '', nextDueDate: '', veterinarian: '', notes: '' })
      fetchVaccinations(selectedPet._id)
    } catch (err) {
      alert(err.message || 'Failed to add vaccination')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteVax = async (id) => {
    if (!confirm('Delete this vaccination record?')) return
    try {
      await vaccinationsAPI.delete(id)
      fetchVaccinations(selectedPet._id)
    } catch (err) {
      alert(err.message || 'Failed to delete')
    }
  }

  const getVaxStatus = (nextDueDate) => {
    if (!nextDueDate) return 'current'
    const due = new Date(nextDueDate)
    const now = new Date()
    if (due < now) return 'overdue'
    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    if (due - now < thirtyDays) return 'due-soon'
    return 'current'
  }

  if (loading) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)', animation: 'spin 1s linear infinite' }}>pets</span>
      </div>
    )
  }

  if (pets.length === 0) {
    return (
      <div className="page-content">
        <div className="section-header">
          <h2>❤️ Health Tracker</h2>
        </div>
        <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '40px' }}>
          Add a pet first to track their health records.
        </p>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="section-header">
        <h2>❤️ Health Tracker — {selectedPet?.name || 'Select Pet'}</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={selectedPet?._id || ''}
            onChange={(e) => {
              const pet = pets.find(p => p._id === e.target.value)
              setSelectedPet(pet)
            }}
            style={{
              padding: '8px 12px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', background: 'var(--bg-secondary)',
              color: 'var(--text)', fontSize: '0.85rem', fontFamily: 'var(--font-body)'
            }}
          >
            {pets.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pet Overview */}
      <div className="health-overview">
        <div className="health-score-card">
          <h3 style={{ marginBottom: '16px' }}>Pet Overview</h3>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--primary)' }}>
              {selectedPet?.species === 'Dog' ? 'pets' : selectedPet?.species === 'Cat' ? 'pets' : 'cruelty_free'}
            </span>
            <h3 style={{ marginTop: '12px' }}>{selectedPet?.name}</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              {selectedPet?.breed || selectedPet?.species}
            </p>
          </div>

          <div className="health-metrics">
            <div className="health-metric">
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>monitor_weight</span>
              <div className="health-metric-info">
                <h4>Weight</h4>
                <p>{selectedPet?.weight ? `${selectedPet.weight} kg` : 'Not set'}</p>
              </div>
            </div>
            <div className="health-metric">
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
                {selectedPet?.gender === 'Male' ? 'male' : selectedPet?.gender === 'Female' ? 'female' : 'help'}
              </span>
              <div className="health-metric-info">
                <h4>Gender</h4>
                <p>{selectedPet?.gender || 'Unknown'}</p>
              </div>
            </div>
            <div className="health-metric">
              <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>category</span>
              <div className="health-metric-info">
                <h4>Species</h4>
                <p>{selectedPet?.species}</p>
              </div>
            </div>
            <div className="health-metric">
              <span className="material-symbols-outlined" style={{ color: '#A78BFA' }}>vaccines</span>
              <div className="health-metric-info">
                <h4>Vaccines</h4>
                <p>{vaccinations.length} records</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vaccination Summary */}
        <div className="weight-chart">
          <div className="widget-header">
            <h3>💉 Vaccination Summary</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
              {vaccinations.length} total
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '12px' }}>
            {['current', 'due-soon', 'overdue'].map(status => {
              const count = vaccinations.filter(v => getVaxStatus(v.nextDueDate) === status).length
              const colors = { current: 'var(--secondary)', 'due-soon': 'var(--accent)', overdue: 'var(--primary)' }
              const labels = { current: 'Up to Date', 'due-soon': 'Due Soon', overdue: 'Overdue' }
              return (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: colors[status], flexShrink: 0
                  }} />
                  <span style={{ flex: 1, fontSize: '0.9rem' }}>{labels[status]}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Vaccination Records */}
      <div className="widget" style={{ marginBottom: '24px' }}>
        <div className="widget-header">
          <h3>💉 Vaccination Records</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(true)}>Add Record</button>
        </div>
        <div className="appointments-list">
          {vaccinations.length > 0 ? (
            vaccinations.map((vax) => {
              const status = getVaxStatus(vax.nextDueDate)
              return (
                <div key={vax._id} className="appointment-card">
                  <div className="appointment-date" style={{
                    background: status === 'current' ? 'rgba(78, 205, 196, 0.12)' :
                      status === 'due-soon' ? 'rgba(255, 179, 71, 0.12)' : 'rgba(255, 107, 107, 0.12)',
                  }}>
                    <span className="material-symbols-outlined" style={{
                      color: status === 'current' ? 'var(--secondary)' :
                        status === 'due-soon' ? 'var(--accent)' : 'var(--primary)',
                      fontSize: '28px'
                    }}>
                      {status === 'current' ? 'verified' : status === 'due-soon' ? 'schedule' : 'warning'}
                    </span>
                  </div>
                  <div className="appointment-info">
                    <h4>{vax.vaccineName}</h4>
                    <p>
                      Given: {new Date(vax.dateGiven).toLocaleDateString()}
                      {vax.nextDueDate && ` · Next: ${new Date(vax.nextDueDate).toLocaleDateString()}`}
                    </p>
                    {vax.veterinarian && <p style={{ fontSize: '0.8rem' }}>By: {vax.veterinarian}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`appointment-status ${status === 'current' ? 'upcoming' : 'cancelled'}`}>
                      {status === 'current' ? 'Current' : status === 'due-soon' ? 'Due Soon' : 'Overdue'}
                    </span>
                    <button onClick={() => handleDeleteVax(vax._id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)',
                      padding: '4px', borderRadius: '4px', transition: 'color 0.2s'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
              No vaccination records yet. Add one to start tracking.
            </p>
          )}
        </div>
      </div>

      {/* Add Vaccination Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💉 Add Vaccination Record</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Vaccine Name</label>
                <input type="text" name="vaccineName" placeholder="e.g., Rabies" value={formData.vaccineName} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date Given</label>
                  <input type="date" name="dateGiven" value={formData.dateGiven} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Next Due Date</label>
                  <input type="date" name="nextDueDate" value={formData.nextDueDate} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Veterinarian</label>
                <input type="text" name="veterinarian" placeholder="e.g., Dr. Sarah Wilson" value={formData.veterinarian} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea name="notes" placeholder="Any notes..." value={formData.notes} onChange={handleChange} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{submitting ? 'progress_activity' : 'check'}</span>
                  {submitting ? 'Adding...' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default HealthTracker
