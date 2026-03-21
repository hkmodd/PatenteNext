const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = 'public/images/segnali';
const files = fs.readdirSync(dir);

async function downloadImage(filename) {
  const url = `https://www.patentati.it/img_sign_400/${filename}`;
  const dest = path.join(dir, filename);
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed to download ${filename}: ${res.statusCode}`);
        resolve(false);
        return;
      }
      
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      console.error(`Error downloading ${filename}: ${err.message}`);
      resolve(false);
    });
  });
}

async function main() {
  let success = 0;
  let failed = 0;
  
  for (const file of files) {
    if (!file.endsWith('.png')) continue;
    
    const ok = await downloadImage(file);
    if (ok) {
      success++;
      if (success % 50 === 0) console.log(`Downloaded ${success} images...`);
    } else {
      failed++;
    }
  }
  
  console.log(`Finished! Success: ${success}, Failed: ${failed}`);
}

main();
