define(['avalon',
	'text!com/demo/delete/delete.html',
	'validate',
	'toast',
	'myajax',
	'tool',
	'sortable',
	'css!com/demo/delete/delete.css'
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
	avalon.component("ms:deletemodal", {
		
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(init_vm, elem) {
			vm = init_vm;
			avalon.scan(elem, vm);
		},

		$ready: function() {},

		ids: [],

		delete_list: [],

		is_load_group_list: false,

		//加载列表数据
		load_delete_list: function() {
			vm.is_load_delete_list = true;
			var param_array = TOOL.create_array();
			param_array.append('ids', JSON.stringify(vm.ids.$model));
			MyAjax(URL.query_delete_list, param_array.get_data(), function(data) {
				vm.is_load_delete_list = false;
				Toast.r(data, false, function() {
					for(var i=0;i<data.data.length;i++){
						data.data[i].is_selected = false;
					}
					vm.delete_list = data.data;
				}, true);
			}, function() {
				vm.is_load_delete_list = false;
				Toast.net_error();
			});
		},


		// validate: function(){
		// 	if( v.d('required',vm.obj.name) == false ){
		// 		Toast.show('提醒信息','请填写问卷表名！',Toast.type.WARNING);
		// 		return false;
		// 	}
		// 	if( v.d('required',vm.obj.group_id) == false ){
		// 		Toast.show('提醒信息','请选择分组',Toast.type.WARNING);
		// 		return false;
		// 	}
		// 	if( v.d('required',vm.obj.exhibition_id) == false ){
		// 		Toast.show('提醒信息','请选择展会！',Toast.type.WARNING);
		// 		return false;
		// 	}
		// 	return true;
		// },
		// 
		// 
		
		is_load_submit: false,

		/**
		 *  保存提交
		 */
		submit: function(callback){
			var $this = $(this);
			$this.button('loading');
			vm.is_load_submit = true;
			// console.log(JSON.stringify(vm.$model.obj));
			var param_array = TOOL.create_array();
			param_array.append('ids', JSON.stringify(ids))
			MyAjax(URL.save_survey, param_array.get_data(), function(data) {
				$this.button('reset');
				vm.is_load_submit = false;
				Toast.r(data, false, success_callback(), true);
			}, function() {
				$this.button('reset');
				vm.is_load_submit = false;
				Toast.net_error();
			});
		}


	});
	//初始化验证
	v = validate({});

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 */
	vm.$init = function(param_url, selected_list) {
		URL = param_url;
		
		vm.delete_list = selected_list;
		
	};

	//注册操作成功之后的回调函数
	vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.delete_vm = vm;
	return avalon;

});