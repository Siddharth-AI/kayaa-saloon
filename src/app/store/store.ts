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
import appointmentsReducer from "./slices/appointmentsSlice";
import changePasswordReducer from "./slices/changePasswordSlice"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { Middleware } from "redux"
import modalReducer from "./slices/modalSlice";
import cancelBookingReducer from './slices/cancelBookingSlice'; // Adjust
import productsReducer from './slices/productsSlice';
import paymentReducer from './slices/paymentSlice';
// Persist config for the root reducer
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth"], // add slices you want to persist
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
  changePassword: changePasswordReducer,
  modal: modalReducer,
  cancelBooking: cancelBookingReducer,
  products: productsReducer,
  payment: paymentReducer
}

const persistedReducer = persistReducer(persistConfig, (state: any, action: any) => {
  // Combine all reducers manually
  return (Object.keys(rootReducer) as Array<keyof typeof rootReducer>).reduce((acc, key) => {
    acc[key] = rootReducer[key](state?.[key], action)
    return acc
  }, {} as Record<keyof typeof rootReducer, any>)
})

// Updated middleware to handle both services and products
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
      const { cart, auth } = storeAPI.getState()
      const user = auth.user

      if (typeof window !== "undefined") {
        // Create cart data object with both services and products
        const cartData = {
          services: cart.services || [],
          products: cart.products || [],
          // Keep items for backward compatibility
          items: cart.items || []
        }

        if (user && user.isLoggedIn) {
          const userIdentifier = user.mobile || user.email || user.uuid
          localStorage.setItem(`userCart_${userIdentifier}`, JSON.stringify(cartData))
          console.log("Saved to user cart after action:", actionType, cartData)
        } else {
          localStorage.setItem("guestCart", JSON.stringify(cartData))
          console.log("Saved to guest cart after action:", actionType, cartData)
        }
      }
    }

    // Handle logout cleanup (unchanged)
    if (actionType === "auth/logout") {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("userData")
        console.log("Cleaned up auth data from localStorage")
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
