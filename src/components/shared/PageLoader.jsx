import { useState, useEffect } from 'react'
import { prefersReducedMotion } from '../../utils/animationUtils'

function PageLoader() {
  const [loading, setLoading] = useState(() => !prefersReducedMotion())
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    // Skip if reduced motion is requested
    if (!loading) return

    const timer = setTimeout(() => {
      setFadingOut(true)
      const removeTimer = setTimeout(() => {
        setLoading(false)
      }, 450)
      return () => clearTimeout(removeTimer)
    }, 700)

    return () => clearTimeout(timer)
  }, [loading])

  if (!loading) return null

  return (
    <div
      className={`page-loader-overlay ${fadingOut ? 'fade-out' : ''}`}
      role="status"
      aria-label="Loading FurEver Care"
    >
      <div className="page-loader-content">
        <div className="walking-paws">
          <span className="material-symbols-outlined paw paw-1">pets</span>
          <span className="material-symbols-outlined paw paw-2">pets</span>
          <span className="material-symbols-outlined paw paw-3">pets</span>
          <span className="material-symbols-outlined paw paw-4">pets</span>
        </div>
        <div className="loader-brand">
          <span className="loader-text">FurEver Care</span>
          <div className="loader-spinner-bar" />
        </div>
      </div>
    </div>
  )
}

export default PageLoader
