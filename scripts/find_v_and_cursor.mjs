import fs from 'fs';

const css = fs.readFileSync('scripts/david_main.css', 'utf8');

const matches = [];
let pos = 0;
while ((pos = css.indexOf('--v', pos)) !== -1) {
  matches.push(css.substring(Math.max(0, pos - 100), Math.min(css.length, pos + 200)));
  pos += 3;
}
console.log('Found --v matches:', matches.length);
matches.forEach((m, i) => console.log(`--- Match ${i+1} ---\n${m}\n`));

console.log('--- cursor-tag matches ---');
let cpos = 0;
while ((cpos = css.indexOf('.cursor-tag', cpos)) !== -1) {
  console.log(css.substring(Math.max(0, cpos - 100), Math.min(css.length, cpos + 300)));
  cpos += 11;
}

