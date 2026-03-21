const https = require('https');

async function searchImage(query) {
  return new Promise((resolve, reject) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent('Italian traffic signs ' + query)}&srnamespace=6&format=json`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query.search.length > 0) {
            resolve(json.query.search[0].title.replace('File:', ''));
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
    'strada deformata',
    'doppia curva pericolosa la prima a destra',
    'doppio senso di circolazione',
    'divieto di sorpasso per i veicoli di massa a pieno carico superiore a 3,5 t',
    'direzione obbligatoria diritto',
    'intersezione con circolazione rotatoria',
    'fermarsi e dare precedenza',
    'fermata autobus'
  ];

  for (const q of missing) {
    const res = await searchImage(q);
    console.log(`${q} -> ${res}`);
  }
}

run();
