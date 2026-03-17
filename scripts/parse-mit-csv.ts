import fs from 'fs';
import path from 'path';

// Questo script è un template per parsare il CSV ufficiale del Ministero (MIT)
// e convertirlo nel formato JSON richiesto dall'applicazione PatenteNext.
// Formato atteso del CSV ministeriale: ID;TESTO;RISPOSTA;CATEGORIA;IMMAGINE

const csvPath = path.join(process.cwd(), 'data', 'quiz_ufficiali_mit.csv');
const outPath = path.join(process.cwd(), 'public', 'database.json');

function parseCSV() {
  if (!fs.existsSync(csvPath)) {
    console.error(`File CSV non trovato in ${csvPath}.`);
    console.error('Scarica il database ufficiale dal Portale dell\'Automobilista e salvalo in data/quiz_ufficiali_mit.csv');
    return;
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');
  
  const questions = [];
  
  // Salta l'header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const [id, text, answerStr, category, imageUrl] = line.split(';');
    
    questions.push({
      id: id.trim(),
      text: text.trim(),
      answer: answerStr.trim().toUpperCase() === 'V',
      category: category.trim(),
      imageUrl: imageUrl && imageUrl.trim() !== '' ? `/images/segnali/${imageUrl.trim()}` : undefined,
    });
  }

  fs.writeFileSync(outPath, JSON.stringify(questions, null, 2));
  console.log(`✅ Database generato con successo: ${questions.length} quiz esportati in public/database.json`);
}

parseCSV();
