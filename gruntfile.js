module.exports = function(grunt) {

	// Project configuration
	grunt.initConfig({

		replace: {
			client: {
				options: {
  				patterns: [{ 
  					match: /\/\/ @include Board.js/g,
  					replacement: '<%= grunt.file.read("./client/lib/Board.js") %>' 
  				},
  				{
    				match: /\/\/ @include Input.js/g,
  					replacement: '<%= grunt.file.read("./client/lib/Input.js") %>'
  				},
  				{
    				match: /\/\/ @include deviceTypes.js/g,
  					replacement: '<%= grunt.file.read("./client/lib/deviceTypes.js") %>'
  				},
  				{
    				match: /\/\/ @include deviceMethods.js/g,
  					replacement: '<%= grunt.file.read("./client/lib/deviceMethods.js") %>'
  				},
  				{
    				match: /\/\/ @include inputTypes.js/g,
  					replacement: '<%= grunt.file.read("./client/lib/inputTypes.js") %>'
  				},
  				{
    				match: /\/\/ @include underscoreFunctions.js/g,
  					replacement: '<%= grunt.file.read("./client/lib/underscoreFunctions.js") %>'
  				}
  		  ],
  		  force: true
  		},
        files: [
          {expand: true, flatten: true, src: ['./client/lib/nodebotui-client.js'], dest: './client'}
        ]
			}
		}
	});

	//grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-replace');
	
	grunt.registerTask('default', ['replace']);
}
	