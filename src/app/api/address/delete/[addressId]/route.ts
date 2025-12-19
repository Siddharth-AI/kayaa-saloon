import { NextRequest } from 'next/server';
import { deleteAddress } from '@/services/address-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { deleteAddressSchema } from '@/lib/schemas';

interface DeleteAddressRequest {
  vendor_location_uuid: string;
}

export async function DELETE(
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
    const body = await validateJSON<DeleteAddressRequest>(req, deleteAddressSchema);
    const { vendor_location_uuid } = body;

    // Call the service function
    await deleteAddress(addressId, vendor_location_uuid, userToken);

    return responseHandler(messages.record_deleted, true);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    return errorHandler(
      error.message || 'Failed to delete address',
      error
    );
  }
}