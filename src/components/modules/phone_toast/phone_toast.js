define(['avalon_mb',
	'text!components/modules/phone_toast/phone_toast.html',
	'css!components/modules/phone_toast/phone_toast.css',
], function(avalon, template) {
	var vm = {};
	//正确码
	var OK = 100;

	//全局基本错误码
	var ERROR = {
		//权限错误
		authority: ['101', '102', '103', '104', '105', , '106', '107', '108', '109', '200', '201', '202', '203', '204', '205', '206', ],
		//服务器错误
		server: ['301', '302', '303', '304'],
		//业务错误
		service: ['1000', '2000', '3000', '4000', '5000'],
		//网络错误
		net: ['-1'],
	};
	//定义为组件
	avalon.component("ms:phonetoast", {
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(component_vm, elem) {
			vm = component_vm;
			avalon.scan(elem, component_vm);
		},
		$ready: function() {},
		//展示内容
		obj: {
			//是否展示toast内容
			is_toast_show: '',
			//toast内容
			toast_msg: '',
		},
		//计时器
		$timeout: '',

		/**
		 * 展示内容 
		 * @param {Object} obj
		 */
		show: function(content) {
			//			vm.obj.toast_msg = content;
			//			vm.obj.is_toast_show = true;
			$("#toast").addClass('active');
			$("#toast_content").html(content);
			//设置定时器
			if(vm.$timeout) {
				clearTimeout(vm.$timeout);
			}
			vm.$timeout = setTimeout(function() {
				//				vm.obj.toast_msg = '';
				//				vm.obj.is_toast_show = false;
				$("#toast_content").html('');
				$("#toast").removeClass('active');
			}, 3000);
		},
		/**
		 * 响应后台的处理结果
		 * @param data 后台传过来的数据，这里约束的数据结构是{status:'',message:'',data:''}
		 * @param is_show_ok 是否展示成功地提示 因为查询的时候是不需要这个提示的
		 * @param success_callback 验证成功后的回调函数
		 * @param is_show_error 是否展示失败的提示 因为有时候需要用其他的方式去展示失败信息来避免UI的冲突
		 * @param error_callback	   验证失败后的回调函数
		 */
		r: function(data, is_show_ok, success_callback, is_show_error, error_callback) {
			if(!data) {
				error_callback ? error_callback() : null;
			}
			var status = data.status,
				message = data.message,
				all_code = [].concat(ERROR.authority, ERROR.server, ERROR.service, ERROR.net);
			if(status == OK) {
				if(is_show_ok) {
					avalon.toast_module_vm.show(message);
				}
				success_callback ? success_callback() : null;
				return;
			} else {
				//				for(var i=0;i<all_code.length;i++){
				//					if(all_code[i] == status){
				//
				//					}
				//				}
				if(is_show_error) {
					avalon.toast_module_vm.show(message);
				}
				error_callback ? error_callback() : null;
				return;
			}
		},
		/**
		 * 提醒网络错误
		 * @param message 默认的message是网络错误，如果想改提醒信息，可以传入一个参数
		 */
		net_error: function(message) {
			var do_message = message ? message : "网络错误";
			vm.r({
				status: ERROR.net[0],
				message: do_message
			});
		}
	});
	avalon.toast_module_vm = vm;
	return avalon;
});