define(['avalon',
	'text!com/developer/application/add/add.html',
	'com/developer/application/common/status',
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
			app_name: '',
            //地址
            app_url:'',
            //是否为手机app
            app_isapp:STATUS.CLOSE,
            app_status:STATUS.OPEN,
            //描述
            app_description:'',
		},

		//该值对应obj.status true open false close
		checked: false,
        isapp:false,

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
			name: 'app_name',
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
			add_vm.checked ? (add_vm.obj.app_status = STATUS.OPEN) : (add_vm.obj.app_status = STATUS.CLOSE);
            add_vm.obj.app_isapp=add_vm.isapp;
			var param_array = [];
			param_array.push({
				key: 'app_name',
				value: add_vm.obj.app_name,
			});
            param_array.push({
				key: 'app_url',
				value: add_vm.obj.app_url,
			});
            
            param_array.push({
				key: 'app_description',
				value: add_vm.obj.app_description,
			});
            
            param_array.push({
				key: 'app_isapp',
				value: add_vm.obj.app_isapp,
			});
            
            param_array.push({
				key: 'app_status',
				value: add_vm.obj.app_status,
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
		add_vm.obj.app_isapp = STATUS.CLOSE;
		add_vm.obj.app_status = STATUS.CLOSE;
		add_vm.checked = false;
        add_vm.isapp = false;
	};

	//注册操作成功之后的回调函数
	add_vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.add_vm = add_vm;
	return avalon;

});