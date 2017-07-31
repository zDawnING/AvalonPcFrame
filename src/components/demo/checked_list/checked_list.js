define(['avalon',
	'text!com/demo/checked_list/checked_list.html',
	'validate',
	'toast',
	'myajax',
	'tool',
	'sortable',
	'css!com/demo/checked_list/checked_list.css'
], function(avalon, template, validate, Toast, MyAjax, TOOL, Sortable) {
	var vm = {},
		v = validate({}),
		success_callback = function() {},
		URL = {};
	var LANGUAGE_TYPE = {
				CHINESE: 1,
				ENGLISH: 2
			};
	//定义为组件
	avalon.component("ms:checkedlistmodal", {
		
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(init_vm, elem) {
			vm = init_vm;
			avalon.scan(elem, vm);
		},

		$ready: function() {},

		checked_list: [],

	});
	//初始化验证
	v = validate({});

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 */
	vm.$init = function(param_url, selected_list) {
		URL = param_url;
		
		vm.checked_list = selected_list;
		
	};

	//注册操作成功之后的回调函数
	vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.checked_list_vm = vm;
	return avalon;

});