import { NextResponse } from 'next/server';

interface ApiResponse {
  status: boolean;
  message: string;
  data?: any;
  total?: number;
  fromCache?: boolean;
}

export function responseHandler(
  message: string,
  status: boolean = false,
  data: any = null,
  httpStatus: number = 200
): NextResponse<ApiResponse> {
  const resObject: ApiResponse = {
    status: status,
    message: message,
    fromCache: false,
  };

  if (status && data) {
    if (data.total) {
      resObject.data = data.data;
      resObject.total = data.total;
    } else {
      resObject.data = data;
    }
  }

  return NextResponse.json(resObject, { status: httpStatus });
}

export function errorHandler(message: string, error?: any, httpStatus: number = 500): NextResponse<ApiResponse> {
  console.error('API Error:', error);
  return responseHandler(message, false, null, httpStatus);
}
