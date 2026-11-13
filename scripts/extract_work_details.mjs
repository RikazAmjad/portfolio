import fs from 'fs';

const html = fs.readFileSync('scripts/david.html', 'utf8');
const css = fs.readFileSync('scripts/david_main.css', 'utf8');
const js = fs.readFileSync('scripts/david_main.js', 'utf8');

console.log('=== HTML SECTION WORK ===');
const workMatch = html.match(/<section class="work"[\s\S]*?<\/section>/);
if (workMatch) {
  console.log('Full Work section length:', workMatch[0].length);
  // List cards
  const cards = [...workMatch[0].matchAll(/<li class="work-card">([\s\S]*?)<\/li>/g)];
  console.log(`Found ${cards.length} cards`);
  cards.forEach((c, i) => {
    const h3 = c[1].match(/<h3>(.*?)<\/h3>/)?.[1];
    const tags = c[1].match(/<p class="work-card__tags">(.*?)<\/p>/)?.[1];
    console.log(`Card ${i + 1}: ${h3} | Tags: ${tags}`);
  });
}

console.log('\n=== CSS WORK RULES ===');
const cssRules = css.split(/(?=\.work)/).filter(r => r.startsWith('.work') || r.startsWith('.work-card'));
console.log(`Found ${cssRules.length} work-related CSS chunks. Printing first 1500 chars of relevant CSS:`);
const workCss = css.split('\n').filter(l => l.includes('.work') || l.includes('work-card') || l.includes('--a-') || l.includes('--b-')).join('\n');
console.log(workCss.slice(0, 2000));

console.log('\n=== JS WORK LOGIC ===');
// Search for data-work or work__stage or similar in JS
const jsLines = js.split('\n');
const workIndices = [];
jsLines.forEach((l, idx) => {
  if (l.includes('data-work') || l.includes('work__stage') || l.includes('work-card') || l.includes('cushion--work')) {
    workIndices.push(idx);
  }
});
console.log(`Matching lines in JS: ${workIndices.length}`);
if (workIndices.length > 0) {
  const minIdx = Math.max(0, workIndices[0] - 20);
  const maxIdx = Math.min(jsLines.length - 1, workIndices[workIndices.length - 1] + 30);
  console.log(`Lines ${minIdx} to ${maxIdx}:`);
  console.log(jsLines.slice(minIdx, Math.min(minIdx + 120, maxIdx)).join('\n'));
}

