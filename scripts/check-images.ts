import fs from 'fs';
import path from 'path';

async function run() {
  const dbPath = path.join(process.cwd(), 'public', 'database.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  
  let missing = 0;
  for (const q of db) {
    if (q.imageUrl) {
      const imgPath = path.join(process.cwd(), 'public', q.imageUrl);
      if (!fs.existsSync(imgPath)) {
        console.error(`Missing image: ${q.imageUrl} for question ${q.id}`);
        missing++;
      }
    }
  }
  
  console.log(`Total missing images: ${missing}`);
}

run();
