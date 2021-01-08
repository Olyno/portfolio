const rollup = require('rollup');
const svelte = require('rollup-plugin-svelte');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { terser } = require('rollup-plugin-terser');
const css = require('rollup-plugin-css-only');
const compiler = require('@ampproject/rollup-plugin-closure-compiler');
const purgecss = require('rollup-plugin-purgecss');

const { src, dest, watch, parallel, series } = require('gulp');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const stylus = require('gulp-stylus');

const fs = require('fs-extra');
const axios = require('axios');
const sharp = require('sharp');

let production = false;

async function watchFiles() {
    connect.server({
        root: 'public',
        livereload: true,
        port: 3000
    });
    watch(['src/**/*.styl'], series(buildStyles, reloadApp));
    return watch(['src/**/*.svelte', 'src/**/*.js'], series(buildingApp, reloadApp));
}

async function buildIcons() {
    const outputDir = 'public/images/icons-pwa';
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    return fs.emptyDir(outputDir)
        .then(() => axios({
            url: 'https://github.com/Olyno.png',
            responseType: 'stream'
        })).then(({ data: response }) => {
            return new Promise((resolve, rejects) => {
                response.pipe(fs.createWriteStream(`${outputDir}/base.png`));
                response.on('close', resolve);
                response.on('error', rejects);
            })
        }).then(async () => {
            for (const size of sizes) {
                await sharp(`${outputDir}/base.png`)
                    .resize(size, size)
                    .toFile(`${outputDir}/icon-${size}x${size}.png`);
                await sharp(`${outputDir}/base.png`)
                    .resize(size, size)
                    .toFile(`${outputDir}/icon-${size}x${size}.webp`);
                await sharp(`${outputDir}/base.png`)
                    .resize(size, size)
                    .toFile(`${outputDir}/icon-${size}x${size}.avif`);
            }
        }).then(() => fs.remove(`${outputDir}/base.png`));
}

async function buildStyles() {
    return src('src/**/*.styl')
        .pipe(concat('global.styl'))
        .pipe(stylus())
        .pipe(dest('public/build'))
}

async function buildingApp() {
    return rollup.rollup({
        input: 'src/main.js',
        plugins: [
    
            // Svelte files compilation
            svelte(),

            // we'll extract any component CSS out into
		    // a separate file - better for performance
            css({ output: 'bundle.css' }),
    
            // If you have external dependencies installed from
            // npm, you'll most likely need these plugins. In
            // some cases you'll need additional configuration -
            // consult the documentation for details:
            // https://github.com/rollup/plugins/tree/master/packages/commonjs
            resolve({
                browser: true,
                dedupe: ['svelte']
            }),
            commonjs(),
            json(),
    
            // If we're building for production (npm run build
            // instead of npm run dev), minify
            production && purgecss(),
            production && terser(),
            production && compiler(),
        ]
    })
        .then(bundle => {
            bundle.write({
                sourcemap: true,
                format: 'es',
                file: 'public/build/modern/bundle.js'
            })
            return bundle.write({
                sourcemap: true,
                format: 'iife',
                name: 'app',
                file: 'public/build/legacy/bundle.js'
            })
        })
        .catch(console.error)
}

async function startApp() {
    connect.server({
        root: 'public',
        port: 3000
    });
}

async function reloadApp() {
    return src('public/**/*')
        .pipe(connect.reload())
}

async function makeProd() {
    return new Promise((resolve, rejects) => {
        production = true;
        resolve();
    })
}

exports.build = series(makeProd, parallel(buildingApp, buildStyles, buildIcons))
exports.dev = parallel(watchFiles, buildStyles, buildingApp);
exports.start = startApp;