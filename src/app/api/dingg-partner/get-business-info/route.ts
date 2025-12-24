import { NextRequest } from 'next/server';
import { getBusinessInfo } from '@/services/dingg-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingPage = searchParams.get('booking_page');
    
    if (!bookingPage) {
      return errorHandler('booking_page parameter is required', null);
    }
    
    const result = await getBusinessInfo(bookingPage);
    return responseHandler(messages.record_found, true, result);
  } catch (error: any) {
    return errorHandler(error.message || 'Failed to fetch business info', error);
  }
}

