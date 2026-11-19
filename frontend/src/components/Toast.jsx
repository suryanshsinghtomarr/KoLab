import { useEffect, useRef } from 'react'

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!message) return undefined

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(onClose, duration)

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [message, duration, onClose])

  if (!message) return null

  const closeToast = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    onClose()
  }

  return (
    <div className={`toast toast-${type}`} role="status">
      {message}
      <button type="button" onClick={closeToast} aria-label="Close notification">×</button>
    </div>
  )
}
