// src/redux/slices/locationsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Location {
  vendor_location_uuid: string;
  name: string;
  locality: string;
  booking_page: string;
  address?: string;
  google_map?: string;
  logo?: {
    src: string;
    size: string;
    type: string;
  };
  description?: string;
  selected?: string;
  _vendor_location?: {
    uuid: string;
  };
}

interface LocationsState {
  locations: Location[];
  loading: boolean;
  error: string | null;
  currentBusinessInfo: any | null;
}

const initialState: LocationsState = {
  locations: [],
  loading: false,
  error: null,
  currentBusinessInfo: null,
};

export const fetchLocations = createAsyncThunk<Location[], string | undefined>(
  'locations/fetchLocations',
  async (bookingPage, { rejectWithValue }) => {
    try {
      const bookingPageParam = bookingPage || 'stylo-hadapsar';
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dingg-partner/get-locations?booking_page=${bookingPageParam}`
      );
      
      // Response structure: { status, message, data: { business_locations: [...] } }
      const locations = response.data?.data?.business_locations || [];
      
      console.log('Fetched locations:', locations);
      
      // Map the locations to match our interface
      return locations.map((loc: any) => ({
        vendor_location_uuid: loc._vendor_location?.uuid || loc.vendor_location_uuid || '',
        name: loc.name || loc.locality || '',
        locality: loc.locality || '',
        booking_page: loc.booking_page || '',
        address: loc.address || '',
        google_map: loc.google_map || '',
        logo: loc.logo || undefined,
        description: loc.description || '',
        selected: loc.selected || 'false',
        _vendor_location: loc._vendor_location || { uuid: loc._vendor_location?.uuid || loc.vendor_location_uuid || '' }
      }));
    } catch (error: any) {
      console.error('Error fetching locations:', error.response?.data || error.message);
      return rejectWithValue(error.message || 'Failed to fetch locations');
    }
  }
);

export const fetchBusinessInfoByBookingPage = createAsyncThunk<any, string>(
  'locations/fetchBusinessInfoByBookingPage',
  async (bookingPage, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dingg-partner/get-business-info?booking_page=${bookingPage}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch business info');
    }
  }
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setCurrentBusinessInfo: (state, action: PayloadAction<any>) => {
      state.currentBusinessInfo = action.payload;
    },
    clearCurrentBusinessInfo: (state) => {
      state.currentBusinessInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<Location[]>) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBusinessInfoByBookingPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessInfoByBookingPage.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentBusinessInfo = action.payload;
      })
      .addCase(fetchBusinessInfoByBookingPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentBusinessInfo, clearCurrentBusinessInfo } = locationsSlice.actions;

export default locationsSlice.reducer;
