import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import AddProduct from './pages/Seller/AddProduct'
import Dashboard from './pages/User/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900">
        <header className="bg-kilimall p-4 text-white">
          <div className="container mx-auto font-bold">Lolly's Collection - Seller Dashboard</div>
        </header>
        <main className="container mx-auto p-6">
          <nav className="mb-6 flex gap-4">
            <Link to="/seller/add-product" className="text-kilimall hover:underline">Add Product</Link>
            <Link to="/dashboard" className="text-kilimall hover:underline">Your Dashboard</Link>
          </nav>
          <Routes>
            <Route path="/seller/add-product" element={<AddProduct />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<div className="text-center py-20">Welcome to Lolly's Collection Admin</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
