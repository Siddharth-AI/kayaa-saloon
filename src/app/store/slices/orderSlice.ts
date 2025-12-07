import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthToken } from './authSlice';

interface OrderItem {
  product_id: number;
  ord_qty: number;
}

interface OrderState {
  currentOrder: any | null;
  lastOrderDetails: any | null;
  loading: boolean;
  error: string | null;
  orderSuccess: boolean;
}

const initialState: OrderState = {
  currentOrder: null,
  lastOrderDetails: null,
  loading: false,
  error: null,
  orderSuccess: false,
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (payload: {
    vendor_location_uuid: string;
    order_type: 'online-delivery' | 'online-pickup';
    ref_no: string;
    po_date: string;
    merchant_customer_id: number;
    total_qty: number;
    items: OrderItem[];
    billing_address_id: number;
    shipping_address_id: number;
    remark?: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { tempToken: string | null } };
      const token = getAuthToken() || state.auth.tempToken;

      console.log('Creating order with payload:', payload);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order/create`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Order API Full Response:', response.data);
      
      // Handle different response structures
      if (response.data?.data?.data) {
        return response.data.data.data;
      } else if (response.data?.data) {
        return response.data.data;
      } else {
        return response.data;
      }
    } catch (error: any) {
      console.error('Create Order Error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create order';
      return rejectWithValue(errorMsg);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.orderSuccess = false;
      state.error = null;
    },
    setLastOrderDetails: (state, action) => {
      state.lastOrderDetails = action.payload;
    },
    clearLastOrderDetails: (state) => {
      state.lastOrderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orderSuccess = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.orderSuccess = false;
      });
  },
});

export const { clearOrder, setLastOrderDetails, clearLastOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
