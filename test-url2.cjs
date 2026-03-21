const https = require('https');
https.get('https://upload.wikimedia.org/wikipedia/commons/e/e9/Italian_traffic_signs_-_dosso.svg', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  console.log('Status:', res.statusCode);
}).on('error', (e) => {
  console.error('Error:', e.message);
});
