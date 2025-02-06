import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const testNotes = [
    {
      title: 'Welcome to Web Notes!',
      content: 'This is your first note. You can create, edit, and organize your notes here.',
      tags: ['welcome', 'getting-started'],
      website: 'web-note.app',
      color: 'yellow',
      position: { x: 100, y: 100 }
    },
    {
      title: 'Markdown Support',
      content: '# You can use markdown\n\n- Make lists\n- **Bold text**\n- *Italic text*\n\nAnd much more!',
      tags: ['markdown', 'tutorial'],
      website: 'github.com',
      color: 'blue',
      position: { x: 300, y: 150 }
    },
    {
      title: 'Development Tasks',
      content: '1. Implement search functionality\n2. Add tag filtering\n3. Improve UI/UX\n4. Add dark mode',
      tags: ['development', 'todo'],
      website: 'localhost:5173',
      color: 'pink',
      position: { x: 500, y: 200 }
    }
  ];

  console.log('Creating seed data...');
  
  for (const note of testNotes) {
    try {
      await prisma.note.create({
        data: note
      });
      console.log(`Created note: ${note.title}`);
    } catch (error) {
      console.error(`Error creating note ${note.title}:`, error);
    }
  }

  console.log('Seed data creation completed!');
}

main()
  .catch((e) => {
    console.error('Error in seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
