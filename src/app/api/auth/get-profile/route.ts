import { NextRequest } from 'next/server';
import { getProfile } from '@/services/auth-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');

    if (!token) {
      return errorHandler('Authorization token is required', null, 401);
    }

    const result = await getProfile(token);
    return responseHandler(messages.user.profile_found, true, result);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'Failed to fetch profile';
    console.log('=?>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', message)
    console.log('=?>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', status)
    return errorHandler(message, null, status);
  }
}
