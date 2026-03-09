import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api/gold/price'

export default function useGoldPrice() {
  const [goldPrice, setGoldPrice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPrice = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL)
      const data = await response.json()

      if (response.ok) {
        setGoldPrice(data)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch price')
      }
    } catch (err) {
      setError('Server not reachable. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrice()

    // Refresh every 10 minutes
    const interval = setInterval(fetchPrice, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { goldPrice, loading, error, refetch: fetchPrice }
}
