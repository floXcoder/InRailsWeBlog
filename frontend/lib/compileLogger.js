const gutil = require('gulp-util');
const prettifyTime = require('./prettifyTime');
const handleErrors = require('./handleErrors');
const webPackConfig = require('../webpack/development.config.js');

module.exports = (err, stats) => {
    if (err) {
        throw new gutil.PluginError('webpack', err);
    }

    gutil.log(stats.toString(webPackConfig.stats));

    if (stats.compilation.errors.length > 0) {
        stats.compilation.errors.forEach(function (error) {
            handleErrors(error);
            statColor = 'red';
        });
    } else {
        const compileTime = prettifyTime(stats.endTime - stats.startTime);
        gutil.log('Compiled with', gutil.colors.cyan('webpack:development'), 'in', gutil.colors.magenta(compileTime));
    }
};
