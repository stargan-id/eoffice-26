"use server";

import { db } from "@/lib/db";
export const getSignRequests = async () => {
  try {
    const result = await db.signRequest.findMany({});
    return result;
  } catch (e) {
    console.log("Error fetching sign requests:", e);
    throw new Error("Failed to fetch sign requests");
  }
};
