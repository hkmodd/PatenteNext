const fs = require('fs');
const path = require('path');

const dbPath = './public/theory-database.json';
const outDir = './public/db-shards';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const manifest = {
  version: "2026.1.0",
  updatedAt: new Date().toISOString(),
  chapters: []
};

for (const key in db) {
  const chapter = db[key];
  
  // Add to manifest
  manifest.chapters.push({
    id: key,
    title: chapter.title,
    icon: chapter.icon,
    description: chapter.description,
    tags: chapter.tags || [],
    difficulty: chapter.difficulty || 'MEDIUM',
    sectionCount: chapter.sections ? chapter.sections.length : 0
  });

  // Write individual shard
  fs.writeFileSync(
    path.join(outDir, `${key}.json`),
    JSON.stringify(chapter)
  );
}

// Write manifest
fs.writeFileSync(
  path.join(outDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log(`Database successfully sharded into ${manifest.chapters.length} chunks!`);
