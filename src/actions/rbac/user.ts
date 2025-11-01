import {
  getUserEmailsByPrefix as getUserEmailByPrefixService,
  getUserEmailsByIds as getUserEmailsByIdsService,
} from '@/lib/services/rbac/user';
import { ActionResponse } from '@/types/action-response.types';

export const getUserEmailsByIds = async (
  ids: string[]
): Promise<{ id: string; email: string }[]> => {
  try {
    // You must implement getUserEmailsByIdsService in your services layer
    return await getUserEmailsByIdsService(ids);
  } catch (e) {
    console.log('Error fetching user emails by ids:', e);
    return [];
  }
};

export const getUserEmailsByPrefix = async (
  prefix: string
): Promise<ActionResponse<{ email: string; id: string }[]>> => {
  try {
    const result = await getUserEmailByPrefixService(prefix);
    return {
      success: true,
      data: result,
    };
  } catch (e) {
    console.log('Error fetching user emails by prefix:', e);
    throw new Error('Failed to fetch user emails');
  }
};
