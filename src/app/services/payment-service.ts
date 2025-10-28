import axios from 'axios';
import { GetPaymentFormRequest, GetPaymentFormResponse } from '../lib/types';

export async function getPaymentForm(data: GetPaymentFormRequest, token: string): Promise<GetPaymentFormResponse> {
  try {
    const url = `${process.env.DINGG_API_URL}/user/cards?merchant_uuid=${data.merchant_uuid}`;

    const cleanToken = token.replace('Bearer ', '');
    
    const response = await axios.post(url, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanToken}`
      }
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Get Payment Form Error:', error.response?.data || error.message);
    throw error;
  }
}

export async function getPaymentCards(data: GetPaymentFormRequest, token: string) {
  try {
    const url = `${process.env.DINGG_API_URL}/user/cards?merchant_uuid=${data.merchant_uuid}`;

    const cleanToken = token.replace('Bearer ', '');
    
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanToken}`
      }
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Get Payment Cards Error:', error.response?.data || error.message);
    throw error;
  }
}