# portfolio

# Setup

1) Clone this repository
2) 
    * ``npm i``
    * ``yarn``
3) 
    * ``npm run dev``
    * ``yarn dev``

# Explainations

## Project tree

```
portfolio
    |- public
        |- build ----------------------------------- Stylus and Svelte builds
        |- images ---------------------------------- List of images used for the website
            |- icons ------------------------------- Icons in .svg
        |- fontawesome.js -------------------------- To load icons (not .svg)
        |- index.html ------------------------------ Root file
        |- utils.js -------------------------------- Client javascript
    |- src
        |- components ------------------------------ Reusable components
            |- AnimatedButton.svelte --------------- Button which contain an animation on Hover
            |- ProjectCard.svelte ------------------ Card style for projects showed
            |- Sidebar.svelte ---------------------- Website sidebar
        |- pages ----------------------------------- Each section of the website
            |- Contact.svelte ---------------------- Contacts Section
            |- Home.svelte ------------------------- First Section
            |- Me.svelte --------------------------- About me Section
            |- Projects.svelte --------------------- Projects Section
        |- styles ---------------------------------- All styles of the project
            |- fixes.styl -------------------------- Style which fix layout our Bulma components
            |- global.styl ------------------------- Random styles
        |- App.svelte ------------------------------ Website page
        |- data.js --------------------------------- Simple json data
        |- main.js --------------------------------- File readed by Rollup
```

## Project dependencies

```js
"devDependencies": {
    "@rollup/plugin-commonjs": "^11.0.0", // ----------- Rollup plugin to convert CommonJS modules to ES6
    "@rollup/plugin-node-resolve": "^7.0.0", // -------- Rollup plugin for node_modules
    "autoprefixer": "^9.7.4", // ----------------------- Import css files into js files
    "gulp": "^4.0.2", // ------------------------------- To create custom tasks (useful in dev mode)
    "gulp-concat": "^2.6.1", // ------------------------ Concat files (used for stylus files)
    "gulp-connect": "^5.7.0", // ----------------------- Server with livereload
    "gulp-stylus": "^2.7.0", // ------------------------ To compile stylus files
    "rollup": "^1.20.0", // ---------------------------- To compile and bundle
    "rollup-plugin-postcss": "^2.0.6", // -------------- Css files edits
    "rollup-plugin-svelte": "^5.0.3", // --------------- Compile Svelte files
    "rollup-plugin-terser": "^5.1.2", // --------------- Minify compilation
    "svelte": "^3.0.0" //  ----------------------------- To compile Svelte files
},
"dependencies": {
    "animate.css": "^3.7.2", // ------------------------ To animate things
    "aos": "^3.0.0-beta.6", // ------------------------- Effects on scroll
    "bulma": "^0.8.0", // ------------------------------ Layout and components
}
```