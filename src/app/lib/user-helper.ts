import { getProfile } from '@/services/auth-service';
import { DinggHeaders } from './types';

export async function getCustomerUuid(token: string): Promise<string> {
  const userData = await getProfile(token) as any;
  const customer_uuid = userData?.data?.user?.uuid;

  if (!customer_uuid) {
    throw new Error('Customer UUID not found,User authentication required');
  }

  return customer_uuid;
}