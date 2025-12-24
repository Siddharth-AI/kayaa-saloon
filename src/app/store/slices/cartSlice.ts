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
  operator?: string | { id: number; name: string; [key: string]: any }
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
  operator?: string | { id: number; name: string; [key: string]: any }
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

// Helper function to get cart data for specific location
const getCartFromStorage = (locationId?: string): { services: ServiceCartItem[], products: ProductCartItem[], items: CartItem[] } => {
  const guestCart = safeLocalStorage.getItem("guestCart")
  if (guestCart) {
    const parsed = JSON.parse(guestCart)
    if (locationId && parsed[locationId]) {
      return {
        services: parsed[locationId].services || [],
        products: parsed[locationId].products || [],
        items: parsed[locationId].items || []
      }
    }
    // Fallback for old structure
    return {
      services: parsed.services || [],
      products: parsed.products || [],
      items: parsed.items || []
    }
  }
  return { services: [], products: [], items: [] }
}

// Helper function for user-specific cart with location support
const getUserCartFromStorage = (userId?: string | null, locationId?: string): { services: ServiceCartItem[], products: ProductCartItem[], items: CartItem[] } => {
  // console.log("🔍 getUserCartFromStorage called with:", { userId, locationId })
  if (userId) {
    const userCart = safeLocalStorage.getItem(`userCart_${userId}`)
    // console.log("📦 Raw userCart from localStorage:", userCart)
    if (userCart) {
      const parsed = JSON.parse(userCart)
      // console.log("📦 Parsed userCart:", parsed)
      if (locationId && parsed[locationId]) {
        // console.log("✅ Found location-based data:", parsed[locationId])
        return {
          services: parsed[locationId].services || [],
          products: parsed[locationId].products || [],
          items: parsed[locationId].items || []
        }
      }
      // Fallback for old structure
      // console.log("⚠️ Using fallback structure:", { services: parsed.services, products: parsed.products, items: parsed.items })
      return {
        services: parsed.services || [],
        products: parsed.products || [],
        items: parsed.items || []
      }
    }
  }
  // console.log("❌ Returning empty cart")
  return { services: [], products: [], items: [] }
}

// Helper to merge services (combine same services)
const mergeServices = (existingServices: ServiceCartItem[], newServices: ServiceCartItem[]): ServiceCartItem[] => {
  const merged = [...existingServices]

  newServices.forEach(newService => {
    const existingIndex = merged.findIndex(existing => existing.id === newService.id)
    if (existingIndex === -1) {
      merged.push(newService)
    }
    // If service already exists, we keep the existing one (no duplicates)
  })

  return merged
}

// Helper to merge products (add quantities for same products)
const mergeProducts = (existingProducts: ProductCartItem[], newProducts: ProductCartItem[]): ProductCartItem[] => {
  const merged = [...existingProducts]

  newProducts.forEach(newProduct => {
    const existingIndex = merged.findIndex(existing => existing.id === newProduct.id)
    if (existingIndex >= 0) {
      merged[existingIndex].quantity += newProduct.quantity
    } else {
      merged.push(newProduct)
    }
  })

  return merged
}

