import { useEffect, useRef, useState } from 'react'
import { isTouchDevice, prefersReducedMotion } from '../../utils/animationUtils'

function CustomCursor() {
  const dotRef = useRef(null)
  const followerRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [disabled] = useState(() => isTouchDevice() || prefersReducedMotion())

  useEffect(() => {
    // Disable completely on touch devices or if user prefers reduced motion
    if (disabled) return

    let mouseX = -100
    let mouseY = -100
    let followerX = -100
    let followerY = -100
    let animId = null

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (!isVisible) setIsVisible(true)

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
    }

    const onMouseDown = () => {
      if (followerRef.current) followerRef.current.classList.add('cursor-clicked')
    }

    const onMouseUp = () => {
      if (followerRef.current) followerRef.current.classList.remove('cursor-clicked')
    }

    const onMouseLeave = () => {
      setIsVisible(false)
    }

    const onMouseEnter = () => {
      setIsVisible(true)
    }

    // Smooth lerp trailing loop for the follower circle
    const renderLoop = () => {
      followerX += (mouseX - followerX) * 0.16
      followerY += (mouseY - followerY) * 0.16

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`
      }

      animId = requestAnimationFrame(renderLoop)
    }

    // Detect clickable elements for expanding cursor
    const handleElementHover = (e) => {
      const target = e.target
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('.btn') ||
        target.closest('.card') ||
        target.closest('.feature-card') ||
        target.closest('.pricing-card') ||
        target.closest('.testimonial-card') ||
        target.closest('.clickable')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseover', handleElementHover, { passive: true })

    animId = requestAnimationFrame(renderLoop)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseover', handleElementHover)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [isVisible, disabled])

  if (disabled) return null

  return (
    <div
      className={`custom-cursor-container ${isVisible ? 'visible' : ''}`}
      aria-hidden="true"
    >
      {/* Precision center dot */}
      <div ref={dotRef} className="cursor-dot" />

      {/* Smooth trailing paw follower */}
      <div
        ref={followerRef}
        className={`cursor-follower ${isHovering ? 'hovering' : ''}`}
      >
        <span className="material-symbols-outlined cursor-paw-icon">pets</span>
      </div>
    </div>
  )
}

export default CustomCursor
