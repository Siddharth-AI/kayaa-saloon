import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AppThunk } from "../store"
import { logout, type User } from "./authSlice"



// NEW: Separate interfaces for different cart item types
export interface ServiceCartItem {
  id: number
  name: string
  duration: number
  price: number
  category: string
  tags: string[]
  operator?: string
  selectedDate?: string
  selectedDay?: string
  timeSlot?: string
  description?: string
  vendor_location_uuid?: string
  type: 'service'
}

export interface ProductCartItem {
  id: number
  name: string
  price: number
  cost: number
  brand: string
  detail: string
  image: string
  measurement?: number | null
  unit: string
  stock: number
  item_code: string
  quantity: number
  type: 'product'
}
export interface CartItem {
  id: number
  name: string
  duration: number
  price: number
  category: string
  tags: string[]
  operator?: string
  selectedDate?: string
  selectedDay?: string
  timeSlot?: string
  description?: string
  vendor_location_uuid?: string,
}

interface CartState {
  services: ServiceCartItem[]
  products: ProductCartItem[]
  items: CartItem[]
  loading: boolean
  error: string | null
  isHydrated: boolean
}

// Safe localStorage operations
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(key)
      }
    } catch (error) {
      console.log("Error reading from localStorage:", error)
    }
    return null
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value)
      }
    } catch (error) {
      console.log("Error writing to localStorage:", error)
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.log("Error removing from localStorage:", error)
    }
  },
}

// UPDATED: Helper function to handle both new and old cart formats
const getCartFromStorage = (): { services: ServiceCartItem[], products: ProductCartItem[], items: CartItem[] } => {
  const guestCart = safeLocalStorage.getItem("guestCart")
  if (guestCart) {
    const parsed = JSON.parse(guestCart)
    return {
      services: parsed.services || [],
      products: parsed.products || [],
      items: parsed.items || []
    }
  }
  return { services: [], products: [], items: [] }
}

// UPDATED: Helper function for user-specific cart
const getUserCartFromStorage = (userId?: string | null): { services: ServiceCartItem[], products: ProductCartItem[], items: CartItem[] } => {
  if (userId) {
    const userCart = safeLocalStorage.getItem(`userCart_${userId}`)
    if (userCart) {
      const parsed = JSON.parse(userCart)
      return {
        services: parsed.services || [],
        products: parsed.products || [],
        items: parsed.items || []
      }
    }
  }
  return { services: [], products: [], items: [] }
}

const initialState: CartState = {
  services: [],
  products: [],
  items: [],
  loading: false,
  error: null,
  isHydrated: false,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeCart(state) {
      try {
        const cartData = getCartFromStorage()
        state.services = cartData.services
        state.products = cartData.products
        state.items = cartData.items
        state.isHydrated = true
        state.error = null
      } catch (error) {
        state.error = "Failed to initialize cart"
        console.log("Cart initialization error:", error)
      }
    },
    setCart(state, action: PayloadAction<{ services?: ServiceCartItem[], products?: ProductCartItem[], items?: CartItem[] }>) {
      if (action.payload.services) state.services = action.payload.services
      if (action.payload.products) state.products = action.payload.products
      if (action.payload.items) state.items = action.payload.items
      state.error = null
    },

    addToCart(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload)
      state.error = null
    },

    removeFromCart(state, action: PayloadAction<number>) {
      if (action.payload >= 0 && action.payload < state.items.length) {
        state.items.splice(action.payload, 1)
        state.error = null
      }
    },
    // NEW: Service-specific actions
    addServiceToCart(state, action: PayloadAction<Omit<ServiceCartItem, 'type'>>) {
      state.services.push({ ...action.payload, type: 'service' })
      state.error = null
    },
    removeServiceFromCart(state, action: PayloadAction<number>) {
      if (action.payload >= 0 && action.payload < state.services.length) {
        state.services.splice(action.payload, 1)
        state.error = null
      }
    },
    clearServices(state) {
      state.services = []
      state.error = null
    },

    // NEW: Product-specific actions
    addProductToCart(state, action: PayloadAction<Omit<ProductCartItem, 'type'>>) {
      const existingProductIndex = state.products.findIndex(
        item => item.id === action.payload.id
      )

      if (existingProductIndex >= 0) {
        state.products[existingProductIndex].quantity += action.payload.quantity
      } else {
        state.products.push({ ...action.payload, type: 'product' })
      }
      state.error = null
    },

    removeProductFromCart(state, action: PayloadAction<number>) {
      const productIndex = state.products.findIndex(item => item.id === action.payload)
      if (productIndex >= 0) {
        state.products.splice(productIndex, 1)
        state.error = null
      }
    },

    updateProductQuantity(state, action: PayloadAction<{ id: number, quantity: number }>) {
      const product = state.products.find(item => item.id === action.payload.id)
      if (product) {
        product.quantity = Math.max(1, action.payload.quantity)
      }
    },

    clearProducts(state) {
      state.products = []
      state.error = null
    },

    // UPDATED: Clear all carts
    clearCart(state) {
      state.services = []
      state.products = []
      state.items = []
      state.error = null
    },

    // UPDATED: Clear only services after booking (keep products)
    clearCartAfterBooking(state) {
      state.services = []
      state.items = []
      // Keep products after booking
      state.error = null
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },

    clearBookingDetailsFromCart(state) {
      state.items = state.items.map((item) => {
        const { operator, selectedDate, selectedDay, timeSlot, ...rest } = item
        return rest as CartItem
      })

      state.services = state.services.map((item) => {
        const { operator, selectedDate, selectedDay, timeSlot, ...rest } = item
        return { ...rest, type: 'service' as const }
      })
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      safeLocalStorage.removeItem("guestCart")
      state.services = []
      state.products = []
      state.items = []
      state.error = null
    })
  },
})

