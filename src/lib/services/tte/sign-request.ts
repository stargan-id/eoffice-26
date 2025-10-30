"use server";

import { db } from "@/lib/db";
import { SignRequest, SignRequestForUser } from "@/types/tte/sign-request";
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
        }
      },
    });
    return result;
  } catch (e) {
    console.log("Error fetching sign requests:", e);
    throw new Error("Failed to fetch sign requests");
  }
};


export const getSignRequestsByUser = async (userId: string): Promise<SignRequest[]> => {
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
        }
      },
    });
    return result;
  } catch (e) {
    console.log("Error fetching sign requests for user:", e);
    throw new Error("Failed to fetch sign requests for user");
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
          status: s.status,
          signedAt: s.signedAt,
        },
      }));
    return signRequests;
  } catch (e) {
    console.log("Error fetching sign requests for user:", e);
    throw new Error("Failed to fetch sign requests for user");
  }
};
