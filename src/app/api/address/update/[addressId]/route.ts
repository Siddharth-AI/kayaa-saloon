import { NextRequest } from 'next/server';
import { updateAddress } from '@/services/address-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { updateAddressSchema } from '@/lib/schemas';
import { UpdateAddressRequest } from '@/lib/types';

export async function PUT(
  req: NextRequest,
  context: any
) {
  try {
    // Get auth token from headers
    const userToken = req.headers.get('authorization');
    if (!userToken) {
      return errorHandler('Authorization token is required');
    }

    // Extract addressId from the dynamic route parameter
    const { addressId } = await context.params;

    // Validate addressId
    if (!addressId || addressId.trim() === '') {
      return errorHandler('Address ID is required');
    }

    // Validate request body
    const body = await validateJSON<UpdateAddressRequest>(req, updateAddressSchema);

    // Call the service function
    const result = await updateAddress(addressId, body, userToken);

    return responseHandler(messages.record_updated, true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    return errorHandler(
      error.message || 'Failed to update address',
      error
    );
  }
}