import fs from 'fs';

const html = fs.readFileSync('scripts/david.html', 'utf8');

const workStart = html.indexOf('id="work"');
console.log('Work HTML snippet (first 3500 chars):');
console.log(html.substring(workStart - 40, workStart + 3500));

// Find script tags
const scripts = [...html.matchAll(/<script[^>]*src=["']([^"']+)["']/g)].map(m => m[1]);
console.log('\nScripts:', scripts);

// Find stylesheets
const styles = [...html.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/g)].map(m => m[1]);
console.log('\nStylesheets:', styles);
