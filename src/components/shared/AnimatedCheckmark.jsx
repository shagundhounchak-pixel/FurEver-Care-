function AnimatedCheckmark({ size = 20, color = 'var(--primary)' }) {
  return (
    <svg
      className="animated-checkmark"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        className="checkmark-circle"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2"
      />
      <path
        className="checkmark-check"
        d="M7 12.5L10.5 16L17 8.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default AnimatedCheckmark
