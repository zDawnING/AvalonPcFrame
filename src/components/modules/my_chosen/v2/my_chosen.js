define(['avalon',
	'text!components/modules/my_chosen/v2/my_chosen.html',
	'jquery',
	'css!components/modules/my_chosen/v2/my_chosen.css',
], function(avalon, template, $) {
	var vm = {},
	STATIC_VM_NAME = "mychosen_module_vm_v2";
	//定义为组件
	avalon.component("ms:mychosenv2", {
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(component_vm, elem) {
			vm = component_vm;
			avalon.scan(elem, component_vm);
			//设置引用名
			vm.vm_name = vm.vm_id ? (vm.vm_name + '_' + vm.vm_id) : vm.vm_name;
			avalon[vm.vm_name] = vm;			
		},
		$ready: function() {},

		/**
		 * 根据vm_id来动态指向vm
		 * @param vm_id 使用者给vm标识的ID
		 */
		to_vm:function(vm_id){
			//重新构成vm的名称
			var vm_name = vm_id ? (STATIC_VM_NAME + '_' + vm_id) : STATIC_VM_NAME;
			vm = avalon[vm_name];
		},
		
		/**
		 * 下面每个vm行为都要调用的方法 
		 * @param {Object} $this 指向dom节点
		 */
		filter:function($this){
			var vm_id = $this.getAttribute('data-id');
			//动态指向
			vm.to_vm(vm_id);
		},		

		//避免多次请求
		$timer: '',

		//标记是否正在查询
		is_load_list: false,

		/**
		 * 调用查询方法 
		 */
		load_data: function() {
			if (vm.is_load_list == true) {
				return;
			}
			vm.is_show_result = true;
			vm.is_load_list = true;
			//清空选择值
			vm.result = '';
			vm.$load_data_fun(vm.input_value, function(result_list) {
				//转换为可识别的结构
				var newArray = vm.$change_data_fun(result_list);
				vm.list = newArray;
				vm.is_load_list = false;
			});
		},

		//用户键盘输入的数据
		input_value: '',

		//键盘弹起时调用查询方法
		key_up: function(event) {
			vm.filter(this);
			var keyCode = {
				up:38,
				left:37,
				down:40,
				right:39,
				enter:13
			}
			if(event.keyCode!=keyCode.up 
				&& event.keyCode!=keyCode.left 
				&& event.keyCode!=keyCode.down 
				&& event.keyCode!=keyCode.right 
				&& event.keyCode!=keyCode.enter && vm.input_value){
				//这里要避免因为用户的多次输入导致的多次查询
				if (vm.$timer) {
					clearTimeout(vm.$timer);
				}
				vm.$timer = setTimeout(function() {
					vm.is_show = true;
					vm.is_show_input = true;	
					if(vm.input_value && vm.input_value.trim()){
						vm.load_data();
					}					
				}, 500);				
			}
			//如果用户没有输入东西，就隐藏
			if(!vm.input_value){
				vm.is_show_result = false;
			}
		},

		/**
		 * 点击选择一个值 
		 * @param {Object} index
		 */
		select_result: function(index) {
			vm.filter(this);
			vm.result = vm.list[index].key;
			vm.is_show_input = false;
			vm.is_show_result = false;
			vm.is_show = false;
			vm.input_value = '';
			vm.$callback();
		},

		//接收初始化后的查询方法
		$load_data_fun: avalon.noop,

		//接收初始化后的数据转换方法，将用户提供的查询结果转换为该组件需要的数据
		$change_data_fun: avalon.noop,

		/**
		 * 子元素固定结构{key:key,value:value}，其中key用于最后用户的选择值，value用于视图展示
		 */
		list: [],

		/**
		 * 初始化 
		 * @param {Object} load_data_fun 该方法一定要有参数接收用户键盘输入的值和回调接口（里面要传入查询好的结果）
		 * @param {Object} change_data_fun 转换方法，这里要返回一个新数组
		 * @param {String} placeholder 提示
		 * @param {Object} input_dom 输入框的dom节点，用于定位 jquery对象
		 * @param {Function} callback 回调函数
		 */
		init: function(load_data_fun, change_data_fun, placeholder,input_dom,callback) {
			vm.is_show = true;
			vm.is_show_input = true;	
			vm.$load_data_fun = load_data_fun;
			vm.$change_data_fun = change_data_fun;
			vm.placeholder = placeholder;
			vm.$callback = callback;
			vm.x = input_dom.offset().left;
			vm.y = input_dom.offset().top;
			vm.width = input_dom.outerWidth(true);
			setTimeout(function(){
				//触发点击进行显示
				$("#my_chosen_input_v2_div"+vm.vm_id).click();
				$("#my_chosen_input_v2"+vm.vm_id).focus();
			},100);
		},
		
		width:'',

		$callback:avalon.noop,

		//当用户点击了选项之后的结果
		result: '',

		//获取最终结果
		get_result: function() {
			return vm.result;
		},

		placeholder: '',

		
		click:function(event){
			vm.filter(this);
			vm.is_show = true;
			vm.is_show_input = true;
			vm.is_show_result = true;
			setTimeout(function(){
				$("#my_chosen_input_v2"+vm.vm_id).focus();
			},100);
		},
		x:0,
		y:0,
		is_show_input:true,
		
		is_show_result:false,
		
		is_show:false,
		
		//对外导出的引用名
		vm_name : STATIC_VM_NAME, 
		//用于多例
		vm_id: '',		
	});
	return avalon;
});