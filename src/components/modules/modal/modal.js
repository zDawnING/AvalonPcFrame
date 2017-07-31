define(['avalon',
	'text!components/modules/modal/modal.html',
	'jquery',
	'css!components/modules/modal/modal.css',
], function(avalon, template,$) {
	var vm = {}; 
	//定义为组件
	avalon.component("ms:contentmodal", {
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(component_vm, elem) {
			vm = component_vm;
			avalon.scan(elem, component_vm);
		},
		$ready: function() {},
		//基本配置
		options: {
			size_class: '',
			modal_id: '',
		},
		//默认配置
		DEFAULTS: {
			//modal-lg：大模态框  modal-sm:小模态框 可不填
			size_class: '',
			//模态框的ID，可不填，不填的话动态生成一个ID
			modal_id: '',
		},
		//展示内容
		obj: {
			//标题 可不填
			title: '',
			//副标题 可不填
			second_title: '',
			//内容 必填
			content: '',
		},

		/**
		 * 初始化配置 
		 * @param {Object} options
		 */
		init: function(options) {
			//合并配置
			this.options = $.extend({}, this.DEFAULTS, options);
			if (!this.options.modal_id) {
				this.options.modal_id = 'modal' + Math.ceil(Math.random()*10000);
			}
			this.inited = true;
		},

		//标记是否已经初始化了
		inited: false,

		/**
		 * 展示内容 
		 * @param {Object} obj
		 */
		show: function(obj) {
			if(this.inited == false){
				this.init({});
			}
			this.obj = $.extend({}, this.obj, obj);
			var $this = this;
			require(['bootstrap'],function(){
				$("#" + $this.options.modal_id).modal('show');	
			})
		}
	});
	avalon.vmodels.modal_module_vm = vm;
	return avalon;
});