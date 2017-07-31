define(['avalon',
	'text!com/developer/json/config/config.html',
	'toast',
	'myajax',
	'tool',
	'layer',
	'css!com/developer/json/config/config.css'
], function(avalon, template, Toast, MyAjax,TOOL,layer) {
	var config_vm = {},
		URL = {},
		success_callback = avalon.noop;
	//定义为组件
	avalon.component("ms:configmodal", {
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(vm, elem) {
			config_vm = vm;
			avalon.scan(elem, vm);
		},
		$ready: function() {

		},

		//单项数据
		obj: {
			//规则id
		 	"urle_id": "",
		 	//映射key
		  	"key": "",
		  	//对一个value
		  	"field": "",
		  	//描述
		  	"explain": "",
		  	//单项id	
		  	"id":"",
		},
		//是否正在加载数据
		is_loading_data: false,
		//映射数据
		list:[],
		/**
		 * 添加
		 */
		add:function(){
			//验证
			if( !config_vm.obj.key ){
				Toast.show('提醒信息','请输入key',Toast.type.WARNING);
				return;
			}
			if( !config_vm.obj.field ){
				Toast.show('提醒信息','请输入字段映射',Toast.type.WARNING);
				return;
			}
			//判断不能重复
			var is_same = false;
			for(var i=0;i<config_vm.list.length;i++){
				if( config_vm.list[i].key == config_vm.obj.key ){
					is_same = true;
					break;
				}
			}
			if( is_same ){
				Toast.show('提醒信息','key应当当前唯一',Toast.type.WARNING);
				return ;
			}
			var $this = $(this);
			$this.button('loading');
			var param_array = TOOL.create_array();
			param_array.append('urle_id',config_vm.obj.urle_id);
			param_array.append('field_key',config_vm.obj.key);
			param_array.append('field',config_vm.obj.field);
			param_array.append('field_explain',config_vm.obj.explain);
			MyAjax(URL.add_config,param_array.get_data(),function(data){
				$this.button('reset');
				Toast.r(data,true,function(){
					config_vm.obj.key = '';
					config_vm.obj.field = '';
					config_vm.obj.explain = '';
					config_vm.load();
				},true);
			},function(){
				$this.button('reset');
				Toast.net_error();
			});
		},
		/**
		 * 加载查询数据
		 * @return {[type]} [description]
		 */
		load:function(){
			//远程加载数据
			config_vm.is_loading_data = true;
			var param_array = TOOL.create_array();
			param_array.append('field_key-like','');
			param_array.append('urle_id',config_vm.obj.urle_id);
			MyAjax(URL.query_config, param_array.get_data(), function(data) {
				config_vm.is_loading_data = false;
				Toast.r(data, false, function() {
					config_vm.list = data.data;
				}, true);
			}, function() {
				config_vm.is_loading_data = false;
				Toast.net_error();
			});
		},

		/**
		 * 更新
		 * @param  {[type]} index [description]
		 * @return {[type]}       [description]
		 */
		update:function(index){
			var $this = $(this);
			var obj = config_vm.list[index];
			var param_array = TOOL.create_array();
			$this.button('loading');
			param_array.append('id',obj.id);
			param_array.append('field_key',obj.field_key);
			param_array.append('field',obj.field);
			param_array.append('field_explain',obj.field_explain);
			MyAjax(URL.update_config,param_array.get_data(),function(data){
				$this.button('reset');
				Toast.r(data,true,function(){

				},true);
			},function(){
				$this.button('reset');
				Toast.net_error();
			});
		},

			/**
			 * 展示删除确定框
			 */
			show_delete_confirm: function(index) {
				var load_flag = layer.load(0, {
					shade: false
				});
				require(['swal', 'css!swal_css'], function() {
					layer.close(load_flag);
					swal({
							title: "您确定要" + config_vm.list[index].field_key + "删除这条信息吗",
							text: "删除后将无法恢复，请谨慎操作！",
							type: "warning",
							showCancelButton: true,
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "是的，我要删除！",
							cancelButtonText: "让我再考虑一下…",
							closeOnConfirm: false,
							closeOnCancel: false
						},
						function(isConfirm) {
							if (isConfirm) {
								config_vm.delete(index);
							} else {
								swal("已取消", "您取消了删除操作！", "error");
							}
						});
				});
			},
			/**
			 * 执行删除
			 */
			delete: function(index) {
				var param_array = TOOL.create_array();
				param_array.append('id',config_vm.list[index].id);
				MyAjax(URL.delete_config, param_array.get_data(), function(data) {
					Toast.r(data, false, function() {
						swal("删除成功！", data.message, "success");
						avalon.Array.removeAt(config_vm.list,index);
					}, false, function() {
						swal("删除失败！", data.message, "error");
					});
				}, function() {
					Toast.net_error();
				});
			},	
		//标题
		title:'',		


	});

	//初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	config_vm.$init = function(param_url, obj) {
		URL = param_url;
		config_vm.obj.urle_id = obj.id;
		config_vm.title = obj.name;
		config_vm.load();
	};
	config_vm.$r = function(callback){
		success_callback = callback;
	}
	//可以在这里将vm传到外面
	avalon.vmodels.config_vm = config_vm;
	return avalon;

});