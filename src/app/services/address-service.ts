import axios from 'axios';
import { CreateAddressRequest, UpdateAddressRequest, GetAddressesRequest } from '../lib/types';
import { getCustomerUuid } from '../lib/user-helper';

export async function createAddress(data: CreateAddressRequest, token: string) {
  try {
    const customer_uuid = await getCustomerUuid(token);
    const url = `${process.env.DINGG_API_URL}/vendor/supplier/order/address`;
    const payload = {
      address_type: data.address_type,
      is_default: false,
      street_address: data.street_address,
      customer_uuid,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      vendor_location_uuid: data.vendor_location_uuid
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Create Address Error:', error.response?.data || error.message);
    throw error;
  }
}

export async function getAddresses(data: GetAddressesRequest, token: string) {
  try {
    const customer_uuid = await getCustomerUuid(token);
    const url = `${process.env.DINGG_API_URL}/vendor/supplier/order/address/all?address_type=${data.address_type}&customer_uuid=${customer_uuid}&vendor_location_uuid=${data.vendor_location_uuid}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Get Addresses Error:', error.response?.data || error.message);
    throw error;
  }
}

export async function updateAddress(addressId: string, data: UpdateAddressRequest, token: string) {
  try {
    const customer_uuid = await getCustomerUuid(token);
    const url = `${process.env.DINGG_API_URL}/vendor/supplier/order/address/${addressId}`;

    const payload = {
      address_type: data.address_type,
      is_default: false,
      street_address: data.street_address,
      customer_uuid,
      id: data.id,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      vendor_location_uuid: data.vendor_location_uuid
    };

    const response = await axios.put(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Update Address Error:', error.response?.data || error.message);
    throw error;
  }
}

export async function deleteAddress(addressId: string, vendor_location_uuid: string, token: string) {
  try {
    const url = `${process.env.DINGG_API_URL}/vendor/supplier/order/address/${addressId}?vendor_location_uuid=${vendor_location_uuid}`;

    const response = await axios.delete(url, {
      headers: {
        'Authorization': token
      }
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Delete Address Error:', error.response?.data || error.message);
    throw error;
  }
}