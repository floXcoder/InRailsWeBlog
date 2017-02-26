const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');
const config = require('../config').sprites;

// Generate one sprite file from all png icons
gulp.task('sprites', () => {
    const spriteData = gulp.src(config.src)
        .pipe(spritesmith(config.options));

    spriteData.img
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest(config.dest.image));

    spriteData.css
        .pipe(gulp.dest(config.dest.css));

    return spriteData
        .pipe(browserSync.reload({stream: true}));
});
