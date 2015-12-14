module.exports = function (grunt) {
    // nur ein kleiner Helfer der unsere grunt-Module Lädt
    // ohne diesen Eintrag wäre ein: ' grunt.loadNpmTasks('...modulename...');'
    // für jedes grunt-module nötig
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // grunt-contrib-jshint, Code Quality Check 
        // die Datei ".jshintrc" definiert die entsprechenden Regeln
        // nach denen der JavaScript Code geprüft wird.
        // Vollständige Liste aller Optionen: http://jshint.com/docs/options/
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: {
                src: "public_html/{,modules/**/}*.js"
            }
        },
        // grunt-contrib-clean, Dateien / Ordner löschen
        // löscht unseren tmp-Files und target-Ordner der wärend unseres Build-Prozesses
        // erstellt wird
        clean: {
            dist: ['.tmp', 'dist', 'public_html/*.tmp'],
            tmp: ['.tmp', 'public_html/*.tmp', '*.war']
        },
        // grunt-injector
        // fügt automatisch unsere Scripte, CSS-Dateien und Bower-Abhänigkeiten in die index.xhtml ein
        // die Position in der HTML-Seite wird durch einen entsprechenden Bereich '<!-- injector:[type] -->' festgelegt
        injector: {
            options: {
                bowerPrefix: 'bower:',
                template: 'public_html/index.html',
                ignorePath: 'public_html',
                addRootSlash: false
            },
            development: {
                files: {
                    'public_html/index.html': ['bower.json', 'public_html/{,modules/**/}*.js', 'public_html/resources/styles/*.css']
                }
            },
            prepare: {
                options: {
                    min: true,
                    relative: true,
                    template: 'public_html/index.html'
                },
                files: {
                    'public_html/index.tmp': ['.tmp/scripts/**/*.js', '.tmp/styles/*.css', 'bower.json']
                }
            }
        },
        // grunt-ng-annotate
        // AngularJS arbeitet mit Dependency Injection die über Namensgleichheit realisiert ist
        // eine Komprimierung der Sourcen wird in aller Regel dazu führen das dies nicht mehr möglich ist
        // Angular bietet dazu eine entsprechende DI-sichere Schreibweise an, die wir uns hier generrieren lassen 
        // (anstatt sie selber zu Verwenden)
        ngAnnotate: {
            build: {
                files: [{
                        expand: true,
                        src: "public_html/{,modules/**/}*.js",
                        ext: '.annotated.js',
                        dest: '.tmp/scripts'
                    }]
            }
        },
        // grunt-postcss + autoprefixer
        // Dient dazu Manipulationen an den StyleSheets durchzuführen
        // autoprefixer wird hier genutzt um Browser-Spezifische CSS Attribute zu generieren
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    })
                ]
            },
            release: {
                files: [{
                        expand: true,
                        cwd: 'public_html/resources/styles/',
                        src: '*.css',
                        dest: '.tmp/styles/'
                    }]
            }
        },
        // grunt-contrib-copy
        // der Name ist Programm: Dateien kopieren
        copy: {
            release: {
                expand: true,
                cwd: 'public_html',
                src: ['{,**/}*.html', 'resources/{fonts,img}/**'],
                dest: 'dist/'
            }
        },
        // grunt-usemin
        // ein relativ komplexer Task der aus mehreren Einzelschritten besteht
        // 'useminPrepare' führt keine eigenen Änderungen an den Sourcen durch
        // stattdessen generriert dieser Task dynamisch zusätzliche Tasks:
        // cssmin,uglify,concat,filerev jeweils mit dem target: 'generated'
        // vollständige Doku: https://github.com/yeoman/grunt-usemin
        useminPrepare: {
            html: 'public_html/index.tmp',
            options: {
                dest: 'dist'
            }
        },
        
        usemin: {
            html: ['dist/{,*/}*.html'],
            css: ['dist/styles/{,*/}*.css'],
            js: ['dist/scripts/{,*/}*.js']
        },
        
        // grunt-contrib-htmlmin
        // minimiert die größe von HTML Dateien
        htmlmin: {
            release: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true
                },
                files: [{
                        expand: true,
                        cwd: 'dist',
                        src: ['{,**/}*.html'],
                        dest: 'dist'
                    }]
            }
        },
        // grunt-contrib-watch
        // Grunt Task der auf Änderungen von Dateien prüft und automatisch
        // bestimmte Tasks ausführen kann. 
        watch: {
            index: {
                files: ['bower.json', 'public_html/index.html'],
                tasks: ['injector:development']
            }
        },
        //  grunt-maven-tasks
        // erzeugt ein Maven-WAR-Archiv aus unserer Anwendung
        maven: {
            options: {
                groupId: 'de.gedoplan.demo',
                packaging: 'war',
                injectDestFolder: "false"
                        //url: '<repository-url'
            },
            release: {
                options: {
                    goal: 'install'
                },
                src: ['dist/**']
            }
        }
    });

    grunt.registerTask("development", [
        // Sourcen für die Entwicklung setzen
        'injector:development',
        // Änderungen an Bower/index.html = neu generieren
        'watch:index'
    ]);

    grunt.registerTask('release', [
        // alte Dateien Löschen
        'clean',
        // Code Quality Check
        'jshint:all',
        // unsere Module für das uglyfy Vorbereiten
        'ngAnnotate:build',
        // CSS Regeln ergänzen
        'postcss:release',
        // Dateien kopieren (html, Bilder, Fonts)
        'copy:release',
        // min Versionen (und unsere ngAnnotatet-Vorbereiteten Sourcen) referenzieren
        'injector:prepare',
        // usemin Konfigurieren
        'useminPrepare',
        // Zusammenfassen
        'concat:generated',
        // CSS minimieren
        'cssmin:generated',
        // JS minimieren
        'uglify:generated',
        // Referenzen ersetzen
        'usemin',
        // HTML minimieren
        'htmlmin:release',
        // Maven Artefakt erzeugen
        'maven:release',
        // Sourcen für die Entwicklung wieder setzen
        'injector:development',
        // temporäre Dateien löschen
        'clean:tmp'
    ]);

};

//zusätzliche Tasks die z.B. beim Yeoman-Angular Setup ausgeführt werden.

// jscs > Code Formatierung, wir stützen uns auf die Formatierung der NetBeans IDE

// connect + livereload > wird häufig eingesetzt um einen lokalen Webserver zu starten 
// auf dem wärend der Entwicklung deployt werden kann, NetBeans bietet uns hierfür den "embedded Webserver"

// wiredep als Alternative zum Injector