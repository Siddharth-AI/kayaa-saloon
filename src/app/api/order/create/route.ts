import { NextRequest } from 'next/server';
import { createOrder } from '@/services/order-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { createOrderSchema } from '@/lib/schemas';
import { CreateOrderRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // Get auth token from headers
    const userToken = req.headers.get('authorization');
    if (!userToken) {
      return errorHandler('Authorization token is required');
    }

    // Validate request body
    const body = await validateJSON<CreateOrderRequest>(req, createOrderSchema);

    // Call the service function
    const result = await createOrder(body, userToken);

    return responseHandler(messages.record_created, true, result);
  } catch (error: any) {
    // Handle validation errors thrown as Response objects
    if (error instanceof Response) {
      return error;
    }

    // Handle axios errors with full response data
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create order';
    const errorData = error.response?.data || null;

    return errorHandler(errorMessage, errorData);
  }
}
