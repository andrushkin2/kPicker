"use strict";
var gulp = require("gulp");
var ts = require("typescript");
var fs = require("fs");
var less = require("gulp-less");
var path = require("path");
var devFolder = "./bin", tsConfig = JSON.parse(fs.readFileSync("./tsconfig.json", "utf-8")), createPathToDev = function (file) {
    return devFolder + "/" + file;
}, compileFolder = function (pathToFile) {
    var program = ts.createProgram(pathToFile.map(function (file) {
        return createPathToDev(file);
    }), tsConfig);
    var emitResult = program.emit();
    var allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    allDiagnostics.forEach(function (diagnostic) {
        var stat = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        var line = stat.line;
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        //colorize input
        process.stdout.write("\x1b[31m");
        process.stdout.write("Message: " + message + " \n");
        process.stdout.write("\x1b[37m");
        process.stdout.write("File: " + diagnostic.file.fileName + " \n");
        process.stdout.write("\x1b[32m");
        process.stdout.write("Line: " + diagnostic.file.getText().split("\n")[line].trim() + " \n");
        process.stdout.write("\x1b[37m");
        process.stdout.write("\n");
    });
    if (!allDiagnostics.length) {
        process.stdout.write("Compilation end\n");
    }
};
gulp.task("tsBuild", function () {
    compileFolder(fs.readdirSync(devFolder).filter(function (file) {
        return file.endsWith(".ts");
    }));
});
gulp.task("less", function () {
    return gulp.src("./bin/styles/*.less")
        .pipe(less({
        paths: [path.join("./bin/styles/", "less", "includes")],
        compress: true
    }))
        .pipe(gulp.dest("./bin/styles/"));
});
gulp.task("watcher", function () {
    fs.watch(devFolder, {
        recursive: true
    }, function (e, file) {
        if (file.endsWith(".ts")) {
            compileFolder([file]);
            return;
        }
        if (file.endsWith(".less")) {
            gulp.start("less");
            return;
        }
    });
});
