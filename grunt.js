/*jshint node: true */
module.exports = function( grunt ) {

"use strict";

grunt.loadNpmTasks( "grunt-update-submodules" );
grunt.loadNpmTasks( "grunt-compare-size" );
grunt.loadNpmTasks( "grunt-git-authors" );

grunt.initConfig({
	pkg: "<json:package.json>",

	meta: {
		banner: "/*! jQuery Simulate v@<%= pkg.version %> http://github.com/jquery/jquery-simulate | jquery.org/license */"
	},

	lint: {
		src: [ "jquery.simulate.js" ],
		grunt: "grunt.js",
		test: [ "test/*.js", "test/unit/*.js" ]
	},

	jshint: (function() {
		function parserc( path ) {
			var rc = grunt.file.readJSON( (path || "") + ".jshintrc" ),
				settings = {
					options: rc,
					globals: rc.globals || {}
				};

			(rc.predef || []).forEach(function( prop ) {
				settings.globals[ prop ] = true;
			});
			delete rc.predef;

			return settings;
		}

		return {
			src: parserc(),
			grunt: parserc(),
			test: parserc( "test/" )
		};
	})(),

	qunit: {
		files: "test/index.html"
	},

	min: {
		"dist/jquery.simulate.min.js": [ "<banner>", "dist/jquery.simulate.js" ]
	},

	watch: {
		files: [ "<config:lint.src>", "<config:lint.test>", "<config:lint.grunt>" ],
		tasks: "default"
	},

	compare_size: {
		files: [ "dist/jquery.simulate.js" ]
	}
});



grunt.registerHelper( "git-date", function( fn ) {
	grunt.utils.spawn({
		cmd: "git",
		args: [ "log", "-1", "--pretty=format:%ad" ]
	}, function( error, result ) {
		if ( error ) {
			grunt.log.error( error );
			return fn( error );
		}

		fn( null, result );
	});
});

grunt.registerTask( "max", function() {
	var dist = "dist/jquery.simulate.js",
		done = this.async(),
		version = grunt.config( "pkg.version" );

	if ( process.env.COMMIT ) {
		version += " " + process.env.COMMIT;
	}

	grunt.helper( "git-date", function( error, date ) {
		if ( error ) {
			return done( false );
		}

		grunt.file.copy( dist.replace( "dist/", "" ), dist, {
			process: function( source ) {
				return source
					.replace( /@VERSION/g, version )
					.replace( /@DATE/g, date );
			}
		});

		done();
	});
});

grunt.registerTask( "testswarm", function( commit, configFile ) {
	var testswarm = require( "testswarm" ),
		config = grunt.file.readJSON( configFile ).jquerycolor;
	config.jobName = "jQuery Simulate commit #<a href='https://github.com/jquery/jquery-simulate/commit/" + commit + "'>" + commit.substr( 0, 10 ) + "</a>";
	config["runNames[]"] = "jQuery Simulate";
	config["runUrls[]"] = config.testUrl + commit + "/test/index.html";
	config["browserSets[]"] = ["popular"];
	testswarm({
		url: config.swarmUrl,
		pollInterval: 10000,
		timeout: 1000 * 60 * 30,
		done: this.async()
	}, config);
});

grunt.registerTask( "manifest", function() {
	var pkg = grunt.config( "pkg" );
	grunt.file.write( "simulate.jquery.json", JSON.stringify({
		name: "color",
		title: pkg.title,
		description: pkg.description,
		keywords: pkg.keywords,
		version: pkg.version,
		author: {
			name: pkg.author.name,
			url: pkg.author.url.replace( "master", pkg.version )
		},
		maintainers: pkg.maintainers,
		licenses: pkg.licenses.map(function( license ) {
			return license.url.replace( "master", pkg.version );
		}),
		bugs: pkg.bugs,
		homepage: pkg.homepage,
		docs: pkg.homepage,
		dependencies: {
			jquery: ">=1.6"
		}
	}, null, "\t" ) );
});

grunt.registerTask( "default", "lint update_submodules qunit build compare_size" );
grunt.registerTask( "build", "max min" );

};
