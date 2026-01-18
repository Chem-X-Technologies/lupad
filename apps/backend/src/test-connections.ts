import { prisma } from './lib/prisma.js';
import redis from './lib/redis.js';

async function testConnections() {
  console.log('🧪 Testing database connections...\n');

  try {
    // Test Prisma/PostgreSQL
    console.log('Testing PostgreSQL connection...');
    await prisma.$connect();
    const userCount = await prisma.user.count();
    console.log('✅ PostgreSQL connected successfully');
    console.log(`   Current user count: ${userCount}\n`);

    // Test Redis
    console.log('Testing Redis connection...');
    await redis.set('test:connection', 'success');
    const testValue = await redis.get('test:connection');
    await redis.del('test:connection');
    console.log('✅ Redis connected successfully');
    console.log(`   Test value retrieved: ${testValue}\n`);

    console.log('🎉 All connections working!');
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await redis.quit();
    process.exit(0);
  }
}

testConnections();
