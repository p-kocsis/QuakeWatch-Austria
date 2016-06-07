var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var replace = require('gulp-replace');
var paths = {
  sass: ['./scss/**/*.scss']
};
var connect = require('gulp-connect');

gulp.task('default', ['sass']);

gulp.task('add-proxy', function(){
  gulp.src(['/Volumes/Data HDD/Schule_2015_16/ITP/QuakeWatch_PHPStorm/QuakeWatch/www/js/resources.js'])
    .pipe(replace('http://geoweb.zamg.ac.at/fdsnws/app/1','http://localhost:8100/apiZAMG'))
    .pipe(replace('http://geoweb.zamg.ac.at/eq_app','http://localhost:8100/apiZAMGFiles'))
    .pipe(replace('http://geoweb.zamg.ac.at','http://localhost:8100/geoweb'))
    .pipe(gulp.dest('/Volumes/Data HDD/Schule_2015_16/ITP/QuakeWatch_PHPStorm/QuakeWatch/www/js/'));
});
 
gulp.task('remove-proxy', function(){
  gulp.src(['/Volumes/Data HDD/Schule_2015_16/ITP/QuakeWatch_PHPStorm/QuakeWatch/www/js/resources.js'])
    .pipe(replace('http://localhost:8100/apiZAMGFiles', 'http://geoweb.zamg.ac.at/eq_app'))
    .pipe(replace('http://localhost:8100/apiZAMG', 'http://geoweb.zamg.ac.at/fdsnws/app/1'))
    .pipe(replace('http://localhost:8100/geoweb', 'http://geoweb.zamg.ac.at'))
    .pipe(gulp.dest('/Volumes/Data HDD/Schule_2015_16/ITP/QuakeWatch_PHPStorm/QuakeWatch/www/js/'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('html', function () {
  gulp.src('./docs/*')
      .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch("./docs/*",['html']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
    done();
  }});

gulp.task('serve-docs', function() {
  connect.server({
    root: './docs',
    livereload: false,
    port: 8200
  });
});

gulp.task('generate-docs', [], function () {
  var gulpDocs = require('gulp-ngdocs');
  var options = {
    html5Mode: false,
    startPage: '/api',
    title: "QuakeWatch App Dokumentation"
    /*
    image: "path/to/my/image.png",
    imageLink: "http://my-domain.com",
    titleLink: "/api"
    */
  };
  return gulpDocs.sections({
    api: {
      glob:['www/js/*.js'],
      api: true,
      title: 'API Dokumentation'
    },
    tutorial: {
      glob: ['docs_new_developer/*.js'],
      title: 'Neuer Entwickler'
    }
  }).pipe(gulpDocs.process(options)).pipe(gulp.dest('./docs'));
});
  
 
  
  

