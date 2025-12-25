import { NextRequest } from 'next/server';
import { calculateBookingSummary } from '@/services/dingg-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';

export async function POST(req: NextRequest) {
  try {
    // Get auth token from headers
    let userToken = req.headers.get('authorization');
    if (!userToken) {
      return errorHandler('Authorization token is required');
    }

    // Remove 'Bearer ' prefix if present
    userToken = userToken.replace(/^Bearer\s+/i, '');

    // Parse request body
    const body = await req.json();

    // Validate required fields
    if (!body.vendor_location_uuid) {
      return errorHandler('vendor_location_uuid is required');
    }
    if (!body.booking_date) {
      return errorHandler('booking_date is required');
    }
    if (!body.services || !Array.isArray(body.services) || body.services.length === 0) {
      return errorHandler('services array is required and must not be empty');
    }

    // Validate services array structure
    for (let i = 0; i < body.services.length; i++) {
      const service = body.services[i];
      if (!service.service_id) {
        return errorHandler(`Service at index ${i} is missing service_id`);
      }
      if (service.start_time === undefined || service.start_time === null) {
        return errorHandler(`Service at index ${i} is missing start_time`);
      }
      if (service.end_time === undefined || service.end_time === null) {
        return errorHandler(`Service at index ${i} is missing end_time`);
      }
      // Validate that start_time and end_time are numbers
      if (typeof service.start_time !== 'number' || typeof service.end_time !== 'number') {
        return errorHandler(`Service at index ${i} has invalid start_time or end_time (must be numbers)`);
      }
      // Validate that end_time > start_time
      if (service.end_time <= service.start_time) {
        return errorHandler(`Service at index ${i} has invalid time range (end_time must be greater than start_time)`);
      }
    }

    // Log the payload for debugging (remove sensitive data in production)
    console.log('calculateBookingSummary request payload:', {
      vendor_location_uuid: body.vendor_location_uuid,
      booking_date: body.booking_date,
      services_count: body.services.length,
      services: body.services.map((s: any) => ({
        service_id: s.service_id,
        start_time: s.start_time,
        end_time: s.end_time,
        employee_id: s.employee_id
      }))
    });

    // Call the service function
    const result = await calculateBookingSummary(body, userToken);

    return responseHandler(messages.record_found || 'Booking summary calculated successfully', true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    // Log full error details for debugging
    console.error('calculateBookingSummary API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });

    // Handle axios errors with full response data
    const errorMessage = error.response?.data?.message || error.message || 'Failed to calculate booking summary';
    const errorData = error.response?.data || null;

    // Return more specific error message
    return errorHandler(errorMessage, errorData);
  }
}

