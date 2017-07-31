var fs = require('fs')
var resolvePath = require('path')
var templateConfig = require('./template_file.config.js')
// var testPath = path.resolve('test')
// 
var args = process.argv.splice(2);
// var path = args[0]

// 复制的目标地址
var target = args[0]
// 复制的模板名称
var templateName = args[1]

/**
 * 文件复制
 * @param  {[String]} path   [复制源]
 * @param  {[type]} target [复制目标]
 */
var copyDirectory = function(path,target){
	fs.readdir(path, function(err,files){
		if(err){
			console.error("path read error!")
			console.dir(err)
		}else{
			files.forEach(function(item){
				var curPath = path + '/' + item
				var targetPath = target + '/' + item
				console.log(curPath, targetPath)
				if(fs.statSync(curPath).isDirectory()){
					if(fs.existsSync(targetPath)){
						copyDirectory(curPath, targetPath)
					}else{
						fs.mkdir(targetPath, function(err){
							if(err){
								console.error("directory create error!")
								console.dir(err)
							}else{
								copyDirectory(curPath, targetPath)
							}
						})
					}
				}
				if(fs.statSync(curPath).isFile()){
					fs.readFile(curPath, 'utf8', function(err,data){
						if(err){
							console.error("read file error!")
							console.dir(err)
						}else{
							fs.writeFile(targetPath, data, 'utf8', function(err){
								if(err){
					        console.error("write file error!")
					        console.dir(err)
								}else{
									console.log( resolvePath.resolve(targetPath) + " write success")
								}
							})
						}
					})
				}
			})
		}
	})
}

if(args.length == 2){
	// copyDirectory(path, target)
	var listLength = templateConfig.pageFilePathConfig.length
	var count = 0

	templateConfig.pageFilePathConfig.forEach(function(item){
		console.log(item.templateName, templateName)
		if(item.templateName == templateName){
			copyDirectory(item.path, target)
			return false
		}
		count++
		if(count == listLength){
			console.error('"' + templateName + '" template is not exist!')
		}
	})
}else{
	console.error('command is no support!')
}
