'use server';
import { db } from '@/lib/db';

/**
 * Get user emails by prefix (autocomplete)
 * @param prefix string
 * @returns string[]
 */
const getUserEmailsByPrefix = async (
  prefix: string
): Promise<{ email: string; id: string }[]> => {
  if (!prefix || typeof prefix !== 'string' || prefix.length < 3) {
    return [];
  }
  try {
    const users = await db.user.findMany({
      where: {
        email: {
          startsWith: prefix,
        },
      },
      select: {
        email: true,
        id: true,
      },
      take: 25, // batasi hasil untuk performa
    });
    return users.map((user) => {
      return {
        email: user.email,
        id: user.id,
      };
    });
  } catch (e) {
    console.error('Error fetching user emails by prefix:', e);
    return [];
  }
};

/**
 * Get user emails by array of IDs
 * @param ids string[]
 * @returns { email: string; id: string }[]
 */
const getUserEmailsByIds = async (
  ids: string[]
): Promise<{ email: string; id: string }[]> => {
  if (!Array.isArray(ids) || ids.length === 0) {
    return [];
  }
  try {
    const users = await db.user.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        email: true,
        id: true,
      },
    });
    return users.map((user) => ({ email: user.email, id: user.id }));
  } catch (e) {
    console.error('Error fetching user emails by ids:', e);
    return [];
  }
};

export { getUserEmailsByIds, getUserEmailsByPrefix };
