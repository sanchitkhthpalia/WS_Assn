const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Passw0rd!', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN'
    }
  });

  console.log('Admin user created:', admin.email);

  // Generate initial slots for the next 7 days
  const slots = [];
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    
    // Skip weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      continue;
    }
    
    // Generate 30-minute slots from 9:00 to 17:00
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startAt = new Date(currentDate);
        startAt.setHours(hour, minute, 0, 0);
        
        const endAt = new Date(startAt);
        endAt.setMinutes(endAt.getMinutes() + 30);
        
        // Skip slots in the past
        if (startAt <= now) {
          continue;
        }
        
        slots.push({
          startAt,
          endAt
        });
      }
    }
  }

  // Create slots in database (check for existing slots first)
  if (slots.length > 0) {
    const existingSlots = await prisma.slot.count();
    if (existingSlots === 0) {
      await prisma.slot.createMany({
        data: slots
      });
      console.log(`Created ${slots.length} slots`);
    } else {
      console.log('Slots already exist, skipping slot creation');
    }
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
