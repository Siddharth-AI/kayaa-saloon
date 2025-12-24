import axios from 'axios';
import { CancelBookingRequest, CreateBookingRequest, GetSlotsRequest, GetUserBookingsRequest } from '../lib/types';
import { getCustomerUuid, getHeaders } from '@/lib/user-helper';

export interface CalculateBookingSummaryRequest {
  vendor_location_uuid: string;
  booking_date: string;
  booking_comment?: string;
  booking_status: string;
  merge_services_of_same_staff: boolean;
  services: Array<{
    service_id: number;
    service_name: string;
    start_time: number;
    end_time: number;
    employee_id?: number;
  }>;
  coupon_code?: string;
}

export interface CalculateBookingSummaryResponse {
  message: string;
  code: number;
  data: {
    policy_applied: boolean;
    policy_summary: {
      policy_name: string;
      customer_type: string;
      policy_description: string;
    };
    financial_summary: {
      booking: {
        tax_total: number;
        discount_amount: number;
        discount_uuid: string | null;
        discount_type: string | null;
        discount_value: number | null;
        service_total: number;
        total_payable: number;
      };
      deposit: {
        amount: number;
      };
      fees: {
        cancellation: {
          amount: number;
          type: string;
          applicable_till: number;
          reason_required: boolean;
        };
        no_show: {
          amount: number;
          type: string;
        };
      };
    };
    policy_conditions: {
      eligibility: {
        min_no_show_count: number;
        min_booking_amount: number;
        min_wallet_balance: number;
      };
      customer_status: {
        current_visits: number;
        no_show_count: number;
        is_member: boolean;
      };
    };
    acceptance_required: boolean;
    acceptance_message: string;
  };
}

