define(['avalon',
	'text!com/demo/sms/sms.html',
	'validate',
	'toast',
	'myajax',
	'tool',
], function(avalon, template, validate, Toast, MyAjax, TOOL) {
	var vm = {},
		v = validate({}),
		success_callback = function() {},
		URL = {};
	var LANGUAGE_TYPE = {
				CHINESE: 1,
				ENGLISH: 2
			};
	//定义为组件
	avalon.component("ms:smsmodal", {
		
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
			content: ''
		},

		exhibit_id: '',
		
		audience_ids: [],

		validate_data: function(){
			//验证字段
			if(v.d('required', vm.obj.content) == false) {
				Toast.show('提示', '请输入短信内容', Toast.type.WARNING);
				return false;
			}
			return true;
		},

		is_load_submit: false,

		/**
		 *  保存提交
		 */
		submit: function(){
			if(!vm.validate_data()){
				return;
			}
			var $this = $(this);
			$this.button('loading');
			vm.is_load_submit = true;
			var param_array = TOOL.create_array();
			param_array.append('exhibit_id', vm.exhibit_id);
			param_array.append('content', vm.obj.content);
			param_array.append('ids', JSON.stringify(vm.audience_ids.$model));
			MyAjax(URL.send_sms, param_array.get_data(), function(data) {
				$this.button('reset');
				vm.is_load_submit = false;
				Toast.r(data, true, success_callback(), true);
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
	};

	//注册操作成功之后的回调函数
	vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.sms_vm = vm;
	return avalon;

});