export const {
  initializeCart,
  setCart,
  addToCart,
  removeFromCart,
  addServiceToCart,
  addProductToCart,
  removeServiceFromCart,
  removeProductFromCart,
  updateProductQuantity,
  clearServices,
  clearProducts,
  clearCart,
  setLoading,
  setError,
  clearCartAfterBooking,
  clearBookingDetailsFromCart
} = cartSlice.actions

// Simple thunk to clear cart after successful booking
export const clearCartAfterSuccessfulBooking = (): AppThunk => (dispatch, getState) => {
  try {
    const { auth } = getState()
    const user = auth.user
    console.log("Clearing services from cart after successful booking...")

    dispatch(clearCartAfterBooking())

    setTimeout(() => {
      if (user && user.isLoggedIn) {
        const userIdentifier = user.mobile || user.email || user.uuid
        const userKey = `userCart_${userIdentifier}`
        const cartData = getUserCartFromStorage(userIdentifier)
        const updatedCartData = {
          services: [],
          products: cartData.products, // Keep products
          items: []
        }
        safeLocalStorage.setItem(userKey, JSON.stringify(updatedCartData))
        console.log("Cleared services from user cart, kept products")
      } else {
        const cartData = getCartFromStorage()
        const updatedCartData = {
          services: [],
          products: cartData.products, // Keep products
          items: []
        }
        safeLocalStorage.setItem("guestCart", JSON.stringify(updatedCartData))
        console.log("Cleared services from guest cart, kept products")
      }
    }, 100)
  } catch (error) {
    console.log("Error clearing cart:", error)
    dispatch(setError("Failed to clear cart"))
  }
}


// Thunk to handle cart synchronization when user logs in
export const syncCartOnLogin = (user: User): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true))
    const guestCartData = getCartFromStorage()
    const userIdentifier = user.mobile || user.email || user.uuid
    const userCartData = getUserCartFromStorage(userIdentifier)

    const mergedCartData = {
      services: [...userCartData.services, ...guestCartData.services],
      products: [...userCartData.products, ...guestCartData.products],
      items: [...userCartData.items, ...guestCartData.items]
    }

    dispatch(setCart(mergedCartData))

    const userKey = `userCart_${userIdentifier}`
    safeLocalStorage.setItem(userKey, JSON.stringify(mergedCartData))
    safeLocalStorage.removeItem("guestCart")
    dispatch(setLoading(false))
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : "Failed to sync cart"))
    dispatch(setLoading(false))
  }
}

// Thunk to load user cart when user is already logged in (on app start)
export const loadUserCart = (user: User): AppThunk => async (dispatch) => {
  try {
    const userIdentifier = user.mobile || user.email || user.uuid
    const userCartData = getUserCartFromStorage(userIdentifier)
    dispatch(setCart(userCartData))
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : "Failed to load cart"))
  }
}

// Middleware to save cart to localStorage
export const saveCartToStorage = (): AppThunk => (dispatch, getState) => {
  try {
    const { cart, auth } = getState()
    const user = auth.user

    const cartData = {
      services: cart.services,
      products: cart.products,
      items: cart.items
    }

    if (user && user.isLoggedIn) {
      const userIdentifier = user.mobile || user.email || user.uuid
      const userKey = `userCart_${userIdentifier}`
      safeLocalStorage.setItem(userKey, JSON.stringify(cartData))
    } else {
      safeLocalStorage.setItem("guestCart", JSON.stringify(cartData))
    }
  } catch (error) {
    console.log("Error saving cart to storage:", error)
    dispatch(setError("Failed to save cart"))
  }
}

export default cartSlice.reducer
