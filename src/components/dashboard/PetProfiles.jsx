import { useState } from 'react'
import petDogImg from '../../assets/pet-dog.jpg'
import petCatImg from '../../assets/pet-cat.jpg'

function PetProfiles() {
  const [showModal, setShowModal] = useState(false)

  const pets = [
    {
      id: 1,
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: '3 years',
      weight: '30 kg',
      type: 'dog',
      image: petDogImg,
      healthScore: 92,
      healthLabel: 'excellent',
      nextVet: 'Sept 15, 2026',
      vaccinated: true,
    },
    {
      id: 2,
      name: 'Luna',
      breed: 'Orange Tabby',
      age: '2 years',
      weight: '4.5 kg',
      type: 'cat',
      image: petCatImg,
      healthScore: 78,
      healthLabel: 'good',
      nextVet: 'Sept 2, 2026',
      vaccinated: true,
    }
  ]

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
          <div key={pet.id} className="pet-card">
            <img src={pet.image} alt={pet.name} className="pet-card-image" />
            <div className="pet-card-content">
              <div className="pet-card-header">
                <h3>{pet.name}</h3>
                <span className={`pet-badge ${pet.type}`}>
                  {pet.type === 'dog' ? '🐕 Dog' : '🐱 Cat'}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '12px' }}>
                {pet.breed}
              </p>
              <div className="pet-card-info">
                <div className="pet-info-item">
                  <span className="material-symbols-outlined">cake</span>
                  {pet.age}
                </div>
                <div className="pet-info-item">
                  <span className="material-symbols-outlined">monitor_weight</span>
                  {pet.weight}
                </div>
                <div className="pet-info-item">
                  <span className="material-symbols-outlined">vaccines</span>
                  {pet.vaccinated ? '✓' : '✗'}
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div className="pet-health-bar">
                  <div className={`pet-health-fill ${pet.healthLabel}`}
                    style={{ width: `${pet.healthScore}%` }}
                  />
                </div>
                <div className="pet-health-label">
                  <span>Health Score</span>
                  <span style={{ color: pet.healthLabel === 'excellent' ? 'var(--secondary)' : 'var(--accent)' }}>
                    {pet.healthScore}%
                  </span>
                </div>
              </div>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-light)',
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>event</span>
                Next vet visit: {pet.nextVet}
              </p>
            </div>
          </div>
        ))}

        {/* Add Pet Card */}
        <div
          className="pet-card"
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            cursor: 'pointer',
            border: '2px dashed var(--border)',
            background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{
              fontSize: '48px',
              color: 'var(--text-light)',
              marginBottom: '12px',
              display: 'block'
            }}>add_circle</span>
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

            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false) }}>
              <div className="form-group">
                <label>Pet Name</label>
                <input type="text" placeholder="e.g., Buddy" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Species</label>
                  <select>
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Bird</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Breed</label>
                  <input type="text" placeholder="e.g., Golden Retriever" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input type="number" placeholder="e.g., 25" step="0.1" />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea placeholder="Any special needs or allergies..." />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                  Add Pet
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
