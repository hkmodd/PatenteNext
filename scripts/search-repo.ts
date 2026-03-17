import fs from 'fs';

async function run() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/Ed0ardo/QuizPatenteB/master/quizPatenteB2023.json');
    const data = await res.json();
    
    const images = new Set<string>();
    for (const category of Object.keys(data)) {
      for (const topic of Object.keys(data[category])) {
        for (const q of data[category][topic]) {
          if (q.img) {
            images.add(q.img);
          }
        }
      }
    }
    console.log("Unique images:", images.size);
  } catch (e) {
    console.error(e);
  }
}

run();
