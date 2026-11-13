import fs from 'fs';

const html = fs.readFileSync('scripts/david.html', 'utf8');
const start = html.indexOf('<section class="work"');
const end = html.indexOf('</section>', start);
console.log(html.substring(start, start + 1200));

