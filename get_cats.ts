import fs from 'fs';
const data = JSON.parse(fs.readFileSync('public/database.json', 'utf-8'));
const cats = [...new Set(data.map((q: any) => q.category))];
console.log(cats);
