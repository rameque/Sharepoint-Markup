module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: {
            src: 'partials/index.html',
            dist: ''
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: ['assets/js/jquery-3.1.0.min.js','assets/js/groups.sharepoint.js'],
                dest: 'build/assets/js/sharepoint.min.js'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'assets/css',
                    src: ['*.css'],
                    dest: 'build/assets/css',
                    ext: '.min.css'
                }]
            }
        },
        copy: {
            build: {
                expand: true,
                src: ['assets/css/images/**','assets/css/fonts/**'],
                dest: 'build/',
            }
        },
        'string-replace': {
            dev: {
                files: {
                    'index.html': 'partials/index.html',
                    'partials/recent.documents.html': 'partials/document/recent.document.html',
                    'partials/team.html': 'partials/team/team.html',
                    'partials/blog.entries.html': 'partials/blog/blog.entries.html'
                },
                options: {
                    replacements: [
                        // place files inline example
                        {
                            pattern: /<!-- @import (.*?) -->/ig,
                            replacement: function(match, p1) {
                                return grunt.file.read(grunt.config.get('config.dist') + p1);
                            }
                        }
                    ]
                }
            },
            build: {
                files: {
                    'build/index.html': 'partials/index.html',
                    'partials/recent.documents.html': 'partials/document/recent.document.html',
                    'partials/team.html': 'partials/team/team.html',
                    'partials/blog.entries.html': 'partials/blog/blog.entries.html'
                },
                options: {
                    replacements: [
                        // place files inline example
                        {
                            pattern: /<!-- @import (.*?) -->/ig,
                            replacement: function(match, p1) {
                                var getHTML = grunt.config.get('config.dist') + p1;
                                if (getHTML.indexOf('head.') !== -1) {
                                    getHTML = getHTML.replace('.html', '.build.html');
                                }
                                return grunt.file.read(getHTML);
                            }
                        }
                    ]
                }
            }
        },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "assets/css/main.css": "assets/css/main.less" // destination file and source file
                }
            }
        },
        watch: {
            styles: {
                files: ['assets/css/**/*.less'], // which files to watch
                tasks: ['less', 'cssmin'],
                options: {
                    nospawn: true
                }
            },
            html: {
                files: ['partials/**/*.html'], // which files to watch
                tasks: ['string-replace'],
                options: {
                    nospawn: true
                }
            }
        },
        browserSync: {
            bsFiles: {
                src: ['build/assets/css/*.css', 'build/*.html']
            },
            options: {
                server: {
                    baseDir: "./build/"
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-browser-sync');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'cssmin', 'string-replace', 'copy']);

};
