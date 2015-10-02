var gulp = require('gulp');
var rev            = require('gulp-rev');
var revNapkin      = require('gulp-rev-napkin');
var gulpSequence = require('gulp-sequence');
var filter = require('gulp-filter');
var revReplace = require('gulp-rev-replace');
var combinemq = require('gulp-combine-mq');
var cssmin = require('gulp-cssmin');
var autoPrefixer = require('gulp-autoprefixer');
var sizereport   = require('gulp-sizereport');
var repeatString = require('../lib/repeatString');

var config     = require('../config').production;

// Rev assets : how to change file name in css url and javascript code ?
// 1) Add md5 hashes to assets referenced by CSS and JS files
gulp.task('rev-assets', function() {
    // Ignore what we dont want to hash in this step
    var notThese = '!' + config.dest + '/**/*+(css|js|json|html)';

    return gulp.src([config.dest + '/**/*.*', notThese])
        .pipe(rev())
        .pipe(gulp.dest(config.dest))
        .pipe(revNapkin({verbose: false}))
        .pipe(rev.manifest(config.dest + '/' + config.manifestFilename, {merge: true}))
        .pipe(gulp.dest(''));
});

// 2) Update asset references with rev-ed filenames in compiled css + js
gulp.task('rev-update-references', function(){
    var manifest = gulp.src(config.dest + '/' + config.manifestFilename);

    return gulp.src(config.dest + '/**/**.{css,js}')
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest(config.dest));
});

// 3) Rev and compress CSS (this is done after assets, so that if a
//    referenced asset hash changes, the parent hash will change as well)
gulp.task('rev-css', function(){
    return gulp.src(config.dest + '/**/*.css')
        .pipe(rev())
        .pipe(autoPrefixer({ browsers: config.autoPrefixer }))
        .pipe(combinemq({beautify: false}))
        .pipe(cssmin())
        .pipe(gulp.dest(config.dest))
        .pipe(revNapkin({verbose: false}))
        .pipe(rev.manifest(config.dest + '/' + config.manifestFilename, {merge: true}))
        .pipe(gulp.dest(''));
});

// 4) Update asset references in HTML
gulp.task('update-html', function(){
    var manifest = gulp.src(config.dest + '/' + config.manifestFilename);
    return gulp.src(config.dest + '/**/*.html')
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest(config.dest));
});

// 5) Report sizes
gulp.task('size-report', function() {
    var hashedFiles = '/**/*-' + repeatString('[a-z,0-9]', 8)  + '*.*';

    return gulp.src([config.dest + hashedFiles, '*!rev-manifest.json'])
        .pipe(sizereport({
            gzip: true
        }));
});


// If you are familiar with Rails, this task the equivalent of `rake assets:precompile`
gulp.task('rev', function(callback) {
    gulpSequence(
        // 1) Add md5 hashes to assets referenced by CSS and JS files
        'rev-assets',
        // 2) Update asset references with rev-ed filenames in compiled css + js
        'rev-update-references',
        // 3) Rev and compress CSS and JS files (this is done after assets, so that if a referenced asset hash changes, the parent hash will change as well
        'rev-css',
        // 4) Update asset references in HTML
        'update-html',
        // 5) Report filesizes
        'size-report',
        callback);
});


gulp.task('production', function(callback) {
    gulpSequence('clean', ['fonts', 'images', 'html'], ['sass-production', 'webpack:production'], 'rev', callback);
});
