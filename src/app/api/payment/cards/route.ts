import { NextRequest } from 'next/server';
import { getPaymentForm } from '@/services/payment-service';
import { validateJSON } from '@/lib/validate';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { GetPaymentFormRequest } from '@/lib/types';
import { messages } from '@/lib/messages';
import Joi from 'joi';

const getPaymentFormSchema = Joi.object({
  merchant_uuid: Joi.string().required().label('Merchant UUID')
});

export async function POST(request: NextRequest) {
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

    const result = await getPaymentForm({ merchant_uuid }, token);
    return responseHandler('Payment form retrieved successfully', true, result);
  } catch (error: any) {
    return errorHandler(error.message || 'Failed to get payment form', error);
  }
}