import { NextRequest } from 'next/server';
import { getPaymentCards } from '@/services/payment-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const merchant_uuid = searchParams.get('merchant_uuid');
    
    if (!merchant_uuid) {
      return errorHandler('merchant_uuid is required in query params');
    }
    
    const token = request.headers.get('authorization');
    if (!token) {
      return errorHandler('Authorization token is required');
    }

    const result = await getPaymentCards({ merchant_uuid }, token);
    return responseHandler('Payment cards retrieved successfully', true, result);
  } catch (error: any) {
    return errorHandler(error.message || 'Failed to get payment cards', error);
  }
}