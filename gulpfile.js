var gulp = require("gulp");
var ts = require("gulp-typescript");
var babel = require("gulp-babel");
var rename = require("gulp-rename");
var tsProject = ts.createProject("./src/tsconfig.json");

var exec = require('child_process').exec;

gulp.task("default", function () {
	return tsProject.src()
		.pipe(ts(tsProject))
        .pipe(babel({ presets: ["es2015"], plugins: ['transform-runtime'] }))
		.pipe(rename("index.js"))
        .pipe(gulp.dest("./"));
});

gulp.task("run", ["default"], function(cb) {
    exec("node ./index.js", function(err, stdout, stderr) {
        if(err) {
            console.error(stderr);
        }
        
        console.log(stdout);
        
        cb();
    });
});