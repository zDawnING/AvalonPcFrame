define([
	'avalon',
	'text!com/modules/qiniu_upload/qiniu_upload.html',
	'qiniu',
	'css!highlight_css',
	'css!main_css',
], function(avalon, template) {
	/**
	 * 初始化七牛云上传图片
	 * @param {Object} $ 				jquery对象
	 * @param {Object} container 		包裹模块的id
	 * @param {Object} browse_button		触发上传文件的id
	 * @param {Object} token_url 		后台提供的请求token地址
	 * @param {Object} domain			bucket 域名，下载资源时用到，**必需**
	 * @param {Object} key_rule			生成key时的文件前缀
	 * @param {Object} success_id		成功信息的domid
	 * @param {Object} upload_table_id 	显示上传表格的id
	 * @param {Object} FilesAddedCallback	
	 * @param {Object} BeforeUploadCallback
	 * @param {Object} UploadProgressCallback
	 * @param {Object} UploadCompleteCallback
	 * @param {Object} FileUploadedCallback
	 * @param {Object} ErrorCallback
	 */
	var qiniu = function($, container, browse_button, token_url, domain, key_rule, success_id, upload_table_id, FilesAddedCallback, BeforeUploadCallback, UploadProgressCallback, UploadCompleteCallback, FileUploadedCallback, ErrorCallback) {
			var uploader = Qiniu.uploader({
				runtimes: 'html5,flash,html4', //上传模式,依次退化
				browse_button: browse_button, //上传选择的点选按钮，**必需**
				uptoken_url: token_url, //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
				// uptoken : '', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
				// unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
				// save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
				domain: domain, //bucket 域名，下载资源时用到，**必需**
				get_new_uptoken: false, //设置上传文件的时候是否每次都重新获取新的token
				container: container, //上传区域DOM ID，默认是browser_button的父元素，
				max_file_size: '100mb', //最大文件体积限制
				//				 	flash_swf_url: 'js/plupload/Moxie.swf', //引入flash,相对路径
				max_retries: 3, //上传失败最大重试次数
				dragdrop: true, //开启可拖曳上传
				drop_element: container, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
				chunk_size: '4mb', //分块上传时，每片的体积
				auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
				filters: {
					max_file_size: '100mb',
					prevent_duplicates: true,
					// Specify what files to browse for
					mime_types: [
						//// 限定后缀格式上传
						{
							title: "Image files",
							extensions: "jpg,jpeg,gif,png"
						},
					]
				},
				unique_names: false,
				save_key: false,
				init: {
					'FilesAdded': function(up, files) {
						$('#' + upload_table_id).show();
						$('#' + success_id).hide();
						plupload.each(files, function(file) {
							var progress = new FileProgress(file, 'fsUploadProgress');
							progress.setStatus("等待...");
							progress.bindUploadCancel(up);
						});
						FilesAddedCallback ? FilesAddedCallback() : null;
					},
					'BeforeUpload': function(up, file) {
						var progress = new FileProgress(file, 'fsUploadProgress');
						var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
						if (up.runtime === 'html5' && chunk_size) {
							progress.setChunkProgess(chunk_size);
						}
						BeforeUploadCallback ? BeforeUploadCallback(up, file) : null;
					},
					'UploadProgress': function(up, file) {
						var progress = new FileProgress(file, 'fsUploadProgress');
						var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
						progress.setProgress(file.percent + "%", file.speed, chunk_size);
						UploadProgressCallback ? UploadProgressCallback(up, file) : null;
					},
					'UploadComplete': function() {
						$('#' + success_id).show();
						UploadCompleteCallback ? UploadCompleteCallback() : null;
					},
					'FileUploaded': function(up, file, info) {
						var progress = new FileProgress(file, 'fsUploadProgress');
						progress.setComplete(up, info);
						var res = $.parseJSON(info);
						var obj = "";
						if (res.url) {
							obj = {
								key: res.url,
								name: file.name.substring(0, file.name.lastIndexOf('.')),
							};
						} else {
							obj = {
								key: res.key,
								name: file.name.substring(0, file.name.lastIndexOf('.')),
							};
						}
						FileUploadedCallback ? FileUploadedCallback(obj, up, file, info) : null;
					},
					'Error': function(up, err, errTip) {
						$('#' + upload_table_id).show();
						var progress = new FileProgress(err.file, 'fsUploadProgress');
						progress.setError();
						progress.setStatus(errTip);
						ErrorCallback ? ErrorCallback(up, err, errTip) : null;
					},
					'Key': function(up, file) {
						var timestamp = Date.parse(new Date()) + Math.random() * 10000;
						var filename = file.name;
						var postfix = filename.substring(filename.lastIndexOf('.') + 1, filename.length).toLowerCase();
						var key = key_rule + timestamp + "." + postfix;
						return key;
					}
				}
			});
		}
		//return qiniu;
	var vm = {},
		STATIC_VM_NAME = "qiniu_upload_module_vm";
	//定义为组件
	avalon.component("ms:qiniuupload", {
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(component_vm, elem) {
			vm = component_vm;
			avalon.scan(elem, component_vm);
			//设置引用名
			vm.vm_name = vm.vm_id ? (vm.vm_name + '_' + vm.vm_id) : vm.vm_name;
			avalon.vmodels[vm.vm_name] = vm;
		},
		$ready: function() {},
		//对外导出的引用名
		vm_name: STATIC_VM_NAME,
		//用于多例
		vm_id: '',

		//和dom相关的id
		dom_obj: {
			container: '',
			browse_button: '',
			success_id: '',
			upload_table_id: '',
		}
	});

	/**
	 * 
	 * @param {Object} $
	 * @param {Object} name
	 * @param {Object} token_url
	 * @param {Object} domain
	 * @param {Object} key_rule
	 * @param {Object} FilesAddedCallback
	 * @param {Object} BeforeUploadCallback
	 * @param {Object} UploadProgressCallback
	 * @param {Object} UploadCompleteCallback
	 * @param {Object} FileUploadedCallback
	 * @param {Object} ErrorCallback
	 */
	vm.$init = function($, name, token_url, domain, key_rule, FilesAddedCallback, BeforeUploadCallback, UploadProgressCallback, UploadCompleteCallback, FileUploadedCallback, ErrorCallback) {
		//这里用name来拼接dom对应的id
		vm.dom_obj.container = name + "_upload_container";
		vm.dom_obj.browse_button = name + "_pickfiles";
		vm.dom_obj.success_id = name + "_success";
		vm.dom_obj.upload_table_id = name + "_upload_table";
		$('.upload_block').on('click', 'table button.check_upload_block', function() {
			$(this).parents('tr').next().toggle();
		});
		setTimeout(function() {
			qiniu($, vm.dom_obj.container, vm.dom_obj.browse_button, token_url, domain, key_rule, vm.dom_obj.success_id, vm.dom_obj.upload_table_id, FilesAddedCallback, BeforeUploadCallback, UploadProgressCallback, UploadCompleteCallback, FileUploadedCallback, ErrorCallback)
		}, 500);

	};
	return avalon;
});