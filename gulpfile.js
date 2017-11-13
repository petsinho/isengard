let gulp = require('gulp'),
  isWin = /^win/.test(process.platform),
  commandSeparator = isWin ? '&' : ';',
  webpack = require('webpack'),
  exec = require('child_process').exec,
  util = require('gulp-util'),
  gulpSequence = require('gulp-sequence'),
  stage = null;

function runCommand(cmd, done) {
  const ls = exec(cmd);
  ls.stdout.on('data', (data) => {
    console.log(data);
  });
  ls.stderr.on('data', (data) => {
    console.log(data);
  });
  ls.on('close', (data) => {
    done && done();
  });
}

/* Install dynamodb local instance */
gulp.task('install-dynamodb', (done) => {
  runCommand(`cd serverless${commandSeparator} sls dynamodb install`, done);
});

/* Start dynamodb local instance */
gulp.task('start-dynamodb', (done) => {
  runCommand(`cd serverless${commandSeparator} sls dynamodb start`, done);
});

/* Start offline server for local development */
gulp.task('start-offline-server', (done) => {
  runCommand(`cd serverless ${commandSeparator}serverless offline start`, done);
});

/* Start offline server for local development */
gulp.task('start-client', (done) => {
  runCommand(`cd web ${commandSeparator}webpack-dev-server`, done);
});

/* Start offline server for local development */
gulp.task('open-website', (done) => {
  require('opn')('http://localhost:8080');
});

/* Start application locally */
gulp.task('serve', gulpSequence(['start-offline-server', 'start-client', 'open-website']));
