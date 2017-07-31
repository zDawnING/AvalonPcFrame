define('components/demo/email/email', ['component_modules/avalon/avalon.modern.shim', 'lib/text!http://127.0.0.1:8008/static/components/demo/email/email.html', 'components/modules/validate_mvvm/validate_mvvm', 'components/modules/toast/toast', 'components/modules/myajax/myajax', 'components/common/js/tool'], function(avalon, template, validate, Toast, MyAjax, TOOL) {
	var vm = {},
		v = validate({}),
		success_callback = function() {},
		URL = {};
	var LANGUAGE_TYPE = {
				CHINESE: 1,
				ENGLISH: 2
			};
	//定义为组件
	avalon.component("ms:emailmodal", {
		
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(init_vm, elem) {
			vm = init_vm;
			avalon.scan(elem, vm);
		},

		$ready: function() {},

		obj: {
			title: '',
			temp: '',
			//				id: '',
			//邮件回复地址
			replyto: '',
			//发件人邮件地址
			from: '',
			//发件人
			name: '',
			//默认是全部查询 1是全部查询 0是部分查询
			//				status:'1',
			where: {
				phone: '',
				email: '',
				name: '',
				corporation: '',
				id: '',
			}
		},

		exhibit_id: '',

		is_load_email_template: false,

		tlist: [],

		audience_ids: [],

		load_email_template: function() {
			vm.is_load_email_template = true;
			var param_array = TOOL.create_array();
			param_array.append('version', 1);
			MyAjax(URL.query_email_template, param_array.get_data(), function(data) {
				vm.is_load_email_template = false;
				Toast.r(data, false, function() {
					vm.tlist = data.data;
				}, true);
			}, function() {
				vm.is_load_email_template = false;
				Toast.net_error();
			});
		},

		validate_data: function(){
			//验证字段
			if(v.d('required', vm.obj.title) == false) {
				Toast.show('提示', '请输入邮件标题', Toast.type.WARNING);
				return false;
			}
			if(v.d('required', vm.obj.temp) == false) {
				Toast.show('提示', '请选择一个邮件模板', Toast.type.WARNING);
				return false;
			}
			if(v.d('required', vm.obj.name) == false) {
				Toast.show('提示', '请输入邮件发送人', Toast.type.WARNING);
				return false;
			}
			if(v.d('required', vm.obj.from) == false) {
				Toast.show('提示', '请输入发件人邮件地址', Toast.type.WARNING);
				return false;
			}
			if(v.d('email', vm.obj.from) == false) {
				Toast.show('提示', '发件人邮件地址格式有误', Toast.type.WARNING);
				return false;
			}
			if(v.d('required', vm.obj.replyto) == true && v.d('email', vm.obj.replyto) == false) {
				Toast.show('提示', '邮件回复地址格式有误', Toast.type.WARNING);
				return false;
			}
			return true;
		},

		/**
		 *  保存提交
		 */
		submit: function(callback){
			if(!vm.validate_data()){
				return;
			}
			var $this = $(this);
			$this.button('loading');
			vm.is_load_submit = true;
			var param_array = TOOL.create_array();
			param_array.append('exhibit_id', vm.exhibit_id);
			param_array.append('title', vm.obj.title);
			param_array.append('name', vm.obj.name);
			param_array.append('temp', vm.obj.temp);
			param_array.append('from', vm.obj.from);
			param_array.append('replyto', vm.obj.replyto);
			param_array.append('ids', JSON.stringify(vm.audience_ids.$model));
			MyAjax(URL.send_email, param_array.get_data(), function(data) {
				$this.button('reset');
				vm.is_load_submit = false;
				Toast.r(data, false, success_callback(), true);
			}, function() {
				$this.button('reset');
				vm.is_load_submit = false;
				Toast.net_error();
			});
		},

	});
	//初始化验证
	v = validate({});

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 */
	vm.$init = function(param_url, ids, exhibit_id) {
		URL = param_url;
		vm.audience_ids = ids;
		vm.exhibit_id = exhibit_id;
		vm.load_email_template();
	};

	//注册操作成功之后的回调函数
	vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.email_vm = vm;
	return avalon;

});