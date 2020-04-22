'use strict';

let gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  del = require('del'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleancss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  path = {
    dev: {
      html: 'dev/*.html',
      style: 'dev/sass/main.sass',
      js: 'dev/js/main.js',
      fonts: 'dev/fonts/**/*.*',
      img: 'dev/img/**/*.{png,jpg,gif,svg,ico}'
    },
    build: {
      html: 'build/',
      style: 'build/css/',
      js: 'build/js/',
      fonts: 'build/fonts/',
      img: 'build/img/'
    },
    watch: {
      html: 'dev/**/*.html',
      style: 'dev/sass/**/*.sass',
      js: 'dev/js/**/*.js',
      img: 'dev/img/**/*.{png,jpg,gif,svg,ico}'
    },
    clean: './build'
  };

gulp.task('serve', function () {
  browserSync.init({
    server: './build'
  });
});

gulp.task('html', function () {
  return gulp.src(path.dev.html)
    .pipe(gulp.dest(path.build.html))
    .on('end', browserSync.reload);
});

gulp.task('fonts', function () {
  return gulp.src(path.dev.fonts)
    .pipe(gulp.dest(path.build.fonts));
});

gulp.task('img', function () {
  return gulp.src(path.dev.img)
    .pipe(gulp.dest(path.build.img))
    .on('end', browserSync.reload);
});

gulp.task('style', function() {
  return gulp.src(path.dev.style)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 version']
    }))
    .pipe(cleancss())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest(path.build.style))
    .on('end', browserSync.reload);
});

gulp.task('js', function() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/slick-carousel/slick/slick.min.js',
    path.dev.js
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', function () {
  gulp.watch(path.watch.html, gulp.series('html'));
  gulp.watch(path.watch.style, gulp.series('style'));
  gulp.watch(path.watch.js, gulp.series('js'));
  gulp.watch(path.watch.img, gulp.series('img'));
});

gulp.task('clean', function () {
  return del(path.clean);
});

gulp.task('build', gulp.series(
  gulp.parallel(
    'fonts',
    'html',
    'img',
    'style',
    'js'
  )
));

gulp.task('default', gulp.series(
  'build',
  gulp.parallel(
    'watch',
    'serve'
  )
));