define(['avalon',
	'text!com/developer/module/add/add.html',
	'com/developer/module/common/status',
	'validate',
	'toast',
	'myajax',
	'tool',
], function(avalon, template, STATUS, validate, Toast, MyAjax,TOOL) {
	var add_vm = {},
		v = {},
		success_callback = function() {},
		URL = {};
	//定义为组件
	avalon.component("ms:addmodal", {
		submit: function() {
			add_vm.checked ? (add_vm.obj.status = STATUS.OPEN) : (add_vm.obj.status = STATUS.CLOSE);
			var $this = $(this);
			if(!add_vm.obj.name) {
				Toast.show('提醒信息', '模块名称不能为空', Toast.type.WARNING);
				return;
			}
			if(!add_vm.obj.url) {
				Toast.show('提醒信息', 'url地址不能为空', Toast.type.WARNING);
				return;
			}
			if(!add_vm.obj.description) {
				Toast.show('提醒信息', '模块描述不能为空', Toast.type.WARNING);
				return;
			}
			if(!add_vm.obj.css) {
				Toast.show('提醒信息', '模块css不能为空', Toast.type.WARNING);
				return;
			}

			$this.button('loading');
			var param_array = TOOL.create_array();
			param_array.append('app_id', add_vm.obj.app_id);
			param_array.append('name', add_vm.obj.name);
			param_array.append('pid', add_vm.obj.pid);
			param_array.append('url', add_vm.obj.url);
			param_array.append('description', add_vm.obj.description);
			param_array.append('is_close', add_vm.checked?0:1);
			param_array.append('css', add_vm.obj.css);
			MyAjax(URL.add, param_array.get_data(), function(data) {
				$this.button('reset');
				Toast.r(data, true, success_callback, true);
			}, function() {
				Toast.net_error();
				$this.button('reset');
			});
			
		},
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(vm, elem) {
			add_vm = vm;
			avalon.scan(elem, vm);
		},
		$ready: function() {},

		//单项数据
		obj: {
            app_id:"",
            id:-1,
			//名称
			name: '',
            //父级
            pid:0,
			url: '',
            description:'',
			sort: 0,
			css: '',
			//状态
			status: STATUS.CLOSE,
		},

		//下拉的权限数据
		rel: [],

		//该值对应obj.status true open false close
		checked: true,

		
		app_list:[],
		
		init_app_list:function(){
			add_vm.is_loading_data = true;
			MyAjax(URL.query_app, [], function(data) {
				add_vm.is_loading_data = false;
				Toast.r(data, true, function() {
					add_vm.app_list = data.data;
				}, true);
			}, function() {
				add_vm.is_loading_data = false;
				Toast.net_error();
			});
		}

	});
	

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 * @param load_fun 用于下拉的权限数据的函数
	 */
	add_vm.$init = function(paraurl, app_id,load_fun) {
		URL = paraurl;
		//执行查询方法
		load_fun(function(data) {
			Toast.r(data, false, function() {
				data.data = TOOL.handle_lvl_array(data.data);
				var item = {},
					array = [],
					name = '',
					rel = data.data;
				for (var i = 0; i < rel.length; i++) {
					if(rel[i].lvl == 1){
						item = rel[i],
							name = item.name;
						var left_blank = "";
						for(var lvl_i=0;lvl_i<item.lvl-1;lvl_i++){
							left_blank+="└";
						}
						//如果是一级就不用那个符号
						name = left_blank+"  " + item.name;
						array.push({
							name: name,
							id: item.id
						});
					}
				}
				add_vm.rel = array;
			}, true);
		});
		//初始化数据状态！
		for (var pro in add_vm.error) {
			if (add_vm.error.hasOwnProperty(pro)) {
				add_vm.error[pro] = false;
			}
		}
		console.log(app_id);
		add_vm.obj.name = '';
		add_vm.obj.sort = 0;
		add_vm.obj.css = '';
		add_vm.obj.description = "";
		add_vm.obj.url = "";
		//这里的值不重置
		add_vm.obj.app_id = app_id;
		add_vm.obj.status = STATUS.CLOSE;
		add_vm.checked = true;
	};

	//注册操作成功之后的回调函数
	add_vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.add_vm = add_vm;
	return avalon;

});