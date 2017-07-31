define(['avalon',
	'text!com/developer/account/add/add.html',
	'validate',
	'toast',
	'myajax',
	'tool',
	'css!com/developer/account/add/add.css',
], function(avalon, template, validate, Toast, MyAjax, TOOL) {
	var add_vm = {},
		v = {},
		ue = undefined, //ueditor的引用
		success_callback = function() {},
		URL = {},
		CHECK_STATUS = {
			CHECKED:1,
			NO_CHECK:0
		};
	//定义为组件
	avalon.component("ms:addmodal", {
		submit: function() {
			var exhibit_id_array = [];
			// for(var i = 0; i < add_vm.selected_ex_list.length; i++) {
			// 	if(add_vm.selected_ex_list[i]) {
			// 		exhibit_id_array.push(add_vm.selected_ex_list[i]);
			// 	}
			// }
			for (var i = 0; i < add_vm.ex_list.size(); i++) {
				if(add_vm.ex_list[i].is_check == CHECK_STATUS.CHECKED){
					exhibit_id_array.push(add_vm.ex_list[i].id);
				}
			}
			
			var $this = $(this);
			//赋值
			if(!add_vm.obj.account) {
				if(!v.d('phone', add_vm.obj.account)) {
					Toast.show('提醒信息', '请输入正确的手机号码', Toast.type.WARNING);
					return;
				}
				Toast.show('提醒信息', '登录账号不能为空', Toast.type.WARNING);
				return;
			}
			if(!add_vm.obj.password) {
				Toast.show('提醒信息', '登录密码不能为空', Toast.type.WARNING);
				return;
			}
			// if(!add_vm.obj.header_url) {
			// Toast.show('提醒信息', '请选择要上传的头像', Toast.type.WARNING);
			// return;
			// }
			if(!add_vm.obj.group_id) {
				Toast.show('提醒信息', '请选择角色', Toast.type.WARNING);
				return;
			}
			if(exhibit_id_array.length == 0) {
				Toast.show('提醒信息', '请选择展会数据', Toast.type.WARNING);
				return;
			}
			$this.button('loading');
			add_vm.obj.exhibit_id = JSON.stringify(exhibit_id_array);
			var param_array = TOOL.create_array();
			for(var pro in add_vm.obj) {
				if(add_vm.obj.hasOwnProperty(pro) == true) {
					if( pro != 'status' ){
						param_array.append(pro, add_vm.obj[pro]);	
					}
				}
			}
			//启用状态 0 不启用 1 启用
			if(add_vm.obj.status == true) {
				param_array.append('status','1');
			} else {
				param_array.append('status','0');
			}			
			MyAjax(URL.add, param_array.get_data(), function(data) {
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
			add_vm = vm;
			avalon.scan(elem, vm);
		},
		$ready: function() {
			//			$("#add_filename").change(function() {
			//				var files = this.files;
			//				if(files.length <= 0) {
			//					return;
			//				} else {
			//					var file = files[0];
			//					add_vm.file_name = file.name;
			//					add_vm.$file = file;
			//					add_vm.upload_img();
			//				}
			//			});

		},

		//单项数据
		obj: {
			//			"account": "",
			//			"password": "",
			//			"user_name": "",
			//			"group_id": "",
			//			"header_url": "",
			//			"sex": "",
			//			"introduce": "",
			//			"province_id": "",
			//			"city_id": "",
			//			"county_id": "",
			//			"wechat_openid": "",
			//			"telephone": "",
			//			"real_name": "",
			//			"id_card": "",
			//			"status": ""
			"account": "",
			"password": "",
			"user_name": "",
			"group_id": "",
			"exhibit_id": "",
			//			"sex": "",
			"status": "",
		},

		//		upload_img: function() {
		//			add_vm.is_locked_btn = true;
		//			var param_array = TOOL.create_array();
		//			param_array.append('img', add_vm.$file);
		//			MyAjax(URL.upload_img, param_array.get_data(), function(data) {
		//				add_vm.is_locked_btn = false;
		//				Toast.r(data, true, function() {
		//					add_vm.obj.header_url = data.data.url;
		//				}, true);
		//			}, function() {
		//				add_vm.is_locked_btn = false;
		//				Toast.net_error();
		//			});
		//		},

		//		init_city_list: function() {
		//			require(['citydata_n'], function(citydata) {
		//				add_vm.province = citydata;
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
		//			var index = document.getElementById("add_province_id").selectedIndex;
		//			add_vm.province_index = index - 1;
		//			if(add_vm.province_index >= 0) {
		//				console.log(add_vm.province[add_vm.province_index]);
		//				add_vm.obj.province_id = add_vm.province[add_vm.province_index].province_id;
		//				add_vm.province_name = add_vm.province[add_vm.province_index].province_name;
		//				add_vm.city = add_vm.province[add_vm.province_index].city;
		//				add_vm.obj.city_id = "";
		//				add_vm.obj.county_id = "";
		//				document.getElementById("add_city_id").selectedIndex = 0;
		//				document.getElementById("add_county_id").selectedIndex = 0;
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
		//			var index = document.getElementById("add_city_id").selectedIndex;
		//			add_vm.city_index = index - 1;
		//			if(add_vm.city_index >= 0) {
		//				add_vm.obj.city_id = add_vm.city[add_vm.city_index].city_id;
		//				add_vm.city_name = add_vm.city[add_vm.city_index].city_name;
		//				add_vm.county = add_vm.city[add_vm.city_index].county;
		//				add_vm.obj.county_id = "";
		//				document.getElementById("add_county_id").selectedIndex = 0;
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
		//			var index = document.getElementById("add_county_id").selectedIndex;
		//			add_vm.county_index = index - 1;
		//			if(add_vm.county_index >= 0) {
		//				add_vm.obj.county_id = add_vm.county[add_vm.county_index].county_id;
		//				add_vm.county_name = add_vm.county[add_vm.county_index].county_name;
		//			}
		//		},

		//		//文件对象
		//		$file: '',
		//
		//		//文件名对象
		//		file_name: '',

		is_locked_btn: false,

		//默认开启
		checked: true,

		is_loading_data: false,

		//商家类型列表
		user_group: [],
		init_user_group: function() {
			MyAjax(URL.user_group, [], function(data) {
				Toast.r(data, false, function() {
					add_vm.user_group = data.data;
				}, true);
			}, function() {
				Toast.net_error();
			});
		},
		/**
		 * 验证该用户名是否唯一
		 * @return {[type]} [description]
		 */
		//		validate: function(callback) {
		//			if(add_vm.obj.account) {
		//				add_vm.is_locked_btn = true;
		//				var param_array = TOOL.create_array();
		//				param_array.append('account-eq', add_vm.obj.account);
		//				MyAjax(URL.validate, param_array.get_data(), function(data) {
		//					Toast.r(data, false, function() {
		//						//验证过就标记为没变动过
		//						add_vm.is_account_change = false;
		//						//已存在
		//						if(data.data == '1') {
		//							Toast.show('提醒信息', '该登录名已被占用！', Toast.type.WARNING);
		//							add_vm.is_locked_btn = true;
		//						} else {
		//							add_vm.is_locked_btn = false;
		//							callback ? callback() : null;
		//						}
		//					}, true);
		//				}, function() {
		//					add_vm.is_locked_btn = false;
		//				});
		//			}
		//		},

		ex_list: [],
		load_ex: function() {
			MyAjax(URL.load_ex, [], function(data) {
				Toast.r(data, false, function() {
					var year_arr = [];
					for(var i=0;i<data.data.length;i++){
						data.data[i].is_check = CHECK_STATUS.NO_CHECK;
						var year = data.data[i].date.substring(0, 4);
						if(!add_vm.check_year_is_have(year_arr, year)){
							year_arr.push(year)
						}
					}
					add_vm.year_list = year_arr;
					add_vm.ex_list = data.data;
					add_vm.change_year_data();
				}, true);
			}, function() {
				Toast.net_error();
			});
		},
		// selected_ex_list: [],
		// add_selected_ex_list: function() {
		// 	add_vm.selected_ex_list.push('');
		// },

		/**
		 * 删除选择的展会项
		 * @param  {[integer]} index 
		 */
		// delete_selected_ex_item: function(index){
		// 	add_vm.selected_ex_list.removeAt(index);
		// },
		
		/**
		 * 检查是否选中项是否已选
		 * @param  {[integer]} index 
		 */
		// check_is_selected: function(index){
		// 	var flag = false;
		// 	for(var i=0;i<add_vm.selected_ex_list.size();i++){
		// 		for(var j=i+1;j<add_vm.selected_ex_list.size();){
		// 			if(add_vm.selected_ex_list[i] === add_vm.selected_ex_list[j]){
		// 				add_vm.selected_ex_list[index] = ''
		// 				Toast.show('提醒信息', '该展会已选过', Toast.type.WARNING);
		// 				return;
		// 			}else{
		// 				j++;
		// 			}
		// 		}
		// 	}
		// },

		/********  以上交互不够人性化，新增版本 ********/

		//选中数目
		selected_num: 0,

		check_selected_num: function(){
			var count = 0;
			for(var i=0;i < add_vm.ex_list.size();i++){
				if(add_vm.ex_list[i].is_check === CHECK_STATUS.CHECKED){
					count++;
				}
			}
			add_vm.selected_num = count;
		},

		select_ex_item: function(index){
			add_vm.ex_year_list[index].is_check = (add_vm.ex_year_list[index].is_check === CHECK_STATUS.NO_CHECK) ? CHECK_STATUS.CHECKED : CHECK_STATUS.NO_CHECK;
			add_vm.check_selected_num();
		},

		year_list:[],

		//选择的年份
		select_year: new Date().getFullYear(),

		//根据年份的展会列表
		ex_year_list:[],

		change_year_data: function(){
			var list = [];
			for(var i=0;i<add_vm.ex_list.size();i++){
				if(add_vm.ex_list[i].date.indexOf(add_vm.select_year) != -1){
					//此处只是将引用赋值给新数组，数据变化还会同步的
					list.push(add_vm.ex_list[i]);
				}
			}
			add_vm.ex_year_list = list;
		},

		/**
     * 查看年份是否已经存在
     * @param  {[type]} arr  [description]
     * @param  {[type]} year [description]
     * @return {[type]}      [description]
     */
    check_year_is_have: function(arr,year){
      for(var i=0;i<arr.length;i++){
        if(arr[i] === year){
          return true;
        }
      }
      return false;
    },

		//
		//		rule_list: [],
		//		load_rule: function() {
		//			MyAjax(URL.load_rule, [], function(data) {
		//				Toast.r(data, false, function() {
		//					add_vm.rule_list = data.data;
		//				}, true);
		//			}, function() {
		//				Toast.net_error();
		//			});
		//		},

	});
	v = validate({});

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 */
	add_vm.$init = function(param_url) {
		URL = param_url;
		//初始化数据状态！
		for(var pro in add_vm.obj) {
			if(add_vm.obj.hasOwnProperty(pro)) {
				add_vm.obj[pro] = '';
			}
		}
		//		add_vm.init_city_list();
		add_vm.init_user_group();
		add_vm.selected_ex_list = [];
		add_vm.selected_ex_list.push('');
		add_vm.load_ex();
		add_vm.is_locked_btn = false;
		//		add_vm.obj.sex = 1;
		add_vm.obj.status = true;
	};

	//注册操作成功之后的回调函数
	add_vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.add_vm = add_vm;
	return avalon;

});