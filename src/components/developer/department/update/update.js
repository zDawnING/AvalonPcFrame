define(['avalon',
	'text!com/developer/authority/update/update.html',
	'com/developer/authority/common/status',
	'validate',
	'toast',
	'myajax',
	'tool',
], function(avalon, template, STATUS, validate, Toast, MyAjax,TOOL) {
	var update_vm = {},
		v = {},
		success_callback = function() {},
		URL = {};
	//定义为组件
	avalon.component("ms:updatemodal", {
		submit: function() {
			//执行验证
			v.v();
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

		//用来响应UI的数据
		error: {
			name_error: false,
			c_error: false,
			sort_error: false,
		},

		//错误信息
		v_message: {
			name_message: '',
			c_message: '',
			sort_message: '',
		},

		//单项数据
		obj: {
			//名称
			name: '',
			c: '',
			sort: 0,
			css: '',
			//状态
			status: STATUS.CLOSE,
			//父级
			superid: 0,
			//id
			id: 0,
		},

		//用一个对象来判定用户有没有修改过，判定是否需要进行修改
		$old_obj: {
			//名称
			name: '',
			c: '',
			sort: 0,
			css: '',
			//状态
			status: STATUS.CLOSE,
			//父级
			superid: 0,
		},

		//标记是否锁定提交按钮
		is_locked_btn: true,

		//权限
		rel: [],

		//该值对应obj.status true open false close
		checked: true,

		//验证单项
		v_item: function(id) {
			v.v(id);
		},

		/**
		 * enter键就提交
		 */
		keydown: function(e) {
			if (e.keyCode == 13) {
				update_vm.submit();
			}
		},

	});
	//判断属性有没有变化过，如果变化过了就解锁
	var is_changed = function() {
			//标记数据有没有变化  true有变化 false没有变化
			var result = false;
			for (var pro in update_vm.$old_obj) {
				if (update_vm.$old_obj[pro] != update_vm.obj[pro]) {
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
	update_vm.$watch('obj.*', function() {
		update_vm.is_locked_btn = !is_changed();
	});
	//	update_vm.$watch('obj.name',function(newValue,oldValue){
	//		update_vm.is_locked_btn = !is_changed();
	//	});	
	//	update_vm.$watch('obj.c',function(newValue,oldValue){
	//		update_vm.is_locked_btn = !is_changed();
	//	});	
	//	update_vm.$watch('obj.css',function(newValue,oldValue){
	//		update_vm.is_locked_btn = !is_changed();
	//	});	
	//	update_vm.$watch('obj.sort',function(newValue,oldValue){
	//		update_vm.is_locked_btn = !is_changed();
	//	});	
	//	update_vm.$watch('obj.superid',function(newValue,oldValue){
	//		update_vm.is_locked_btn = !is_changed();
	//	});	
	//验证需要的配置文件
	var $map = {
		data: update_vm.obj,
		items: [{
				//要验证的项
				name: 'name',
				//验证成功
				onSuccess: function() {
					update_vm.error.name_error = false;
				},
				//验证失败
				onError: function(message) {
					update_vm.error.name_error = true;
					update_vm.v_message.name_message = message;
				},
				//验证结束
				onComplete: function() {},
				//重置
				onReset: function() {
					update_vm.error.name_error = false;
				},
				rule_name: 'required',
			}, {
				//要验证的项
				name: 'c',
				//验证成功
				onSuccess: function() {
					update_vm.error.c_error = false;
				},
				//验证失败
				onError: function(message) {
					update_vm.error.c_error = true;
					update_vm.v_message.c_message = message;
				},
				//验证结束
				onComplete: function() {},
				//重置
				onReset: function() {
					update_vm.error.c_error = false;
				},
				rule_name: 'required',
			}, {
				//要验证的项
				name: 'sort',
				//验证成功
				onSuccess: function() {
					update_vm.error.sort_error = false;
				},
				//验证失败
				onError: function(message) {
					update_vm.error.sort_error = true;
					update_vm.v_message.sort_message = message;
				},
				//验证结束
				onComplete: function() {},
				//重置
				onReset: function() {
					update_vm.error.sort_error = false;
				},
				rule_name: 'int',
			},

		],
		//验证结束后统一回调方法
		onComplete: function() {},
		//全部验证通过后的回调方法，这里通常是指最后要提交的方法
		onSuccess: function() {
			if (update_vm.is_locked_btn) {
				return;
			}
			//这里可能要进行优化流程
			this.onReset();
			var $this = $("#update_submit_btn");
			$this.button('loading');
			update_vm.checked ? (update_vm.obj.status = STATUS.OPEN) : (update_vm.obj.status = STATUS.CLOSE);
			var param_array = [];
			param_array.push({
				key:'name',
				value:update_vm.obj.name,
			});
			param_array.push({
				key:'status',
				value:update_vm.obj.status,
			});
			param_array.push({
				key:'c',
				value:update_vm.obj.c,
			});
			param_array.push({
				key:'css',
				value:update_vm.obj.css,
			});
			param_array.push({
				key:'sort',
				value:update_vm.obj.sort,
			});
			param_array.push({
				key:'superid',
				value:update_vm.obj.superid,
			});
			param_array.push({
				key:'id',
				value:update_vm.obj.id,
			});
			MyAjax(URL.update, param_array, function(data) {
				$this.button('reset');
				Toast.r(data, true, success_callback, true);
			}, function() {
				Toast.net_error();
				$this.button('reset');
			});
		},
		//以上验证只要有一项不过就执行该方法
		onError: function() {
			for (var pro in update_vm.error) {
				if (update_vm.error.hasOwnProperty(pro)) {
					//找到第一个进行focus
					if (update_vm.error[pro] == true) {
						$("#update_" + pro.split("_")[0]).focus();
						return;
					}
				}
			}
		},
		//重置全部
		onReset: function() {
			for (var pro in update_vm.error) {
				if (update_vm.error.hasOwnProperty(pro)) {
					update_vm.error[pro] = false;
				}
			}
		},
	};

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 * @param obj 回填的对象
	 * @param load_fun 加载权限数据的函数
	 */
	update_vm.$init = function(param_url, obj, load_fun) {
		URL = param_url;
		load_fun(function(data) {
			Toast.r(data, false, function() {
				data.data = TOOL.handle_lvl_array(data.data);
				var item = {},
					array = [],
					name = '',
					rel = data.data;
				for (var i = 0; i < rel.length; i++) {
					item = rel[i],
						name = item.name;
//					if (item.lvl == 2) {
//						name = "└  " + item.name;
//					} else if (item.lvl == 3) {
//						name = "  └  " + item.name;
//					}
					var left_blank = "";
					for(var lvl_i=0;lvl_i<item.lvl-1;lvl_i++){
						left_blank+="└";
					}
					//如果是一级就不用那个符号
					name = left_blank+"  " + item.name;
					array.push({
						name: name,
						id: item.id
					});
				}
				update_vm.rel = array;
			}, true);
		});
		//初始化数据状态！
		for (var pro in update_vm.error) {
			if (update_vm.error.hasOwnProperty(pro)) {
				update_vm.error[pro] = false;
			}
		}
		for (var pro in obj) {
			if (update_vm.obj.hasOwnProperty(pro)) {
				if (update_vm.$old_obj.hasOwnProperty(pro)) {
					update_vm.$old_obj[pro] = update_vm.obj[pro] = obj[pro];
				} else {
					update_vm.obj[pro] = obj[pro];
				}
			}
		}
		update_vm.checked = obj.status == STATUS.OPEN ? true : false;
		update_vm.is_locked_btn = !is_changed();
		//初始化验证
		v = validate($map);
	};

	//注册操作成功之后的回调函数
	update_vm.$r = function(callback) {
		success_callback = callback;
	};
	//可以在这里将vm传到外面
	avalon.vmodels.update_vm = update_vm;
	return avalon;

});