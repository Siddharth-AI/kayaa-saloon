import axios from 'axios';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrdersRequest,
  GetOrdersResponse,
  GetOrderDetailRequest,
  OrderDetailResponse,
  GetPaymentStatusRequest,
  PaymentStatusResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  CalculateSummaryRequest,
  CalculateSummaryResponse
} from '../lib/types';
import { getCustomerUuid } from '../lib/user-helper';

export async function createOrder(
  data: CreateOrderRequest,
  token: string
): Promise<CreateOrderResponse> {
  try {
    const customer_uuid = await getCustomerUuid(token);
    console.log('Customer UUID:', customer_uuid);
    const url = `${process.env.DINGG_API_URL}/vendor/sales-order/online`;

    const payload = {
      vendor_location_uuid: data.vendor_location_uuid,
      order_type: data.order_type,
      ref_no: data.ref_no,
      po_date: data.po_date,
      merchant_customer_id: data.merchant_customer_id,
      total_qty: data.total_qty,
      items: data.items,
      billing_address_id: data.billing_address_id,
      shipping_address_id: data.shipping_address_id,
      remark: data.remark || ''
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        customer_uuid
      }
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Create Order Error:', error.response?.data || error.message);
    throw error;
  }
}

export async function getOrders(
  params: GetOrdersRequest,
  token: string
): Promise<GetOrdersResponse> {
  try {
    const customer_uuid = await getCustomerUuid(token);
    const limit = params.limit || 10;
    const page = params.page || 1;

    const url = `${process.env.DINGG_API_URL}/vendor/sales-order/online?limit=${limit}&page=${page}&vendor_location_uuid=${params.vendor_location_uuid}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        customer_uuid
      }
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Get Orders Error:', error.response?.data || error.message);
    throw error;
  }
}


// ---------------------- Get Order Detail ----------------------
export async function getOrderDetail(
  params: GetOrderDetailRequest,
  token: string
): Promise<OrderDetailResponse> {
  try {
    const customer_uuid = await getCustomerUuid(token);
    const url = `${process.env.DINGG_API_URL}/vendor/sales-order/${params.id}?vendor_location_uuid=${params.vendor_location_uuid}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        customer_uuid
      },
      timeout: 15000
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Get Order Detail Error:', error.response?.data || error.message);
    throw error;
  }
}

// ---------------------- Get Payment Status ----------------------
export async function getPaymentStatus(
  params: GetPaymentStatusRequest,
  token: string
): Promise<PaymentStatusResponse> {
  try {
    const customer_uuid = await getCustomerUuid(token);
    const url = `${process.env.DINGG_API_URL}/vendor/sales-order/${params.order_uuid}/payment-status?vendor_location_uuid=${params.vendor_location_uuid}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        customer_uuid
      },
      timeout: 10000
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Get Payment Status Error:', error.response?.data || error.message);
    throw error;
  }
}

// ---------------------- Cancel Order ----------------------
export async function cancelOrder(
  params: CancelOrderRequest,
  token: string
): Promise<CancelOrderResponse> {
  try {
    const url = `${process.env.DINGG_API_URL}/vendor/sales-order/online/${params.uuid}?vendor_location_uuid=${params.vendor_location_uuid}`;

    const response = await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      timeout: 15000
    });

    if (response.status === 200) {
      // Check if the response status is false
      if (response.data && response.data.status === false) {
        throw new Error(response.data.message || 'Failed to cancel order');
      }
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Cancel Order Error:', error.response?.data || error.message);
    throw error;
  }
}

// ---------------------- Calculate Summary ----------------------
export async function calculateSummary(
  data: CalculateSummaryRequest,
  token: string
): Promise<CalculateSummaryResponse> {
  try {
    const customer_uuid = await getCustomerUuid(token);
    const url = `${process.env.DINGG_API_URL}/user/calculate-summary`;

    const payload = {
      vendor_location_uuid: data.vendor_location_uuid,
      order_type: data.order_type,
      sales_order_date: data.sales_order_date,
      products: data.products
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        customer_uuid
      },
      timeout: 10000
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Calculate Summary Error:', error.response?.data || error.message);
    throw error;
  }
}