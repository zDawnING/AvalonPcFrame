define(['avalon',
	'text!com/demo/add_label/add_label.html',
	'validate',
	'toast',
	'myajax',
	'tool',
	'sortable',
	'css!com/demo/add_label/add_label.css'
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
	avalon.component("ms:addlabelmodal", {
		
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(init_vm, elem) {
			vm = init_vm;
			avalon.scan(elem, vm);
		},

		$ready: function() {},

		label_list: [],

		audience_ids: [],

		is_load_label_list: false,

		//加载列表数据
		load_label_list: function() {
			vm.is_load_label_list = true;
			var param_array = TOOL.create_array();
			// param_array.append('ids', JSON.stringify(vm.ids.$model));
			MyAjax(URL.query_label_list, param_array.get_data(), function(data) {
				vm.is_load_label_list = false;
				Toast.r(data, false, function() {
					for(var i=0;i<data.data.length;i++){
						data.data[i].is_selected = false;
					}
					vm.label_list = data.data;
				}, true);
			}, function() {
				vm.is_load_label_list = false;
				Toast.net_error();
			});
		},

		select_label_item: function(index){
			vm.label_list[index].is_selected = vm.label_list[index].is_selected ? false : true;
		},

		check_selected_label_num: function(){
			var count = 0;
			for(var i=0;i<vm.label_list.size();i++){
				if(vm.label_list[i].is_selected){
					count++;
				}
			}
			return count;
		},
		
		is_load_submit: false,

		/**
		 *  保存提交
		 */
		submit: function(callback){
			if(vm.check_selected_label_num() == 0){
				Toast.show('提醒信息','请至少选择一项标签！',Toast.type.WARNING);
				return;
			}
			var label_arr = [];
			for(var i=0;i<vm.label_list.size();i++){
				if(vm.label_list[i].is_selected){
					label_arr.push(vm.label_list[i].id);
				}
			}
			var $this = $(this);
			$this.button('loading');
			vm.is_load_submit = true;
			// console.log(JSON.stringify(vm.$model.obj));
			var param_array = TOOL.create_array();
			param_array.append('ids', JSON.stringify(label_arr));
			param_array.append('audience_arr', JSON.stringify(vm.audience_ids.$model));
			MyAjax(URL.add_label, param_array.get_data(), function(data) {
				$this.button('reset');
				vm.is_load_submit = false;
				Toast.r(data, false, success_callback(), true);
			}, function() {
				$this.button('reset');
				vm.is_load_submit = false;
				Toast.net_error();
			});
		},

	});
	//初始化验证
	v = validate({});

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 */
	vm.$init = function(param_url, ids) {
		URL = param_url;
		vm.audience_ids = ids;
		vm.load_label_list();
		
	};

	//注册操作成功之后的回调函数
	vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.add_label_vm = vm;
	return avalon;

});