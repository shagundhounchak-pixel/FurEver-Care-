import { useState, useRef } from 'react'
import { healthCheckAPI } from '../../services/api'

function AICamera() {
  const [image, setImage] = useState(null)
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image is too large. Please select an image under 10MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
        setAnalysis('')
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const analyzeImage = async () => {
    if (!image) return

    setLoading(true)
    setError('')
    try {
      const data = await healthCheckAPI.analyze(image)
      if (data.success) {
        setAnalysis(data.analysis)
      } else {
        setError(data.message || 'Failed to analyze image.')
      }
    } catch (err) {
      setError(err.message || 'An error occurred while connecting to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-content">
      <div className="section-header">
        <h2>📷 AI Health Diagnosis</h2>
      </div>

      <div className="card" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>
          Upload or take a picture of your pet's health concern (e.g., skin rash, eye issue, injury) for an AI-powered preliminary analysis. 
          <br/><strong>Note:</strong> This is not a replacement for professional veterinary advice.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />

          {!image ? (
            <button 
              onClick={handleCameraClick}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                width: '100%', minHeight: '300px', border: '2px dashed var(--primary)', 
                borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)',
                cursor: 'pointer', transition: 'all 0.2s', gap: '16px'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff22'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--primary)' }}>add_a_photo</span>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 500 }}>Tap to Take Picture or Upload</span>
            </button>
          ) : (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <img 
                src={image} 
                alt="Pet health concern" 
                style={{ 
                  maxWidth: '100%', maxHeight: '400px', borderRadius: 'var(--radius-md)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', objectFit: 'contain'
                }} 
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={handleCameraClick}>
                  <span className="material-symbols-outlined">retweet</span> Retake
                </button>
                <button className="btn btn-primary" onClick={analyzeImage} disabled={loading}>
                  {loading ? (
                    <><span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span> Analyzing...</>
                  ) : (
                    <><span className="material-symbols-outlined">auto_awesome</span> Analyze Image</>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div style={{ padding: '16px', background: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius-md)', width: '100%', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                <span className="material-symbols-outlined">error</span> Error
              </div>
              <p style={{ marginTop: '4px', fontSize: '0.9rem' }}>{error}</p>
            </div>
          )}

          {analysis && (
            <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', width: '100%', marginTop: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '16px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>medical_information</span>
                <h3 style={{ margin: 0 }}>AI Analysis Result</h3>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-main)' }}>
                {analysis}
              </div>
              <div style={{ marginTop: '24px', padding: '12px', background: '#fff3cd', color: '#856404', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', gap: '8px' }}>
                 <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>warning</span>
                 <strong>Disclaimer:</strong> This is an AI-generated analysis and may not be 100% accurate. Always consult a qualified veterinarian for proper medical advice and treatment.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AICamera
