import gsap from 'gsap'

/**
 * Checks if the user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Checks if the device has touch only (no hover)
 */
export const isTouchDevice = () => {
  return typeof window !== 'undefined' && (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || 'ontouchstart' in window)
}

/**
 * Applies a 3D tilt effect on mouse movement with a smooth glare reflection
 * Automatically disabled on touch or reduced motion
 */
export const attach3DTilt = (element, maxTilt = 10) => {
  if (!element || prefersReducedMotion() || isTouchDevice()) return () => {}

  // Ensure card has 3D transform style
  element.style.transformStyle = 'preserve-3d'
  element.style.willChange = 'transform'

  // Add glare element if not present
  let glare = element.querySelector('.card-glare')
  if (!glare) {
    glare = document.createElement('div')
    glare.className = 'card-glare'
    element.appendChild(glare)
  }

  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -maxTilt
    const rotateY = ((x - centerX) / centerX) * maxTilt

    gsap.to(element, {
      rotateX,
      rotateY,
      y: -6,
      scale: 1.015,
      duration: 0.35,
      ease: 'power2.out',
      transformPerspective: 1000,
    })

    if (glare) {
      const glareX = (x / rect.width) * 100
      const glareY = (y / rect.height) * 100
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22) 0%, transparent 65%)`
      glare.style.opacity = '1'
    }
  }

  const handleMouseLeave = () => {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    })

    if (glare) {
      glare.style.opacity = '0'
    }
  }

  element.addEventListener('mousemove', handleMouseMove)
  element.addEventListener('mouseleave', handleMouseLeave)

  return () => {
    element.removeEventListener('mousemove', handleMouseMove)
    element.removeEventListener('mouseleave', handleMouseLeave)
  }
}

/**
 * Magnetic button effect: button slightly pulls towards cursor when hovered
 */
export const attachMagnetic = (element, pullStrength = 0.32) => {
  if (!element || prefersReducedMotion() || isTouchDevice()) return () => {}

  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)

    gsap.to(element, {
      x: x * pullStrength,
      y: y * pullStrength,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: 'elastic.out(1, 0.4)',
    })
  }

  element.addEventListener('mousemove', handleMouseMove)
  element.addEventListener('mouseleave', handleMouseLeave)

  return () => {
    element.removeEventListener('mousemove', handleMouseMove)
    element.removeEventListener('mouseleave', handleMouseLeave)
  }
}

/**
 * Creates an expanding ripple animation on button click
 */
export const triggerRipple = (e) => {
  const button = e.currentTarget
  if (!button) return

  const rect = button.getBoundingClientRect()
  const ripple = document.createElement('span')
  ripple.className = 'btn-ripple'

  const size = Math.max(rect.width, rect.height) * 2
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`

  button.appendChild(ripple)

  setTimeout(() => {
    ripple.remove()
  }, 600)
}
