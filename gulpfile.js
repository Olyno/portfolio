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

let production = false;

function watchFiles() {
    connect.server({
        root: 'public',
        livereload: true,
        port: 3000
    });
    watch(['src/**/*.styl'], series(buildStyles, reloadApp));
    return watch(['src/**/*.svelte'], series(buildingApp, reloadApp));
}

function buildStyles() {
    return src('src/**/*.styl')
        .pipe(concat('global.styl'))
        .pipe(stylus())
        .pipe(dest('public/build'))
}

function buildingApp() {
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

function startApp() {
    connect.server({
        root: 'public',
        port: 3000
    });
}

function reloadApp() {
    return src('public/**/*')
        .pipe(connect.reload())
}

function setup() {
    return new Promise((resolve, rejects) => {
        production = true;
        resolve();
    })
}

exports.build = series(setup, parallel(buildingApp, buildStyles))
exports.dev = watchFiles;
exports.start = startApp;