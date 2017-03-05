const gulp = require('gulp');
const rev = require('gulp-rev');
const revNapkin = require('gulp-rev-napkin');
const gulpSequence = require('gulp-sequence');
const filter = require('gulp-filter');
const revReplace = require('gulp-rev-replace');
const cleanCSS = require('gulp-clean-css');
const autoPrefixer = require('gulp-autoprefixer');
const sizereport = require('gulp-sizereport');
const repeatString = require('../lib/repeatString');

const config = require('../config').production;

// 1) Add md5 hashes to assets referenced by CSS and JS files
gulp.task('rev-assets', () => {
    // Ignore what we dont want to hash in this step
    const notThese = '!' + config.dest + '/**/*+(css|js|json|geojson|html|ico)';

    return gulp.src([config.dest + '/**/*.*', notThese])
        .pipe(rev())
        .pipe(gulp.dest(config.dest))
        .pipe(revNapkin({verbose: false}))
        .pipe(rev.manifest(config.dest + '/' + config.manifestFilename, {merge: true}))
        .pipe(gulp.dest(''));
});

// 2) Add md5 hashes to translations assets
gulp.task('rev-translations', () => {
    return gulp.src(config.dest + '/**/**\-{fr,en}.js')
        .pipe(rev())
        .pipe(gulp.dest(config.dest))
        .pipe(revNapkin({verbose: false}))
        .pipe(rev.manifest(config.dest + '/' + config.manifestFilename, {merge: true}))
        .pipe(gulp.dest(''));
});

// 3) Update asset references with rev-ed filenames in compiled css + js
gulp.task('rev-update-references', () => {
    const manifest = gulp.src(config.dest + '/' + config.manifestFilename);

    return gulp.src(config.dest + '/**/**.{css,js}')
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest(config.dest));
});

// 4) Rev and compress CSS (this is done after assets, so that if a
//    referenced asset hash changes, the parent hash will change as well)
gulp.task('rev-css', () => {
    return gulp.src(config.dest + '/**/*.css')
        .pipe(rev())
        .pipe(autoPrefixer({browsers: config.autoPrefixer}))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.dest))
        .pipe(revNapkin({verbose: false}))
        .pipe(rev.manifest(config.dest + '/' + config.manifestFilename, {merge: true}))
        .pipe(gulp.dest(''));
});

// 5) Update asset references in HTML
gulp.task('update-html', () => {
    const manifest = gulp.src(config.dest + '/' + config.manifestFilename);

    return gulp.src(config.dest + '/**/*.html')
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest(config.dest));
});

// 6) Report sizes
gulp.task('size-report', () => {
    const hashedFiles = '/**/*-' + repeatString('[a-z,0-9]', 8) + '*.*';

    return gulp.src([config.dest + hashedFiles, '*!rev-manifest.json'])
        .pipe(sizereport({
            gzip: true
        }));
});


// If you are familiar with Rails, this task the equivalent of `rake assets:precompile`
gulp.task('rev', (callback) => {
    gulpSequence(
        // 1) Add md5 hashes to assets referenced by CSS and JS files
        'rev-assets',
        // 2) Add md5 hashes to translations assets
        'rev-translations',
        // 3) Update asset references with rev-ed filenames in compiled css + js
        'rev-update-references',
        // 4) Rev and compress CSS and JS files (this is done after assets, so that if a referenced asset hash changes, the parent hash will change as well
        'rev-css',
        // 5) Update asset references in HTML
        'update-html',
        // 6) Report filesizes
        'size-report',
        callback);
});


gulp.task('production', (callback) => {
    // Do not clean in production to keep previously generated translation files
    gulpSequence(['fonts', 'images', 'sprites', 'data', 'sass-production', 'webpack:production'], 'rev', callback);
});
