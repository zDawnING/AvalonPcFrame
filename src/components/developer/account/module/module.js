define(['avalon',
	'text!com/developer/account/module/module.html',
	'validate',
	'toast',
	'myajax',
	'tool',
	'css!com/developer/account/module/module.css',
	'css!checkbox_css'
], function(avalon, template, validate, Toast, MyAjax, TOOL) {
	var module_vm = {},
		v = {},
		success_callback = avalon.noop,
		URL = {};
	//定义为组件
	avalon.component("ms:modulemodal", {

		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(vm, elem) {
			module_vm = vm;
			avalon.scan(elem, vm);
		},
		$ready: function() {},

		//单项数据
		obj: {
			//名称
			user_name: '',
			//id
			user_id: 0,
		},

		//标记是否锁定提交按钮
		is_locked_btn: false,

		is_load_module: false,
		
		copy_list:[],

		list: [],

		//查询规则集合
		load_module: function(id) {
			module_vm.is_load_module = true;
			var param_array = [];
			param_array.push({
				key: 'id',
				value: id
			});
			MyAjax(URL.load_module, param_array, function(data) {
				module_vm.is_load_module = false;
				Toast.r(data, false, function() {
					data.data = TOOL.handle_lvl_array(data.data);
					var item = {},
						array = [],
						name = '',
						rel = data.data;
					for(var i = 0; i < rel.length; i++) {
						item = rel[i],
							name = item.name;
						var left_blank = "";
						for(var lvl_i = 0; lvl_i < item.lvl - 1; lvl_i++) {
							left_blank += "└";
						}
						//保留整份副本
						array.push({
							url: item.url,
							id: item.id,
							name: item.name,
							pid: item.pid,
							status: item.status,
							superid: item.superid,
							time: item.time,
							lvl_str: left_blank,
							description: item.description,
							is_close: item.is_close,
							css: item.css,
							app_id: item.app_id
						});
					}
					module_vm.copy_list = array;
					module_vm.list = array;
				}, true);
			}, function() {
				module_vm.is_load_module = false;
				Toast.net_error();
			});
		},

		//加载完之后设置icheck
		load_end: function() {},

	});

	//初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	module_vm.$init = function(param_url, obj) {
		URL = param_url;
		module_vm.obj.user_id = obj.user_id;
		module_vm.obj.user_name = obj.user_name;
		//初始化数据状态！远程加载数据
		module_vm.load_module(obj.user_id);
	};

	//注册操作成功之后的回调函数
	module_vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.module_vm = module_vm;
	return avalon;

});