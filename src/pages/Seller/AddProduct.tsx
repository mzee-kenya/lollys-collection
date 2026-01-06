import React, { useState } from 'react'
import ImageUploader from '../../components/ImageUploader'
import type { Product } from '../../types/Product'
import { useProductsStore } from '../../store/useProductsStore'

export default function AddProduct() {
  const addProduct = useProductsStore((s) => s.add)
  const [form, setForm] = useState<{ name: string; price: string; category: string; image?: string }>({
    name: '',
    price: '',
    category: '',
  })
  const [message, setMessage] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function handleImage(url: string) {
    setForm((s) => ({ ...s, image: url }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Basic validation
    const price = parseFloat(form.price)
    if (!form.name || isNaN(price) || !form.category) {
      setMessage('Please fill all fields correctly.')
      return
    }

    const product: Product = {
      id: `p_${Date.now()}`,
      name: form.name,
      price: price,
      category: form.category,
      image: form.image,
    }

    // Save to local products store (simulated persistence)
    addProduct(product)
    setMessage('Product created successfully.')
    setForm({ name: '', price: '', category: '' })
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (USD)</label>
          <input name="price" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
          </select>
        </div>

        <ImageUploader onUploadComplete={handleImage} />

        <div>
          <button type="submit" className="bg-kilimall text-white px-4 py-2 rounded hover:opacity-90">Create Product</button>
        </div>

        {message && <div className="text-sm text-green-700">{message}</div>}
      </form>
    </div>
  )
}
