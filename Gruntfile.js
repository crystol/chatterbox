module.exports = function () {
    'use strict';
    var grunt = require('grunt');
    grunt.initConfig({
        package: grunt.file.readJSON('package.json'),
        staticDir: '../static',
        // Clean build and temp directories
        clean: {
            start: ['build/'],
            finish: ['build/.temp/', 'build/less/', 'build/private/', 'build/js/']
        },
        // Clone source tree to build directory
        copy: {
            everything: {
                files: [{
                    expand: true,
                    cwd: 'source/',
                    src: '**/**',
                    dest: 'build/',
                }]
            },
            server: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'source/*.js',
                    dest: 'build/'
                }, ]
            },
            js: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'source/js/*.js',
                    dest: 'build/public/js/'
                }]
            },
            less: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'source/less/*.less',
                    dest: 'build/public/less/'
                }]
            },
            views: {
                files: [{
                    expand: true,
                    cwd: 'source/',
                    src: 'views/**',
                    dest: 'build/'
                }]
            },
            privates: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'source/private/*.js',
                    dest: 'build/routes/'
                }, {
                    expand: true,
                    cwd: 'source/private/views',
                    src: '**/*.jade',
                    dest: 'build/views/'
                }],
            }
        },
        // Render Less to  CSS
        less: {
            development: {
                options: {
                    paths: ['source/less']
                },
                files: [{
                    expand: true,
                    cwd: 'source/less',
                    src: ['*.less'],
                    dest: 'build/public/css/',
                    ext: '.css'
                }]
            }
        },
        //watches for changes within files & perform tasks if found
        watch: {
            options: {
                spawn: false,
                interrupt: true,
                livereload: 35729
            },
            server: {
                files: ['source/*.js'],
                tasks: ['copy:server', 'jshint']
            },
            js: {
                files: ['source/js/*.js'],
                tasks: ['copy:js', 'concat:require', 'jshint']
            },
            views: {
                files: ['source/views/**', 'source/views/**/**'],
                tasks: ['copy:views']
            },
            privates: {
                files: ['source/private/*.js', 'source/private/views/**', 'source/private/views/**/**'],
                tasks: ['copy:privates']
            },
            less: {
                files: ['source/less/*.less'],
                tasks: ['less:development']
            }
        },
        // Auto restart the server if conditions meet
        nodemon: {
            development: {
                options: {
                    cwd: __dirname,
                    file: 'build/server.js',
                    // Sets the environment for node to development(configuration purposes)
                    env: {
                        'NODE_ENV': 'development'
                    },
                    delayTime: 2,
                    watchedExtensions: ['js'],
                    watchedFolders: ['source/', 'source/private/'],
                    ignoredFiles: ['source/js/**']
                }
            }
        },
        // Run watch and nodemon at the same time to serve the site live
        concurrent: {
            target: {
                tasks: ['nodemon:development', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });
    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    // Assign tasks names
    grunt.registerTask('default', ['live']);
    grunt.registerTask('development', ['clean:start', 'copy', 'less', 'clean:finish']);
    grunt.registerTask('live', ['development', 'concurrent']);
};