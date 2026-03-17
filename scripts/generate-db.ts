import fs from 'fs';
import path from 'path';
import { quizDatabase } from '../src/data/questions.js';

const dbPath = path.join(process.cwd(), 'public', 'database.json');

fs.writeFileSync(dbPath, JSON.stringify(quizDatabase, null, 2));

console.log(`Successfully generated database.json with ${quizDatabase.length} questions.`);
