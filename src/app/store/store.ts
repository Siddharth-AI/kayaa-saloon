import { configureStore, type ThunkAction, type Action } from "@reduxjs/toolkit"
import cartReducer from "./slices/cartSlice"
import authReducer from "./slices/authSlice"
import operatorsReducer from "./slices/operatorsSlice"
import servicesReducer from "./slices/servicesSlice"
import uiReducer from "./slices/uiSlice"
import locationsReducer from "./slices/locationsSlice"
import businessHoursReducer from "./slices/businessHoursSlice"
import timeSlotsReducer from "./slices/timeSlotsSlice"
import bookingReducer from "./slices/bookingSlice"
import bookingSummaryReducer from "./slices/bookingSummarySlice"
import appointmentsReducer from "./slices/appointmentsSlice";
import changePasswordReducer from "./slices/changePasswordSlice"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { Middleware } from "redux"
import modalReducer from "./slices/modalSlice";
import cancelBookingReducer from './slices/cancelBookingSlice'; // Adjust
import productsReducer from './slices/productsSlice';
import paymentReducer from './slices/paymentSlice';
import addressReducer from './slices/addressSlice';
import ordersReducer from './slices/orderSlice';
// Persist config for the root reducer
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth", "products", "address", "order", "bookingSummary"], // add slices you want to persist
}

const rootReducer = {
  cart: cartReducer,
  appointments: appointmentsReducer,
  operators: operatorsReducer,
  services: servicesReducer,
  ui: uiReducer,
  locations: locationsReducer,
  auth: authReducer,
  businessHours: businessHoursReducer,
  timeSlots: timeSlotsReducer,
  booking: bookingReducer,
  bookingSummary: bookingSummaryReducer,
  changePassword: changePasswordReducer,
  modal: modalReducer,
  cancelBooking: cancelBookingReducer,
  products: productsReducer,
  payment: paymentReducer,
  address: addressReducer,
  orders: ordersReducer
}

const persistedReducer = persistReducer(persistConfig, (state: any, action: any) => {
  // Combine all reducers manually
  return (Object.keys(rootReducer) as Array<keyof typeof rootReducer>).reduce((acc, key) => {
    acc[key] = rootReducer[key](state?.[key], action)
    return acc
  }, {} as Record<keyof typeof rootReducer, any>)
})

// Updated middleware to handle location-based cart storage
const cartLocalStorageMiddleware: Middleware = storeAPI => next => (action: unknown) => {
  const result = next(action)

  if (
    typeof action === "object" &&
    action !== null &&
    "type" in action
  ) {
    const actionType = (action as { type: string }).type

    // Handle all cart-related actions for both services and products
    if (
      actionType === "cart/addServiceToCart" ||
      actionType === "cart/addProductToCart" ||
      actionType === "cart/removeServiceFromCart" ||
      actionType === "cart/removeProductFromCart" ||
      actionType === "cart/updateProductQuantity" ||
      actionType === "cart/clearServices" ||
      actionType === "cart/clearProducts" ||
      actionType === "cart/clearCart" ||
      actionType === "cart/setCart" ||
      actionType === "cart/addToCart" || // Keep for backward compatibility
      actionType === "cart/removeFromCart" // Keep for backward compatibility
    ) {
      const { cart, auth, services } = storeAPI.getState()
      const user = auth.user
      const locationId = services.selectedLocationUuid

      if (typeof window !== "undefined" && locationId) {
        // Create cart data object with both services and products
        const cartData = {
          services: cart.services || [],
          products: cart.products || [],
          items: cart.items || []
        }

        const storageKey = user && user.isLoggedIn ? `userCart_${user.mobile || user.email || user.uuid}` : "guestCart"
        const existingData = localStorage.getItem(storageKey)
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

        localStorage.setItem(storageKey, JSON.stringify(parsedData))
        // console.log("💾 Saved to cart after action:", actionType, "Location:", locationId)
        // console.log("💾 Storage key:", storageKey)
        // console.log("💾 Saved data:", parsedData)
      }
    }

    // Handle logout cleanup (unchanged)
    if (actionType === "auth/logout") {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("userData")
        // console.log("Cleaned up auth data from localStorage")
      }
    }
  }

  return result
}


export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(cartLocalStorageMiddleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
