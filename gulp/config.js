module.exports = {
    browserSync: {
        server: {
            // Serve up our build folder
            baseDir: './examples/dist'
        }
    },
    browserify: {
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [{
            entries: './examples/00/index.js',
            dest: './examples/dist/js/00',
            outputName: 'index.js',
            external: []
        }, {
            entries: './examples/01/index.js',
            dest: './examples/dist/js/01',
            outputName: 'index.js',
            external: []
        }]
    }
};