// Helper to save cart data with location structure
const saveCartToStorage = (cartData: any, locationId: string, isUser: boolean, userId?: string) => {
  const storageKey = isUser ? `userCart_${userId}` : "guestCart"
  const existingData = safeLocalStorage.getItem(storageKey)
  let parsedData = {}

  if (existingData) {
    try {
      parsedData = JSON.parse(existingData)
    } catch (e) {
      parsedData = {}
    }
  }

  // Update the specific location data
  parsedData = {
    ...parsedData,
    [locationId]: cartData
  }

  safeLocalStorage.setItem(storageKey, JSON.stringify(parsedData))
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
    initializeCart(state, action: PayloadAction<string | undefined>) {
      try {
        const locationId = action.payload
        // We can't access auth state here, so we'll create a thunk for this
        const cartData = getCartFromStorage(locationId)
        state.services = cartData.services
        state.products = cartData.products
        state.items = cartData.items
        state.isHydrated = true
        state.error = null
      } catch (error) {
        state.error = "Failed to initialize cart"
        // console.log("Cart initialization error:", error)
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
      // Clear cart state on logout so user can start fresh as guest
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
export const clearCartAfterSuccessfulBooking = (locationId: string): AppThunk => (dispatch, getState) => {
  try {
    const { auth } = getState()
    const user = auth.user
    // console.log("Clearing services from cart after successful booking...")

    dispatch(clearCartAfterBooking())

    setTimeout(() => {
      if (user && user.isLoggedIn) {
        const userIdentifier = user.mobile || user.email || user.uuid
        const cartData = getUserCartFromStorage(userIdentifier, locationId)
        const updatedCartData = {
          services: [],
          products: cartData.products, // Keep products
          items: []
        }
        saveCartToStorage(updatedCartData, locationId, true, userIdentifier)
        // console.log("Cleared services from user cart, kept products")
      } else {
        const cartData = getCartFromStorage(locationId)
        const updatedCartData = {
          services: [],
          products: cartData.products, // Keep products
          items: []
        }
        saveCartToStorage(updatedCartData, locationId, false)
        // console.log("Cleared services from guest cart, kept products")
      }
    }, 100)
  } catch (error) {
    // console.log("Error clearing cart:", error)
    dispatch(setError("Failed to clear cart"))
  }
}


// Thunk to handle cart synchronization when user logs in
export const syncCartOnLogin = (user: User, locationId: string): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true))

    const userIdentifier = user.mobile || user.email || user.uuid

    // Get guest cart from localStorage (not current state)
    const guestCartData = getCartFromStorage(locationId)

    // Get user cart from localStorage
    const userCartData = getUserCartFromStorage(userIdentifier, locationId)

    // console.log("🔄 Syncing cart on login:", {
    //   locationId,
    //   userIdentifier,
    //   guestCartData,
    //   userCartData
    // })
    // console.log("📦 User cart services before merge:", userCartData.services)
    // console.log("📦 Guest cart services before merge:", guestCartData.services)

    // Merge user cart + guest cart (deduplicate services)
    const mergedCartData = {
      services: mergeServices(userCartData.services, guestCartData.services),
      products: mergeProducts(userCartData.products, guestCartData.products),
      items: [...userCartData.items, ...guestCartData.items]
    }

    // console.log("✅ Merged cart data:", mergedCartData)

    dispatch(setCart(mergedCartData))

    // Save merged data to user cart
    saveCartToStorage(mergedCartData, locationId, true, userIdentifier)

    // Clear guest cart for this location after merging
    if (guestCartData.services.length > 0 || guestCartData.products.length > 0 || guestCartData.items.length > 0) {
      const guestCart = safeLocalStorage.getItem("guestCart")
      if (guestCart) {
        const parsed = JSON.parse(guestCart)
        delete parsed[locationId]
        if (Object.keys(parsed).length === 0) {
          safeLocalStorage.removeItem("guestCart")
        } else {
          safeLocalStorage.setItem("guestCart", JSON.stringify(parsed))
        }
      }
    }

    dispatch(setLoading(false))
  } catch (error) {
    console.log("❌ Cart sync error:", error)
    dispatch(setError(error instanceof Error ? error.message : "Failed to sync cart"))
    dispatch(setLoading(false))
  }
}

// Thunk to load user cart when user is already logged in (on app start)
export const loadUserCart = (user: User, locationId: string): AppThunk => async (dispatch) => {
  try {
    const userIdentifier = user.mobile || user.email || user.uuid
    const userCartData = getUserCartFromStorage(userIdentifier, locationId)
    dispatch(setCart(userCartData))
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : "Failed to load cart"))
  }
}

// Thunk to initialize cart with auth state awareness
export const initializeCartWithAuth = (locationId: string): AppThunk => (dispatch, getState) => {
  try {
    const { auth } = getState()
    const user = auth.user

    let cartData
    if (user && user.isLoggedIn) {
      const userIdentifier = user.mobile || user.email || user.uuid
      cartData = getUserCartFromStorage(userIdentifier, locationId)
      // console.log("Loading user cart for location:", locationId, cartData)
    } else {
      cartData = getCartFromStorage(locationId)
      // console.log("Loading guest cart for location:", locationId, cartData)
    }

    dispatch(setCart(cartData))
  } catch (error) {
    console.log("Error initializing cart:", error)
    dispatch(setError("Failed to initialize cart"))
  }
}

// Middleware to save cart to localStorage with location support
export const saveCartToStorageWithLocation = (locationId: string): AppThunk => (dispatch, getState) => {
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
      saveCartToStorage(cartData, locationId, true, userIdentifier)
    } else {
      saveCartToStorage(cartData, locationId, false)
    }
  } catch (error) {
    console.log("Error saving cart to storage:", error)
    dispatch(setError("Failed to save cart"))
  }
}

export default cartSlice.reducer
