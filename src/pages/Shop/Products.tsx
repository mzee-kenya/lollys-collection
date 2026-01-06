import React, { useEffect, useState } from 'react'
import { getProducts } from '../../services/api'
import { Link } from 'react-router-dom'

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getProducts().then((r) => {
      if (!mounted) return
      setProducts(r.products)
    }).catch((e) => setError(String(e))).finally(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  if (loading) return <div>Loading products...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded p-3">
            {p.image && <img src={p.image} alt={p.name} className="h-40 w-full object-cover mb-2 rounded" />}
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-600">{p.category}</div>
            <div className="mt-2">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(p.price)}</div>
            <div className="mt-3">
              <Link to={`/products/${p.id}`} className="text-kilimall">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
