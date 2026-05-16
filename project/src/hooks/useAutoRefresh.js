import { useEffect } from 'react'

export function useAutoRefresh(callback, intervalMs = 60000) {
  useEffect(() => {
    const timerId = window.setInterval(callback, intervalMs)
    return () => window.clearInterval(timerId)
  }, [callback, intervalMs])
}
