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
            |- Sidebar.svelte ---------------------- Mobile and desktop sidebar
        |- pages ----------------------------------- Each section of the website
            |- Contact.svelte ---------------------- Contacts Section
            |- Home.svelte ------------------------- First Section
            |- Me.svelte --------------------------- About me Section
            |- Projects.svelte --------------------- Projects Section
        |- App.svelte ------------------------------ Website page
        |- data.js --------------------------------- Simple json data
        |- global.styl ----------------------------- Global style
        |- main.js --------------------------------- File readed by Rollup
    |- .whitesource -------------------------------- Security Checker App config
```

## Project dependencies

```js
"devDependencies": {
    "@rollup/plugin-commonjs": "^11.0.0", // ----------- Rollup plugin to convert CommonJS modules to ES6
    "@rollup/plugin-node-resolve": "^7.0.0", // -------- Rollup plugin for node_modules
    "autoprefixer": "^9.7.4", // ----------------------- Import css files into js files
    "rollup": "^1.20.0", // ---------------------------- To compile and bundle
    "rollup-plugin-livereload": "^1.0.0", // ----------- To have a livereload in dev mode
    "rollup-plugin-postcss": "^2.0.6", // -------------- Css files edits
    "rollup-plugin-stylus-compiler": "^1.0.1", // ------ Compile stylus files
    "rollup-plugin-svelte": "^5.0.3", // --------------- Compile Svelte files
    "rollup-plugin-terser": "^5.1.2", // --------------- Minify compilation
    "svelte": "^3.0.0" //  ----------------------------- To compile Svelte files
},
"dependencies": {
    "animate.css": "^3.7.2", // ------------------------ To animate things
    "aos": "^3.0.0-beta.6", // ------------------------- Effects on scroll
    "bulma": "^0.8.0", // ------------------------------ Layout and components
    "sirv-cli": "^0.4.4" // ---------------------------- Just to serve website
}
```