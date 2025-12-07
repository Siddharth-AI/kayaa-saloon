import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper function to validate token format (basic check)
const isValidTokenFormat = (token: string | null): boolean => {
  if (!token) {
    return false;
  }

  // More strict token validation
  const isValid =
    token.length > 20 &&
    !token.includes("undefined") &&
    !token.includes("null") &&
    !token.includes("NaN") &&
    !token.includes(" ") &&
    /^[A-Za-z0-9._-]+$/.test(token);
  return isValid;
};

// Helper function to get auth token
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

interface PaymentCard {
  id: number;
  card_type: string;
  card_expiry: string;
  card_holder_name: string;
  card_number: string;
}

interface PaymentState {
  paymentForm: string | null;
  paymentCards: PaymentCard[];
  selectedCardId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  paymentForm: null,
  paymentCards: [],
  selectedCardId: null,
  loading: false,
  error: null,
};

export const getPaymentForm = createAsyncThunk(
  'payment/getPaymentForm',
  async ({ merchant_uuid }: { merchant_uuid: string }, { getState }) => {
    const state = getState() as { auth: { token: string | null; tempToken: string | null } };
    const token = getAuthToken() || state.auth.token;

    if (!isValidTokenFormat(token)) {
      throw new Error('Invalid or missing authentication token');
    }

    const response = await axios.post(
      `/api/payment/cards?merchant_uuid=${merchant_uuid}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data.data;
  }
);

export const getPaymentCards = createAsyncThunk(
  'payment/getPaymentCards',
  async ({ merchant_uuid }: { merchant_uuid: string }, { getState }) => {
    const state = getState() as { auth: { token: string | null; tempToken: string | null } };
    const token = getAuthToken() || state.auth.token;

    if (!isValidTokenFormat(token)) {
      throw new Error('Invalid or missing authentication token');
    }

    const response = await axios.get(
      `/api/payment/cards/list?merchant_uuid=${merchant_uuid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data.data;
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentData: (state) => {
      state.paymentForm = null;
      state.paymentCards = [];
      state.selectedCardId = null;
      state.error = null;
    },
    setSelectedCard: (state, action) => {
      state.selectedCardId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPaymentForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentForm.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentForm = action.payload;
      })
      .addCase(getPaymentForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get payment form';
      })
      .addCase(getPaymentCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentCards.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentCards = Array.isArray(action.payload) ? action.payload : [];
        // Auto-select first card if none selected
        if (state.paymentCards.length > 0 && !state.selectedCardId) {
          state.selectedCardId = state.paymentCards[0].id;
        }
      })
      .addCase(getPaymentCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get payment cards';
      });
  },
});

export const { clearPaymentData, setSelectedCard } = paymentSlice.actions;
export default paymentSlice.reducer;
