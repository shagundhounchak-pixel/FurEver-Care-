import { useState, useEffect } from 'react'

function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="scroll-progress-container" aria-hidden="true">
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}

export default ScrollProgressBar
