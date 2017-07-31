/**
 * 根据Toastr插件编写的响应全局错误码的工具js
 */
define(['jquery1.8.3','toastr_ie8'],function($,toastr){
	//正确码
	var OK = 100;
	
	//全局基本错误码
	var ERROR = {
		//网络错误
		net:['-1'],
	};
	
	//提醒对象
	var Toast = function(){
		
		this.toastr = toastr;
		
		//标记是否已经初始化了
		this.isInit = false;
		
		this.gettoastr = function(){
			return this.toastr;
		};
		
		/**
		 * 对象初始化，用来进行配置文件的合并
		 */
		this.init = function(){
			this.isInit = true;
			//给toastr注入配置
			this.toastr.options = this.DEFAULTS;
		};
		
		/**
		 * 追加配置，可以完成Toastr的初始化
		 * @param {Object} options 插件Toastr的配置
		 */
		this.config = function(options){
			this.isInit = true;
			//给toastr注入配置
			this.toastr.options = $.extend({}, this.DEFAULTS, options);		
		};
		
		//默认的配置文件，其实是对应toastr的配置
		this.DEFAULTS = {
			"closeButton": true,
			"debug": false,
			"progressBar": true,
			"positionClass": "toast-bottom-right",
			"onclick": null,
			"showDuration": "400",
			"hideDuration": "1000",
			"timeOut": "7000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"				
		};
		
		//默认配置和用户传进来的配置进行整合
		this.options = {};
		
		//toastr的类型配置
		this.type = {
			SUCCESS:'success',
			INFO:'info',
			WARNING:'warning',
			ERROR:'error'
		};
		
		/**
		 * @param title 提醒标题
		 * @param msg   提醒正文
		 * @param type  提醒类型，可选值：success（成功，绿色） info（信息，蓝色） warning（警告，黄色）error（错误，红色）
		 */
		this.show = function(title,msg,type){
			if(this.isInit === false){
				this.init();
			}
			this.toastr[type](msg,title);
		};
		
		/**
		 * 清除所有的提醒框
		 */
		this.clear = function(){
			this.toastr.clear();
		};
		
		//默认的操作成功的标题
		this.ok_title = "成功提醒";	
		
		/**
		 * 修改操作成功的标题
		 */
		this.setOkTitle = function(ok_title){
			this.ok_title = ok_title;
		}
		
		//默认的操作失败的标题
		this.error_title = "错误提醒";
		
		/**
		 * 修改操作失败的标题
		 */
		this.setErroTitle = function(error_title){
			this.error_title = error_title;
		}
		
		/**
		 * 响应
		 * @param data 后台传过来的数据，这里约束的数据结构是{status:'',message:'',data:''}
		 * @param is_show_ok 是否展示成功地提示 因为查询的时候是不需要这个提示的
		 * @param success_callback 验证成功后的回调函数
		 * @param is_show_error 是否展示失败的提示 因为有时候需要用其他的方式去展示失败信息来避免UI的冲突
		 * @param error_callback	   验证失败后的回调函数
		 */
		this.responseErrorMsg = function(data, is_show_ok, success_callback, is_show_error, error_callback) {
			if (!data) {
				error_callback ? error_callback() : null;
			}
			var status = data.status,
				message = data.message;
			if (status == OK) {
				if (is_show_ok) {
					this.show(this.ok_title, message, this.type.SUCCESS);
				}
				success_callback ? success_callback() : null;
				return;
			} else {
				if (is_show_error) {
					this.show(this.error_title, message, this.type.ERROR);
				}
				error_callback ? error_callback() : null;
			}
		};
		
		/**
		 * 对外的接口
		 */
		this.r = function(data,is_show_ok,success_callback,is_show_error,error_callback){
			this.responseErrorMsg(data,is_show_ok,success_callback,is_show_error,error_callback);
		};
		
		/**
		 * 提醒网络错误
		 * @param message 默认的message是网络错误，如果想改提醒信息，可以传入一个参数
		 */
		this.net_error = function(message){
			var do_message = message ? message : "网络错误" ;
			this.r({
				status:ERROR.net[0],
				message:do_message
			});
		};
		
	};
	return new Toast();
});