export interface GetSlotsRequest {
  startDate: string;
  endDate: string;
  serviceIds?: string[];
  staffId?: string;
}

export interface DinggHeaders {
  [key: string]: string;
  access_code: string;
  api_key: string;
  'Content-Type': string;
  Authorization: string;
}

export type SendOtpRequest =
  | {
    dial_code: number;
    mobile: string;
    country_id: string;
    vendor_location_uuid: string;
    email?: never;
  }
  | {
    email: string;
    vendor_location_uuid: string;
    dial_code?: never;
    mobile?: never;
    country_id?: never;
  };

export type VerifyOtpRequest =
  | {
    vendor_location_uuid: string;
    dial_code: number;
    mobile: string;
    country_id: string;
    otp: string;
    email?: never;
  }
  | {
    vendor_location_uuid: string;
    email: string;
    otp: string;
    dial_code?: never;
    mobile?: never;
    country_id?: never;
  };

export type LoginRequest =
  | {
    vendor_location_uuid: string;
    password: string;
    email: string;
    dial_code?: never;
    mobile?: never;
    country_id?: never;
  }
  | {
    vendor_location_uuid: string;
    password: string;
    dial_code: number;
    mobile: string;
    country_id: string;
    email?: never;
  };

export interface ProfileResponse {
  message: string;
  code: number;
  data: {
    skip_profile: boolean;
    user: {
      id: number;
      fname: string;
      lname: string;
      display_name: string | null;
      gender: string | null;
      profile_pic: string | null;
      email: string;
      mobile: string;
      locality: string | null;
      dob: string | null;
      anniversary: string | null;
      is_email_verify: boolean;
      email_verify_token: string | null;
      is_mobile_verify: boolean;
      is_valid_mobile: boolean;
      address: string | null;
      country_id: number;
      uuid: string;
      createdAt: string;
      updatedAt: string;
      country: {
        dial_code: number;
        id: number;
        country_name: string;
        country_code: string;
        possible_length: number[];
      };
    };
  };
};


export type ForgotPasswordRequest =
  | {
    vendor_location_uuid: string;
    email: string;
    dial_code?: never;
    mobile?: never;
    country_id?: never;
  }
  | {
    vendor_location_uuid: string;
    dial_code: number;
    mobile: string;
    country_id: number;
    email?: never;
  };

export interface ForgotPasswordResponse {
  message: string;
  code: number;
};


export type ResetPasswordRequest =
  | {
    vendor_location_uuid: string;
    password: string;
    verification_code: string;
    email: string;
    dial_code?: never;
    mobile?: never;
    country_id?: never;
  }
  | {
    vendor_location_uuid: string;
    password: string;
    verification_code: string;
    dial_code: number;
    mobile: string;
    country_id: string;
    email?: never;
  };

export interface ResetPasswordResponse {
  message: string;
  code: number;
};


export interface UpdateProfileRequest {
  vendor_location_uuid: string;
  name: string;
  email: string;
  mobile: string;
  gender?: string;
  dial_code: string;
  country_id: string;
  dob?: string;
  address?: string;
}

export interface UpdateProfileResponse {
  message: string;
  code: number;
  data: {
    user: {
      id: number;
      fname: string;
      lname: string;
      display_name: string | null;
      gender: string;
      profile_pic: string;
      email: string;
      mobile: string;
      locality: string | null;
      dob: string;
      anniversary: string | null;
      is_email_verify: boolean;
      email_verify_token: string | null;
      is_mobile_verify: boolean;
      is_valid_mobile: boolean;
      address: string;
      country_id: string;
      uuid: string;
      createdAt: string;
      updatedAt: string;
    };
    skip_profile: boolean;
    token: string;
  };
};



export interface ProfileSetupRequest {
  password: string;
  name: string;
  mobile: string;
  vendor_location_uuid: string;
  verified_by: 'email' | 'mobile';
  gender?: string;
  email: string;
  dial_code: string;
  country_id: string;
}

export interface ProfileSetupResponse {
  message: string;
  code: number;
  data: {
    user: {
      id: number;
      fname: string;
      lname: string;
      display_name: string | null;
      gender: string | null;
      profile_pic: string | null;
      email: string;
      mobile: string;
      locality: string | null;
      dob: string | null;
      anniversary: string | null;
      is_email_verify: boolean;
      email_verify_token: string | null;
      is_mobile_verify: boolean;
      is_valid_mobile: boolean;
      address: string | null;
      country_id: string;
      uuid: string;
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  };
};



export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  vendor_location_uuid: string;
}

export interface CreateBookingRequest {
  vendor_location_uuid: string;
  booking_date: string;
  booking_comment?: string;
  booking_status: string;
  merchant_customer_id: number,
  merge_services_of_same_staff: boolean;
  total: number;
  services: Array<{
    service_id: number;
    service_name: string;
    start_time: number;
    end_time: number;
  }>;
}

export interface GetUserBookingsRequest {
  vendor_location_uuid: string;
  booking_type: number; // 1 = UPCOMING, 2 = CANCELLED, 3 = PREVIOUS
  page?: number;
  limit?: number;
}

export interface CancelBookingRequest {
  vendor_location_uuid: string;
  id: string; // Booking ID to cancel
}

export interface CreateCustomerParams {
  fname: string;
  lname: string;
  mobile: string;
  sms_trans?: boolean;
  sms_promo?: boolean;
  email_trans?: boolean;
  email_promo?: boolean;
}

export interface GetPaymentFormRequest {
  merchant_uuid: string;
}

export interface GetPaymentFormResponse {
  message: string;
  code: number;
  data: string;
}

// ---------------------- Address Types ----------------------

export interface CreateAddressRequest {
  address_type: 'billing' | 'shipping';
  street_address: string;
  city: string;
  state: string;
  pincode: number;
  vendor_location_uuid: string;
}

export interface UpdateAddressRequest {
  address_type: 'billing' | 'shipping';
  street_address: string;
  id: number;
  city: string;
  state: string;
  pincode: number;
  vendor_location_uuid: string;
}

export interface GetAddressesRequest {
  address_type: string;
  vendor_location_uuid: string;
}

export interface AddressResponse {
  id: number;
  vendor_location_id: number;
  address_type: string;
  street_address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ---------------------- Order Types ----------------------

export interface CreateOrderRequest {
  vendor_location_uuid: string;
  order_type: 'online-delivery' | 'online-pickup';
  ref_no: string;
  po_date: string; // YYYY-MM-DD format
  merchant_customer_id: number | null;
  total_qty: number;
  items: Array<{
    product_id: number;
    ord_qty: number;
  }>;
  billing_address_id: number;
  shipping_address_id: number;
  remark?: string;
}

export interface CreateOrderResponse {
  status: string;
  success: boolean;
  message: string;
  code: number;
  data: {
    sales_order_uuid: string;
    status: string;
    order_type: string;
    order_items: Array<{
      product_id: number;
      quantity: number;
    }>;
  };
}


// ---------------------- Get Orders Types ----------------------

export interface GetOrdersRequest {
  vendor_location_uuid: string;
  limit?: number;
  page?: number;
}

export interface OrderItem {
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

export interface GetOrdersResponse {
  message: string;
  code: number;
  data: {
    count: number;
    rows: OrderItem[];
  };
}
