// src/app/test-api/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'

export default function TestApi() {
  const [data, setData] = useState(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/products')
        setData(response.data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
        setError(errorMessage)
        console.error('API Error:', errorMessage)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      {error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}