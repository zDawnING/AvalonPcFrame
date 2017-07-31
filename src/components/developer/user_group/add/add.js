define(['avalon',
	'text!com/developer/user_group/add/add.html',
	'com/developer/user_group/common/status',
	'validate',
	'toast',
	'myajax',
], function(avalon, template, STATUS, validate, Toast, MyAjax) {
	var add_vm = {},
		v = {},
		success_callback = function() {},
		//现在URL都要index.js传入
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
		},

		//错误信息
		v_message: {
			name_message: '',
		},

		//单项数据
		obj: {
			//名称
			name: '',
			//状态
			status: STATUS.CLOSE,
		},

		//该值对应obj.status true open false close
		checked: false,

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
			//标记是否是有值才执行验证，true是有值才验证，false是都验证 默认是都验证
			do_value: false,
		}, ],
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
				key: 'title',
				value: add_vm.obj.name,
			});
			param_array.push({
				key: 'status',
				value: add_vm.obj.status,
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
			$("#add_name").focus();
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

	//初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	add_vm.$init = function(param_url) {
		URL = param_url;
		//初始化数据状态！
		add_vm.error.name_error = false;
		add_vm.obj.name = '';
		add_vm.obj.status = 1;
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