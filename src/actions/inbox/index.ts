import { mockInboxData } from "@/lib/services/mockdata/inbox";
import { ActionResponse } from "@/types/action-response-interfaces";
import { InboxItem } from "@/types/inbox-item.types";

export const getInboxData = async (): Promise<ActionResponse<InboxItem[]>> => {
    // Simulate an API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
        success: true,
        data: mockInboxData,
    };
};