export async function getBusinessInfo(bookingPage: string = 'stylo-hadapsar') {
	const url = `https://qf9u42zvrh.execute-api.ap-south-1.amazonaws.com/stage/business/${bookingPage}`;

	try {
		const response = await axios.get(url, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return response.data;
	} catch (error: any) {
		console.error("Error in getBusinessInfo:", error.response?.data || error.message);
		throw error;
	}
}

export async function getLocations(bookingPage: string = 'stylo-hadapsar') {
	try {
		const businessInfo = await getBusinessInfo(bookingPage);
		
		// Extract locations array from response
		// The API returns: { message, error, data: { locations: [...] } }
		// We need to return: { business_locations: [...] } for the responseHandler
		const locations = businessInfo?.data?.locations || [];
		
		return {
			business_locations: locations
		};
	} catch (error: any) {
		console.error("Error in getLocations:", error.response?.data || error.message);
		throw error;
	}
}

export async function getServices(businessId: string) {
	const url = `${process.env.CUSTOMER_BOOKING_URL}/client/business/${businessId}/services`;

	const headers = {
		'Content-Type': 'application/json',
	};

	try {
		const response = await axios.get(url, { headers });
		return response.data;
	} catch (error: any) {
		if (error.response?.status === 401) {
			// Token might be expired or invalid — regenerate and retry once
			console.warn("Token expired or unauthorized in getServices. Regenerating...");
		
			const retryResponse = await axios.get(url, {
				headers: {
					'Content-Type': 'application/json',
					
				}
			});

			return retryResponse.data;
		} else {
			console.error("getServices error:", error.response?.data || error.message);
			throw error;
		}
	}
}

export async function getOperators(businessId: string) {
	// Get a cached / still-valid token
	const url = `${process.env.CUSTOMER_BOOKING_URL}/client/business/${businessId}/operators`;

	const headers = {
		'Content-Type': 'application/json',
	};

	try {
		// First attempt
		const response = await axios.get(url, { headers });
		return response.data;
	} catch (error: any) {
		// If token was invalid/expired, regenerate once and retry
		if (error.response?.status === 401) {
			console.warn("Token expired or unauthorized in getOperators. Regenerating...");
		

			const retryResponse = await axios.get(url, {
				headers: {
					'Content-Type': 'application/json',
				
				}
			});

			return retryResponse.data;
		}

		// Any other error → bubble up
		console.error('getOperators error:', error.response?.data || error.message);
		throw error;
	}
}

export async function getBusinessHours(businessId: string) {
	const url = `${process.env.CUSTOMER_BOOKING_URL}/client/business/${businessId}/hours`;

	try {
		const response = await axios.get(url, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return response.data;
	} catch (error: any) {
		console.error('getBusinessHours error:', error.response?.data || error.message);
		throw error;
	}
}

export async function getSlots(businessId: string, params: GetSlotsRequest) {
	const { startDate, endDate, serviceIds = [], staffId } = params;

	// Build the base URL with startDate and endDate
	let url = `${process.env.CUSTOMER_BOOKING_URL}/client/business/${businessId}/slots/${startDate}/${endDate}`;

	// Build query parameters
	const queryParams = [];

	if (serviceIds.length > 0) {
		queryParams.push(`service_ids=${serviceIds.join(',')}`);
	}

	if (staffId) {
		queryParams.push(`staff_id=${staffId}`);
	}

	if (queryParams.length > 0) {
		url += `?${queryParams.join('&')}`;
	}

	// console.log('getSlots URL:', url);

	try {
		const response = await axios.get(url, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return response.data;
	} catch (error: any) {
		console.error('getSlots error:', error.response?.data || error.message);
		throw error;
	}
}

export async function calculateBookingSummary(params: CalculateBookingSummaryRequest, userToken: string): Promise<CalculateBookingSummaryResponse> {
	try {
		const customerUuid = await getCustomerUuid(userToken);
		const url = `${process.env.DINGG_API_URL}/user/calculate-summary`;

		const payload = {
			vendor_location_uuid: params.vendor_location_uuid,
			booking_date: params.booking_date,
			booking_comment: params.booking_comment || '',
			booking_status: params.booking_status,
			merge_services_of_same_staff: params.merge_services_of_same_staff,
			services: params.services,
			coupon_code: params.coupon_code || ''
		};

		const headers = {
			'customer_uuid': customerUuid,
			'vendor_location_uuid': params.vendor_location_uuid,
			'Authorization': userToken,
			'Content-Type': 'application/json'
		};

		const response = await axios.post(url, payload, { headers });
		return response.data;
	} catch (error: any) {
		console.error("calculateBookingSummary error:", error.response?.data || error.message);
		throw error;
	}
}

export async function createBooking(params: CreateBookingRequest, userToken: string): Promise<any> {
	try {

		const customerUuid = await getCustomerUuid(userToken);
		console.log("customerUuid", customerUuid);
		const url = `${process.env.DINGG_API_URL}/user/booking`;

		// Build payload
		const payload = {
			vendor_location_uuid: params.vendor_location_uuid,
			booking_date: params.booking_date,
			booking_comment: params.booking_comment || '',
			booking_status: params.booking_status,
			merchant_customer_id: params.merchant_customer_id,
			merge_services_of_same_staff: params.merge_services_of_same_staff,
			total: params.total,
			deposit_amount: params.deposit_amount,
			services: params.services,
			...(params.policy_acceptance && { policy_acceptance: params.policy_acceptance })
		};

		// Build headers with user UUID
		const headers = {
			'customer_uuid': customerUuid,
			'vendor_location_uuid': params.vendor_location_uuid,
			'Authorization': userToken,
			'Content-Type': 'application/json'
		};

		const response = await axios.post(url, payload, { headers });

		console.log("Booking response", response.data);
		return response.data;
	} catch (error: any) {
		console.error("createBooking error:", error.response?.data || error.message);
		throw error;
	}
}

export async function getUserBookings(params: GetUserBookingsRequest, userToken: string): Promise<any> {
	try {
		const customerUuid = await getCustomerUuid(userToken);

		// Map booking type numbers to strings
		const typeMap: Record<number, string> = {
			1: "UPCOMING",
			2: "CANCELLED",
			3: "PREVIOUS"
		};

		const bookingType = typeMap[params.booking_type];
		if (!bookingType) {
			throw new Error("Invalid booking_type.");
		}

		const businessUuid = params.vendor_location_uuid;
		const url = `${process.env.DINGG_API_URL}/user/bookings/${businessUuid}/${bookingType}?page=${params.page || 1}&limit=${params.limit || 10}`;

		const headers = {
			'customer_uuid': customerUuid,
			'vendor_location_uuid': businessUuid,
			'Authorization': userToken,
			'Content-Type': 'application/json'
		};

		const response = await axios.get(url, { headers });
		return response.data;
	} catch (error: any) {
		console.error("getUserBookings error:", error.response?.data || error.message);
		throw error;
	}
}

export async function cancelBooking(params: CancelBookingRequest, userToken: string): Promise<any> {
	try {

		const customerUuid = await getCustomerUuid(userToken);

		const url = `${process.env.DINGG_API_URL}/user/bookings/${params.id}`;

		const config = {
			headers: {
				'Authorization': userToken,
				'vendor_location_uuid': params.vendor_location_uuid,
				'customer_uuid': customerUuid,
				'Content-Type': 'application/json'
			}
		};

		const response = await axios.delete(url, config);
		return response.data;
	} catch (error: any) {
		console.error("Cancel Booking Error:", error?.response?.data || error.message);
		throw error;
	}
}

export async function getProducts(businessId: string) {
	const url = `https://qf9u42zvrh.execute-api.ap-south-1.amazonaws.com/stage/client/business/${businessId}/products?structure=hierarchical`
	try {
		const response = await axios.get(url);
		// console.log("Products found:", response.data);
		return response.data;
	} catch (error: any) {
		console.error("no products found Error:", error?.response?.data || error.message);
		throw error;

	}
}
