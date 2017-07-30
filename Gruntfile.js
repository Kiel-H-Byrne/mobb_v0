

/*global module:false*/
module.exports = function(grunt) {

    // var mozjpeg = require('imagemin-mozjpeg');
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
                    iconsPath: 'img/icons/',
                    html: [ 'public/icon_head.html' ],
                    design: {
                        ios: {
                            pictureAspect: 'backgroundAndMargin',
                            backgroundColor: '#ed7e0e',
                            margin: '14%',
                            assets: {
                                ios6AndPriorIcons: true,
                                ios7AndLaterIcons: true,
                                precomposedIcons: false,
                                declareOnlyDefaultIcon: true
                            }
                        },
                        desktopBrowser: {},
                        windows: {
                            pictureAspect: 'noChange',
                            backgroundColor: '#ed7e0e',
                            onConflict: 'override',
                            assets: {
                                windows80Ie10Tile: true,
                                windows10Ie11EdgeTiles: {
                                    small: true,
                                    medium: true,
                                    big: false,
                                    rectangle: false
                                }
                            }
                        },
                        androidChrome: {
                            pictureAspect: 'backgroundAndMargin',
                            margin: '17%',
                            backgroundColor: '#ed7e0e',
                            themeColor: '#ed7e0e',
                            manifest: {
                                name: 'KIBU: The Map',
                                display: 'standalone',
                                orientation: 'notSet',
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
                            threshold: 16.875,
                            themeColor: '#ed7e0e'
                        }
                    },
                    settings: {
                        compression: 3,
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
};
