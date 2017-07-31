define(['avalon',
	'text!com/demo/import/import.html',
	'validate',
	'toast',
	'myajax',
	'tool'
], function(avalon, template, validate, Toast, MyAjax, TOOL) {
	var vm = {},
		v = {},
		success_callback = function() {},
		//现在URL都要index.js传入
		URL = {};
	//定义为组件
	avalon.component("ms:importmodal", {
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(init_vm, elem) {
			vm = init_vm;
			avalon.scan(elem, vm);
		},
		$ready: function() {
			//监听文件变化
			$("#import_file").change(function() {
				var files = this.files;
				if(files.length <= 0) {
					return;
				} else {
					var file = files[0];
					vm.obj.filename = file.name;
					vm.$file = file;
				}
			});
		},
		// obj: {
		// 	//名称
		// 	"exhibit_id": "",
		//   "excel": "",
		//   "mark": ""
		// },
		// group_list:[],
		// $file: '',
		// file_name: '',
		// submit: function() {
		// 	if(!vm.file_name) {
		// 		Toast.show('提示', '请先上传文件！', Toast.type.WARNING);
		// 		return;
		// 	}
		// 	//常用的图片后缀
		// 	var pic_postfix = ['xlsx'],
		// 		postfix = vm.file_name.substring(vm.file_name.lastIndexOf('.') + 1, vm.file_name.length).toLowerCase(),
		// 		is_excel = false;
		// 	//确保是图片文件
		// 	for(var i = 0; i < pic_postfix.length; i++) {
		// 		if(pic_postfix[i] == postfix) {
		// 			is_excel = true;
		// 			break;
		// 		}
		// 	}
		// 	if(is_excel == false) {
		// 		Toast.show('提示', '请上传excel文件！', Toast.type.WARNING);
		// 		return;
		// 	}
		// 	var $this = $(this);
		// 	$this.button('loading');
		// 	var param_array = TOOL.create_array();
		// 	param_array.append('exhibit_id', vm.obj.exhibit_id);
		// 	param_array.append('excel', vm.$file);
		// 	param_array.append('mark', vm.obj.mark);
		// 	MyAjax(URL.import_excel, param_array.get_data(), function(data) {
		// 		$this.button('reset');
		// 		Toast.r(data, true, success_callback, true);
		// 	}, function() {
		// 		Toast.net_error();
		// 		$this.button('reset');
		// 	});
		// },

		//上传的文件
		$file: '',

		file_name: '',

		obj: {
			//会展id
			exhibit_id: '',
			//excel文件名称
			filename: '',
			//标记
			mark: '',
		},

		//是否展示导入完成后的信息
		is_show_msg: false,

		// 导入成功后的数据信息
		import_msg: {
			"correct_num": '',
		  "error_num": '',
		  // "error_url": ''
		  "error_code": ''
		},

		/**
		 * 清除导入信息
		 * @return {[type]} [description]
		 */
		clear_import_msg: function(){
			for(var pro in vm.import_msg){
				if(vm.import_msg.hasOwnProperty(pro)) {
					vm.import_msg[pro] = '';
				}
			}
		},

		/**
		 * 清除历史导入数据
		 * @return {[type]} [description]
		 */
		clear_import_data: function(){
			for(var pro in vm.obj){
				if(vm.obj.hasOwnProperty(pro)) {
					vm.obj[pro] = '';
				}
			}
			vm.$file = '';
			$("#import_file").val('');
		},

		submit: function() {
			var $this = $("#submit_btn");
			var end_callback = function() {
					$this.button('loading');
					//清除历史数据
					vm.clear_import_msg();
					$this.button('loading');
					var param_array = TOOL.create_array();
					param_array.append('exhibit_id', vm.obj.exhibit_id);
					param_array.append('excel', vm.$file);		
					param_array.append('mark', vm.obj.mark);
					MyAjax(URL.import_excel, param_array.get_data(), function(data) {
						$this.button('reset');
						Toast.r(data, true, function() {
							vm.is_show_msg = true;
							vm.import_msg.correct_num = data.data.correct_num;
							vm.import_msg.error_num = data.data.error_num;
							// vm.import_msg.error_url = data.data.error_url;
							vm.import_msg.error_code = data.data.error_code;
						}, true);
					}, function() {
						$this.button('reset');
						Toast.net_error();
					});
					vm.clear_import_data();
				}
			//标记不能为空
			if(v.d('required', vm.obj.mark) == false) {
				Toast.show('提示', '请输入标记', Toast.type.WARNING);
				return;
			}
			//文件不能为空
			if(v.d('required', vm.obj.filename) == false) {
				Toast.show('提示', '请上传一个excel文件', Toast.type.WARNING);
				return;
			}
			//判断文件是否为excel文件
			var file_type = ['xls', 'xlsx'],
				is_file_type_ok = false,
				filename = vm.obj.filename,
				postfix = filename.substring(filename.lastIndexOf('.') + 1, filename.length).toLowerCase();
			for(var i = 0; i < file_type.length; i++) {
				if(file_type[i] == postfix) {
					is_file_type_ok = true;
					break;
				}
			}
			if(is_file_type_ok == false) {
				Toast.show('提示', '请上传一个后缀为xls或xlsx的文件', Toast.type.WARNING);
				return;
			}
			end_callback();
		},
		//错误提醒信息
		error_message: '',

		/**
		 * pda 导入错误列表下载
		 * @return {[type]} [description]
		 */
		download_error_list: function(){
			location.href = URL.download_error_list.url + '?error_code=' + vm.import_msg.error_code
		},

		ex_list: [],
		load_ex: function() {
			MyAjax(URL.load_import_ex, [], function(data) {
				Toast.r(data, false, function() {
					vm.ex_list = data.data;
				}, true);
			}, function() {
				Toast.net_error();
			});
		},

		download_template: function(){
      location.href = URL.download_template.url;
    },

	});
	//初始化验证
	v = validate({});
	//初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	vm.$init = function(param_url) {
		URL = param_url;
		vm.load_ex();
		// vm.obj.exhibit_id = exhibit_id;
	};

	//注册操作成功之后的回调函数
	vm.$r = function(callback) {
		success_callback = callback;
	};
	//可以在这里将vm传到外面
	avalon.vmodels.import_vm = vm;
	return avalon;

});