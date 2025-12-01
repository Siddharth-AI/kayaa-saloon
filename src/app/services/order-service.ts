import axios from 'axios';
import { CreateOrderRequest, CreateOrderResponse, GetOrdersRequest, GetOrdersResponse } from '../lib/types';
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
