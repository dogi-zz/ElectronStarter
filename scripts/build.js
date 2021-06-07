const rimraf = require('rimraf')
const path = require('path')
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

Promise.resolve()

  .then(() => console.log("Compile Server JS..."))
  .then(() => rm(path.resolve('dist', 'server')))
  .then(() => execute('tsc -P server/server.tsconfig.json'))
  .then(() => console.log("Compile Server JS... done"))

  .then(() => console.log("Build Angular..."))
  .then(()=> execute('npx ng build --base-href /app/ --deploy-url /app/'))
  .then(() => console.log("Build Angular...done"))
