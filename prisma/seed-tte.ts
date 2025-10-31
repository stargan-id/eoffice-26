import { db } from '@/lib/db';
import { faker } from '@faker-js/faker';

async function main() {
  // Create a user for the sign requests
  const user = await db.user.upsert({
    where: { email: 'signer@example.com' },
    update: {},
    create: {
      name: 'Signer User',
      email: 'signer@example.com',
      password: 'password',
      status: 'ACTIVE',
    },
  });

  // Create multiple sign requests and signatories
  for (let i = 0; i < 10000; i++) {
    const signRequest = await db.signRequest.create({
      data: {
        subject: faker.lorem.sentence(),
        message: faker.lorem.paragraph(),
        notes: faker.lorem.words(3),
        userId: user.id,
        fileUrl: faker.internet.url(),
        status: 'PENDING',
        completion: `0/1`,
      },
    });

    // Create 1-3 signatories per sign request
    const allUsers = await db.user.findMany();
    const signatoryCount = Math.min(
      faker.number.int({ min: 1, max: 3 }),
      allUsers.length
    );
    // Ambil user random tanpa duplikat
    const shuffledUsers = faker.helpers
      .shuffle(allUsers)
      .slice(0, signatoryCount);
    for (let j = 0; j < signatoryCount; j++) {
      const randomUser = shuffledUsers[j];
      await db.signatory.create({
        data: {
          signReqId: signRequest.id,
          ordinal: j + 1,
          userId: randomUser.id,
          status: 'WAITING',
          signVisibility: 'VISIBLE',
          notes: faker.lorem.words(2),
        },
      });
    }
  }

  console.log('Seeded multiple sign requests and signatories.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
