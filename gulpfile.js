var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');

/********************************************
 * This will install all the dependencies in
 * your bower.json file to bower_components/
 * ******************************************/
gulp.task('bower', function() {
    var install = require("gulp-install");
    var installPipe = install();

    return gulp.src(['./bower.json'])
        .pipe(installPipe);
});

gulp.task('build', function() {
    runSequence('bower', 'rename-dep', 'copy-src');
});

gulp.task('copy-src', function() {

    var bowerToBuild =
        gulp.src('./bower_components/**/*')
            .pipe(gulp.dest('./build/bower_components/'));

    var bowerToWWW =
        gulp.src('./bower_components/**/*')
            .pipe(gulp.dest('./www/bower_components/'));

    var webapp =
            gulp.src('./www/**/*')
                .pipe(gulp.dest('./build/'))
        ;
    return merge(bowerToBuild, bowerToWWW, webapp);

});


gulp.task('rename-dep', function () {

    gulp.src('./www/bower_components/stripe/index', {
            base: './www/bower_components/stripe'
        })
    .pipe(rename('index.js'))
    .pipe(gulp.dest('./www/bower_components/stripe/'))
    .pipe(gulp.dest('./build/bower_components/stripe/'));

});

/********************************************
 * Delete build artifacts
 * ******************************************/
gulp.task('clean', function () {
    del(['build', 'bower_components', 'www/bower_components']).then(function(paths) {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});