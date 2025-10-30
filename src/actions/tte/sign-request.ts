import { getSignRequests as getSignRequestsService } from "@/lib/services/tte";
import { ActionResponse } from "@/types/action-response.types";
import { SignRequest } from "@prisma/client";

export const getSignRequests = async (): Promise<
  ActionResponse<SignRequest[]>
> => {
  // implementasi pengambilan daftar sign request dari backend
  try {
    const result = await getSignRequestsService();
    return {
      success: true,
      data: result,
    };
  } catch (e) {
    console.log("Error fetching sign requests:", e);
    return {
      success: false,
      error: "Failed to fetch sign requests",
    };
  }
};

export default getSignRequests;
