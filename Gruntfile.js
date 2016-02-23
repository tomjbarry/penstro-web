module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      development: {
        options: {
          paths: './css',
          yuicompress: true
        },
        files: {
          './public/css/app.css': 'less/app.less'
        }
      }
    },

    watch: {
      files: ['./less/**.less','./less/**/**.less'],
      tasks: ['less']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
};