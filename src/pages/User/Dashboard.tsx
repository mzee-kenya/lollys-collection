import React from 'react'
import { useProductsStore } from '../../store/useProductsStore'
import { useSessionStore } from '../../store/useSessionStore'

export default function Dashboard() {
  const [products, setProducts] = React.useState<any[]>([])
  const remove = useProductsStore((s) => s.remove)

  const user = useSessionStore((s) => s.user)

  React.useEffect(() => {
    let mounted = true
    fetch('/api/products').then((r) => r.json()).then((d) => { if (mounted && d.ok) {
      const products = d.products || []
      if (user && user.id) setProducts(products.filter((p: any) => p.seller_id === user.id))
      else setProducts(products)
    } }).catch(() => {}).finally(() => {})
    return () => { mounted = false }
  }, [user])

  const login = useSessionStore((s) => s.login)

  if (products.length === 0) {
    return (
      <div>
        <div className="mb-4">
          {!user ? (
            <div>
              <div className="mb-2">You are not signed in. To test seller features, sign in as a demo seller.</div>
              <button onClick={() => login({ id: 'seller_demo', name: 'Demo Seller' })} className="bg-kilimall text-white px-3 py-1 rounded">Sign in as demo seller</button>
            </div>
          ) : null}
        </div>
        <div>No products posted yet.</div>
      </div>
    )
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
            <div className="mt-2">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(p.price)}</div>
            <div className="mt-3 flex gap-2">
              {user && p.seller_id === user.id ? (
                <button onClick={async () => { const res = await fetch(`/api/products/${p.id}`, { method: 'DELETE', headers: { 'x-user-id': user?.id } }); if (!res.ok) { const payload = await res.json().catch(() => ({})); alert('Failed to delete: ' + (payload.error || res.statusText)); return } setProducts((s) => s.filter((x) => x.id !== p.id)) }} className="text-red-600 text-sm">Remove</button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
