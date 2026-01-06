import React from 'react'
import { useProductsStore } from '../../store/useProductsStore'

export default function Dashboard() {
  const products = useProductsStore((s) => s.products)
  const remove = useProductsStore((s) => s.remove)

  if (products.length === 0) {
    return <div>No products posted yet.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Posted Items</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded p-4">
            {p.image && <img src={p.image} alt={p.name} className="w-full h-48 object-cover mb-3 rounded" />}
            <div className="font-semibold text-lg">{p.name}</div>
            <div className="text-sm text-gray-600">{p.category}</div>
            <div className="mt-2">${p.price.toFixed(2)}</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => remove(p.id)} className="text-red-600 text-sm">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
