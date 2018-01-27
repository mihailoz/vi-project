module.exports = function(grunt) {
    
    // Project configuration.
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: {
                        path: 'www',
                        options: {
                            index: "index.html",
                            maxAge: 300000
                        }
                    },
                    keepalive: true,
                    livereload: true
                }
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    // Default task(s).
    grunt.registerTask('default', ['uglify']);
    
};