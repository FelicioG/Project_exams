import { useEffect } from 'react'

export function useContentProtection() {
  useEffect(() => {
    // Disable developer tools
    const disableDevTools = (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'u')) {
        e.preventDefault()
        return false
      }
    }

    // Disable right-click
    const disableRightClick = (e) => {
      e.preventDefault()
      return false
    }

    // Disable text selection
    const disableSelection = () => false

    // Add event listeners
    document.addEventListener('keydown', disableDevTools)
    document.addEventListener('contextmenu', disableRightClick)
    document.addEventListener('selectstart', disableSelection)
    document.addEventListener('dragstart', disableSelection)

    // Detect screenshot attempts
    const detectScreenshot = () => {
      // This is a basic detection - more sophisticated methods would be needed for production
      console.warn('Screenshot attempt detected')
      alert('Screenshots and screen recording are not allowed')
    }

    document.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen') {
        detectScreenshot()
      }
    })

    // Cleanup
    return () => {
      document.removeEventListener('keydown', disableDevTools)
      document.removeEventListener('contextmenu', disableRightClick)
      document.removeEventListener('selectstart', disableSelection)
      document.removeEventListener('dragstart', disableSelection)
    }
  }, [])
}