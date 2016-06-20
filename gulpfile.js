// Include Gulp && BrowserSync
var gulp          = require('gulp'),
    browserSync   = require('browser-sync').create();

// Include gulp plugins
var autoprefixer  = require('gulp-autoprefixer'),
    nodemon       = require('gulp-nodemon'),
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

// Nodemon
gulp.task('server', function () {
  nodemon({
    script: 'index.js'
  });
});

// Compile backend scss
gulp.task('scss-backend', function(){
  return gulp.src('./scss/backend.scss')
    .pipe(plumber({errorHandler: reportError}))
    .pipe(sass({sourceComments: true}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./app/public/stylesheets/'));
});

// Compile smartmirror scss
gulp.task('scss-smartmirror', function(){
  return gulp.src('./scss/smartmirror.scss')
    .pipe(plumber({errorHandler: reportError}))
    .pipe(sass({sourceComments: true}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
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
gulp.task('watch', ['scss-backend', 'scss-smartmirror'], function () {

  browserSync.init({
    open: false,
    notify: true,
    proxy: 'localhost:3000/',
    port: 8080
  });

  gulp.watch(['./app/views/**/*.jade', './scss/**/*.scss', './app/public/javascripts/*.js'], ['scss-backend', 'scss-smartmirror', reload]);
});

// Default task - run all the other tasks
gulp.task('default', ['server', 'scss-backend', 'scss-smartmirror', 'watch']);

// Backend/Smartmirror task - run all the other tasks
gulp.task('backend', ['server', 'scss-backend', 'watch']);
gulp.task('smartmirror', ['server', 'scss-smartmirror', 'watch']);