import { useState, useEffect, useCallback } from 'react'
import { petsAPI } from '../../services/api'

function PetProfiles() {
  const [showModal, setShowModal] = useState(false)
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '', species: 'Dog', breed: '', gender: 'Unknown',
    dateOfBirth: '', weight: '', color: '', medicalNotes: ''
  })

  const fetchPets = useCallback(async () => {
    try {
      const res = await petsAPI.getAll()
      setPets(res.data.pets)
    } catch (err) {
      console.error('Error fetching pets:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-compiler/react-compiler
  useEffect(() => { fetchPets() }, [fetchPets])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await petsAPI.create({
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : 0
      })
      setShowModal(false)
      setFormData({ name: '', species: 'Dog', breed: '', gender: 'Unknown', dateOfBirth: '', weight: '', color: '', medicalNotes: '' })
      fetchPets()
    } catch (err) {
      alert(err.message || 'Failed to add pet')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this pet?')) return
    try {
      await petsAPI.delete(id)
      fetchPets()
    } catch (err) {
      alert(err.message || 'Failed to delete pet')
    }
  }

  const getAge = (dob) => {
    if (!dob) return 'Age unknown'
    const birth = new Date(dob)
    const now = new Date()
    const years = now.getFullYear() - birth.getFullYear()
    const months = now.getMonth() - birth.getMonth()
    if (years > 0) return `${years} year${years > 1 ? 's' : ''}`
    if (months > 0) return `${months} month${months > 1 ? 's' : ''}`
    return 'Less than a month'
  }

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
        <h2>🐾 My Pets</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Add Pet
        </button>
      </div>

      <div className="pets-grid">
        {pets.map((pet) => (
          <div key={pet._id} className="pet-card">
            <div style={{
              width: '100%', height: '200px',
              background: pet.species === 'Dog' ? 'linear-gradient(135deg, #FF6B6B22, #FF6B6B11)' :
                pet.species === 'Cat' ? 'linear-gradient(135deg, #4ECDC422, #4ECDC411)' :
                'linear-gradient(135deg, #FFB34722, #FFB34711)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{
                fontSize: '64px',
                color: pet.species === 'Dog' ? 'var(--primary)' : pet.species === 'Cat' ? 'var(--secondary)' : 'var(--accent)'
              }}>
                {pet.species === 'Dog' ? 'pets' : pet.species === 'Cat' ? 'pets' : 'cruelty_free'}
              </span>
            </div>
            <div className="pet-card-content">
              <div className="pet-card-header">
                <h3>{pet.name}</h3>
                <span className={`pet-badge ${pet.species?.toLowerCase()}`}>
                  {pet.species === 'Dog' ? '🐕' : pet.species === 'Cat' ? '🐱' : '🐾'} {pet.species}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '12px' }}>
                {pet.breed || 'Breed not specified'}
              </p>
              <div className="pet-card-info">
                <div className="pet-info-item">
                  <span className="material-symbols-outlined">cake</span>
                  {getAge(pet.dateOfBirth)}
                </div>
                <div className="pet-info-item">
                  <span className="material-symbols-outlined">monitor_weight</span>
                  {pet.weight ? `${pet.weight} kg` : '—'}
                </div>
                {pet.gender !== 'Unknown' && (
                  <div className="pet-info-item">
                    <span className="material-symbols-outlined">{pet.gender === 'Male' ? 'male' : 'female'}</span>
                    {pet.gender}
                  </div>
                )}
              </div>
              {pet.medicalNotes && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '12px', fontStyle: 'italic' }}>
                  📝 {pet.medicalNotes}
                </p>
              )}
              <button
                onClick={() => handleDelete(pet._id)}
                style={{
                  marginTop: '12px', padding: '6px 12px', fontSize: '0.8rem',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  background: 'none', color: 'var(--text-light)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-light)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Add Pet Card */}
        <div
          className="pet-card"
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '400px', cursor: 'pointer',
            border: '2px dashed var(--border)', background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--text-light)', marginBottom: '12px', display: 'block' }}>add_circle</span>
            <h3 style={{ color: 'var(--text-light)', fontWeight: 600 }}>Add New Pet</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Click to add a furry friend</p>
          </div>
        </div>
      </div>

      {/* Add Pet Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🐾 Add New Pet</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Pet Name</label>
                <input type="text" name="name" placeholder="e.g., Buddy" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Species</label>
                  <select name="species" value={formData.species} onChange={handleChange}>
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Bird</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Breed</label>
                  <input type="text" name="breed" placeholder="e.g., Golden Retriever" value={formData.breed} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Unknown</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input type="text" name="color" placeholder="e.g., Golden" value={formData.color} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input type="number" name="weight" placeholder="e.g., 25" step="0.1" value={formData.weight} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea name="medicalNotes" placeholder="Any special needs or allergies..." value={formData.medicalNotes} onChange={handleChange} />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {submitting ? 'progress_activity' : 'check'}
                  </span>
                  {submitting ? 'Adding...' : 'Add Pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PetProfiles
