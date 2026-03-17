import fs from 'fs';
import path from 'path';

const DB_URL = 'https://raw.githubusercontent.com/Ed0ardo/QuizPatenteB/master/quizPatenteB2023.json';
const IMG_BASE_URL = 'https://raw.githubusercontent.com/Ed0ardo/QuizPatenteB/master';

async function fetchDatabase() {
  console.log('Fetching official database...');
  const res = await fetch(DB_URL);
  const data = await res.json();
  
  const questions = [];
  const imagesToDownload = new Set<string>();
  
  let idCounter = 1;
  
  for (const category of Object.keys(data)) {
    for (const topic of Object.keys(data[category])) {
      for (const q of data[category][topic]) {
        const qId = `q_${idCounter.toString().padStart(4, '0')}`;
        idCounter++;
        
        let imageUrl = undefined;
        if (q.img) {
          imagesToDownload.add(q.img);
          // q.img is like '/img_sign/550.png'
          imageUrl = `/images/segnali${q.img.replace('/img_sign', '')}`;
        }
        
        questions.push({
          id: qId,
          text: q.q,
          answer: q.a,
          category: category,
          imageUrl: imageUrl,
          explanation: `Argomento: ${topic.replace(/-/g, ' ')}`
        });
      }
    }
  }
  
  const dbPath = path.join(process.cwd(), 'public', 'database.json');
  fs.writeFileSync(dbPath, JSON.stringify(questions, null, 2));
  console.log(`✅ Saved ${questions.length} questions to public/database.json`);
  
  // Download images
  const imgDir = path.join(process.cwd(), 'public', 'images', 'segnali');
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
  }
  
  console.log(`Downloading ${imagesToDownload.size} images...`);
  const imgArray = Array.from(imagesToDownload);
  
  // Download in batches of 20
  for (let i = 0; i < imgArray.length; i += 20) {
    const batch = imgArray.slice(i, i + 20);
    await Promise.all(batch.map(async (img) => {
      const fileName = path.basename(img);
      const filePath = path.join(imgDir, fileName);
      if (!fs.existsSync(filePath)) {
        try {
          const imgRes = await fetch(`${IMG_BASE_URL}${img}`);
          if (imgRes.ok) {
            const buffer = await imgRes.arrayBuffer();
            fs.writeFileSync(filePath, Buffer.from(buffer));
          }
        } catch (e) {
          console.error(`Failed to download ${img}`, e);
        }
      }
    }));
    process.stdout.write(`\rDownloaded ${Math.min(i + 20, imgArray.length)}/${imgArray.length} images`);
  }
  console.log('\n✅ All images downloaded.');
}

fetchDatabase();
