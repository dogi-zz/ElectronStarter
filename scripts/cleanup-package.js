const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')
const {exec} = require('child_process');

const NAME = 'electron_starter';

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

let promise = Promise.resolve()
  .then(() => console.log("Cleanup..."));

['src', 'server', 'common'].forEach(dir => {
  promise = promise.then(() => console.info(`.... cleanup ${dir}`))
    .then(() => rm(path.resolve(`out/${NAME}-linux-x64/resources/app/`, dir)))
    .then(() => fs.writeFileSync(`out/${NAME}-linux-x64/data.dir`, '../../data', 'utf-8'));
})

