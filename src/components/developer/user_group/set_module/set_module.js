define(['avalon',
	'text!com/developer/user_group/set_module/set_module.html',
	'validate',
	'toast',
	'myajax',
	'tool',
	'css!com/developer/user_group/set_module/set_module.css',
	'css!checkbox_css'
], function(avalon, template, validate, Toast, MyAjax,TOOL) {
	var module_vm = {},
		v = {},
		success_callback = avalon.noop,
		URL = {};
	//定义为组件
	avalon.component("ms:modulemodal", {
		submit: function() {
			var $this = $("#module_submit_btn");
			$this.button('loading');
			if(!module_vm.obj.name) {
				Toast.show('提醒信息', '用户组名称不能为空', Toast.type.WARNING);
				return;
			}
			//收集选中对象
			var rel = [];
			for (var i = 0; i < module_vm.app_list.size(); i++) {
				for(var j=0;j < module_vm.app_list[i].lule.size();j++){
					if (module_vm.app_list[i].lule[j].flag == true) {
						rel.push(module_vm.app_list[i].lule[j].id);
					}
				}
			}
//			console.log(module_vm.obj.id);
//			console.log(module_vm.obj.name);
//			console.log(JSON.stringify(rel));
//			
//			return;
			var param_array = TOOL.create_array();
			param_array.append('id',module_vm.obj.id);
			param_array.append('title',module_vm.obj.name);
			param_array.append('app',JSON.stringify(rel));
			MyAjax(URL.save_module, param_array.get_data(), function(data) {
				$this.button('reset');
				Toast.r(data, true, success_callback, true);
			}, function() {
				Toast.net_error();
				$this.button('reset');
			});
		},
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
			name: '',
			//id
			id: 0,
			//从后台传过来的集合
			rel: [],
		},

		//		test_obj: {
		//			rel: [{
		//				flag: false
		//			}]
		//		},

		//用一个对象来判定用户有没有修改过，判定是否需要进行修改
		$old_obj: {
			name: '',
			rel: [],
		},

		//标记是否锁定提交按钮
		is_locked_btn: false,

		is_load_module: false,
		
		app_list:[],
		
		$old_app_list:[],

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
					for(var i=0;i<data.data.app.length;i++){
						data.data.app[i].lule = TOOL.handle_lvl_array(data.data.app[i].lule);
					}
					module_vm.app_list = data.data.app;
					//复制
//					avalon.mix(module_vm.$oldapp_list, data.data.app);
//					data.data.rel = TOOL.handle_lvl_array(data.data.rel); 
//					module_vm.obj = data.data;
				}, true);
			}, function() {
				module_vm.is_load_module = false;
				Toast.net_error();
			});
		},

		//加载完之后设置icheck
		load_end: function() {},

		$flag_click_changed: 0,
		/**
		 * 这个方法每次都会会执行两次，要设法只让第二次生效 
		 * @param {Object} index
		 */
		click_changed: function(f_index,c_index) {
			module_vm.$flag_click_changed++;
			if (module_vm.$flag_click_changed % 2 == 0) {
				//如果是选中自己，需要同时处理父节点
				TOOL.synchro_lvl_array(module_vm.app_list[f_index].lule,'flag',c_index);
//				module_vm.is_locked_btn = !is_changed();
			}
		},
		

	});
//	var is_changed = function() {
//		//标记数据有没有变化  true有变化 false没有变化
//		var result = false;
//		if (module_vm.$old_obj.name != module_vm.obj.name) {
//			return true;
//		}
//		if (module_vm.$old_app_list.length && module_vm.app_list.size()) {
//			for (var i = 0; i < module_vm.$old_app_list.length; i++) {
//				for(var j=0;j < module_vm.$old_app_list[i].lule.length;j++ ){
//					if (module_vm.$old_app_list[i].lule[j].flag != module_vm.app_list[i].lule[j].flag) {
//						return true;
//					}
//				}
//			}
//		}
//		return result;
//	}
//	module_vm.$watch('obj.name', function() {
//		module_vm.is_locked_btn = !is_changed();
//	});

	

	//初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	module_vm.$init = function(param_url, obj) {
		URL = param_url;
		module_vm.obj.id  = obj.id;
		module_vm.obj.name = obj.name;
		//初始化数据状态！远程加载数据
		module_vm.load_module(obj.id);
	};

	//注册操作成功之后的回调函数
	module_vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.module_vm = module_vm;
	return avalon;

});