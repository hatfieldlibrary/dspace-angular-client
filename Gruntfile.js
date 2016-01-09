'use strict';


module.exports = function (grunt) {

  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // define reload port here to avoid conflict with
  // client applications
  var ReloadPort = 35642, files;

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    app: 'app',
    config: 'config',
    public: 'app/public',
    dist: 'dist',

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
      runlocal: {
        options: {
          script: 'server.js',
          /*jshint camelcase: false */
          node_env: 'runlocal',
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
        url: 'http://localhost:<%= express.options.port %>/item/'
      }
    },

    watch: {
      mochaTest: {
        files: ['test/*.js'],
        tasks: ['env:test', 'mochaTest']
      },
      jade: {
        files: ['<%= app %>/views/**/*.jade'],
        options: {
          livereload: ReloadPort
        }
      },
      js: {
        files: [
          '<%= public %>/javascripts/**/*.js',
        ],
        options: {
          livereload: ReloadPort
        }
      },
      module: {
        files: [
          // admin
          // '<%= public %>/stylesheets/{,*//*}*.css',
          // '<%= public %>/javascripts/{,*//*}*.js',
          // exclude bower components
          // '!<%= client %>/app/bower_components/**'
        ],
        // tasks: ['newer:jshint','express:dev', 'wait'],
        options: {
          livereload: ReloadPort,
          nospawn: true //Without this option specified express won't be reloaded
        }
      },
      express: {
        files: [
          '!<%= public %>/**/*.js',
          '<%= app %>/**/*.js',
          'config/*.js',
          'server.js',

        ],
        tasks: ['newer:jshint', 'express:dev', 'wait'],
        options: {
          livereload: ReloadPort,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

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
          '<%= app %>/controllers/**/*.js',
          '<%= app %>/models/**/**/*.js',
          '<%= public %>/javascripts/app/**/*.js',
          '<%= config %>/**/*.js',
          './server.js'
        ]
      }
    },


    clean: {
      server: '.tmp',
      dist: {
        src: ['<%= dist %>/*']
      }
    },

    copy: {
      // copy to the public ui dist directory
      client: {
        files: [{
          expand: true,
          cwd: '<%= public %>/app',
          src: ['js/*.js', '**/*.html'],
          dest: '<%= dist %>'
        }, {
          expand: true,
          flatten: false,
          cwd: '<%= public %>',
          src: ['fonts/**'],
          dest: '<%= dist %>'
        }, {
          expand: true,
          flatten: true,
          src: ['app/javascripts/vendor/modernizr.optimized.js'],
          dest: '<%= dist %>/javascripts/vendor',
          filter: 'isFile'
        }/*,
         {
         expand: true,
         flatten: false,
         cwd:'<%= client %>/app',
         src: ['css/font-awesome/**','css/i/**','css/icomoon/**','css/materialize/**' ],
         dest: '<%= dist %>'
         }   */
        ]
      }
    },

    concat: {
      server: {
        flatten: true,
        src: [
          '<%= app %>/bower_components/angular/angular.min.js',
          '<%= app %>/bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js',
          '<%= app %>/bower_components/angular-animate/angular-animate.min.js',
          '<%= app %>/bower_components/angular-route/angular-route.js',
          '<%= app %>/bower_components/angular-resource/angular-resource.js',
          '<%= app %>/bower_components/angular-aria/angular-aria.min.js',
          '<%= app %>/bower_components/angular-material/angular-material.js',
          '<%= app %>/bower_components/ng-file-upload-shim/ng-file-upload-shim.min.js',
          '<%= app %>/bower_components/ng-file-upload/ng-file-upload.min.js',
          '<%= app %>/bower_components/d3/d3.js',
        ],
        dest: '<%= public %>/javascripts/vendor/main.js'
      }
    },

    imagemin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= client %>/app/images/',
          src: ['**/*.{jpg,gif,svg,jpeg,png}'],
          dest: '<%= dist %>/images/'
        }]
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: '<%= dist %>/css',
        src: ['**/*.css', '!*.min.css'],
        dest: '<%= dist %>/css',
        ext: '.min.css'
      }
    },

    uglify: {
      options: {
        preserveComments: 'some',
        mangle: false
      }
    },

    // useminPrepare: {
    //   jade: ['<%= public %>/views/header.jade', '<%= public %>/views/js-load.jade'],
    //   options: {
    //     dest: '<%= dist %>'
    //    }
    //  },

    jadeUsemin: {
      scripts: {
        options: {
          dirs: ['<%= public %>'],
          tasks: {
            js: ['uglify'],
            css: ['cssmin']
          }
        },
        cwd: '<%= public %>',
        files: [{src: '<%= app %>/views/js-load.jade'}]
      }
      // jade: ['<%= dist %>/**/*.jade'],
      /// css: ['<%= dist %>/stylesheets/**/*.css'],
      // options: {
      //   dirs: ['<%= dist %>']
      // }
    },

    bowerInstall: {
      target: {
        src: [
          '<%= client %>/app/index.html'
        ],
        exclude: [
          'jasmine',
          'modernizr',
          'font-awesome',
          'jquery-placeholder',
          'jquery.cookie'
        ]
      }
    },

    karma: {
      unit: {
        configFile: '<%= client %>/test/karma.conf.js'
      }
    },

    mocha: {
      all: {
        options: {
          //   reporter: 'spec',
          ui: 'bdd',
          slow: true,
          run: true
        }
      },
      src: ['<%= app %>/test/{,*/}*.js']
    },

    env: {
      test: {
        NODE_ENV: 'test'
      }
    },

    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost',
          'web-port': 8080,
          'debug-port': 5858,
          'save-live-edit': true,
          'preload': false,
          'hidden': ['node_modules'],
          'stack-trace-limit': 4
        }
      }

    },

    modernizr: {

      dist: {
        devFile: 'app/bower_components/modernizr/modernizr.js',
        outputFile: 'app/javascripts/vendor/modernizr.optimized.js',
        extra: {
          shiv: true,
          printshiv: false,
          load: true,
          mq: false,
          cssclasses: true
        },
        extensibility: {
          addtest: false,
          prefixed: false,
          teststyles: false,
          testprops: false,
          testallprops: false,
          hasevents: false,
          prefixes: false,
          domprefixes: false
        },
        uglify: true,
        tests: [],
        parseFiles: true,
        files: {
          src: []
        },
        matchCommunityTests: false,
        customTests: []
      }
    }

  });

  // grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.config.requires('watch.js.files');
  // grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-clean');
  // grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-cssmin');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  // grunt.loadNpmTasks('grunt-jade-usemin');
  // grunt.loadNpmTasks('grunt-bower-install');
  // grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-modernizr');
  grunt.loadNpmTasks('grunt-mocha');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);


  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');
    var done = this.async();
    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 500);
  });
  grunt.registerTask('serverTest', function () {
    grunt.task.run([
      'env:test',
      'mocha'
    ]);
  });
  grunt.registerTask('test', ['karma']);
  grunt.registerTask('bower-install', ['bowerInstall']);
  grunt.registerTask('validate-js', ['jshint']);
  // grunt.registerTask('compile-sass', ['sass']);
  grunt.registerTask('debug-node', 'node-inspector');
  grunt.registerTask('develop', function () {
    grunt.task.run([
      'clean:server',
      //'compile-sass',
      //'concat:serverlibs',
      //'concat:serverfoundation',
      // Uncomment the following uglify task if you
      // want to test javascript libs for admin
      // mode. It takes a while to complete, which
      // is why it is commented out here. The task
      // is included by default when you publish.
      // 'uglify:server',
      'express:dev',
      'bower-install',
      'open',
      'watch'
    ]);
  });
  grunt.registerTask('runlocal', function () {
    grunt.task.run([
      'clean:server',
      'express:runlocal',
      'open',
      'watch'
    ]);
  });

  /**
   * To publish the application, copy the entire project
   * directory to the server.  You can manually remove development
   * dependencies if you like. See Readme for more details.
   *
   * But, it's still a good idea to validate.
   */
  grunt.registerTask('publish', [

    'validate-js'

  ]);

  grunt.registerTask('validate', [

    'validate-js'

  ]);

};
