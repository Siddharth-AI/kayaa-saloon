import { NextRequest } from 'next/server';
import { getLocations, getBusinessInfo } from '@/services/dingg-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingPage = searchParams.get('booking_page') || 'stylo-hadapsar';
    
    const result = await getLocations(bookingPage);
    return responseHandler(messages.record_found, true, result);
  } catch (error: any) {
    return errorHandler(error.message || 'Failed to fetch locations', error);
  }
}
