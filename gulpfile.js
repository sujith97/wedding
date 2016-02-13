var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  del = require('del'),
  path = require('path'),
  runSequence = require('run-sequence');

var PATTERN = {
  HTML: '*.html',
  JAVASCRIPT: '*.js',
  CSS: '*.css',
  STYLUS: '*.styl',
  EJS: '*.ejs'
}
var FOLDER = {};

FOLDER.STATIC_FILES_ROOT = 'public';
FOLDER.VIEW_FILES_ROOT = 'views';
FOLDER.PRODUCTION_FOLDER = 'release';
FOLDER.MAIN_RUNNER = path.join('bin', 'www');
FOLDER.JS_FOLDER = path.join(FOLDER.STATIC_FILES_ROOT, 'javascripts', '**', PATTERN.JAVASCRIPT);
FOLDER.CSS_PREPROS = path.join(FOLDER.STATIC_FILES_ROOT, 'stylesheets', 'prepros', '**', PATTERN.STYLUS);
FOLDER.CSS_DESTINATION = path.join(FOLDER.STATIC_FILES_ROOT, 'stylesheets');
FOLDER.VIEW_FILES = path.join(FOLDER.VIEW_FILES_ROOT, '**', PATTERN.EJS);
FOLDER.HTML_TEMPLATES = path.join(FOLDER.STATIC_FILES_ROOT, 'templates', '*');
FOLDER.HTML_TEMPLATES_RELEASE = path.join(FOLDER.PRODUCTION_FOLDER, 'templates');


var GULP_TASKS = {
  OPTIMIZE: 'optimize',
  OPTIMIZE_STATICS: 'optimize_statics',
  CLEAN: 'clean',
  STYLES: 'styles',
  JSHINT: 'jshint',
  NODEMON: 'nodemon',
  SERVE: 'serve',
  HTML_TEMPLATES: 'htmlTemplates'
}

gulp.task(GULP_TASKS.OPTIMIZE, function() {
  runSequence(GULP_TASKS.CLEAN,
              [GULP_TASKS.OPTIMIZE_STATICS, GULP_TASKS.HTML_TEMPLATES]
              );
});

gulp.task(GULP_TASKS.OPTIMIZE_STATICS, function() {
  var assets = $.useref.assets({searchPath: [FOLDER.STATIC_FILES_ROOT]});
  return gulp.src(FOLDER.VIEW_FILES)
    // Place the HTML files which are served from NODE in /dist/views folder
    .pipe($.if(PATTERN.HTML, $.rename(function (_path) { path.join(_path.dirname, FOLDER.VIEW_FILES_ROOT) })))
    // Gather all the assets from HTML files
    .pipe(assets)
    // Concatinate and minify JS files
    .pipe($.if(PATTERN.JAVASCRIPT, $.uglify()))
    // Minify CSS
    .pipe($.if(PATTERN.CSS, $.cssmin()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Store the production files in release folder
    .pipe(gulp.dest(FOLDER.PRODUCTION_FOLDER));
});


// Clean Output Directory
gulp.task(GULP_TASKS.CLEAN, del.bind(null, FOLDER.PRODUCTION_FOLDER));

gulp.task(GULP_TASKS.HTML_TEMPLATES, function() {
  return gulp.src(FOLDER.HTML_TEMPLATES)
    .pipe(gulp.dest(FOLDER.HTML_TEMPLATES_RELEASE));
});

gulp.task(GULP_TASKS.STYLES, function() {
	return gulp.src(FOLDER.CSS_PREPROS)
		.pipe($.stylus())
		.pipe(gulp.dest(FOLDER.CSS_DESTINATION));
});

// Lint JavaScript
gulp.task(GULP_TASKS.JSHINT, function () {
  return gulp.src(FOLDER.JS_FOLDER)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});


// Watch Files For Changes & Reload
gulp.task(GULP_TASKS.SERVE, [GULP_TASKS.STYLES, GULP_TASKS.NODEMON], function () {
  browserSync({
    port: 7000,
  	proxy: 'http://localhost:3000',
    ws: true
  });

  gulp.watch(FOLDER.VIEW_FILES, reload);
  gulp.watch(FOLDER.CSS_PREPROS, [GULP_TASKS.STYLES, reload]);
  gulp.watch(FOLDER.JS_FOLDER, [GULP_TASKS.JSHINT, reload]);
});

gulp.task(GULP_TASKS.NODEMON, function (cb) {
  var called = false;
  return $.nodemon({
    script: FOLDER.MAIN_RUNNER,
    env: { 'NODE_ENV': 'production', 'mongodb': false },
    ignore: [ path.join(FOLDER.STATIC_FILES_ROOT, '**', '*.*'), path.join(FOLDER.PRODUCTION_FOLDER, '**', '*.*') ]
  }).on('start', function () {
    if (!called) { cb(); }
      called = true;
  })
  .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reloadServ() {
        reload({
          stream: false
        });
      }, 500);
    });
});


