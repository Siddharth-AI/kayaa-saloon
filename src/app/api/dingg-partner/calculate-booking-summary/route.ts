import { NextRequest } from 'next/server';
import { calculateBookingSummary } from '@/services/dingg-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';

export async function POST(req: NextRequest) {
  try {
    // Get auth token from headers
    const userToken = req.headers.get('authorization');
    if (!userToken) {
      return errorHandler('Authorization token is required');
    }

    // Parse request body
    const body = await req.json();

    // Call the service function
    const result = await calculateBookingSummary(body, userToken);

    return responseHandler(messages.record_found || 'Booking summary calculated successfully', true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    // Handle axios errors with full response data
    const errorMessage = error.response?.data?.message || error.message || 'Failed to calculate booking summary';
    const errorData = error.response?.data || null;

    return errorHandler(errorMessage, errorData);
  }
}

