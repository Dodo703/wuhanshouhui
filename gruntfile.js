module.exports=function(grunt){

	grunt.initConfig({
		watch:{
			jade:{
				files:['views/**'],
				options:{
					livereload:true
				}
			},
			js:{
				files:['public/js/**','models/**/*.js','schemas/**/*.js'],
				//tasks:['jshint'],
				options:{
					livereload:true  //文件出现改动重启
				}
			}
		},
		nodemon:{
			dev:{
				options:{
					file:'app.js',  //入口文件
					args:[],
					nodeArgs: ['--debug'],
					ignore:['README.md','node_modules/**','.DS_Store'],
					ext:'js',
					watch:['./'],
					delay:1000, //改动后1后重启
					env:{
						PORT:'3000'
					},
					cwd:__dirname
				}
			}
		},
		concurrent:{
			tasks:['nodemon','watch'],
			options:{
				logConcurrentOutput:true
			}
		}
	})
	//文件的变动（增加，删除）
	grunt.loadNpmTasks('grunt-contrib-watch')
	//入口文件，node app.js的包装
	grunt.loadNpmTasks('grunt-nodemon')
	//慢任务，less
	grunt.loadNpmTasks('grunt-concurrent')
//不会因为语法的错误而中断
	grunt.option('force',true)
	grunt.registerTask('default',['concurrent'])
}