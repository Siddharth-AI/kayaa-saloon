import { NextRequest } from 'next/server';
import { getProducts } from '@/services/dingg-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';

export async function GET(req: NextRequest,
  context: any) {
  try {
    // Check if context and params exist
    if (!context || !context.params) {
      return errorHandler('Invalid request context');
    }

    // Extract businessId from the dynamic route parameter
    const { businessId } = await context.params;

    // Validate businessId
    if (!businessId || businessId.trim() === '') {
      return errorHandler('Business ID is required');
    }

    const result = await getProducts(businessId);
    return responseHandler(messages.record_found, true, result);
  } catch (error: any) {
    return errorHandler(error.message || 'Failed to fetch locations', error);
  }
}
