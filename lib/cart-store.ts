'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from './types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, color: string, size?: string) => void
  removeItem: (productId: string, color: string, size?: string) => void
  updateQuantity: (productId: string, color: string, quantity: number, size?: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product, color, size) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product.id === product.id &&
              item.selectedColor === color &&
              item.selectedSize === size
          )
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id &&
                item.selectedColor === color &&
                item.selectedSize === size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }
          
          return {
            items: [...state.items, { product, quantity: 1, selectedColor: color, selectedSize: size }],
          }
        })
      },
      
      removeItem: (productId, color, size) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product.id === productId &&
                item.selectedColor === color &&
                item.selectedSize === size)
          ),
        }))
      },
      
      updateQuantity: (productId, color, quantity, size) => {
        if (quantity <= 0) {
          get().removeItem(productId, color, size)
          return
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
              ? { ...item, quantity }
              : item
          ),
        }))
      },
      
      clearCart: () => set({ items: [] }),
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'platzi-cart',
    }
  )
)
