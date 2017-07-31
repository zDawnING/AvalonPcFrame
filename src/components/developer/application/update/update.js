define(['avalon',
	'text!com/developer/application/update/update.html',
	'com/developer/application/common/status',
	'validate',
	'toast',
	'myajax'
], function(avalon, template, STATUS, validate, Toast,MyAjax) {

	var update_vm = {},
		v = {},
		success_callback = avalon.noop;
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
		},

		//错误信息
		v_message: {
			name_message: '',
		},

		//单项数据
		obj: {
            app_id:-1,
			//名称
			app_name: '',
            //地址
            app_url:'',
            //是否为手机app
            app_isapp:STATUS.CLOSE,
            app_status:STATUS.CLOSE,
            //描述
            app_description:'',
		},

		//用一个对象来判定用户有没有修改过，判定是否需要进行修改
		$old_obj: {
            app_id:-1,
			//名称
			app_name: '',
            app_status:STATUS.CLOSE,
            //地址
            app_url:'',
            //是否为手机app
            app_isapp:STATUS.CLOSE,
            //描述
            app_description:'',
		},

		//标记是否锁定提交按钮
		is_locked_btn: true,

		//该值对应obj.status true open false close
		checked: '',
        isapp:'',

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
		newValue ? (update_vm.obj.app_status = STATUS.OPEN) : (update_vm.obj.app_status = STATUS.CLOSE);
		update_vm.is_locked_btn = !is_changed();
	});
	update_vm.$watch('isapp', function(newValue, oldValue) {
		newValue ? (update_vm.obj.app_isapp = STATUS.OPEN) : (update_vm.obj.app_isapp = STATUS.CLOSE);
		update_vm.is_locked_btn = !is_changed();
	});
	update_vm.$watch('obj.app_name', function(newValue, oldValue) {
		update_vm.is_locked_btn = !is_changed();
	});
    	update_vm.$watch('obj.app_url', function(newValue, oldValue) {
		update_vm.is_locked_btn = !is_changed();
	});
    
    	update_vm.$watch('obj.app_description', function(newValue, oldValue) {
		update_vm.is_locked_btn = !is_changed();
	});
    
       	update_vm.$watch('obj.app_isapp', function(newValue, oldValue) {
		update_vm.is_locked_btn = !is_changed();
	});

	//验证需要的配置文件
	var $map = {
		data: update_vm.obj,
		items: [{
			//要验证的项
			name: 'app_name',
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
		}, ],
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
			var param_array = [];
			param_array.push({
				key: 'app_id',
				value: update_vm.obj.app_id
			});
			param_array.push({
				key: 'app_name',
				value: update_vm.obj.app_name,
			});
			param_array.push({
				key: 'app_url',
				value: update_vm.obj.app_url,
			});
            param_array.push({
				key: 'app_description',
				value: update_vm.obj.app_description,
			});
            param_array.push({
				key: 'app_isapp',
				value: update_vm.obj.app_isapp,
			});
              param_array.push({
				key: 'app_status',
				value: update_vm.obj.app_status,
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
			$("#update_name").focus();
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
	//初始化
	update_vm.$init = function(param_url, obj) {
		URL = param_url;
		update_vm.error.name_error = false;
		//回填数据！
		for (var pro in obj) {
			if (update_vm.obj.hasOwnProperty(pro)) {
				if (update_vm.$old_obj.hasOwnProperty(pro)) {
					update_vm.$old_obj[pro] = update_vm.obj[pro] = obj[pro];
				} else {
					update_vm.obj[pro] = obj[pro];
				}
			}
		}
		update_vm.checked = (obj.app_status == STATUS.OPEN) ? true : false;
        update_vm.isapp = (obj.app_isapp == STATUS.OPEN) ? true : false;
		update_vm.is_locked_btn = !is_changed();
		v = validate($map);
	};

	//给外部提供成功操作接口
	update_vm.$r = function(callback) {
		success_callback = callback;
	};
	avalon.vmodels.update_vm = update_vm;

	return avalon;

});