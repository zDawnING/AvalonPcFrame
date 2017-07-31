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
	//����Ϊ���
	avalon.component("ms:configmodal", {
		$template: template,
		/**
		 * @param vm ���ǿ��Զ���������������vm
		 */
		$init: function(vm, elem) {
			config_vm = vm;
			avalon.scan(elem, vm);
		},
		$ready: function() {

		},

		//��������
		obj: {
			//����id
		 	"urle_id": "",
		 	//ӳ��key
		  	"key": "",
		  	//��һ��value
		  	"field": "",
		  	//����
		  	"explain": "",
		  	//����id	
		  	"id":"",
		},
		//�Ƿ����ڼ�������
		is_loading_data: false,
		//ӳ������
		list:[],
		/**
		 * ���
		 */
		add:function(){
			//��֤
			if( !config_vm.obj.key ){
				Toast.show('������Ϣ','������key',Toast.type.WARNING);
				return;
			}
			if( !config_vm.obj.field ){
				Toast.show('������Ϣ','�������ֶ�ӳ��',Toast.type.WARNING);
				return;
			}
			//�жϲ����ظ�
			var is_same = false;
			for(var i=0;i<config_vm.list.length;i++){
				if( config_vm.list[i].key == config_vm.obj.key ){
					is_same = true;
					break;
				}
			}
			if( is_same ){
				Toast.show('������Ϣ','keyӦ����ǰΨһ',Toast.type.WARNING);
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
		 * ���ز�ѯ����
		 * @return {[type]} [description]
		 */
		load:function(){
			//Զ�̼�������
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
		 * ����
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
			 * չʾɾ��ȷ����
			 */
			show_delete_confirm: function(index) {
				var load_flag = layer.load(0, {
					shade: false
				});
				require(['swal', 'css!swal_css'], function() {
					layer.close(load_flag);
					swal({
							title: "��ȷ��Ҫ" + config_vm.list[index].field_key + "ɾ��������Ϣ��",
							text: "ɾ�����޷��ָ��������������",
							type: "warning",
							showCancelButton: true,
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "�ǵģ���Ҫɾ����",
							cancelButtonText: "�����ٿ���һ�¡�",
							closeOnConfirm: false,
							closeOnCancel: false
						},
						function(isConfirm) {
							if (isConfirm) {
								config_vm.delete(index);
							} else {
								swal("��ȡ��", "��ȡ����ɾ��������", "error");
							}
						});
				});
			},
			/**
			 * ִ��ɾ��
			 */
			delete: function(index) {
				var param_array = TOOL.create_array();
				param_array.append('id',config_vm.list[index].id);
				MyAjax(URL.delete_config, param_array.get_data(), function(data) {
					Toast.r(data, false, function() {
						swal("ɾ���ɹ���", data.message, "success");
						avalon.Array.removeAt(config_vm.list,index);
					}, false, function() {
						swal("ɾ��ʧ�ܣ�", data.message, "error");
					});
				}, function() {
					Toast.net_error();
				});
			},	
		//����
		title:'',		


	});

	//��ʼ���������������ͨ����ָ���ݵĳ�ʼ����ͬʱ���������Ӧ��Ҫ�����ⲿ����
	config_vm.$init = function(param_url, obj) {
		URL = param_url;
		config_vm.obj.urle_id = obj.id;
		config_vm.title = obj.name;
		config_vm.load();
	};
	config_vm.$r = function(callback){
		success_callback = callback;
	}
	//���������ｫvm��������
	avalon.vmodels.config_vm = config_vm;
	return avalon;

});