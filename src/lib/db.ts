import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Question } from '../data/questions';

interface PatenteDB extends DBSchema {
  questions: {
    key: string;
    value: Question;
    indexes: { 'by-category': string };
  };
  stats: {
    key: string; // questionId
    value: {
      questionId: string;
      correct: number;
      wrong: number;
      lastAnswered: number; // timestamp
    };
  };
  meta: {
    key: string;
    value: {
      key: string;
      value: any;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<PatenteDB>> | null = null;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<PatenteDB>('patente-next-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('questions')) {
          const questionStore = db.createObjectStore('questions', { keyPath: 'id' });
          questionStore.createIndex('by-category', 'category');
        }
        if (!db.objectStoreNames.contains('stats')) {
          db.createObjectStore('stats', { keyPath: 'questionId' });
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function syncDatabase(questions: Question[]) {
  const db = await getDB();
  const tx = db.transaction('questions', 'readwrite');
  const store = tx.objectStore('questions');
  
  // Clear existing to avoid duplicates or stale data
  await store.clear();
  
  // Batch insert
  for (const q of questions) {
    await store.put(q);
  }
  
  await tx.done;
  
  const metaTx = db.transaction('meta', 'readwrite');
  await metaTx.objectStore('meta').put({ key: 'lastSync', value: Date.now() });
  await metaTx.objectStore('meta').put({ key: 'totalQuestions', value: questions.length });
  await metaTx.done;
}

export async function getRandomQuestions(count: number): Promise<Question[]> {
  const db = await getDB();
  
  // Get all questions to group by category
  const tx = db.transaction('questions', 'readonly');
  const store = tx.objectStore('questions');
  const allQuestions = await store.getAll();
  
  if (allQuestions.length === 0) return [];
  
  const questionsByCategory: Record<string, Question[]> = {};
  allQuestions.forEach(q => {
    if (!questionsByCategory[q.category]) {
      questionsByCategory[q.category] = [];
    }
    questionsByCategory[q.category].push(q);
  });

  const selectedQuestions: Question[] = [];
  const categories = Object.keys(questionsByCategory);
  
  // Shuffle questions within each category
  categories.forEach(cat => {
    questionsByCategory[cat].sort(() => 0.5 - Math.random());
  });

  // Pick 1 from each available category first, then loop
  let catIndex = 0;
  while (selectedQuestions.length < count && categories.length > 0) {
    const currentCatIndex = catIndex % categories.length;
    const cat = categories[currentCatIndex];
    const q = questionsByCategory[cat].pop();
    
    if (q) {
      selectedQuestions.push(q);
      catIndex++;
    } else {
      // Remove category if it has no more questions
      categories.splice(currentCatIndex, 1);
      // Do not increment catIndex, so the next iteration checks the new category at this index
    }
  }

  // Shuffle the final selection
  return selectedQuestions.sort(() => 0.5 - Math.random());
}

export async function getQuestionsByCategory(category: string): Promise<Question[]> {
  const db = await getDB();
  return db.getAllFromIndex('questions', 'by-category', category);
}

export async function updateQuestionStats(questionId: string, isCorrect: boolean) {
  const db = await getDB();
  const tx = db.transaction('stats', 'readwrite');
  const store = tx.objectStore('stats');
  
  let stat = await store.get(questionId);
  if (!stat) {
    stat = { questionId, correct: 0, wrong: 0, lastAnswered: Date.now() };
  }
  
  if (isCorrect) {
    stat.correct += 1;
  } else {
    stat.wrong += 1;
  }
  stat.lastAnswered = Date.now();
  
  await store.put(stat);
  await tx.done;
}

export async function getDatabaseMeta() {
  const db = await getDB();
  const lastSync = await db.get('meta', 'lastSync');
  const totalQuestions = await db.get('meta', 'totalQuestions');
  
  return {
    lastSync: lastSync?.value as number | undefined,
    totalQuestions: totalQuestions?.value as number | undefined,
  };
}
