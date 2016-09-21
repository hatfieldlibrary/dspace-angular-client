/**
 * Created by mspalti on 4/29/16.
 */
// Generated on 2016-04-30 using generator-angular-fullstack 3.6.1
'use strict';

module.exports = function (grunt) {
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch (e) {
    localConfig = {};
  }


  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    // protractor: 'grunt-protractor-runner',
    buildcontrol: 'grunt-build-control',
    //istanbul_check_coverage: 'grunt-mocha-istanbul'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    app: 'app',
    config: 'config',
    client: 'app/public/client/app',
    public: 'app/public/client',
    dist: 'dist',
    proxyPath: 'ds',

    express: {
      options: {
        port: process.env.PORT || 3000
      },
      dev: {
        options: {
          script: 'server.js',
          /*jshint camelcase: false */
          node_env: 'development',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'server.js',
          /*jshint camelcase: false */
          node_env: 'production',
          debug: false
        }
      },
      test: {
        options: {
          script: 'server.js',
          /*jshint camelcase: false */
          node_env: 'test',
          debug: true
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>/ds/communities'
      }
    },
    watch: {
      // babel: {
      //   files: ['<%= client %>/**/!(*.spec|*.mock|*.html).js'],
      //   tasks: ['newer:babel:client']
      // },
      // injectJS: {
      //   files: [
      //     '<%= client %>/**/!(*.spec|*.mock).js',
      //     '!<%= client %>/app.js'
      //   ],
      //   tasks: ['injector:scripts']
      // },
      // injectCss: {
      //   files: ['<%= public %>/**/*.css'],
      //   tasks: ['injector:css']
      // },
      //mochaTest: {
      //  files: ['<%= yeoman.server %>/**/*.{spec,integration}.js'],
      //  tasks: ['env:test', 'mochaTest']
      //},
      //jsTest: {
      //  files: ['<%= yeoman.client %>/{app,components}/**/*.{spec,mock}.js'],
      //  tasks: ['newer:jshint:all', 'wiredep:test', 'karma']
      //},
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%= public %>}/**/*.{css,html}',
          '{.tmp,<%= public %>}/**/!(*.spec|*.mock).js',
          '<%= public %>/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: ['<%= app %>/**/*.{js,json}'],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          spawn: false //Without this option specified express won't be reloaded
        }
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),

      },
      test: {
        //    options: {
        //      jshintrc: 'app/test/.jshintrc'
        //    },
        //    src: ['app/test/*.js']
      },
      client: {
        src: [
          'Gruntfile.js',
          '<%= client %>/components/**/*.js',
          '<%= client %>/services/**/**/*.js',
          '<%= client %>/core/**/*.js',
          '<%= config %>/**/*.js',
          './server.js'
        ]
      }
      //options: {
      //  jshintrc: '<%= yeoman.client %>/.jshintrc',
      //  reporter: require('jshint-stylish')
      //},
      //server: {
      //  options: {
      //    jshintrc: '<%= yeoman.server %>/.jshintrc'
      //  },
      //  src: ['<%= yeoman.server %>/**/!(*.spec|*.integration).js']
      //},
      //serverTest: {
      //  options: {
      //    jshintrc: '<%= yeoman.server %>/.jshintrc-spec'
      //  },
      //  src: ['<%= yeoman.server %>/**/*.{spec,integration}.js']
      //},
      //all: ['<%= yeoman.client %>/{app,components}/**/!(*.spec|*.mock|app.constant).js'],
      //test: {
      //  src: ['<%= yeoman.client %>/{app,components}/**/*.{spec,mock}.js']
      //}
    },

    //jscs: {
    //  options: {
    //    config: ".jscsrc"
    //  },
    //  main: {
    //    files: {
    //      src: [
    //        '<%= yeoman.client %>/app/**/*.js',
    //        '<%= yeoman.server %>/**/*.js'
    //      ]
    //    }
    //  }
    //},

    // Empties folders to start fresh
    clean: {
      server: '.tmp',
      dist: {
        files: [{
          dot: true,
          src: ['<%= dist %>/*']
        }]
      }
    },

    // Debugging with node inspector
    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost'
        }
      }
    },

    // Use nodemon to run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: '<%= app %>',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 9000
          },
          callback: function (nodemon) {
            /* jshint unused: false */
            nodemon.on('log', function (event) {
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:8080/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },
    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat',
          src: '**/*.js',
          dest: '.tmp/concat'
        }]
      }
    },

    // Renames files for browser caching purposes
    // filerev: {
    //   dist: {
    //     src: [
    //       '<%= dist %>/<%= public %>/!(bower_components){,*/}*.css}',
    //       '<%= dist %>/<%= public %>/!(bower_components){,*/}*.html',
    //       '<%= dist %>/<%= client %>/!(bower_components){,*/}*.js}',
    //       '<%= dist %>/<%= public %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
    //     ]
    //   }
    // },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= public %>/index.html'],
      options: {
        root: '<%= public %>',
        dest: '<%= dist %>/<%= public %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= dist %>/<%= public %>/{,!(bower_components)/**/}*.html'],
      css: ['<%= dist %>/<%= public %>/!(bower_components){,*/}*.css'],
      js: ['<%= dist %>/<%= client %>/!(bower_components){,*/}*.js'],
      options: {
        root: '<%= public %>',
        assetsDirs: [
          '<%= dist %>/<%= public %>',
          '<%= dist %>/<%= public %>/images'
        ],
        // This is so we update image references in our ng-templates
        patterns: {
          css: [
            [/(\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the CSS to reference our revved images']
          ],
          js: [
            [/(\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= public %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
          dest: '<%= dist %>/<%= public %>/images'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    // ngAnnotate: {
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: '.tmp/concat',
    //       src: '**/*.js',
    //       dest: '.tmp/concat'
    //     }]
    //   }
    // },



    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= public %>',
          dest: '<%= dist %>/<%= public %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            // 'bower_components/**/*',
            // 'images/{,*/}*.{webp}',
            // 'fonts/**/*',
            'index.html'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= dist %>/<%= public %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          dest: '<%= dist %>',
          src: [
            'package.json',
            '<%= app %>/**/*',
            '!<%= app %>/config/local.env.sample.js'
          ]
        }, { expand: true,
          cwd: '<%= public %>',
          dest: '<%= dist %>/<%= public %>/',
          src: [
            'images/**/*',
            'fonts/**/*'
          ]

        }]
      }

    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      //server: [
      //  'newer:babel:client',
      //],
      //test: [
      //  'newer:babel:client',
      //],
      debug: {
        tasks: [
          'nodemon',
          'node-inspector'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: [
        'newer:babel:client',
        'imagemin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec',
        require: 'mocha.conf.js',
        timeout: 5000 // set default mocha spec timeout
      },
      unit: {
        src: ['<%= app %>/**/*.spec.js']
      },
      integration: {
        src: ['<%= app %>/**/*.integration.js']
      }
    },

    mocha_istanbul: {
      unit: {
        options: {
          excludes: ['**/*.{spec,mock,integration}.js'],
          reporter: 'spec',
          require: ['mocha.conf.js'],
          mask: '**/*.spec.js',
          coverageFolder: 'coverage/server/unit'
        },
        src: '<%= app %>'
      },
      integration: {
        options: {
          excludes: ['**/*.{spec,mock,integration}.js'],
          reporter: 'spec',
          require: ['mocha.conf.js'],
          mask: '**/*.integration.js',
          coverageFolder: 'coverage/server/integration'
        },
        src: '<%= app %>'
      }
    },

    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage/**',
          check: {
            lines: 80,
            statements: 80,
            branches: 80,
            functions: 80
          }
        }
      }
    },

    protractor: {
      options: {
        configFile: 'protractor.conf.js'
      },
      chrome: {
        options: {
          args: {
            browser: 'chrome'
          }
        }
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      develop: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },

    // Compiles ES6 to JavaScript using Babel
    babel: {
      options: {
        sourceMap: true
      },
      client: {
        files: [{
          expand: true,
          cwd: '<%= client %>',
          src: ['{app,components}/**/!(*.spec).js'],
          dest: '.tmp'
        }]
      },
      server: {
        options: {
          plugins: [
            'transform-class-properties',
            'transform-runtime'
          ]
        },
        files: [{
          expand: true,
          cwd: '<%= app %>',
          src: [
            '!(<%= client %>)/**/*.js',
            '!config/local.env.sample.js'
          ],
          dest: '<%= dist %>/<%= app %>'
        }]
      }
    },

    // injector: {
    //   options: {},
    //   // Inject application script files into index.html (doesn't include bower)
    //   scripts: {
    //     options: {
    //       transform: function (filePath) {
    //         var yoClient = grunt.config.get('client');
    //         filePath = filePath.replace('/' + yoClient, '');
    //         filePath = filePath.replace('/.tmp/', '');
    //         return '<script src="' + filePath + '"></script>';
    //       },
    //       sort: function (a, b) {
    //         var module = /\.module\.(js|ts)$/;
    //         var aMod = module.test(a);
    //         var bMod = module.test(b);
    //         // inject *.module.js first
    //         return (aMod === bMod) ? 0 : (aMod ? -1 : 1);
    //       },
    //       starttag: '<!-- injector:js -->',
    //       endtag: '<!-- endinjector -->'
    //     },
    //     files: {
    //       '<%= public %>/index.html': [
    //         [
    //           '<%= public %>/**/!(*.spec|*.mock).js',
    //           '!{.tmp,<%= client %>}/app.{js,ts}'
    //         ]
    //       ]
    //     }
    //   }
    //
    // }
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function () {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'env:all', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive']);
    }

    if (target === 'debug') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        // 'concurrent:pre',
        'concurrent:server',
        //  'injector',
        //  'wiredep:client',
        // 'postcss',
        'concurrent:debug'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'env:all',
      //  'concurrent:pre',
      // 'concurrent:server',
      //  'injector',
      //'wiredep:client',
      //  'postcss',
      'express:dev',
      'wait',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', function (target, option) {
    if (target === 'server') {
      return grunt.task.run([
        'env:all',
        'env:test',
        'mochaTest:unit',
        'mochaTest:integration'
      ]);
    }

    else if (target === 'client') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        //  'concurrent:pre',
        //  'concurrent:test',
        // 'injector',
        'postcss',
        //  'wiredep:test',
        'karma'
      ]);
    }

    else if (target === 'e2e') {

      if (option === 'prod') {
        return grunt.task.run([
          'build',
          'env:all',
          'env:prod',
          'express:prod',
          'protractor'
        ]);
      }

      else {
        return grunt.task.run([
          'clean:server',
          'env:all',
          'env:test',
          //   'concurrent:pre',
          //   'concurrent:test',
          // 'injector',
          //  'wiredep:client',
          'postcss',
          'express:dev',
          'protractor'
        ]);
      }
    }

    else if (target === 'coverage') {

      if (option === 'unit') {
        return grunt.task.run([
          'env:all',
          'env:test',
          'mocha_istanbul:unit'
        ]);
      }

      else if (option === 'integration') {
        return grunt.task.run([
          'env:all',
          'env:test',
          'mocha_istanbul:integration'
        ]);
      }

      else if (option === 'check') {
        return grunt.task.run([
          'istanbul_check_coverage'
        ]);
      }

      else {
        return grunt.task.run([
          'env:all',
          'env:test',
          'mocha_istanbul',
          'istanbul_check_coverage'
        ]);
      }

    }

    else {
      grunt.task.run([
        'test:server',
        'test:client'
      ]);
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    //  'concurrent:pre',
    'concurrent:dist',
    // 'injector',
    // 'wiredep:client',
    'useminPrepare',
    // 'postcss',
   // 'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'babel:server',
    // 'cdnify',
    'cssmin',
    'uglify',
    // 'filerev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    //'test',
    'build'
  ]);
};
