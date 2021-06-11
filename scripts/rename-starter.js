const fs = require('fs');

if (process.argv.length < 3) {
  console.error("please enter new Name");
  process.exit(1);
}

const name = process.argv[2];


const camelize = (text) => {
  let result = text.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2, offset) => {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
  return result.substr(0, 1).toUpperCase() + result.substr(1);
}
const dashize = (text) => {
  let result = text.replace(/([A-Z])/g, (match, p1, p2, offset) => {
    return '_' + p1.toLowerCase();
  });
  return result.substr(1);
}

const camelName = camelize(name);
const dashName = dashize(camelName);

console.info("name", name)
console.info("camelName", camelName)
console.info("dashName", dashName)


const indexHtmlLines = fs.readFileSync('src/index.html', 'utf-8').split('\n');
indexHtmlLines.forEach((line, idx) => {
  const match = line.match(/<title>(.*?)<\/title>/);
  if (match) {
    line = line.replace(match[1], camelName);
    indexHtmlLines[idx] = line;
  }
})
fs.writeFileSync('src/index.html', indexHtmlLines.join('\n'), 'utf-8');

const angularJson = JSON.parse(fs.readFileSync('angular.json', 'utf-8'));
const defaultProject = angularJson.projects[angularJson.defaultProject];
if (defaultProject && angularJson.defaultProject !== camelName){
  defaultProject.architect.build.options.outputPath = `dist/${camelName}`;
  defaultProject.architect.serve.options.browserTarget = `${camelName}:build`;
  defaultProject.architect.serve.configurations.production.browserTarget = `${camelName}:build:production`;
  defaultProject.architect['extract-i18n'].options.browserTarget = `${camelName}:build`;
  angularJson.projects[camelName] = defaultProject;
  delete (angularJson.projects[angularJson.defaultProject]);
  angularJson.defaultProject = camelName;
}
fs.writeFileSync('angular.json', JSON.stringify(angularJson, null, 2), 'utf-8');


const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
packageJson.name = dashName;
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2), 'utf-8');



const serverTsLines = fs.readFileSync('server/server.ts', 'utf-8').split('\n');
serverTsLines.forEach((line, idx) => {
  const match = line.match(/const projectName = '(.*)';/);
  if (match) {
    line = line.replace(match[1], camelName);
    serverTsLines[idx] = line;
  }
})
fs.writeFileSync('server/server.ts', serverTsLines.join('\n'), 'utf-8');


const cleanUpJsLines = fs.readFileSync('scripts/cleanup-package.js', 'utf-8').split('\n');
cleanUpJsLines.forEach((line, idx) => {
  const match = line.match(/const NAME = '(.*)';/);
  if (match) {
    line = line.replace(match[1], dashName);
    serverTsLines[idx] = line;
  }
})
fs.writeFileSync('scripts/cleanup-package.js', cleanUpJsLines.join('\n'), 'utf-8');


const runShLines = fs.readFileSync('run.sh', 'utf-8').split('\n');
runShLines.forEach((line, idx) => {
  let match;
  match = line.match(/cd out\/(.*)-linux-x64/);
  if (match) {
    line = line.replace(match[1], dashName);
    runShLines[idx] = line;
  }
  match = line.match(/^.\/(.*)/);
  if (match) {
    line = line.replace(match[1], dashName);
    runShLines[idx] = line;
  }
})
fs.writeFileSync('run.sh', runShLines.join('\n'), 'utf-8');

