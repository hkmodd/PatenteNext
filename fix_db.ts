import fs from 'fs';
let data = fs.readFileSync('public/database.json', 'utf-8');
const lastComma = data.lastIndexOf('},');
data = data.substring(0, lastComma + 1) + '\n]';
fs.writeFileSync('public/database.json', data);
console.log('Fixed database.json');
