define([

], function(template) {

	var target = document.getElementById("phone_toast");
	if(!target) {
		console.log('请在html中引入phone_toast的代码片段');
	}
	//正确码
	var OK = 100;

	//全局基本错误码，除了100其他都是错误的
	var ERROR = {
		//网络错误
		net: ['-1'],
	};

	var $timeout = '';

	//提醒对象
	var Toast = function() {

		/**
		 * @param title 提醒标题
		 */
		this.show = function(title) {
			var phone_toast_content = document.getElementById("phone_toast_content"),
				phone_toast = document.getElementById("phone_toast");
			phone_toast_content.innerHTML = title;
			phone_toast.setAttribute('class', 'phone-toast active');
			//设置定时器
			if($timeout) {
				clearTimeout($timeout);
			}
			$timeout = setTimeout(function() {
				phone_toast_content.innerHTML = '';
				phone_toast.setAttribute('class', 'phone-toast');
			}, 3000);
		};

		this.ok_title = '操作成功';


		this.error_title = "操作失败";

		/**
		 * 响应
		 * @param data 后台传过来的数据，这里约束的数据结构是{status:'',message:'',data:''}
		 * @param is_show_ok 是否展示成功地提示 因为查询的时候是不需要这个提示的
		 * @param success_callback 验证成功后的回调函数
		 * @param is_show_error 是否展示失败的提示 因为有时候需要用其他的方式去展示失败信息来避免UI的冲突
		 * @param error_callback	   验证失败后的回调函数
		 */
		this.responseErrorMsg = function(data, is_show_ok, success_callback, is_show_error, error_callback) {
			if(!data) {
				error_callback ? error_callback() : null;
			}
			var status = data.status,
				message = data.message;
			if(status == OK) {
				if(is_show_ok) {
					this.show(this.ok_title);
				}
				success_callback ? success_callback() : null;
				return;
			} else {
				if(is_show_error) {
					this.show(this.error_title);
				}
				error_callback ? error_callback() : null;
			}
		};

		/**
		 * 对外的接口
		 */
		this.r = function(data, is_show_ok, success_callback, is_show_error, error_callback) {
			this.responseErrorMsg(data, is_show_ok, success_callback, is_show_error, error_callback);
		};

		/**
		 * 提醒网络错误
		 * @param message 默认的message是网络错误，如果想改提醒信息，可以传入一个参数
		 */
		this.net_error = function(message) {
			var do_message = message ? message : "网络错误";
			this.r({
				status: ERROR.net[0],
				message: do_message
			});
		};

	};
	return new Toast();
});