const rollup = require('rollup');
const svelte = require('rollup-plugin-svelte');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const { terser } = require('rollup-plugin-terser');

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
    return watch(['src/**/*.svelte'], series(buildingApp, reloadApp));
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

            // Import Bulma CSS and more!
            postcss({
                include: '**/*.css',
                plugins: [
                    require('autoprefixer')
                ]
            }),
    
            // Svelte files compilation
            svelte({
                // enable run-time checks when not in production
                dev: !production,
                // we'll extract any component CSS out into
                // a separate file - better for performance
                css: css => {
                    css.write('public/build/bundle.css');
                }
            }),
    
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
    
            // If we're building for production (npm run build
            // instead of npm run dev), minify
            production && terser()
        ]
    })
        .then(bundle => {
            return bundle.write({
                sourcemap: true,
                format: 'iife',
                name: 'app',
                file: 'public/build/bundle.js'
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

async function setup() {
    return new Promise((resolve, rejects) => {
        production = true;
        resolve();
    })
}

exports.build = series(setup, parallel(buildingApp, buildStyles, buildIcons))
exports.dev = watchFiles;
exports.start = startApp;