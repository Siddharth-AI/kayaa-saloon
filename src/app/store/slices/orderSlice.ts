import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthToken, removeAuthToken } from './authSlice';

interface CreateOrderPayload {
  vendor_location_uuid: string;
  order_type: 'online-pickup' | 'online-delivery';

  billing_address_id: number;
  shipping_address_id: number;
  items: Array<{
    product_id: number;
    ord_qty: number;
  }>;
  total_qty: number,
  merchant_customer_id: number,
  remark?: string;
}

interface OrderItem {
  id: number;
  product_id: number;
  order_qty: number;
  delivered_qty: number;
  cost: number;
  sell_price: number;
  tax: number;
  total: number;
  product: {
    name: string;
    item_code: string;
    unit: string;
    measurement: number;
    stock: {
      available_qty: number;
    };
    product_cat_subcategory: {
      name: string;
    };
  };
}

interface Order {
  id: number;
  uuid: string;
  ref_no: string;
  po_date: string;
  po_number: string;
  order_status: string;
  total: number;
  total_qty: number;
  order_type: string;
  remark: string;
}

interface OrderDetail extends Order {
  user: {
    id: number;
    user_histories: Array<{
      fname: string;
      lname: string;
      email: string;
      mobile: string;
    }>;
  };
  sales_order_items: OrderItem[];
  billing_address: {
    street_address: string;
    city: string;
    state: string;
    pincode: string;
  };
  shipping_address: {
    street_address: string;
    city: string;
    state: string;
    pincode: string;
  };
  sales_order_deliveries: Array<{
    bill: {
      payment_status: string;
      total: number;
      paid: number;
    };
  }>;
}

interface OrderState {
  orders: Order[];
  currentOrder: OrderDetail | null;
  paymentStatus: string | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  paymentStatus: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalCount: 0,
};

// Fetch all orders
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (payload: {
    vendor_location_uuid: string;
    limit?: number;
    page?: number;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { tempToken: string | null } };
      const token = getAuthToken() || state.auth.tempToken;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order/get`,
        {
          params: {
            vendor_location_uuid: payload.vendor_location_uuid,
            limit: payload.limit || 10,
            page: payload.page || 1,
          },
          headers: { 
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
          },
        }
      );

      return response.data.data.data;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        removeAuthToken();
        window.location.href = '/';
        return rejectWithValue('Authentication session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// Fetch single order detail
export const fetchOrderDetail = createAsyncThunk(
  'order/fetchOrderDetail',
  async (payload: {
    order_uuid: string;
    vendor_location_uuid: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { tempToken: string | null } };
      const token = getAuthToken() || state.auth.tempToken;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order/${payload.order_uuid}`,
        {
          params: { vendor_location_uuid: payload.vendor_location_uuid },
          headers: { 
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
          },
        }
      );

      return response.data.data.data;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        removeAuthToken();
        window.location.href = '/';
        return rejectWithValue('Authentication session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
);

// Fetch payment status
export const fetchPaymentStatus = createAsyncThunk(
  'order/fetchPaymentStatus',
  async (payload: {
    order_uuid: string;
    vendor_location_uuid: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { tempToken: string | null } };
      const token = getAuthToken() || state.auth.tempToken;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order/${payload.order_uuid}/payment-status`,
        {
          params: { vendor_location_uuid: payload.vendor_location_uuid },
          headers: { 
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
          },
        }
      );

      return response.data.data.data.payment_status;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        removeAuthToken();
        window.location.href = '/';
        return rejectWithValue('Authentication session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment status');
    }
  }
);

// Create order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (payload: CreateOrderPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { tempToken: string | null } };
      const token = getAuthToken() || state.auth.tempToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order/create`,
        payload,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
          },
        }
      );

      return response.data.data.data;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        removeAuthToken();
        window.location.href = '/';
        return rejectWithValue('Authentication session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (payload: {
    order_uuid: string;
    vendor_location_uuid: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { tempToken: string | null } };
      const token = getAuthToken() || state.auth.tempToken;

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order/${payload.order_uuid}/cancel`,
        {
          params: { vendor_location_uuid: payload.vendor_location_uuid },
          headers: { 
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
          },
        }
      );

      return payload.order_uuid;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        removeAuthToken();
        window.location.href = '/';
        return rejectWithValue('Authentication session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.paymentStatus = null;
    },
    clearLastOrderDetails: (state) => {
      state.currentOrder = null;
      state.paymentStatus = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.rows;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch order detail
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch payment status
      .addCase(fetchPaymentStatus.fulfilled, (state, action) => {
        state.paymentStatus = action.payload;
      })
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order.uuid !== action.payload);
        if (state.currentOrder?.uuid === action.payload) {
          state.currentOrder = null;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrderError, clearCurrentOrder, clearLastOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
