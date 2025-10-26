import { InboxItem } from '@/types/inbox-item.types';
import { faker } from '@faker-js/faker';


export const mockInboxData: InboxItem[] = Array.from({ length: 30 }, () => ({
    id: faker.string.uuid(),
    sender: faker.person.fullName(),
    subject: faker.lorem.sentence({ min: 10, max: 30 }),
    body: faker.lorem.paragraph(),
    receivedAt: faker.date.recent(),
    status: faker.helpers.arrayElement(['read', 'unread']),
}));