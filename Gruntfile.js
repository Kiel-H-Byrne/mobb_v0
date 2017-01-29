

/*global module:false*/
module.exports = function(grunt) {

    var mozjpeg = require('imagemin-mozjpeg');
    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        realFavicon: {
            favicons: {
                src: 'public/img/KIBU-logo_lg.png',
                dest: 'public/img/icons',
                options: {
                    iconsPath: '/img',
                    html: ['client/head.html'],
                    design: {
                        ios: {
                            pictureAspect: 'noChange',
                            assets: {
                                ios6AndPriorIcons: false,
                                ios7AndLaterIcons: true,
                                precomposedIcons: false,
                                declareOnlyDefaultIcon: true
                            }
                        },
                        desktopBrowser: {},
                        windows: {
                            pictureAspect: 'noChange',
                            backgroundColor: '#da532c',
                            onConflict: 'override',
                            assets: {
                                windows80Ie10Tile: true,
                                windows10Ie11EdgeTiles: {
                                    small: false,
                                    medium: true,
                                    big: false,
                                    rectangle: false
                                }
                            }
                        },
                        androidChrome: {
                            pictureAspect: 'noChange',
                            themeColor: '#ffffff',
                            manifest: {
                                name: 'KIBU: The Map',
                                short_name: "KIBU",
                                description: "The Map of Black Owned Businesses",
                                display: 'standalone',
                                orientation: 'portrait',
                                start_url: '/?utm_source=homescreen',
                                onConflict: 'override',
                                declared: true
                            },
                            assets: {
                                legacyIcon: false,
                                lowResolutionIcons: false
                            }
                        },
                        safariPinnedTab: {
                            pictureAspect: 'blackAndWhite',
                            threshold: 20,
                            themeColor: '#ed7e0e'
                        }
                    },
                    settings: {
                        scalingAlgorithm: 'Mitchell',
                        errorOnImageTooSmall: false
                    }
                }
            }
        },
        imagemin: {
            dynamic: { // Another target
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: '../private/img_pre', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'public/img' // Destination path prefix
                }]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-real-favicon');

    // Default task.
    grunt.registerTask('default', ['real_favicon']);

    //Build Task.
    grunt.registerTask('img',   [ 'imagemin']);
    grunt.registerTask('icons', ['real_favicon']); //MUST BE RUN SUDO!
    /** 
     copy : {
        files: [{
          cwd: '_build/style',
          src: [''],
          dest: 'dist/style', 
          expand: true
        }]
      }
      */
}