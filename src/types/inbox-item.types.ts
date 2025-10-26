export type InboxItem = {
    id: string;
    subject: string;
    sender: string;
    receivedAt: Date;
    isRead: boolean;
};