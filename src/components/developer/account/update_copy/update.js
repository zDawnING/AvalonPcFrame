define(['avalon',
	'text!com/developer/account/update/update.html',
	'validate',
	'toast',
	'myajax',
	'tool'
], function(avalon, template, validate, Toast, MyAjax, TOOL) {
	var update_vm = {},
		v = {},
		ue = undefined, //ueditor的引用
		success_callback = function() {},
		URL = {};
	//定义为组件
	avalon.component("ms:updatemodal", {
		submit: function() {
			var $this = $(this);
			
			if(!update_vm.obj.account) {
				if(!v.d('phone', update_vm.obj.account)) {
					Toast.show('提醒信息', '请输入正确的手机号码', Toast.type.WARNING);
					return;
				}
//				Toast.show('提醒信息', '登录账号不能为空', Toast.type.WARNING);
//				return;
			}
			if(!update_vm.obj.header_url) {
				Toast.show('提醒信息', '请选择要上传的头像', Toast.type.WARNING);
				return;
			}
			if(!update_vm.obj.group_id) {
				Toast.show('提醒信息', '请选择用户组', Toast.type.WARNING);
				return;
			}

			$this.button('loading');
			var param_array = TOOL.create_array();
			param_array.append('user_id-eq', update_vm.obj.user_id);
			param_array.append('account', update_vm.obj.account);
			param_array.append('password', update_vm.obj.password);
			param_array.append('group_id', update_vm.obj.group_id);
			param_array.append('header_url', update_vm.obj.header_url);
			param_array.append('user_name', update_vm.obj.user_name);
			param_array.append('sex', update_vm.obj.sex);
			param_array.append('status', update_vm.obj.status);
			
			MyAjax(URL.update, param_array.get_data(), function(data) {
				$this.button('reset');
				Toast.r(data, true, function() {
					success_callback ? success_callback() : null;
				}, true);
			}, function() {
				$this.button('reset');
				Toast.net_error();
			});

		},
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(vm, elem) {
			update_vm = vm;
			avalon.scan(elem, vm);
		},
		$ready: function() {
			$("#update_filename").change(function() {
				var files = this.files;
				if(files.length <= 0) {
					return;
				} else {
					var file = files[0];
					update_vm.file_name = file.name;
					update_vm.$file = file;
					update_vm.upload_img();
				}
			});
			
		},

		//单项数据
		obj: {
		  "user_id":"",
		  "account": "",
		  "password": "",
		  "user_name": "",
		  "group_id": "",
		  "header_url": "",
		  "sex": "",
		  "introduce": "",
		  "province_id": "",
		  "city_id": "",
		  "county_id": "",
		  "wechat_openid": "",
		  "telephone": "",
		  "real_name": "",
		  "id_card": "",
		  "status":""
		},
		
		//单项数据
		$old_obj: {
		  "user_id":"",
		  "account": "",
		  "password": "",
		  "user_name": "",
		  "group_id": "",
		  "header_url": "",
		  "sex": "",
		  "introduce": "",
		  "province_id": "",
		  "city_id": "",
		  "county_id": "",
		  "wechat_openid": "",
		  "telephone": "",
		  "real_name": "",
		  "id_card": "",
		  "status":""
		},

		upload_img: function() {
			update_vm.is_locked_btn = true;
			var param_array = TOOL.create_array();
			param_array.append('img', update_vm.$file);
			MyAjax(URL.upload_img, param_array.get_data(), function(data) {
				update_vm.is_locked_btn = false;
				Toast.r(data, true, function() {
					update_vm.obj.icon = data.data.url;
				}, true);
			}, function() {
				update_vm.is_locked_btn = false;
				Toast.net_error();
			});
		},
		
//		init_city_list: function() {
//			require(['citydata_n'], function(citydata) {
//				update_vm.province = citydata;
//			});
//		},
//
//		//省份数组
//		province: [],
//		//当前省份下标
//		province_index: "",
//		//当前省份名称
//		province_name: "",
//		//选择一级城市之后要修改二级城市
//		province_change: function() {
//			var index = document.getElementById("update_province_id").selectedIndex;
//			update_vm.province_index = index - 1;
//			if(update_vm.province_index >= 0) {
//				console.log(update_vm.province[update_vm.province_index]);
//				update_vm.obj.province_id = update_vm.province[update_vm.province_index].province_id;
//				update_vm.province_name = update_vm.province[update_vm.province_index].province_name;
//				update_vm.city = update_vm.province[update_vm.province_index].city;
//				update_vm.obj.city_id = "";
//				update_vm.obj.county_id = "";
//				document.getElementById("update_city_id").selectedIndex = 0;
//				document.getElementById("update_county_id").selectedIndex = 0;
//			}
//		},
//
//		//城市数组
//		city: [],
//		//当前城市下标
//		city_index: "",
//		//当前城市名称
//		city_name: "",
//		//选择二级城市之后要修改三级城市
//		city_change: function() {
//			var index = document.getElementById("update_city_id").selectedIndex;
//			update_vm.city_index = index - 1;
//			if(update_vm.city_index >= 0) {
//				update_vm.obj.city_id = update_vm.city[update_vm.city_index].city_id;
//				update_vm.city_name = update_vm.city[update_vm.city_index].city_name;
//				update_vm.county = update_vm.city[update_vm.city_index].county;
//				update_vm.obj.county_id = "";
//				document.getElementById("update_county_id").selectedIndex = 0;
//			}
//		},
//
//		//地区数组
//		county: [],
//		//当前城市下标
//		county_index: "",
//		//当前城市名称
//		county_name: "",
//		//选取地区后
//		county_change:function(){
//			var index = document.getElementById("update_county_id").selectedIndex;
//			update_vm.county_index = index - 1;
//			if(update_vm.county_index >= 0) {
//				update_vm.obj.county_id = update_vm.county[update_vm.county_index].county_id;
//				update_vm.county_name = update_vm.county[update_vm.county_index].county_name;
//			}
//		},

		//文件对象
		$file: '',

		//文件名对象
		file_name: '',

		is_locked_btn: false,
		
		//默认开启
		checked:true,
		
		is_loading_data:false,
		
		//商家类型列表
		user_group:[],
		
		init_user_group:function(){
			MyAjax(URL.user_group, [], function(data) {
				Toast.r(data, true, function() {
					update_vm.user_group = data.data;
				}, true);
			}, function() {
				Toast.net_error();
			});
		},
		
		/**
		 * 验证该用户名是否唯一
		 * @return {[type]} [description]
		 */
		validate: function(callback) {
			if (update_vm.obj.account) {
				update_vm.is_locked_btn = true;
				var param_array = TOOL.create_array();
				param_array.append('account-eq', update_vm.obj.account);
				MyAjax(URL.validate, param_array.get_data(), function(data) {
					Toast.r(data, false, function() {
						//验证过就标记为没变动过
						update_vm.is_account_change = false;
						//已存在
						if (data.data == '1') {
							Toast.show('提醒信息', '该登录名已被占用！', Toast.type.WARNING);
							update_vm.is_locked_btn = true;
						} else {
							update_vm.is_locked_btn = false;
							callback?callback():null;
						}
					}, true);
				}, function() {
					update_vm.is_locked_btn = false;
				});
			}
		},

	});
	v = validate({});
	
	//判断属性有没有变化过，如果变化过了就解锁
	var is_changed = function() {
		//标记数据有没有变化  true有变化 false没有变化
		var result = false;
		for(var pro in update_vm.$old_obj) {
			if(update_vm.$old_obj[pro] != update_vm.obj[pro]) {
				result = true;
			}
		}
		return result;
	}
	update_vm.$watch('obj.*', function(newValue, oldValue) {
		update_vm.is_locked_btn = !is_changed();
	});

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 */
	update_vm.$init = function(param_url,obj) {
		URL = param_url;
		//初始化数据状态！
		for(var pro in obj) {
			if(update_vm.obj.hasOwnProperty(pro)) {
				if(update_vm.$old_obj.hasOwnProperty(pro)) {
					update_vm.$old_obj[pro] = update_vm.obj[pro] = obj[pro];
				} else {
					update_vm.obj[pro] = obj[pro];
				}
			}
		}
		update_vm.file_name = update_vm.obj.header_url;
//		update_vm.init_city_list();
		update_vm.init_user_group();
		update_vm.is_locked_btn = true;
		
		
	};

	//注册操作成功之后的回调函数
	update_vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.update_vm = update_vm;
	return avalon;

});