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
    				match: /\/\/ @include Input.js/g,
  					replacement: '<%= grunt.file.read("./client/src/Input.js") %>'
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
    				match: /\/\/ @include underscoreFunctions.js/g,
  					replacement: '<%= grunt.file.read("./client/src/underscoreFunctions.js") %>'
  				},
  				{
    				match: /\/\/ @include warning.txt/g,
  					replacement: '<%= grunt.file.read("./client/src/warning.txt") %>'
  				}
  		  ],
  		  force: true
  		},
        files: [
          {expand: true, flatten: true, src: ['./client/src/nodebotui-client.js'], dest: './client'}
        ]
			}
		}
	});

	//grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-replace');
	
	grunt.registerTask('default', ['replace']);
}
	