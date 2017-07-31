define(['avalon',
	'text!com/demo/audience/audience.html',
	'toast',
	'myajax',
	'tool',
	'validate',
	'layer',
	'com/demo/audience/countryCode',
	'css!com/demo/audience/audience.css'
], function(avalon, template, Toast, MyAjax, TOOL, validate, layer, countryCode) {
	var vm = {},
		v = {},
		success_callback = function() {},
		backback = function() {},
		//现在URL都要index.js传入
		URL = {};

	var LAND_TYPE = {
				INLAND: 1,
				OULAND: 2
			},
			SEX_TYPE = {
				MALE:1,
				FEMALE: 2
			},
			STATUS_TYPE = {
				YES: 1,
				NO: 2
			},
			IS_SELF = {
				YES: 1,
				NO: 2
			},
			IS_ENGLISH = {
				YES: 1,
				NO: 0
			};	
	//定义为组件
	avalon.component("ms:audiencemodal", {
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(init_vm, elem) {
			vm = init_vm;
			avalon.scan(elem, vm);
		},
		$ready: function() {
			require(['city_three_select_pc'], function() {});
		},

		back: function() {
        backback ? backback() : null;
    },

		obj: {
			"id": "",
		  "phone_pre": "",
		  "phone": "",
		  "country": "",
		  "corporation": "",
		  "name": "",
		  "post": "",
		  "job_function": "",
		  "email": "",
		  "area1": "",
		  "area2": "",
		  "area3": "",
		  "detailed": "",
		  "url": "",
		  "fax": "",
		  "sex": "",
		  "address": "",
		  "is_checked": "",
		  "phone_zone": "",
		  "post_code": "",
		  "linkman": "",
		  "effective_phone": "",
		  "effective_address": "",
		  "effective_email": "",
		  "effective_linkman": "",
		  "label_list": [],
		  "audience_group_list": []
		},

		active_tab_index: 0,

		exhibit_id: '',

   	note_text: '',

		is_load: false,

		is_load_audience_to_ex: false,

		label_list: [],

		audience_to_ex_list: [],

		my_label_list:[],

		other_label_list:[],

		note_list: [],

		is_load_label_list: false,

		is_load_note_list: false,

		is_load_add_note: false,

		load: function() {
			var load_flag = layer.load(0, { shade: false });
			vm.is_load = true;
			var param_array = TOOL.create_array();
			param_array.append('exhibit_id', vm.exhibit_id);
			param_array.append('is_english', IS_ENGLISH.NO);
			param_array.append('id', vm.obj.id);
			MyAjax(URL.load_audience, param_array.get_data(), function(data) {
				layer.close(load_flag);
				vm.is_load = false;
				Toast.r(data, false, function() {
					vm.obj = data.data;
					//回填地址
					avalon.citythreeselect_module_vm.set_area1(data.data.area1);
					setTimeout(function() {
						avalon.citythreeselect_module_vm.set_area2(data.data.area2);
						setTimeout(function() {
							avalon.citythreeselect_module_vm.set_area3(data.data.area3);
						}, 200);
					}, 200);
					//创建标签分组
					if(data.data.label_list.length>0){
						var my_arr = [], other_arr = [];
						for(var i=0;i<data.data.label_list.length;i++){
							if(data.data.label_list[i].is_self == IS_SELF.YES){
								my_arr.push(data.data.label_list[i]);
							}
							if(data.data.label_list[i].is_self == IS_SELF.NO){
								other_arr.push(data.data.label_list[i]);
							}
						}
						vm.my_label_list = my_arr;
						vm.other_label_list = other_arr;
						vm.checked_my_add_label();
					}
				}, true);
			}, function() {
				layer.close(load_flag);
				Toast.net_error();
				vm.is_load = false;
			});
		},

		/**
		 * 加载观众参与展会记录列表
		 * @return {[type]} [description]
		 */
		load_audience_to_ex: function(){
			vm.is_load_audience_to_ex = true;
			var param_array = TOOL.create_array();
			param_array.append('id', vm.obj.id);
			param_array.append('exhibit_id', vm.exhibit_id);
			MyAjax(URL.query_audience_to_ex, param_array.get_data(), function(data) {
				vm.is_load_audience_to_ex = false;
				Toast.r(data, false, function() {
					vm.audience_to_ex_list = data.data;
				}, true);
			}, function() {
				vm.is_load_audience_to_ex = false;
				Toast.net_error();
			});
		},

		/**
		 * 变更相应字段是否有效状态
		 * @return {[type]} [description]
		 */
		change_status: function(pro){
			vm.obj[pro] = vm.obj[pro] == STATUS_TYPE.YES ? STATUS_TYPE.NO : STATUS_TYPE.YES;
		},

		//加载列表数据
		load_label_list: function(callback) {
			vm.is_load_label_list = true;
			var param_array = TOOL.create_array();
			// param_array.append('ids', JSON.stringify(vm.ids.$model));
			MyAjax(URL.query_label_list, param_array.get_data(), function(data) {
				vm.is_load_label_list = false;
				Toast.r(data, false, function() {
					for(var i=0;i<data.data.length;i++){
						data.data[i].is_selected = false;
					}
					vm.label_list = data.data;
					callback?callback():null;
				}, true);
			}, function() {
				vm.is_load_label_list = false;
				Toast.net_error();
			});
		},

		select_label_item: function(index){
			vm.label_list[index].is_selected = vm.label_list[index].is_selected ? false : true;
		},

		check_selected_label_num: function(){
			var count = 0;
			for(var i=0;i<vm.label_list.size();i++){
				if(vm.label_list[i].is_selected){
					count++;
				}
			}
			return count;
		},

		/**
		 * 改变标签类型tab
		 */
		change_label_type_tab: function(index){
			vm.active_tab_index = index;
		},

		/**
		 * 回填我添加的标签
		 * @return {[type]} [description]
		 */
		checked_my_add_label: function(){
			var size = vm.my_label_list.size();
			if(size>0){
				for(var i=0;i<vm.label_list.size();i++){
					for(var j=0;j<size;j++){
						if(vm.label_list[i].id == vm.my_label_list[j].id){
							vm.label_list[i].is_selected = true;
						}
					}
				}
			}
		},

		/**
		 * 保存选择的标签
		 */
		save_selected_label: function(){
			if(vm.check_selected_label_num() == 0){
				Toast.show('提醒信息','请至少选择一项标签！',Toast.type.WARNING);
				return;
			}
			var label_arr = [];
			for(var i=0;i<vm.label_list.size();i++){
				if(vm.label_list[i].is_selected){
					label_arr.push(vm.label_list[i].id);
				}
			}
			var audience_arr = [];
			audience_arr.push(vm.obj.id);
			var $this = $(this);
			$this.button('loading');
			vm.is_load_submit = true;
			var param_array = TOOL.create_array();
			param_array.append('ids', JSON.stringify(label_arr));
			param_array.append('audience_arr', JSON.stringify(audience_arr));
			MyAjax(URL.add_label, param_array.get_data(), function(data) {
				$this.button('reset');
				vm.is_load_submit = false;
				Toast.r(data, true, function(){

				}, true);
			}, function() {
				$this.button('reset');
				vm.is_load_submit = false;
				Toast.net_error();
			});
		},

		/**
		 * 查询笔记列表
		 * @return {[type]} [description]
		 */
		query_note_list: function(){
			vm.is_load_note_list = true;
			var param_array = TOOL.create_array();
			param_array.append('id', vm.obj.id);
			MyAjax(URL.query_note_list, param_array.get_data(), function(data) {
				vm.is_load_note_list = false;
				Toast.r(data, false, function() {
					vm.note_list = data.data;
				}, true);
			}, function() {
				vm.is_load_note_list = false;
				Toast.net_error();
			});
		},

		/**
		 * 添加笔记
		 * @return {[type]} [description]
		 */
		add_note: function(){
			if( v.d('required',vm.note_text) == false ){
				Toast.show('提醒信息','笔记内容不能为空！',Toast.type.WARNING);
				return;
			}
			var $this = $(this);
			$this.button('loading');
			vm.is_load_add_note = true;
			var param_array = TOOL.create_array();
			param_array.append('id', vm.obj.id);
			param_array.append('note', vm.note_text);
			MyAjax(URL.add_note, param_array.get_data(), function(data) {
				$this.button('reset');
				vm.is_load_add_note = false;
				Toast.r(data, true, function() {
					vm.note_text = '';
					vm.query_note_list();
				}, true);
			}, function() {
				$this.button('reset');
				vm.is_load_add_note = false;
				Toast.net_error();
			});
		},

		validate_audience: function(){
			if(v.d('required', vm.obj.id) == false) {
				Toast.show('提示', '请先执行查询再执行保存！', Toast.type.WARNING);
				return false;
			}
			//验证字段
			if(v.d('required', vm.obj.sex) == false) {
				Toast.show('提示', '请选择性别', Toast.type.WARNING);
				return false;
			}
			if(v.d('required', vm.obj.company) == false) {
				Toast.show('提示', '公司名称不能为空', Toast.type.WARNING);
				return false;
			}
			if(v.d('required', avalon.citythreeselect_module_vm.get_result()) == false) {
				Toast.show('提示', '公司地址所在城市不能为空', Toast.type.WARNING);
				return false;
			}
			if(v.d('required', vm.obj.detailed) == false) {
				Toast.show('提示', '公司地址不能为空', Toast.type.WARNING);
				return false;
			}
			if(v.d('required', vm.obj.linkman) == false) {
				Toast.show('提示', '固话不能为空', Toast.type.WARNING);
				return false;
			}
			if(v.d('required', vm.obj.name) == false) {
				Toast.show('提示', '姓名不能为空', Toast.type.WARNING);
				return false;
			}
			if(v.d('required', vm.obj.email) == false) {
				Toast.show('提示', '邮箱不能为空', Toast.type.WARNING);
				return false;
			}
			return true;
		},

		/**
		 * 提交保存用户信息
		 * @return {[type]} [description]
		 */
		submit_save: function(){
			if(!vm.validate_audience()){
				return;
			}
			var $this = $(this);
			$this.button('loading');
			var param_array = TOOL.create_array();
			param_array.append("id", vm.obj.id);
			param_array.append('phone_pre', vm.obj.phone_pre);
			param_array.append('phone', vm.obj.phone);
			param_array.append('country', vm.obj.country);
			param_array.append('corporation', vm.obj.corporation);
			param_array.append('name', vm.obj.name);
			param_array.append('area1', avalon.citythreeselect_module_vm.get_area1());
			param_array.append('area2', avalon.citythreeselect_module_vm.get_area2());
			param_array.append('area3', avalon.citythreeselect_module_vm.get_area3());
			param_array.append('detailed', vm.obj.detailed);
			param_array.append('post', vm.obj.post);
			param_array.append('job_function', vm.obj.job_function);
			param_array.append('email', vm.obj.email);
			param_array.append('url', vm.obj.url);
			param_array.append('fax', vm.obj.fax);
			param_array.append('sex', vm.obj.sex);
			param_array.append('address', vm.obj.address);
			param_array.append('phone_zone', vm.obj.phone_zone);
			param_array.append('post_code', vm.obj.post_code);
			param_array.append('linkman', vm.obj.linkman);
			param_array.append('effective_phone', vm.obj.effective_phone);
			param_array.append('effective_address', vm.obj.effective_address);
			param_array.append('effective_email', vm.obj.effective_email);
			param_array.append('effective_linkman', vm.obj.effective_linkman);
			MyAjax(URL.save, param_array.get_data(), function(data) {
				$this.button('reset');
				Toast.r(data, true, function() {
					
				}, true);
			}, function() {
				$this.button('reset');
				Toast.net_error();
			});
		},

		/* ---------  新增英文版修改  --------- */

		countryCode: countryCode,

		 //观众类型（国内外）
    audience_type: IS_ENGLISH.NO,

    en_obj: {
			"id": "",
		  "phone_pre": "",
		  "phone": "",
		  "country": "",
		  "corporation": "",
		  "first_name": "",
		  "last_name": "",
		  "post": "",
		  "job_function": "",
		  "email": "",
		  "area1": "",
		  "area2": "",
		  "area3": "",
		  "detailed": "",
		  "url": "",
		  "fax": "",
		  "sex": "",
		  "address": "",
		  "is_checked": "",
		  "phone_zone": "",
		  "post_code": "",
		  "linkman": "",
		  "effective_phone": "",
		  "effective_address": "",
		  "effective_email": "",
		  "effective_linkman": "",
		  "label_list": [],
		  "audience_group_list": []
		},

		/**
		 * 加载国外观众数据
		 * @return {[type]} [description]
		 */
		en_load: function() {
			var load_flag = layer.load(0, { shade: false });
			vm.is_load = true;
			var param_array = TOOL.create_array();
			param_array.append('exhibit_id', vm.exhibit_id);
			param_array.append('is_english', IS_ENGLISH.YES);
			param_array.append('id', vm.en_obj.id);
			MyAjax(URL.en_load_audience, param_array.get_data(), function(data) {
				layer.close(load_flag);
				vm.is_load = false;
				Toast.r(data, false, function() {
					vm.en_obj = data.data;
					//创建标签分组
					if(data.data.label_list.length>0){
						var my_arr = [], other_arr = [];
						for(var i=0;i<data.data.label_list.length;i++){
							if(data.data.label_list[i].is_self == IS_SELF.YES){
								my_arr.push(data.data.label_list[i]);
							}
							if(data.data.label_list[i].is_self == IS_SELF.NO){
								other_arr.push(data.data.label_list[i]);
							}
						}
						vm.my_label_list = my_arr;
						vm.other_label_list = other_arr;
						vm.checked_my_add_label();
					}
				}, true);
			}, function() {
				layer.close(load_flag);
				Toast.net_error();
				vm.is_load = false;
			});
		},

		/**
		 * 变更相应字段是否有效状态
		 * @return {[type]} [description]
		 */
		en_change_status: function(pro){
			vm.en_obj[pro] = vm.en_obj[pro] == STATUS_TYPE.YES ? STATUS_TYPE.NO : STATUS_TYPE.YES;
		},

		en_validate_audience: function(){
			if(v.d('required', vm.obj.id) == false) {
				Toast.show('提示', '请先执行查询再执行保存！', Toast.type.WARNING);
				return false;
			}
			//验证字段
			if(v.d('required', vm.en_obj.email) == false) {
				Toast.show('提示', '邮箱不能为空', Toast.type.WARNING);
				return;
			}
			if(v.d('email', vm.en_obj.email) == false) {
				Toast.show('提示', '邮箱格式有误', Toast.type.WARNING);
				return;
			}
			if(v.d('required', vm.en_obj.sex) == false) {
				Toast.show('提示', '请选择性别', Toast.type.WARNING);
				return;
			}
			if (v.d('required', vm.en_obj.phone) == false) {
				Toast.show('提示', '电话不能为空', Toast.type.WARNING);
				return;
			}
			if(v.d('required', vm.en_obj.first_name) == false) {
				Toast.show('提示', 'First Name不能为空', Toast.type.WARNING);
				return;
			}
			if(v.d('required', vm.en_obj.last_name) == false) {
				Toast.show('提示', 'Last Name不能为空', Toast.type.WARNING);
				return;
			}
			return true;
		},

		/**
		 * 提交保存用户信息
		 * @return {[type]} [description]
		 */
		en_submit_save: function(){
			if(!vm.en_validate_audience()){
				return;
			}
			var $this = $(this);
			$this.button('loading');
			var param_array = TOOL.create_array();
			for(var pro in vm.en_obj) {
				if(vm.en_obj.hasOwnProperty(pro)) {
					if(pro != 'is_checked' && pro != 'label_list' && pro != 'audience_group_list'){
						param_array.append(pro, vm.en_obj[pro]);
					}
				}
			}
			MyAjax(URL.en_save, param_array.get_data(), function(data) {
				$this.button('reset');
				Toast.r(data, true, function() {
					
				}, true);
			}, function() {
				$this.button('reset');
				Toast.net_error();
			});
		},

	});
	
	//初始化验证
	v = validate({});

	//初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	vm.$init = function(param_url, obj, exhibit_id) {
		URL = param_url;
		vm.exhibit_id = exhibit_id;
		vm.obj.id = obj.id;
		vm.en_obj.id = obj.id;
		if(obj.is_english == IS_ENGLISH.YES){
			vm.audience_type = IS_ENGLISH.YES;
			vm.load_label_list(function(){
					vm.en_load();
			});
		}else{
			vm.audience_type = IS_ENGLISH.NO;
			vm.load_label_list(function(){
					vm.load();
			});
		}
		vm.query_note_list();
		vm.load_audience_to_ex();
	};

	//注册操作成功之后的回调函数
	vm.$r = function(callback) {
		success_callback = callback;
	};

	vm.$back = function(callback) {
    backback = callback;
  };

	//可以在这里将vm传到外面
	avalon.vmodels.audience_vm = vm;
	return avalon;

});