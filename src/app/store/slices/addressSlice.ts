import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthToken } from './authSlice';

interface Address {
  id: number;
  vendor_location_id: number;
  address_type: 'billing' | 'shipping';
  street_address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

interface AddressState {
  billingAddresses: Address[];
  shippingAddresses: Address[];
  selectedBillingId: number | null;
  selectedShippingId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  billingAddresses: [],
  shippingAddresses: [],
  selectedBillingId: null,
  selectedShippingId: null,
  loading: false,
  error: null,
};

// Create Address
export const createAddress = createAsyncThunk(
  'address/create',
  async (payload: {
    address_type: 'billing' | 'shipping';
    street_address: string;
    city: string;
    state: string;
    pincode: string;
    vendor_location_uuid: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { tempToken: string | null } };
      const token = getAuthToken() || state.auth.tempToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/address/create`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create address');
    }
  }
);

// Get Addresse
export const getAddresses = createAsyncThunk(
  'address/getAddresses',
  async (payload: {
    address_type: 'billing' | 'shipping';
    vendor_location_uuid: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { tempToken: string | null } };
      const token = getAuthToken() || state.auth.tempToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/address/get-addresses`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return { type: payload.address_type, data: response.data.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
    }
  }
);

// Update Address
export const updateAddress = createAsyncThunk(
  'address/update',
  async (payload: {
    addressId: number;
    address_type: 'billing' | 'shipping';
    street_address: string;
    city: string;
    state: string;
    pincode: string;
    vendor_location_uuid: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { tempToken: string | null } };
      const token = getAuthToken() || state.auth.tempToken;

      const { addressId, ...body } = payload;
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/address/update/${addressId}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update address');
    }
  }
);

// Delete Address
export const deleteAddress = createAsyncThunk(
  'address/delete',
  async (payload: {
    addressId: number;
    vendor_location_uuid: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { tempToken: string | null } };
      const token = getAuthToken() || state.auth.tempToken;

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/address/delete/${payload.addressId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { vendor_location_uuid: payload.vendor_location_uuid }
        }
      );

      return payload.addressId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setSelectedBilling: (state, action) => {
      state.selectedBillingId = action.payload;
    },
    setSelectedShipping: (state, action) => {
      state.selectedShippingId = action.payload;
    },
    clearAddresses: (state) => {
      state.billingAddresses = [];
      state.shippingAddresses = [];
      state.selectedBillingId = null;
      state.selectedShippingId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Address
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.address_type === 'billing') {
          state.billingAddresses.push(action.payload);
        } else {
          state.shippingAddresses.push(action.payload);
        }
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Addresses
      .addCase(getAddresses.fulfilled, (state, action) => {
        if (action.payload.type === 'billing') {
          state.billingAddresses = action.payload.data;
        } else {
          state.shippingAddresses = action.payload.data;
        }
      })
      // Update Address
      .addCase(updateAddress.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated.address_type === 'billing') {
          const index = state.billingAddresses.findIndex(a => a.id === updated.id);
          if (index !== -1) state.billingAddresses[index] = updated;
        } else {
          const index = state.shippingAddresses.findIndex(a => a.id === updated.id);
          if (index !== -1) state.shippingAddresses[index] = updated;
        }
      })
      // Delete Address
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.billingAddresses = state.billingAddresses.filter(a => a.id !== action.payload);
        state.shippingAddresses = state.shippingAddresses.filter(a => a.id !== action.payload);
      });
  },
});

export const { setSelectedBilling, setSelectedShipping, clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;
