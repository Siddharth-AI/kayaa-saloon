import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getAuthToken } from "./authSlice"

export interface BookingSummaryData {
  policy_applied: boolean
  policy_summary: {
    policy_name: string
    customer_type: string
    policy_description: string
  }
  financial_summary: {
    booking: {
      tax_total: number
      discount_amount: number
      discount_uuid: string | null
      discount_type: string | null
      discount_value: number | null
      service_total: number
      total_payable: number
    }
    deposit: {
      amount: number
    }
    fees: {
      cancellation: {
        amount: number
        type: string
        applicable_till: number
        reason_required: boolean
      }
      no_show: {
        amount: number
        type: string
      }
    }
  }
  policy_conditions: {
    eligibility: {
      min_no_show_count: number
      min_booking_amount: number
      min_wallet_balance: number
    }
    customer_status: {
      current_visits: number
      no_show_count: number
      is_member: boolean
    }
  }
  acceptance_required: boolean
  acceptance_message: string
}

export interface BookingSummaryState {
  loading: boolean
  error: string | null
  data: BookingSummaryData | null
}

export interface CalculateBookingSummaryPayload {
  vendor_location_uuid: string
  booking_date: string
  booking_comment?: string
  booking_status: string
  merge_services_of_same_staff: boolean
  services: Array<{
    service_id: number
    service_name: string
    start_time: number
    end_time: number
    employee_id?: number
  }>
  coupon_code?: string
}

// Async thunk for calculating booking summary
export const calculateBookingSummary = createAsyncThunk<
  BookingSummaryData,
  CalculateBookingSummaryPayload,
  { rejectValue: string }
>(
  "bookingSummary/calculateBookingSummary",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string | null; tempToken: string | null } }
      const token = getAuthToken() || state.auth.token

      if (!token) {
        return rejectWithValue("No authentication token found")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dingg-partner/calculate-booking-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || `HTTP error! status: ${response.status}`
        return rejectWithValue(errorMessage)
      }

      const data: any = await response.json()

      // Handle both response formats: {status, message, data} and {code, message, data}
      if ((data.code && data.code !== 200) || (data.status === false)) {
        const errorMessage = data.message || data.data?.message || "Failed to calculate booking summary"
        return rejectWithValue(errorMessage)
      }

      // Extract data from nested response structure
      // Response structure: {status, message, data: {message, code, data: {actual booking summary data}}}
      // The actual booking summary data is nested at data.data.data
      let summaryData = data
      
      if (data.data) {
        // Check if data.data has another nested data property (the actual booking summary)
        if (data.data.data && typeof data.data.data === 'object' && data.data.data.policy_applied !== undefined) {
          // This is the actual booking summary data
          summaryData = data.data.data
        } else if (data.data.policy_applied !== undefined) {
          // Data is directly in data.data
          summaryData = data.data
        } else {
          // Fallback to data.data
          summaryData = data.data
        }
      }
      
      return summaryData
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred")
    }
  },
)

const initialState: BookingSummaryState = {
  loading: false,
  error: null,
  data: null,
}

const bookingSummarySlice = createSlice({
  name: "bookingSummary",
  initialState,
  reducers: {
    clearBookingSummary: (state) => {
      state.data = null
      state.error = null
    },
    clearBookingSummaryError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateBookingSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(calculateBookingSummary.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.data = action.payload
      })
      .addCase(calculateBookingSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to calculate booking summary"
      })
  },
})

export const { clearBookingSummary, clearBookingSummaryError } = bookingSummarySlice.actions
export default bookingSummarySlice.reducer

