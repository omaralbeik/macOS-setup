var gulp = require('gulp');

var mainBowerFiles = require('gulp-main-bower-files');
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;
var cssnano = require('gulp-cssnano');
var replace = require("gulp-html-replace");
var sourcemaps = require("gulp-sourcemaps");
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var concat = require('gulp-concat');

var dest = 'dist/';

gulp.task('bower', function() {
  return gulp.src('./bower.json')
    .pipe(mainBowerFiles({
      overrides: {
        bootstrap: {
          main: [
            './dist/js/*.min.*',
            './dist/css/*.min.*',
            './dist/fonts/*.*'
          ]
        },
        jquery: {
          main: [
            './dist/*.min.*',
          ]
        },
        'bootstrap-add-clear': {
          main: [
            '*.min.*',
          ]
        }
      }
    }))
    .pipe(gulp.dest(dest + 'libs'));
});

gulp.task('gzip', function() {
  gulp.src('./src/**/*.*')
    .pipe(gzip({
      append: true
    }))
    .pipe(gulp.dest(dest));
});

gulp.task('html', function() {
  gulp.src('./src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: false
    }))
    .pipe(gulp.dest(dest))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('js', function() {
  return gulp.src(['./src/js/misc.js', './src/js/model.js', './src/js/foursquare.js', './src/js/maps.js', './src/js/app.js'])
    // uncomment the next line to enable maping js files
    // .pipe(sourcemaps.init({
    //   loadMaps: true
    // }))
    .pipe(concat('app.js'))
    .pipe(jsmin())
    .pipe(rename({
      suffix: '.min'
    }))
    // uncomment the next line to enable maping js files
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest + 'js/'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('css', function() {
  gulp.src('src/**/*.css')
    // uncomment the next line to enable maping css files
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    // uncomment the next line to enable maping css files
    .pipe(sourcemaps.write('.'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(dest))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('img', function() {
  gulp.src(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.jpeg'])
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(dest));
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  });
  gulp.watch('./src/**/*.html', ['html']);
  gulp.watch('./src/**/*.js', ['js']);
  gulp.watch('./src/**/*.css', ['css']);
  gulp.watch('./src/img/**', ['img']);
  gulp.watch('bower_components/**', ['bower']);
});

gulp.task('default', ['img', 'js', 'css', 'html', 'bower']);
