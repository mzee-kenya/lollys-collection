import create from 'zustand'
import type { Product } from '../types/Product'

type ProductsState = {
  products: Product[]
  add: (p: Product) => void
  remove: (id: string) => void
  clear: () => void
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  add: (p) => set((s) => ({ products: [p, ...s.products] })),
  remove: (id) => set((s) => ({ products: s.products.filter((i) => i.id !== id) })),
  clear: () => set({ products: [] }),
}))
