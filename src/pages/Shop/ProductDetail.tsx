import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct } from '../../services/api'
import { useCartStore } from '../../store/useCartStore'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const add = useCartStore((s) => s.add)

  useEffect(() => {
    if (!id) return
    let mounted = true
    getProduct(id).then((r) => { if (mounted) setProduct(r.product) }).catch((e) => setError(String(e))).finally(() => setLoading(false))
    return () => { mounted = false }
  }, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!product) return <div>Not found</div>

  return (
    <div className="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>{product.image && <img src={product.image} alt={product.name} className="w-full rounded" />}</div>
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="text-gray-600">{product.category}</div>
          <div className="mt-4 text-xl font-bold">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(product.price)}</div>
          <div className="mt-6">
            <button onClick={() => add(product)} className="bg-kilimall text-white px-4 py-2 rounded">Add to cart</button>
          </div>
          <div className="mt-6">{product.description}</div>
          <div className="mt-4"><Link to="/checkout" className="text-kilimall">Go to checkout</Link></div>
        </div>
      </div>
    </div>
  )
}
