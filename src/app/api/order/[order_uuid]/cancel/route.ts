import { NextRequest } from 'next/server';
import { cancelOrder } from '@/services/order-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';

interface RouteContext {
  params: { order_uuid: string };
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    // Get auth token from headers
    const userToken = req.headers.get('authorization');
    if (!userToken) {
      return errorHandler('Authorization token is required');
    }

    // Extract order_uuid from the dynamic route parameter
    const { order_uuid } = context.params;

    // Validate order_uuid
    if (!order_uuid || order_uuid.trim() === '') {
      return errorHandler('Order UUID is required');
    }

    // Extract vendor_location_uuid from query params
    const { searchParams } = new URL(req.url);
    const vendor_location_uuid = searchParams.get('vendor_location_uuid');

    if (!vendor_location_uuid) {
      return errorHandler('Vendor location UUID is required');
    }

    // Call the service function
    const result = await cancelOrder(
      { uuid: order_uuid, vendor_location_uuid },
      userToken
    );

    return responseHandler('Order cancelled successfully', true, result);
  } catch (error: any) {

    // Handle axios errors with full response data
    const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel order';
    const errorData = error.response?.data || null;
    return errorHandler(errorMessage, errorData);
  }
}
