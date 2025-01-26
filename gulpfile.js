'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

gulp.task('convertSassMinify', () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream());  
});

gulp.task('minifyImages', async () => {
  const imagemin = (await import('gulp-imagemin')).default;
  return gulp.src('./src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/images/'));
});

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './', 
    },
    port: 3000,
  });

  gulp.watch('./src/scss/**/*.scss', gulp.series('convertSassMinify'));

  gulp.watch('./src/images/**/*', gulp.series('minifyImages'));

  gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('convertSassMinify', 'serve'));
