define(['avalon',
	'text!com/developer/authority/add/add.html',
	'com/developer/authority/common/status',
	'validate',
	'toast',
	'myajax',
	'tool',
], function(avalon, template, STATUS, validate, Toast, MyAjax,TOOL) {
	var add_vm = {},
		v = {},
		success_callback = function() {},
		URL = {};
	//定义为组件
	avalon.component("ms:addmodal", {
		submit: function() {
			//执行验证
			v.v();
		},
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(vm, elem) {
			add_vm = vm;
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
		},

		//下拉的权限数据
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
				add_vm.submit();
			}
		},

	});
	//验证需要的配置文件
	var $map = {
		data: add_vm.obj,
		items: [{
				//要验证的项
				name: 'name',
				//验证成功
				onSuccess: function() {
					add_vm.error.name_error = false;
				},
				//验证失败
				onError: function(message) {
					add_vm.error.name_error = true;
					add_vm.v_message.name_message = message;
				},
				//验证结束
				onComplete: function() {},
				//重置
				onReset: function() {
					add_vm.error.name_error = false;
				},
				rule_name: 'required',
			}, {
				//要验证的项
				name: 'c',
				//验证成功
				onSuccess: function() {
					add_vm.error.c_error = false;
				},
				//验证失败
				onError: function(message) {
					add_vm.error.c_error = true;
					add_vm.v_message.c_message = message;
				},
				//验证结束
				onComplete: function() {},
				//重置
				onReset: function() {
					add_vm.error.c_error = false;
				},
				rule_name: 'required',
			}, {
				//要验证的项
				name: 'sort',
				//验证成功
				onSuccess: function() {
					add_vm.error.sort_error = false;
				},
				//验证失败
				onError: function(message) {
					add_vm.error.sort_error = true;
					add_vm.v_message.sort_message = message;
				},
				//验证结束
				onComplete: function() {},
				//重置
				onReset: function() {
					add_vm.error.sort_error = false;
				},
				rule_name: 'int',
			},

		],
		//验证结束后统一回调方法
		onComplete: function() {},
		//全部验证通过后的回调方法，这里通常是指最后要提交的方法
		onSuccess: function() {
			//这里可能要进行优化流程
			this.onReset();
			var $this = $("#add_submit_btn");
			$this.button('loading');
			add_vm.checked ? (add_vm.obj.status = STATUS.OPEN) : (add_vm.obj.status = STATUS.CLOSE);
			var param_array = [];
			param_array.push({
				key: 'name',
				value: add_vm.obj.name,
			});
			param_array.push({
				key: 'status',
				value: add_vm.obj.status,
			});
			param_array.push({
				key: 'c',
				value: add_vm.obj.c,
			});
			param_array.push({
				key: 'css',
				value: add_vm.obj.css,
			});
			param_array.push({
				key: 'sort',
				value: add_vm.obj.sort,
			});
			param_array.push({
				key: 'superid',
				value: add_vm.obj.superid,
			});			
			MyAjax(URL.add, param_array, function(data) {
				$this.button('reset');
				Toast.r(data, true, success_callback, true);
			}, function() {
				Toast.net_error();
				$this.button('reset');
			});
		},
		//以上验证只要有一项不过就执行该方法
		onError: function() {
			for (var pro in add_vm.error) {
				if (add_vm.error.hasOwnProperty(pro)) {
					//找到第一个进行focus
					if (add_vm.error[pro] == true) {
						$("#add_" + pro.split("_")[0]).focus();
						return;
					}
				}
			}
		},
		//重置全部
		onReset: function() {
			for (var pro in add_vm.error) {
				if (add_vm.error.hasOwnProperty(pro)) {
					add_vm.error[pro] = false;
				}
			}
		},
	};
	//初始化验证
	v = validate($map);

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 * @param load_fun 用于下拉的权限数据的函数
	 */
	add_vm.$init = function(param_url, load_fun) {
		URL = param_url;
		//执行查询方法
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
				add_vm.rel = array;
			}, true);
		});
		//初始化数据状态！
		for (var pro in add_vm.error) {
			if (add_vm.error.hasOwnProperty(pro)) {
				add_vm.error[pro] = false;
			}
		}
		add_vm.obj.name = '';
		add_vm.obj.sort = 0;
		//默认给url
		add_vm.obj.c = 'url';
		add_vm.obj.css = '';
		//这里的值不重置
//		add_vm.obj.superid = 0;
		add_vm.obj.status = STATUS.CLOSE;
		add_vm.checked = true;
	};

	//注册操作成功之后的回调函数
	add_vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.add_vm = add_vm;
	return avalon;

});