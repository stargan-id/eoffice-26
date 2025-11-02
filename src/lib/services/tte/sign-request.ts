'use server';

import { db } from '@/lib/db';
import { SignRequest, SignRequestForUser } from '@/types/tte/sign-request';
import { SigningStatus } from '@prisma/client';
export const getSignRequests = async (): Promise<SignRequest[]> => {
  try {
    const result = await db.signRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        signatory: {
          select: {
            id: true,
            userId: true,
            status: true,
            signedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return result;
  } catch (e) {
    console.log('Error fetching sign requests:', e);
    throw new Error('Failed to fetch sign requests');
  }
};

export const getSignRequestsByUser = async (
  userId: string
): Promise<SignRequest[]> => {
  try {
    const result = await db.signRequest.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        signatory: {
          select: {
            id: true,
            userId: true,
            status: true,
            signedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return result;
  } catch (e) {
    console.log('Error fetching sign requests for user:', e);
    throw new Error('Failed to fetch sign requests for user');
  }
};

/**
 * Mengambil semua SignRequest yang userId adalah owner atau signatory
 */
export const getSignRequestsByOrForUser = async (
  userId: string
): Promise<SignRequest[]> => {
  try {
    // Ambil sign requests dimana user adalah owner
    const ownedRequests = await db.signRequest.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        signatory: {
          select: {
            id: true,
            userId: true,
            status: true,
            signedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Ambil sign requests dimana user adalah signatory
    const signatoryRequests = await db.signRequest.findMany({
      where: {
        signatory: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        signatory: {
          select: {
            id: true,
            userId: true,
            status: true,
            signedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Gabungkan dan hapus duplikat berdasarkan id
    const allRequests = [...ownedRequests, ...signatoryRequests];
    const uniqueRequests = allRequests.filter(
      (request, index, self) =>
        index === self.findIndex((r) => r.id === request.id)
    );

    return uniqueRequests;
  } catch (e) {
    console.log('Error fetching sign requests by or for user:', e);
    throw new Error('Failed to fetch sign requests by or for user');
  }
};

/**
 * Mengambil semua SignRequest yang userId adalah signatory (dimintai tanda tangan)
 */
export const getSignRequestsForUser = async (
  userId: string
): Promise<SignRequestForUser[]> => {
  try {
    // Cari semua signatory dengan userId, lalu ambil signRequest-nya
    const signatories = await db.signatory.findMany({
      where: { userId },
      include: {
        signRequest: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });
    // Map ke SignRequestForUser
    const signRequests: SignRequestForUser[] = signatories
      .filter((s) => !!s.signRequest)
      .map((s) => ({
        ...s.signRequest,
        user: s.signRequest.user,
        signatory: {
          id: s.id,
          userId: s.userId,
          status: s.status,
          signedAt: s.signedAt,
        },
      }));
    return signRequests;
  } catch (e) {
    console.log('Error fetching sign requests for user:', e);
    throw new Error('Failed to fetch sign requests for user');
  }
};

export const getSignRequestForUser = async (
  userId: string,
  signRequestId: string
): Promise<SignRequestForUser | null> => {
  try {
    const signatory = await db.signatory.findFirst({
      where: { userId, signReqId: signRequestId },
      include: {
        signRequest: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
    if (!signatory || !signatory.signRequest) {
      return null;
    }
    const signRequest: SignRequestForUser = {
      ...signatory.signRequest,
      user: signatory.signRequest.user,
      signatory: {
        id: signatory.id,
        userId: signatory.userId,
        status: signatory.status,
        signedAt: signatory.signedAt,
      },
    };
    return signRequest;
  } catch (e) {
    console.log('Error fetching sign request for user:', e);
    throw new Error('Failed to fetch sign request for user');
  }
};

export const getSignRequestById = async (
  signRequestId: string
): Promise<SignRequest | null> => {
  try {
    const signRequest = await db.signRequest.findUnique({
      where: { id: signRequestId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        signatory: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            status: true,
            signedAt: true,
          },
        },
      },
    });
    return signRequest;
  } catch (e) {
    console.log('Error fetching sign request by id:', e);
    throw new Error('Failed to fetch sign request by id');
  }
};

export async function updateSignatoryStatus(
  signatoryId: string,
  newStatus: SigningStatus,
  signedFileUrl?: string
): Promise<{ signedCount: number; totalCount: number }> {
  return await db.$transaction(async (tx) => {
    // 1. Update signatory status to SIGNED
    const signatory = await tx.signatory.update({
      where: { id: signatoryId },
      data: { status: newStatus, signedAt: new Date() },
    });

    // 2. Find all signatories for this signRequestId
    const allSignatories = await tx.signatory.findMany({
      where: { signReqId: signatory.signReqId },
    });

    // 3. Count signed signatories
    const signedCount = allSignatories.filter(
      (s) => s.status === 'SIGNED'
    ).length;
    const totalCount = allSignatories.length;

    // 4. If all are signed, update SignRequest
    if (signedCount === totalCount && totalCount > 0) {
      await tx.signRequest.update({
        where: { id: signatory.signReqId },
        data: {
          status: 'COMPLETED',
          completion: `${signedCount}/${totalCount}`,
          signedFileUrl: signedFileUrl,
        },
      });
    } else {
      // Optionally, update completion field even if not all signed
      await tx.signRequest.update({
        where: { id: signatory.signReqId },
        data: {
          completion: `${signedCount}/${totalCount}`,
          signedFileUrl: signedFileUrl,
        },
      });
    }

    return { signedCount, totalCount };
  });
}
