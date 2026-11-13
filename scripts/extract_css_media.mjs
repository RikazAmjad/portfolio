import fs from 'fs';

const css = fs.readFileSync('scripts/david_main.css', 'utf8');

const idx = css.indexOf('@media (max-width: 700px)');
if (idx !== -1) {
  console.log(css.substring(idx, idx + 2500));
}

