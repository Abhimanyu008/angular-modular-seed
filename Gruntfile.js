/*Author: Tushar Borole
Discription:grunt configuration file
Copyright:NisosTechnologies 2014*/


'use strict';

module.exports = function (grunt) {

    // Grunt helpers
    //require('time-grunt')(grunt);
    require('autostrip-json-comments');
    var fs = require('fs');

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Settings
    var appSettings = require('./config/application.conf.json');


    // grunt.config.init({
    grunt.initConfig({

        // Set the application settings
        settings: appSettings,

        // Server config
        connect: {
            options: {
                hostname: '<%= settings.dev.hostname %>',
                port: '<%= settings.dev.port %>',
                livereload: '<%= settings.dev.liveReloadPort %>',
                options: {
                    index: 'index.html',
                    maxAge: 300000
                }
            },
            livereload: {
                options: {
                    open: true,
                    base: [
            '.tmp',
            '<%= settings.dev.dir %>'
          ],
                    index: 'index.html'
                }
            },
            devel: {
                options: {
                    port: '<%= settings.dev.port %>',
                    hostname: '<%= settings.dev.hostname %>',
                    base: {
                        path: '<%= settings.dev.dir %>',
                        options: {
                            index: 'index.html'
                        }
                    },
                    middleware: function (connect, options, middlewares) {
                        middlewares.unshift(function (req, res, next) {
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                            return next();


                        });

                        return middlewares;
                    }
                }
            },
            /*         logger: {
                prod: {
                    option: {
                        separator: ','
                    },
                    destination: "log/prod.log",
                    logItems: {
                        "date": grunt.template.today('yyyy-mm-dd hh:mm:ss'),
                        "version": "456",
                        "project": "<%= pkg.name %>",
                        "environment": "<%= pkg.env %>"
                    }
                },
                test: {
                    destination: "log/test.log",
                    options: {
                        separator: ','
                    },
                    logItems: {
                        "date": grunt.template.today('yyyy-mm-dd hh:mm:ss'),
                        "project": "<%= pkg.name %>",
                        "environment": "<%= pkg.env %>"
                    }
                }
            },*/
            test: {
                options: {
                    port: '<%= settings.test.port %>',
                    livereload: false,
                    base: [
            '.tmp',
            'test',
            '<%= settings.dev.dir %>'
          ]
                }
            },
            dist: {
                options: {
                    port: '<%= settings.dist.port %>',
                    hostname: '<%= settings.dist.hostname %>',
                    base: {
                        path: '<%= settings.dist.dir %>',
                        options: {
                            index: 'index.html',
                            maxAge: 300000
                        }
                    },
                    middleware: function (connect, options, middlewares) {
                        middlewares.unshift(function (req, res, next) {
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.setHeader('Access-Control-Allow-Methods', '*');
                            return next();


                        });

                        return middlewares;
                    }
                }
            },
            coverage: {
                options: {
                    base: '<%= settings.test.coverage.dir %>',
                    directory: '<%= settings.test.coverage.dir %>',
                    port: '<%= settings.test.coverage.port %>',
                    keepalive: true,
                    livereload: false
                }
            }
        },

        // Watch config
        watch: {
            js: {
                files: [
          '{.tmp,<%= settings.dev.dir %>}/scripts/**/*.js',
          '<%= settings.dev.dir %>/bower_components/bootstrap/js/*.js'
        ],
                tasks: ['newer:jshint:all']
            },
            less: {
                files: [
          '<%= settings.dev.dir %>/styles/**/*.less',
          '<%= settings.dev.dir %>/bower_components/bootstrap/less/*.less'
        ],
                tasks: ['less:dev']
            },
            styles: {
                files: ['<%= settings.dev.dir %>/styles/**/*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
          // '<%= watch.js.files %>',
          '<%= settings.dev.dir %>/**/*.html',
          '.tmp/styles/**/*.css',
          // '<%= settings.dev.dir %>/styles/**/*.{css,less}',
          '<%= settings.dev.dir %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
            },
            gruntfile: {
                files: ['Gruntfile.js']
                    // tasks: ['default']
            },
            jsUnitTest: {
                files: ['test/spec-unit/**/*.js']
                    // tasks: ['newer:jshint:test', 'karma']
                    // tasks: ['karma:unit']
            },
            protractor: {
                // files: ['<%= settings.dev.dir %>/scripts/**/*.js','test/spec-e2e/**/*.js'],
                files: ['test/spec-e2e/**/*.js'],
                tasks: ['protractor:singlerun']
            }
        },

        // jsHint config
        jshint: {
            options: {
                jshintrc: __dirname + '/.jshintrc',
                reporter: require('jshint-stylish'),
                force: true
            },
            all: [
        // 'Gruntfile.js',
        '<%= settings.dev.dir %>/scripts/**/*.js'
      ],
            test: {
                options: {
                    jshintrc: __dirname + '/.jshintrc'
                },
                src: ['<%= settings.test.dir %>/**/*.js']
            }
        },

        /*uglify configuration*/
        uglify: {
            options: {
                mangle: false,
                compress: {
                    drop_console: true
                }
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.dist.dir %>',
                    src: ['*.js', '**/*.js', '!assets/vendor/**'],
                    dest: '<%= settings.dist.dir %>'
        }]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.dist.dir %>',
                    src: ['*.css', '**/*.css', '!bower_components/**'],
                    dest: '<%= settings.dist.dir %>'
        }]
            }
        },

        // Vendor prefix config
        autoprefixer: {
            options: {
                browsers: ['last 1 version'] /* https://github.com/ai/autoprefixer#browsers */
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '**/*.css',
                    dest: '.tmp/styles/'
        }]
            }
        },

        // LESS config
        /*        less: {
            dev: {
                options: {
                    paths: ['<%= settings.dev.dir %>/styles/']
                },
                files: {
                    // '<%= settings.dev.dir %>/styles/main.css': '<%= settings.dev.dir %>/styles/main.less'
                    '.tmp/styles/main.css': '<%= settings.dev.dir %>/styles/main.less'
                }
            },
            dist: {
                options: {
                    paths: ['assets/css'],
                    cleancss: true
                },
                files: {
                    '<%= settings.dev.dir %>/styles/main.css': '<%= settings.dev.dir %>/styles/main.less'
                }
            }
        },*/

        // Clean config
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
            '.tmp',
            '<%= settings.dist.dir %>/*',
            '!<%= settings.dist.dir %>/.git*'
          ]
        }]
            },
            vendor: {
                files: [{
                    dot: true,
                    src: [
            '<%= settings.dist.dir %>/assets/vendor'
          ]
        }]
            },
            server: '.tmp',
            docs: '<%= settings.docs.dir %>',
            coverage: '<%= settings.test.coverage.dir %>'
        },

        // Copy config
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.dev.dir %>',
                    dest: '<%= settings.dist.dir %>',
                    src: [
                        '**/**'
          ]
        }]
            },
            vendor: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.dev.dir %>',
                    dest: '<%= settings.dist.dir %>',
                    src: []
        }]
            },
        },

        // Build config - REV (rename)
        rev: {
            dist: {
                files: {
                    src: [
            '<%= settings.dist.dir %>/scripts/**/*.js',
            '<%= settings.dist.dir %>/styles/**/*.css',
            '<%= settings.dist.dir %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
          ]
                }
            }
        },

        // Build config - usemin
        useminPrepare: {
            html: ['<%= settings.dev.dir %>/index.html'],
            options: {
                dest: '<%= settings.dist.dir %>'
            }
        },
        usemin: {
            html: ['<%= settings.dist.dir %>/**/*.html'],
            css: ['<%= settings.dist.dir %>/styles/**/*.css'],
            options: {
                assetsDirs: ['<%= settings.dist.dir %>']
            }
        },

        // Build config - imagemin
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.dev.dir %>/images',
                    src: '**/*.{png,jpg,jpeg,gif}',
                    dest: '<%= settings.dist.dir %>/images'
        }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.dist.dir %>/fonts',
                    src: '**/*.svg',
                    dest: '<%= settings.dist.dir %>/fonts'
        }]
            }
        },

        // Build config - htmlmin
        /*        htmlmin: {
            dist: {
                options: {

                },
                files: [{
                    expand: true,
                    cwd: '<%= settings.dev.dir %>',
                    src: '<%= settings.files.htmlfile %>',
                    dest: '<%= settings.dist.dir %>'
        }]
            },
            deploy: {
                options: {
                    collapseWhitespace: true,

                },
                files: [{
                    expand: true,
                    cwd: '<%= settings.dist.dir %>',
                    src: '<%= settings.files.htmlfile %>',
                    dest: '<%= settings.dist.dir %>'
        }]
            }
        },*/
        minifyHtml: {
            options: {
                empty: true, // KEEP empty attributes
                cdata: true, // KEEP CDATA from scripts
                comments: false, // KEEP comments
                ssi: true, // KEEP Server Side Includes
                conditionals: true, // KEEP conditional internet explorer comments
                spare: true, // KEEP redundant attributes
                quotes: true, // KEEP arbitrary quotes
                loose: false // KEEP one whitespace
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.dist.dir %>',
                    src: '<%= settings.files.htmlfile %>',
                    dest: '<%= settings.dist.dir %>'
        }]
            }
        },

        // Build config - Allow the use of non-minsafe AngularJS files.
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
        }]
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            app: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    },
                ],
            }
        },
        //configuration for cancatination of js and css
        concat: {
            missing: {
                nonull: true
            },
        },

        ngconstant: {
            // Options for all targets
            // Environment targets
            development: {
                options: {
                    dest: '<%= settings.dev.dir %>/conf/config.js',
                    space: '  ',
                    wrap: '\n\n {%= __ngModule %}',
                    name: 'Config',
                },
                constants: {
                    $enviornment: require('./config/development.json')
                }
            },
            staging: {
                options: {
                    dest: '<%= settings.dev.dir %>/conf/config.js',
                    space: '  ',
                    wrap: '\n\n {%= __ngModule %}',
                    name: 'Config',
                },
                constants: {
                    $enviornment: require('./config/staging.json')
                }
            },
            production: {
                options: {
                    dest: '<%= settings.dev.dir %>/conf/config.js',
                    space: '  ',
                    wrap: '\n\n {%= __ngModule %}',
                    name: 'Config',
                },
                constants: {
                    $enviornment: require('./config/production.json')
                }
            },
            mock: {
                options: {
                    dest: '<%= settings.dev.dir %>/conf/config.js',
                    space: '  ',
                    wrap: '\n\n {%= __ngModule %}',
                    name: 'Config',
                },
                constants: {
                    $enviornment: require('./config/mock.json')
                }
            },
            assets: {
                options: {
                    space: '  ',
                    wrap: '\n\n {%= __ngModule %}',
                    name: 'apprequire',
                    dest: '<%= settings.dev.dir %>/conf/assets.js'
                },
                /* constants: {
                     APP_REQUIRES: 'app/conf/assets.json'
                 },*/

                constants: function () {
                    return {
                        APP_REQUIRES: grunt.file.readJSON('app/conf/assets.json')
                    };
                },

            },
            url: {
                options: {
                    space: '  ',
                    wrap: '\n\n {%= __ngModule %}',
                    name: 'url',
                    dest: '<%= settings.dev.dir %>/conf/url.js'
                },
                constants: function () {
                    return {
                        APP_URL: grunt.file.readJSON('app/conf/url.json')
                    };
                },

            }
        },

        // unit testing config
        karma: {
            unit: {
                configFile: './config/spec-unit.conf.js',
                autoWatch: false,
                singleRun: true
            },
            unitAuto: {
                configFile: './config/spec-unit.conf.js',
                autoWatch: true,
                singleRun: false
            },
            unitCoverage: {
                configFile: './config/spec-unit.conf.js',
                autoWatch: false,
                singleRun: true,
                reporters: ['progress', 'coverage'],
                preprocessors: {
                    'app/scripts/**.js': ['coverage'],
                    'app/views/**/*.html': ['ng-html2js']
                },
                coverageReporter: {
                    type: 'html',
                    dir: '<%= settings.test.coverage.dir %>'
                }
            },
            travis: {
                configFile: './config/spec-unit.conf.js',
                autoWatch: false,
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },

        replace: {
            dist: {
                src: ['<%= settings.dist.dir %>/styles/*.css'],
                dest: '<%= settings.dist.dir %>/styles/',
                options: {
                    processTemplates: true
                },
                replacements: [{
                    from: /url\(\s*[\'"]?(\S*\.(?:jpe?g|gif|png))[\'"]?\s*\)[^;}]*?/ig,
                    to: function (matchedWord, index, fullText, regexMatches) {

                        //replace the css image path in dist copy
                        var string = matchedWord.replace("url(", "").replace(")", "");
                        var filename = string.substring(string.lastIndexOf('/') + 1);
                        var CssUrl = "url(../images/" + filename + ")";
                        return CssUrl;
                    }
    }]
            }
        },

        'merge-json': {
            assets: {
                src: ["<%= settings.dev.dir %>/**/*.script.json"],
                dest: "<%= settings.dev.dir %>/conf/assets.json"
            },
            url: {
                src: ["<%= settings.dev.dir %>/**/*.url.json"],
                dest: "<%= settings.dev.dir %>/conf/url.json"
            }
        },


        // Open config
        open: {
            dev: {
                path: 'http://<%= settings.dev.hostname %>:<%= settings.dev.port %>'
            },
            prod: {
                path: 'http://<%= settings.dev.hostname %>:<%= settings.dist.port %>'
            },
            docs: {
                path: 'http://<%= settings.dev.hostname %>:<%= settings.docs.port %>'
            },
            coverage: {
                path: 'http://<%= settings.dev.hostname %>:<%= settings.test.coverage.port %>'
            }
        },

        // Concurrent servers config
        concurrent: {
            servers: {
                tasks: [
          'server:dev',
          'server:dist',
          'server:docs',
          'server:test:unit',
          // 'server:test:e2e',
          'server:coverage'
        ],
                options: {
                    logConcurrentOutput: true,
                    limit: 20
                }
            },
            dev: [
        'watch:js',
        'watch:less',
        'watch:styles',
        'watch:livereload',
        'watch:gruntfile'
      ],
            test: [
        'less:dist',
        'copy:styles'
      ],
            dist: [
        'less:dist',
        'copy:styles',
        //'imagemin',
          'copy:image',
          'copy:font',
        'svgmin',
        //'copy:html'
      ]
        }


        /* shell: {
            options: {
                stdout: true,
                async: false
            },
            // Install locally dev dependencies in package.json (node_modules/*)
            npm_install: {
                command: 'npm install'
            },
            // Install locally bower components (app/bower_components/*)
            bower_install: {
                command: 'bower install'
            },
            // Download latest version of selenium server
            // https://code.google.com/p/selenium/downloads/list
            // ALL -> http://selenium.googlecode.com/files/selenium-server-2.39.0.zip
            // JAR -> http://selenium.googlecode.com/files/selenium-server-standalone-2.39.0.jar
            selenium_install: {
                // todo: download selenium 2 .jar file based on environment
                command: ''
                // execOptions: {
                //   cwd: './test/selenium/'
                // }
            },
            // Download latest chrome driver
            // http://chromedriver.storage.googleapis.com/index.html
            // Win32 -> http://chromedriver.storage.googleapis.com/2.8/chromedriver_win32.zip
            // Linux32 -> http://chromedriver.storage.googleapis.com/2.8/chromedriver_linux32.zip
            // Linux64 -> http://chromedriver.storage.googleapis.com/2.8/chromedriver_linux64.zip
            // Mac32 -> http://chromedriver.storage.googleapis.com/2.8/chromedriver_mac32.zip
            chromedriver_install: {
                // todo: download chrome driver .exe based on environment
                command: ''
            },
            // Download latest version of phantomjs
            // http://phantomjs.org/download.html
            // Win -> https://phantomjs.googlecode.com/files/phantomjs-1.9.2-windows.zip
            // Mac -> https://phantomjs.googlecode.com/files/phantomjs-1.9.2-macosx.zip
            // Linux32 -> https://phantomjs.googlecode.com/files/phantomjs-1.9.2-linux-i686.tar.bz2
            // Linux64 -> https://phantomjs.googlecode.com/files/phantomjs-1.9.2-linux-x86_64.tar.bz2
            phantomjs_manual_install: {
                // todo: download phantomjs .exe based on environment
                command: ''
            },
            // Download latest version of protractor
            // You need to apply this patch to fix a known bug: https://github.com/angular/protractor/issues/85
            // https://github.com/vrtdev/protractor/commit/2f18b01378e4f054331df23ce536e4081ee1ccf0
            protractor_install: {
                // todo: apply patch to latest version of protractor
                command: ''
            }
        }*/

    });


    /* -- SERVER TASKS ----------------------------------------------- */

    /*  grunt.registerTask('server', 'Start up all servers.', [
      'concurrent:servers'
    ]);*/

    /* @discription
 n {string} it is build type can be development/mock*/
    grunt.registerTask('server', 'Start up the development live reload server', function (n) {
        if (n == null) {
            grunt.warn('Build type must be specified');
        }
        grunt.task.run('ngconstant:' + n,
            'merge-json',
            'ngconstant:assets',
            'ngconstant:url',
            'connect:devel',
            // 'concurrent:dev'
            'watch');
    });




    grunt.registerTask('server:dist', 'Start up the production app preview server.', [
    'connect:dist',
          'watch'
  ]);

   




    /* @discription
     n {string} it is build type can be production/development/staging*/
    grunt.registerTask('build', 'Build a production ready app', function (n) {
        if (n == null) {
            grunt.warn('Build type must be specified');
        }

        //remove console from script
        if (n == "production") {
            grunt.config('uglify.options.compress.drop_console', true);
        } else {
            grunt.config('uglify.options.compress.drop_console', false);
        }

        var copyFiles = grunt.file.readJSON('app/conf/assets.json')

        //grunt.config('copy.vendor.files[0].src', finalCopyFiles);





        grunt.task.run('clean:dist',
            'ngconstant:' + n,
             'merge-json',
            'ngconstant:assets',
            'ngconstant:url',
            'copy:dist',
            //'clean:vendor',
            //'copy:vendor',
            'useminPrepare',
            'svgmin',
            'autoprefixer',
            'concat',
            'ngAnnotate',
            'cssmin',
            'uglify',
            'usemin',
            'replace:dist',
            'minifyHtml');
    });


    /* -- DOCS TASKS ----------------------------------------------- */

    grunt.registerTask('docs:build', 'Build the api documentation.', [
    'clean:docs',
    'docular'
  ]);
    grunt.registerTask('docs', 'Build the docs and start the docs server.', [
    'docs:build',
    'server:docs'
  ]);


    /* -- INSTALL TASKS -------------------------------------------- */

    grunt.registerTask('install', 'Install stuff that is required for development servers.', [
    "shell:npm_install",
    "shell:bower_install",
    "shell:selenium_install",
    "shell:chromedriver_install",
    "shell:phantomjs_manual_install",
    "shell:protractor_install",
    "build",
    "docs:build",
    "karma:unitCoverage"
  ]);


    /* -- DEFAULT TASK --------------------------------------------- */

    grunt.registerTask('default', 'Run all servers.', [
    'server'
  ]);



};