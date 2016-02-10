var gulp = require("gulp");
var gutil = require("gulp-util");
var plumber = require("gulp-plumber");
var less = require("gulp-less");
var autoprefixer = require("gulp-autoprefixer");
var minify = require("gulp-minify-css");
var rename = require("gulp-rename");
var options = require("minimist")(process.argv.slice(2));

gulp.task("css", function() {
  gulp.src("./less/dakara.less")
    .pipe(!options.production ? plumber() : gutil.noop())
    .pipe(less())
    .pipe(options.production ? autoprefixer() : gutil.noop())
    .pipe(options.production ? rename({
                            suffix: '.min'
                            }) : gutil.noop())
    .pipe(options.production ? minify() : gutil.noop())
    .pipe(gulp.dest("./css/"))
});

gulp.task("css-watch", ["css"], function() {
  gulp.watch("./less/*", ["css"])
});
