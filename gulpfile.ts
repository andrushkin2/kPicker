import * as gulp from "gulp";
import * as ts from "typescript";
import * as fs from "fs";
import * as less from "gulp-less";
import * as path from "path";

let devFolder = "./bin",
    tsConfig = JSON.parse(fs.readFileSync("./tsconfig.json", "utf-8")),
    createPathToDev = (file: string) => {
        return `${devFolder}/${file}`;
    },
    compileFolder = (pathToFile: string[]) => {
        let program: ts.Program = ts.createProgram(pathToFile.map(file => {
            return createPathToDev(file);
        }), tsConfig);
        let emitResult = program.emit();

        let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

        allDiagnostics.forEach(diagnostic => {
            let stat = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            let line = stat.line;
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

            //colorize input
            process.stdout.write("\x1b[31m");
            process.stdout.write(`Message: ${message} \n`);
            process.stdout.write("\x1b[37m");
            process.stdout.write(`File: ${diagnostic.file.fileName} \n`);
            process.stdout.write("\x1b[32m");
            process.stdout.write(`Line: ${ diagnostic.file.getText().split("\n")[line].trim() } \n`);
            process.stdout.write("\x1b[37m");
            process.stdout.write("\n");
        });

        if (!allDiagnostics.length) {
            process.stdout.write("Compilation end\n");
        }
    };


gulp.task("tsBuild", function() {
    compileFolder(fs.readdirSync(devFolder).filter(file => {
        return file.endsWith(".ts");
    }));
});

gulp.task("less", function () {
  return gulp.src("./bin/styles/*.less")
    .pipe(less({
      paths: [ path.join("./bin/styles/", "less", "includes") ],
      compress: true
    }))
    .pipe(gulp.dest("./bin/styles/"));
});

gulp.task("watcher", () => {
    fs.watch(devFolder, {
        recursive: true
    }, (e, file) => {
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