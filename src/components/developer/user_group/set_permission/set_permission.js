define(['avalon',
	'text!com/developer/user_group/set_permission/set_permission.html',
	'validate',
	'toast',
	'myajax',
	'tool',
	'css!com/developer/user_group/set_permission/set_permission.css',
	'css!checkbox_css'
], function(avalon, template, validate, Toast, MyAjax,TOOL) {
	var permission_vm = {},
		v = {},
		success_callback = avalon.noop,
		URL = {};
	//定义为组件
	avalon.component("ms:permissionmodal", {
		submit: function() {
			//执行验证
			v.v();
		},
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(vm, elem) {
			permission_vm = vm;
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
		// obj: {
		// 	//名称
		// 	name: '',
		// 	//id
		// 	id: 0,
		// 	//从后台传过来的集合
		// 	rel: [],
		// },

		//		test_obj: {
		//			rel: [{
		//				flag: false
		//			}]
		//		},

		//用一个对象来判定用户有没有修改过，判定是否需要进行修改
		// $old_obj: {
		// 	name: '',
		// 	rel: [],
		// },
		// 
		
		obj:{
			id:"",
			list:[],
		},

		$old_obj:{
			id:"",
			list:[],
		},

		//标记是否锁定提交按钮
		is_locked_btn: true,

		is_load_permission: false,



		list:[],
		//查询规则集合
		load_permission: function(id) {
			permission_vm.is_load_permission = true;
			var param_array = [];
			param_array.push({
				key: 'id',
				value: id
			});
			MyAjax(URL.load_permission, param_array, function(data) {
				permission_vm.is_load_permission = false;
				Toast.r(data, false, function() {
					for(var i=0;i<data.data.length;i++){
						if(data.data[i].add == 1){
							data.data[i].add = true;
						}else{
							data.data[i].add = false;
						}
						if(data.data[i].search == 1){
							data.data[i].search = true;
						}else{
							data.data[i].search = false;
						}
						if(data.data[i].delete == 1){
							data.data[i].delete = true;
						}else{
							data.data[i].delete = false;
						}
						if(data.data[i].save == 1){
							data.data[i].save = true;
						}else{
							data.data[i].save = false;
						}
						if(data.data[i].export == 1){
							data.data[i].export = true;
						}else{
							data.data[i].export = false;
						}
						if(data.data[i].import == 1){
							data.data[i].import = true;
						}else{
							data.data[i].import = false;
						}
					}
					permission_vm.$old_obj.list= data.data;
					permission_vm.obj.list = data.data;
					// //复制
					// avalon.mix(permission_vm.$old_obj, data.data);
					// data.data.rel = TOOL.handle_lvl_array(data.data.rel); 
					// permission_vm.obj = data.data;
				}, true);
			}, function() {
				permission_vm.is_load_rule = false;
				Toast.net_error();
			});
		},

		//加载完之后设置icheck
		load_end: function() {},

		//验证单项
		v_item: function(id) {
			v.v(id);
		},

		/**
		 * enter键就提交
		 */
		keydown: function(e) {
			if (e.keyCode == 13) {
				permission_vm.submit();
			}
		},
		$flag_click_changed: 0,
		/**
		 * 这个方法每次都会会执行两次，要设法只让第二次生效 
		 * @param {Object} index
		 */
		click_changed: function(index) {
			permission_vm.$flag_click_changed++;
			if (permission_vm.$flag_click_changed % 2 == 0) {
				//如果是选中自己，需要同时处理父节点
				// TOOL.synchro_lvl_array(permission_vm.obj.rel,'flag',index);
				permission_vm.is_locked_btn = !is_changed();
			}
		},

		is_submit:false,
		submit:function(){
			var $this = $("#permission_submit_btn");
			$this.button('loading');
			var data_arr = [];
			for(var i=0;i<permission_vm.obj.list.size();i++){
				if(permission_vm.obj.list[i].add == true){
					permission_vm.obj.list[i].add = 1;
				}else{
					permission_vm.obj.list[i].add = 0;
				}
				if(permission_vm.obj.list[i].search == true){
					permission_vm.obj.list[i].search = 1;
				}else{
					permission_vm.obj.list[i].search = 0;
				}
				if(permission_vm.obj.list[i].delete == true){
					permission_vm.obj.list[i].delete = 1;
				}else{
					permission_vm.obj.list[i].delete = 0;
				}
				if(permission_vm.obj.list[i].save == true){
					permission_vm.obj.list[i].save = 1;
				}else{
					permission_vm.obj.list[i].save = 0;
				}
				if(permission_vm.obj.list[i].export == true){
					permission_vm.obj.list[i].export = 1;
				}else{
					permission_vm.obj.list[i].export = 0;
				}
				if(permission_vm.obj.list[i].import == true){
					permission_vm.obj.list[i].import = 1;
				}else{
					permission_vm.obj.list[i].import = 0;
				}
				var obj = {
					"group_id": permission_vm.obj.id,
					"module_id": permission_vm.obj.list[i].module_id,
				    "add": permission_vm.obj.list[i].add,
				    "search": permission_vm.obj.list[i].search,
				    "delete": permission_vm.obj.list[i].delete,
				    "save": permission_vm.obj.list[i].save,
				    "export": permission_vm.obj.list[i].export,
				    "import": permission_vm.obj.list[i].import
				};
				data_arr.push(obj);
			}
			var arr_str = JSON.stringify(data_arr);
			console.log(arr_str);
			permission_vm.is_submit = true;
			var param_array = [];
			param_array.push({
				key: 'access',
				value: arr_str
			});
			MyAjax(URL.save_permission, param_array, function(data) {
				$this.button('reset');
				Toast.r(data, true, success_callback, true);
			}, function() {
				$this.button('reset');
				Toast.net_error();
			});
		}

	});
	var is_changed = function() {
		//标记数据有没有变化  true有变化 false没有变化
		var result = false;
		if (permission_vm.$old_obj.list.length && permission_vm.obj.list.size()) {
			for (var i = 0; i < permission_vm.$old_obj.list.length; i++) {
				if (permission_vm.$old_obj.list[i].add != permission_vm.obj.list[i].add) {
					return true;
				}
				if (permission_vm.$old_obj.list[i].search != permission_vm.obj.list[i].search) {
					return true;
				}
				if (permission_vm.$old_obj.list[i].delete != permission_vm.obj.list[i].delete) {
					return true;
				}
				if (permission_vm.$old_obj.list[i].save != permission_vm.obj.list[i].save) {
					return true;
				}
				if (permission_vm.$old_obj.list[i].export != permission_vm.obj.list[i].export) {
					return true;
				}
				if (permission_vm.$old_obj.list[i].import != permission_vm.obj.list[i].import) {
					return true;
				}
			}
		}
		return result;
	}
	
	// //初始化验证
	// v = validate($map);

	//初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	permission_vm.$init = function(param_url, obj) {
		URL = param_url;
		permission_vm.$old_obj.id = obj.id;
		permission_vm.obj.id = obj.id;
		//初始化数据状态！远程加载数据
		permission_vm.load_permission(obj.id);
	};

	//注册操作成功之后的回调函数
	permission_vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.permission_vm = permission_vm;
	return avalon;

});