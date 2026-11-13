import fs from 'fs';

const css = fs.readFileSync('scripts/david_main.css', 'utf8');

// Find the section that begins with /* Work or .work
const idx = css.indexOf('.work {');
if (idx !== -1) {
  console.log(css.substring(idx - 100, idx + 4500));
} else {
  console.log('Not found');
}

