const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const reporter = require('eslint-html-reporter');
const htmlhint = require('gulp-htmlhint');
const htmlhintreporter = require('gulp-htmlhint-html-reporter');

const mocha = require('gulp-mocha');

gulp.task('lint', ['eslint','htmlhint']);

gulp.task('eslint', function() {
  return gulp.src(['gulpfile.js','js/index.js','!node_modules/**/*'])
    .pipe(eslint())
    .pipe(eslint.format(reporter, function(results) {
      fs.writeFileSync(path.join(__dirname, 'output/report-results.html'), results);
    }))
    .pipe(eslint.failAfterError())
});

gulp.task('htmlhint', function() {
  return gulp.src(['**/*.html','!node_modules/**/*'])
  .pipe(htmlhint({htmlhintrc: '.htmlhintrc'}))
  .pipe(htmlhint.reporter(htmlhintreporter, {
     filename: __dirname + 'output/htmlhint-output.html',
     createMissingFolders : true
   }))
  .pipe(htmlhint.failReporter())
});

gulp.task('test', function() {
  return gulp.src(['**/*.spec.js','!node_modules/**/*'], { read: false })
  .pipe(mocha())
});
