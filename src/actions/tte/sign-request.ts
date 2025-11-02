'use server';
import { auth } from '@/auth';
import {
  getSignRequestForUser as getSignRequestForUserService,
  getSignRequestsByOrForUser as getSignRequestsByOrForUserService,
  getSignRequestsForUser as getSignRequestsForUserService,
} from '@/lib/services/tte';
import { ActionResponse } from '@/types/action-response.types';
import { SignRequest, SignRequestForUser } from '@/types/tte/sign-request';

export const getSignRequestsForUser = async (): Promise<
  ActionResponse<SignRequestForUser[]>
> => {
  // implementasi pengambilan daftar sign request dari backend

  const session = await auth();
  if (!session?.user)
    return {
      success: false,
      error: 'Unauthorized',
    };

  console.log('Fetching sign requests for user:', session.user);

  try {
    const result = await getSignRequestsForUserService(session.user.id);
    return {
      success: true,
      data: result,
    };
  } catch (e) {
    console.log('Error fetching sign requests:', e);
    return {
      success: false,
      error: 'Failed to fetch sign requests',
    };
  }
};

export const getSignRequestForUser = async (
  userId: string,
  signRequestId: string
): Promise<ActionResponse<SignRequestForUser | null>> => {
  try {
    const result = await getSignRequestForUserService(userId, signRequestId);
    if (result) {
      return {
        success: true,
        data: result,
      };
    }
  } catch (e) {
    console.log('Error fetching sign request for user:', e);
    return {
      success: false,
      error: 'Failed to fetch sign request for user',
    };
  }
  return {
    success: true,
    data: null,
  };
};

export const getSignRequestsByOrForUser = async (): Promise<
  ActionResponse<SignRequest[]>
> => {
  // implementasi pengambilan daftar sign request dari backend

  const session = await auth();
  if (!session?.user)
    return {
      success: false,
      error: 'Unauthorized',
    };

  console.log('Fetching sign requests by or for user:', session.user);

  try {
    const result = await getSignRequestsByOrForUserService(session.user.id);
    return {
      success: true,
      data: result,
    };
  } catch (e) {
    console.log('Error fetching sign requests by or for user:', e);
    return {
      success: false,
      error: 'Failed to fetch sign requests',
    };
  }
};
