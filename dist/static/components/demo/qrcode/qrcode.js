define('components/demo/qrcode/qrcode', ['component_modules/avalon/avalon.modern.shim', 'lib/text!http://127.0.0.1:8008/static/components/demo/qrcode/qrcode.html', 'components/modules/validate_mvvm/validate_mvvm', 'components/modules/toast/toast', 'components/modules/myajax/myajax', 'components/common/js/tool', 'components/common/js/domain', 'component_modules/jquery.qrcode/jquery.qrcode.min'], function(avalon, template, validate, Toast, MyAjax, TOOL, domain) {
	var vm = {},
		v = validate({}),
		success_callback = function() {},
		URL = {};
	//定义为组件
	avalon.component("ms:qrcodemodal", {
		
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
			id: '',
			name: '',
		},

		create_qrcode:function(){
			$('#qrcode_div').qrcode({
          text: domain + '/mobile/qrcode/index.html?id=' + vm.obj.id,
          width: 200,
          height: 200,
          render:'canvas'
      });
		},

	});
	//初始化验证

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 */
	vm.$init = function(param_url, obj) {
		URL = param_url;
		vm.obj = obj;
		$('#qrcode_div').html('');
		vm.create_qrcode();
	};

	//注册操作成功之后的回调函数
	vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.qrcode_vm = vm;
	return avalon;

});