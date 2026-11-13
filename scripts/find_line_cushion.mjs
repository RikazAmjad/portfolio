import fs from 'fs';

const css = fs.readFileSync('scripts/david_main.css', 'utf8');

const matches = [];
['.line', '.cushion'].forEach(sel => {
  let pos = 0;
  while ((pos = css.indexOf(sel, pos)) !== -1) {
    matches.push({ sel, chunk: css.substring(pos, pos + 400) });
    pos += sel.length + 50;
  }
});

console.log('Found matches:', matches.length);
matches.slice(0, 10).forEach((m, i) => console.log(`--- Match ${i+1}: ${m.sel} ---\n${m.chunk}\n`));

