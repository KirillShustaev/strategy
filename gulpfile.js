const gulp = require("gulp")
const sass = require("gulp-sass")(require("sass"))
const rename = require("gulp-rename")
const cleanCSS = require("gulp-clean-css")
const babel = require("gulp-babel")
const uglify = require("gulp-uglify")
const concat = require("gulp-concat")
const sourcemaps = require("gulp-sourcemaps")
const autoprefixer = require("gulp-autoprefixer")
const imagemin = require("gulp-imagemin")
const htmlmin = require('gulp-htmlmin');
const newer = require('gulp-newer');
const del = require("del")

const path = {
    html: {
        src: "src/index.html",
        dest: "dist/"
    },
    styles: {
        src: "src/styles/**/*.css",
        dest: "dist/css/"
    },
    scripts: {
        src: "src/scripts/**/*.js",
        dest: "dist/js/"
    },
    images: {
        src: "src/img/*",
        dest: "dist/img/"
    },
    fonts: {
        src: "src/fonts/*",
        dest: "dist/fonts/"
    }
}

function clean() {
    return del(["dist/*", "!dist/img"])
}

function html() {
    return gulp.src(path.html.src)
      .pipe(htmlmin({
        collapseWhitespace: true
    }))
      .pipe(gulp.dest(path.html.dest));
}

function styles() {
    return gulp.src(path.styles.src)
        .pipe(sourcemaps.init())
        // .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
			cascade: false
		}))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(rename({
            basename: "style",
            suffix: ".min"
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(path.styles.dest))
}

function scripts() {
    return gulp.src(path.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ["@babel/env"]
    }))
    .pipe(uglify())
    .pipe(concat("main.min.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(path.scripts.dest))
}

function img() {
    return gulp.src(path.images.src)
    .pipe(newer(path.images.dest))
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest(path.images.dest))
}

function font() {
    return gulp.src(path.fonts.src)
        .pipe(gulp.dest(path.fonts.dest))
}

function watch() {
    gulp.watch(path.html.src, html)
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
    gulp.watch(path.images.src, img)
    gulp.watch(path.fonts.src, font)
}

const build = gulp.series(clean, gulp.parallel(html, styles, scripts, img, font),  watch)


exports.html = html
exports.clean = clean
exports.img = img
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build