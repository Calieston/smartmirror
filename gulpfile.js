// Include Gulp && BrowserSync
var gulp          = require('gulp'),
    browserSync   = require('browser-sync').create();

// Include gulp plugins
var autoprefixer  = require('gulp-autoprefixer'),
    plumber       = require('gulp-plumber'),
    rename        = require('gulp-rename'),
    sass          = require('gulp-sass'),
    cssnano       = require('gulp-cssnano'),
    uglify        = require('gulp-uglify'),
    uncss         = require('gulp-uncss');

var reload        = browserSync.reload;

// Report/Notify Errors
var reportError = function (error) {
  console.error('TASK:' + ' ' + error.plugin + '\nPROB:' + ' ' + error.message + '\n');
  this.emit('end');
}

// Compile scss
gulp.task('scss', function(){
  return gulp.src('./scss/styles.scss')
    .pipe(plumber({errorHandler: reportError}))
    .pipe(sass({sourceComments: true}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./app/public/stylesheets/'));
});

// Compile and minify scss
gulp.task('scss-min', function(){
  return gulp.src('./scss/styles.scss')
    .pipe(plumber({errorHandler: reportError}))
    .pipe(sass({
      sourceComments: false,
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(uncss({
      html: ['app/index.html']
    }))
    .pipe(cssnano())
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('./app/public/stylesheets/'));
});

// Uglify javascripts
gulp.task('uglify', function(){
  return gulp.src('./app/public/javascripts/*.js')
    .pipe(plumber({errorHandler: reportError}))
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest(dir.js));
});

// Minify css and javascripts
gulp.task('min', ['scss-min', 'uglify']);

// Watch files for changes & reload
gulp.task('watch', ['scss'], function () {

  browserSync.init({
    open: false,
    notify: true,
    proxy: 'localhost:3000/'
  });

  gulp.watch(['./app/**/*.*'], ['scss', reload]);
});

// Default task - run all the other tasks
gulp.task('default', ['scss', 'watch']);