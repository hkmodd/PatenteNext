const https = require('https');
const fs = require('fs');

async function searchImage(query) {
  return new Promise((resolve, reject) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query.search.length > 0) {
            resolve(json.query.search.slice(0, 3).map(s => s.title.replace('File:', '')));
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const missing = [
    'Italian traffic signs intersezione con circolazione rotatoria',
    'Italian traffic signs cunetta',
    'Italian traffic signs dosso',
    'Italian traffic signs passaggio a livello',
    'Italian traffic signs attraversamento pedonale'
  ];

  for (const q of missing) {
    const res = await searchImage(q);
    console.log(`${q} -> ${res}`);
  }
}

run();
