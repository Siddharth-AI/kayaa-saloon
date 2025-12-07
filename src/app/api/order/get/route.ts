import { NextRequest } from 'next/server';
import { getOrders } from '@/services/order-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { getOrdersSchema } from '@/lib/schemas';
import { GetOrdersRequest } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    // Get auth token from headers
    const userToken = req.headers.get('authorization');
    if (!userToken) {
      return errorHandler('Authorization token is required');
    }

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const queryParams: GetOrdersRequest = {
      vendor_location_uuid: searchParams.get('vendor_location_uuid') || '',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    };

    // Validate query parameters
    const { error } = getOrdersSchema.validate(queryParams);
    if (error) {
      return errorHandler(error.details[0].message);
    }

    // Call the service function
    const result = await getOrders(queryParams, userToken);

    return responseHandler(messages.record_found, true, result);
  } catch (error: any) {
    // Handle axios errors with full response data
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
    const errorData = error.response?.data || null;

    return errorHandler(errorMessage, errorData);
  }
}
