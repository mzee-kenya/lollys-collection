import React from 'react'
import { useCartStore } from '../../store/useCartStore'
import { createOrder } from '../../services/api'

export default function Checkout() {
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)

  const total = items.reduce((s, i) => s + i.price, 0)

  async function handleCheckout() {
    const order = {
      id: `o_${Date.now()}`,
      items,
      total,
      customer_info: { name: 'Guest' },
    }
    try {
      await createOrder(order)
      clear()
      alert('Order placed!')
    } catch (err: any) {
      alert('Failed to place order: ' + (err.message || String(err)))
    }
  }

  if (items.length === 0) return <div>Your cart is empty.</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex justify-between border p-2 rounded">
            <div>{i.name}</div>
            <div>{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(i.price)}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 font-bold">Total: {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(total)}</div>
      <div className="mt-4">
        <button onClick={handleCheckout} className="bg-kilimall text-white px-4 py-2 rounded">Place Order</button>
      </div>
    </div>
  )
}
