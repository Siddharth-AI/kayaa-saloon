import { NextRequest } from 'next/server';
import { calculateSummary } from '@/services/order-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { calculateSummarySchema } from '@/lib/schemas';
import { CalculateSummaryRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // Get auth token from headers
    const userToken = req.headers.get('authorization');
    if (!userToken) {
      return errorHandler('Authorization token is required');
    }

    // Validate request body
    const body = await validateJSON<CalculateSummaryRequest>(req, calculateSummarySchema);

    // Call the service function
    const result = await calculateSummary(body, userToken);

    return responseHandler(messages.record_found, true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) {
      return error;
    }

    // Handle axios errors with full response data
    const errorMessage = error.response?.data?.message || error.message || 'Failed to calculate summary';
    const errorData = error.response?.data || null;
    return errorHandler(errorMessage, errorData);
  }
}
