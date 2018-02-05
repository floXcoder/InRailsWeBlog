/*
 gulpfile.js
 ===========
 Rather than manage one giant configuration file responsible for creating multiple tasks, each task has been broken out into
 its own file in gulp/tasks. Any files in that directory get automatically required below.

 To add a new task, simply add a new task file that directory. gulp/tasks/default.js specifies the default set of tasks to run
 when you run `gulp`.
*/

const gutil = require('gulp-util');
const requireDir = require('require-dir');

// Require all tasks in gulp/tasks, without subfolders
requireDir('./frontend/gulp', {recurse: false});

console.log(gutil.env.env)

if (gutil.env.env === 'production') {
    requireDir('./frontend/gulp/production', {recurse: true});
} else {
    requireDir('./frontend/gulp/development', {recurse: true});
}
