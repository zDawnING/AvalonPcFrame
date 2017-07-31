define(['avalon',
	'text!com/developer/role/set_app_permission/set_app_permission.html',
	'validate',
	'toast',
	'myajax',
	'tool',
	'css!com/developer/role/set_app_permission/set_app_permission.css',
	'css!checkbox_css'
], function(avalon, template, validate, Toast, MyAjax,TOOL) {
	var app_vm = {},
		v = {},
		success_callback = avalon.noop,
		URL = {};
	//定义为组件
	avalon.component("ms:appmodal", {
		submit: function() {
			//执行验证
			v.v();
		},
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(vm, elem) {
			app_vm = vm;
			avalon.scan(elem, vm);
		},
		$ready: function() {},

		//用来响应UI的数据
		error: {
			name_error: false,
		},

		//错误信息
		v_message: {
			name_message: '',
		},

		//单项数据
		obj: {
			//名称
			name: '',
			//id
			role_id: 0,
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
            role_id: 0,
			rel: [],
		},

		//标记是否锁定提交按钮
		is_locked_btn: false,

		is_load_rule: false,

		//查询规则集合
		load_rule: function(id) {
			app_vm.is_load_rule = true;
            app_vm.obj.role_id=id;
			var param_array = [];
			param_array.push({
				key: 'role_id',
				value: id,
			});
			MyAjax(URL.load_app_list, param_array, function(data) {
				app_vm.is_load_rule = false;
				Toast.r(data, false, function() {
					//复制
					avalon.mix(app_vm.$old_obj, data.data);
					app_vm.obj.rel = data.data;
				}, true);
			}, function() {
				app_vm.is_load_rule = false;
				Toast.net_error();
			});
		},

		//加载完之后设置icheck
		load_end: function() {},

		//验证单项
		v_item: function(id) {
			v.v(id);
		},

		/**
		 * enter键就提交
		 */
		keydown: function(e) {
			if (e.keyCode == 13) {
				app_vm.submit();
			}
		},
		$flag_click_changed: 0,
		/**
		 * 这个方法每次都会会执行两次，要设法只让第二次生效 
		 * @param {Object} index
		 */
		click_changed: function(index) {
			app_vm.$flag_click_changed++;
			if (app_vm.$flag_click_changed % 2 == 0) {
				//如果是选中自己，需要同时处理父节点
				TOOL.synchro_lvl_array(app_vm.obj.rel,'flag',index);
				app_vm.is_locked_btn = !is_changed();
			}
		},

	});
	var is_changed = function() {
		//标记数据有没有变化  true有变化 false没有变化
		var result = false;
		if (app_vm.$old_obj.rel.length && app_vm.obj.rel.size()) {
			for (var i = 0; i < app_vm.$old_obj.rel.length; i++) {
				if (app_vm.$old_obj.rel[i].flag != app_vm.obj.rel[i].flag) {
					return true;
				}
			}
		}
		return true;
	}
	// app_vm.$watch('obj.app_name', function() {
		// app_vm.is_locked_btn = !is_changed();
	// });

	//验证需要的配置文件
	var $map = {
		data: app_vm.obj,
		items: [],
		//验证结束后统一回调方法
		onComplete: function() {},
		//全部验证通过后的回调方法，这里通常是指最后要提交的方法
		onSuccess: function() {
			//这里可能要进行优化流程
			this.onReset();
			var $this = $("#rule_submit_btn");
			$this.button('loading');
			//收集选中对象
			var rel = [];
			for (var i = 0; i < app_vm.obj.rel.length; i++) {
				if (app_vm.obj.rel[i].flag == true) {
					rel.push(app_vm.obj.rel[i].app_id);
				}
			}
			var param_array = [];
			param_array.push({
				key: 'role_id',
				value: app_vm.obj.role_id,
			});
			
			param_array.push({
				key: 'app_ids',
				value: JSON.stringify(rel),
			});
			MyAjax(URL.save_app_list, param_array, function(data) {
				$this.button('reset');
				Toast.r(data, true, success_callback, true);
			}, function() {
				Toast.net_error();
				$this.button('reset');
			});
		},
		//以上验证只要有一项不过就执行该方法
		onError: function() {
			$("#rule_name").focus();
		},
		//重置全部
		onReset: function() {
			for (var pro in app_vm.error) {
				if (app_vm.error.hasOwnProperty(pro)) {
					app_vm.error[pro] = false;
				}
			}
		},
	};
	//初始化验证
	v = validate($map);

	//初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	app_vm.$init = function(param_url, obj) {
		URL = param_url;
		//初始化数据状态！远程加载数据
		app_vm.load_rule(obj.role_id);
	};

	//注册操作成功之后的回调函数
	app_vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.app_vm = app_vm;
	return avalon;

});