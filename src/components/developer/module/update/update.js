define(['avalon',
	'text!com/developer/module/update/update.html',
	'com/developer/module/common/status',
	'validate',
	'toast',
	'myajax',
	'tool',
], function(avalon, template, STATUS, validate, Toast, MyAjax, TOOL) {
	var update_vm = {},
		v = {},
		success_callback = function() {},
		URL = {};
	//定义为组件
	avalon.component("ms:updatemodal", {
		submit: function() {
			update_vm.checked ? (update_vm.obj.status = STATUS.OPEN) : (update_vm.obj.status = STATUS.CLOSE);
			var $this = $(this);
			if(!update_vm.obj.name) {
				Toast.show('提醒信息', '模块名称不能为空', Toast.type.WARNING);
				return;
			}
			if(!update_vm.obj.url) {
				Toast.show('提醒信息', 'url地址不能为空', Toast.type.WARNING);
				return;
			}
			if(!update_vm.obj.description) {
				Toast.show('提醒信息', '模块描述不能为空', Toast.type.WARNING);
				return;
			}
			if(!update_vm.obj.css) {
				Toast.show('提醒信息', '模块css不能为空', Toast.type.WARNING);
				return;
			}

			$this.button('loading');
			var param_array = TOOL.create_array();
			param_array.append('id', update_vm.obj.id);
			param_array.append('app_id', update_vm.obj.app_id);
			param_array.append('name', update_vm.obj.name);
			param_array.append('pid', update_vm.obj.pid);
			param_array.append('url', update_vm.obj.url);
			param_array.append('description', update_vm.obj.description);
			param_array.append('is_close', update_vm.checked ? 0 : 1);
			param_array.append('css', update_vm.obj.css);
			MyAjax(URL.update, param_array.get_data(), function(data) {
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
			update_vm = vm;
			avalon.scan(elem, vm);
		},
		$ready: function() {},

		//单项数据
		obj: {
			app_id: "",
			id: -1,
			//名称
			name: '',
			//父级
			pid: 0,
			url: '',
			description: '',
			sort: 0,
			css: '',
			//状态
			status: STATUS.CLOSE,
		},

		//单项数据
		$old_obj: {
			app_id: "",
			id: -1,
			//名称
			name: '',
			//父级
			pid: 0,
			url: '',
			description: '',
			sort: 0,
			css: '',
			//状态
			status: STATUS.CLOSE,
		},

		//下拉的权限数据
		rel: [],

		//该值对应obj.status true open false close
		checked: true,

		app_list: [],

		init_app_list: function() {
			update_vm.is_loading_data = true;
			MyAjax(URL.query_app, [], function(data) {
				update_vm.is_loading_data = false;
				Toast.r(data, true, function() {
					update_vm.app_list = data.data;
				}, true);
			}, function() {
				update_vm.is_loading_data = false;
				Toast.net_error();
			});
		},
		
		is_locked_btn:true

	});

	//判断属性有没有变化过，如果变化过了就解锁
	var is_changed = function() {
			//标记数据有没有变化  true有变化 false没有变化
			var result = false;
			for(var pro in update_vm.$old_obj) {
				if(update_vm.$old_obj[pro] != update_vm.obj[pro]) {
					result = true;
				}
			}
			return result;
		}
		//监听属性变化
	update_vm.$watch('checked', function(newValue, oldValue) {
		newValue ? (update_vm.obj.status = STATUS.OPEN) : (update_vm.obj.status = STATUS.CLOSE);
		update_vm.is_locked_btn = !is_changed();
	});
	
	update_vm.$watch('obj.*', function(newValue, oldValue) {
		update_vm.is_locked_btn = !is_changed();
	});

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 * @param load_fun 用于下拉的权限数据的函数
	 */
	update_vm.$init = function(paraurl, obj, load_fun) {
		URL = paraurl;
		//执行查询方法
		load_fun(function(data) {
			Toast.r(data, false, function() {
				data.data = TOOL.handle_lvl_array(data.data);
				var item = {},
					array = [],
					name = '',
					rel = data.data;
				for(var i = 0; i < rel.length; i++) {
					if(rel[i].lvl == 1){
						item = rel[i],
							name = item.name;
						var left_blank = "";
						for(var lvl_i = 0; lvl_i < item.lvl - 1; lvl_i++) {
							left_blank += "└";
						}
						//如果是一级就不用那个符号
						name = left_blank + "  " + item.name;
						array.push({
							name: name,
							id: item.id
						});
					}
				}
				update_vm.rel = array;
			}, true);
		});
		//初始化数据状态！
		for(var pro in obj) {
			if(update_vm.obj.hasOwnProperty(pro)) {
				if(update_vm.$old_obj.hasOwnProperty(pro)) {
					update_vm.$old_obj[pro] = update_vm.obj[pro] = obj[pro];
				} else {
					update_vm.obj[pro] = obj[pro];
				}
			}
		}
		update_vm.is_locked_btn = true;
		update_vm.checked = (obj.is_close == STATUS.OPEN) ? false : true;
		
	};

	//注册操作成功之后的回调函数
	update_vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.update_vm = update_vm;
	return avalon;

});