module.exports = function(grunt) {

	// Project configuration
	grunt.initConfig({

		replace: {
			client: {
				options: {
  				patterns: [{ 
  					match: /\/\/ @include Board.js/g,
  					replacement: '<%= grunt.file.read("./client/src/Board.js") %>' 
  				},
  				{
    				match: /\/\/ @include BrowserControl.js/g,
  					replacement: '<%= grunt.file.read("./client/src/BrowserControl.js") %>'
  				},
  				{
    				match: /\/\/ @include deviceTypes.js/g,
  					replacement: '<%= grunt.file.read("./client/src/deviceTypes.js") %>'
  				},
  				{
    				match: /\/\/ @include deviceMethods.js/g,
  					replacement: '<%= grunt.file.read("./client/src/deviceMethods.js") %>'
  				},
  				{
    				match: /\/\/ @include inputTypes.js/g,
  					replacement: '<%= grunt.file.read("./client/src/inputTypes.js") %>'
  				},
  				{
    				match: /\/\/ @include browserControls.js/g,
  					replacement: '<%= grunt.file.read("./client/src/browserControls.js") %>'
  				},
  				{
    				match: /\/\/ @include underscoreFunctions.js/g,
  					replacement: '<%= grunt.file.read("./client/src/underscoreFunctions.js") %>'
  				},
  				{
    				match: /\/\/ @include warning.txt/g,
  					replacement: '<%= grunt.file.read("./client/src/warning.txt") %>'
  				},
  				{
    				match: /\/\/ @include easing.js/g,
  					replacement: '<%= grunt.file.read("./client/src/easing.js") %>'
  				}
  		  ],
  		  force: true
  		},
        files: [
          {expand: true, flatten: true, src: ['./client/src/nodebotui-client.js'], dest: './client'}
        ]
			}
		},
		jshint: {
		  client: ['client/src/*.js']
		},
		uglify: {
		  client: {
        files: [
          { src: ['client/nodebotui-client.js'], dest: 'client/nodebotui-client.min.js', filter: 'isFile' }
        ]
      }
		}
		
	});

	//grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.registerTask('default', ['jshint', 'replace', 'uglify']);
}
	