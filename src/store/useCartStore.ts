import create from 'zustand'
import type { Product } from '../types/Product'

type CartState = {
  items: Product[]
  add: (p: Product) => void
  remove: (id: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  add: (p) => set((s) => ({ items: [...s.items, p] })),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
}))
