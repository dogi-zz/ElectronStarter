const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')
const copydir = require('copy-dir')
const {exec, spawn} = require('child_process');

const rm = (path) => new Promise(res => {
  rimraf(path, () => {
    res();
  })
})

const execute = (command) => new Promise((res, rej) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      rej(error);
      return;
    }
    if (stdout && stdout.length) {
      console.log(stdout);
    }
    if (stderr && stderr.length) {
      console.error(stderr);
    }
    res();
  });
})


const camelize = (text) => {
  let result = text.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2, offset) => {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
  return result.substr(0, 1).toUpperCase() + result.substr(1);
}
const dashize = (text) => {
  let result = text.replace(/([A-Z])/g, (match, p1, p2, offset) => {
    return '-' + p1.toLowerCase();
  });
  return result.substr(1);
}

const replaceAll = (content, src, target) => {
  while (content.includes(src)) {
    content = content.replace(src, target)
  }
  return content;
}


const arguments = process.argv.slice(2);

if (arguments.length < 2) {
  console.error("Arguments: [source-component-file] [target-name]");
  process.exit(1)
}

const [sourceComponentFile, targetName] = arguments;


if (!fs.existsSync(sourceComponentFile)) {
  console.error("sourceComponentFile not exists");
  process.exit(1)
}
const sourceComponentDir = path.dirname(sourceComponentFile);

const baseName = path.basename(sourceComponentFile);
if (!baseName.endsWith('.component.ts')) {
  console.error("sourceComponentFile not ends with '.component.ts'");
  process.exit(1)
}

const sourceComponentFilePrefix = baseName.substr(0, baseName.length - '.component.ts'.length)


console.info()
console.info("sourceComponentFile", sourceComponentFile)
console.info("sourceComponentDir", sourceComponentDir)
console.info("sourceComponentFilePrefix", sourceComponentFilePrefix)
console.info("sourceComponentComponentName", camelize(sourceComponentFilePrefix) + 'Component')
console.info("sourceComponentModuleName", camelize(sourceComponentFilePrefix) + 'Module')


const camelName = camelize(targetName);
const dashName = dashize(camelName);
const targetDir = path.resolve(path.dirname(sourceComponentDir), dashName);


console.info()
console.info("targetName", targetName)
console.info("camelName", camelName)
console.info("dashName", dashName)
console.info("targetDir", targetDir)

console.info()
console.info("copy-dir...")

copydir.sync(sourceComponentDir, targetDir);

console.info("rename files...")
const files = fs.readdirSync(targetDir);
files.forEach(file => {
  if (file.startsWith(sourceComponentFilePrefix)) {
    console.info(file, '->', dashName + file.substr(sourceComponentFilePrefix.length))
    fs.renameSync(path.resolve(targetDir, file), path.resolve(targetDir, dashName + file.substr(sourceComponentFilePrefix.length)));
  }
})

console.info()
if (fs.existsSync(path.resolve(targetDir, dashName + '.module.ts'))) {
  console.info("modify module....")
  let content = fs.readFileSync(path.resolve(targetDir, dashName + '.module.ts'), 'utf-8');

  content = replaceAll(content, camelize(sourceComponentFilePrefix) + 'Module', camelName + 'Module')
  content = replaceAll(content, camelize(sourceComponentFilePrefix) + 'Component', camelName + 'Component')
  content = replaceAll(content, dashize(camelize(sourceComponentFilePrefix)) + '.component', dashName + '.component')

  fs.writeFileSync(path.resolve(targetDir, dashName + '.module.ts'), content, 'utf-8');
}
if (fs.existsSync(path.resolve(targetDir, dashName + '.module.ts'))) {
  console.info("modify component....")
  let content = fs.readFileSync(path.resolve(targetDir, dashName + '.component.ts'), 'utf-8');

  content = replaceAll(content, camelize(sourceComponentFilePrefix) + 'Component', camelName + 'Component')
  content = replaceAll(content, dashize(camelize(sourceComponentFilePrefix)) , dashName )

  fs.writeFileSync(path.resolve(targetDir, dashName + '.component.ts'), content, 'utf-8');
}
