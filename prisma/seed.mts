import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 模擬的測試用戶
const TEST_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
};

async function main() {
  // 清除現有數據
  await prisma.note.deleteMany();

  // 創建測試筆記
  const notes = [
    {
      title: '測試筆記 1',
      content: '這是第一個測試筆記的內容。',
      tags: ['測試', '筆記'],
      website: 'https://example.com',
      color: '#FFE4E1',
      position: { x: 100, y: 100 },
      userId: TEST_USER.id,
      userEmail: TEST_USER.email,
    },
    {
      title: 'JavaScript 學習筆記',
      content: '今天學習了 Promise 和 async/await。',
      tags: ['JavaScript', '學習'],
      website: 'https://javascript.info',
      color: '#E6E6FA',
      position: { x: 200, y: 200 },
      userId: TEST_USER.id,
      userEmail: TEST_USER.email,
    },
    {
      title: 'React 組件設計',
      content: '組件設計的最佳實踐和常見模式。',
      tags: ['React', '前端'],
      website: 'https://reactjs.org',
      color: '#F0FFF0',
      position: { x: 300, y: 300 },
      userId: TEST_USER.id,
      userEmail: TEST_USER.email,
    },
  ];

  for (const note of notes) {
    await prisma.note.create({
      data: note,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
