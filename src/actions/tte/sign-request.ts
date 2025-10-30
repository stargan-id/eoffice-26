import { getSignRequestsForUser } from "@/lib/services/tte";
import { ActionResponse } from "@/types/action-response.types";
import { SignRequestForUser } from "@/types/tte/sign-request";

const mockForUserId = "cmhdeyczf00009ycw4hahy4sh";

export const getSignRequests = async (): Promise<
  ActionResponse<SignRequestForUser[]>
> => {
  // implementasi pengambilan daftar sign request dari backend
  try {
    const result = await getSignRequestsForUser(mockForUserId);
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
