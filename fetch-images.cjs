const https = require('https');

https.get('https://www.patentati.it/quiz-patente-b/esame-1.html', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const matches = data.match(/<img[^>]+src="([^">]+)"/g);
    console.log(matches);
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
