import fs from 'node:fs';
import path from 'node:path';

const project = process.argv[2];
const file = path.join(project, 'package.json');
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));

pkg.scripts = {
  ...pkg.scripts,
  'dev:web': 'vite',
  'dev:server': 'node --watch server/index.mjs',
  'dev': 'concurrently -k -n WEB,AI -c cyan,green "npm:dev:web" "npm:dev:server"'
};

fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
