import { db } from '@/lib/db';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

// Generate 1000 users with natural names, emails, and nips
async function seedUsers(count = 1000) {
  const users = [];
  const hashedPassword = await bcrypt.hash('User@123!', 12);
  for (let i = 1; i <= count; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email({
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(-1)[0],
    });
    const nip = faker.string.numeric(18);
    users.push({
      name,
      email,
      password: hashedPassword,
      nip,
      organisasiId: null, // You can assign a default org if needed
      createdBy: 'system',
    });
  }
  await db.user.createMany({ data: users });
  console.log(`👤 Created ${count} seed users.`);
}

seedUsers(1000)
  .catch((e) => {
    console.error('❌ Error during user seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
