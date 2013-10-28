module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['gruntfile.js', '/src/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    jsonlint: {
      files: ['bower.json', 'package.json']
    },
    //karma: {
      //develop: {
        //configFile: 'karma.conf.js',
        //background: true
      //},
      //all: {
        //configFile: 'karma.conf.js',
        //singleRun: true,
        //browsers: ['Chrome', 'Firefox', 'Opera']
      //}
    //},
    watch: {
      jshint: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
      },
      jsonlint: {
        files: ['<%= jsonlint.files %>'],
        tasks: ['jsonlint']
      },
      //karma: {
        //files: ['src/*.js', 'test/*'],
        //tasks: ['karma:develop:run']
      //}
    },
    connect: {
      server: {
        options: {
          port: 8001,
          hostname: 'localhost',
          keepalive: true,
          base: '.'
        }
      },
      test: {
        options: {
          port: 8001,
          hostname: 'localhost',
          base: '.'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsonlint');
  //grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('develop', [
    'jshint',
    'jsonlint',
    'connect:test',
    //'karma:develop',
    'watch'
  ]);
  grunt.registerTask('dev', ['develop']);

  grunt.registerTask('test', [
    'jshint',
    'jsonlint',
    //'connect:test',
    //'karma:all'
  ]);
};
