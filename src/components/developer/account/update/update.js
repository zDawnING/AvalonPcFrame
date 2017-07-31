define(['avalon',
	'text!com/developer/account/update/update.html',
	'validate',
	'toast',
	'myajax',
	'tool',
	'css!com/developer/account/update/update.css',
], function(avalon, template, validate, Toast, MyAjax, TOOL) {
	var update_vm = {},
		v = {},
		ue = undefined, //ueditor的引用
		success_callback = function() {},
		URL = {},
		CHECK_STATUS = {
			CHECKED:1,
			NO_CHECK:0
		};
	//定义为组件
	avalon.component("ms:updatemodal", {
		submit: function() {
			var exhibit_id_array = [];
			// for(var i = 0; i < update_vm.selected_ex_list.length; i++) {
			// 	if(update_vm.selected_ex_list[i]) {
			// 		exhibit_id_array.push(update_vm.selected_ex_list[i]);
			// 	}
			// }
			for (var i = 0; i < update_vm.ex_list.size(); i++) {
				if(update_vm.ex_list[i].is_check == CHECK_STATUS.CHECKED){
					exhibit_id_array.push(update_vm.ex_list[i].id);
				}
			}
			var $this = $(this);
			//赋值
			if(!update_vm.obj.account) {
				if(!v.d('phone', update_vm.obj.account)) {
					Toast.show('提醒信息', '请输入正确的手机号码', Toast.type.WARNING);
					return;
				}
				Toast.show('提醒信息', '登录账号不能为空', Toast.type.WARNING);
				return;
			}
//			if(!update_vm.obj.password) {
//				Toast.show('提醒信息', '登录密码不能为空', Toast.type.WARNING);
//				return;
//			}
			if(!update_vm.obj.group_id) {
				Toast.show('提醒信息', '请选择角色', Toast.type.WARNING);
				return;
			}
			if(exhibit_id_array.length == 0) {
				Toast.show('提醒信息', '请选择展会数据', Toast.type.WARNING);
				return;
			}
			$this.button('loading');
			update_vm.obj.exhibit_id = JSON.stringify(exhibit_id_array);
			var param_array = TOOL.create_array();
			for(var pro in update_vm.obj) {
				if(update_vm.obj.hasOwnProperty(pro) == true) {
					if( update_vm.is_submit_pro(pro) == true ){
						param_array.append(pro, update_vm.obj[pro]);	
					}
				}
			}
			//启用状态 0 不启用 1 启用
			if(update_vm.obj.status == true) {
				param_array.append('status', '1');
			} else {
				param_array.append('status', '0');
			}
            if(update_vm.obj.password){
                param_array.append('password', update_vm.obj.password);
            }
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
		$ready: function() {},

		//单项数据
		obj: {
			"user_id": "",
			"account": "",
			"password": "",
			"user_name": "",
			"group_id": "",
			"exhibit_id": "",
			"status": "",
		},
		is_locked_btn: false,
		//商家类型列表
		user_group: [],
		init_user_group: function() {
			MyAjax(URL.user_group, [], function(data) {
				Toast.r(data, false, function() {
					update_vm.user_group = data.data;
				}, true);
			}, function() {
				Toast.net_error();
			});
		},

		ex_list: [],
		load_ex: function(callback) {
			MyAjax(URL.load_ex, [], function(data) {
				Toast.r(data, false, function() {
					var year_arr = [];
					for(var i=0;i<data.data.length;i++){
						data.data[i].is_check = CHECK_STATUS.NO_CHECK;
						var year = data.data[i].date.substring(0, 4);
						if(!update_vm.check_year_is_have(year_arr, year)){
							year_arr.push(year)
						}
					}
					update_vm.year_list = year_arr;
					update_vm.ex_list = data.data;
					update_vm.change_year_data();
					callback?callback():null;
				}, true);
			}, function() {
				callback?callback():null;
				Toast.net_error();
			});
		},
		// selected_ex_list: [],
		// add_selected_ex_list: function() {
		// 	update_vm.selected_ex_list.push('');
		// },

		is_loading_data: false,
		load_data: function(id) {
			update_vm.is_loading_data = true;
			var param_array = TOOL.create_array();
			param_array.append('user_id', id);
			MyAjax(URL.more, param_array.get_data(), function(data) {
				update_vm.is_loading_data = false;
				Toast.r(data, false, function() {
					update_vm.selected_ex_list = data.data.exhibit_id;
					data.data.exhibit_id = JSON.stringify(data.data.exhibit_id);
					var temp_arr = JSON.parse(data.data.exhibit_id);
					for(var i=0;i<update_vm.ex_list.size();i++){
						for(var j=0;j<temp_arr.length;j++){
							if(temp_arr[j] == update_vm.ex_list[i].id){
								update_vm.ex_list[i].is_check = CHECK_STATUS.CHECKED;
							}
						}
					}
					update_vm.obj = data.data;
				}, true);
			}, function() {
				update_vm.is_loading_data = false;
				Toast.net_error();
			});
		},
		/**
		 * 判断这个属性是否需要提交 
		 * @param {Object} pro
		 */
		is_submit_pro:function(pro){
			var pro_array = ['user_id','account','password','user_name','group_id','exhibit_id'];
			for(var i=0;i<pro_array.length;i++){
				if( pro == pro_array[i] ){
					return true;
				}
			}
			return false;
		},

		/********  以上交互不够人性化，新增版本 ********/

		//选中数目
		selected_num: 0,

		check_selected_num: function(){
			var count = 0;
			for(var i=0;i < update_vm.ex_list.size();i++){
				if(update_vm.ex_list[i].is_check === CHECK_STATUS.CHECKED){
					count++;
				}
			}
			update_vm.selected_num = count;
		},

		select_ex_item: function(index){
			update_vm.ex_year_list[index].is_check = (update_vm.ex_year_list[index].is_check === CHECK_STATUS.NO_CHECK) ? CHECK_STATUS.CHECKED : CHECK_STATUS.NO_CHECK;
			update_vm.check_selected_num();
		},

		year_list:[],

		//选择的年份
		select_year: new Date().getFullYear(),

		//根据年份的展会列表
		ex_year_list:[],

		change_year_data: function(){
			var list = [];
			for(var i=0;i<update_vm.ex_list.size();i++){
				if(update_vm.ex_list[i].date.indexOf(update_vm.select_year) != -1){
					//此处只是将引用赋值给新数组，数据变化还会同步的
					list.push(update_vm.ex_list[i]);
				}
			}
			update_vm.ex_year_list = list;
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

	});
	v = validate({});

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 */
	update_vm.$init = function(param_url, obj) {
		URL = param_url;
		//初始化数据状态！
		for(var pro in update_vm.obj) {
			if(update_vm.obj.hasOwnProperty(pro)) {
				update_vm.obj[pro] = '';
			}
		}
		//		update_vm.init_city_list();
		update_vm.init_user_group();
		update_vm.selected_ex_list = [];
		//		update_vm.selected_ex_list.push('');
		update_vm.load_ex(function(){
			update_vm.load_data(obj.id);
		});
		update_vm.is_locked_btn = false;
		//		update_vm.obj.sex = 1;
		//		update_vm.obj.status = true;
		
	};

	//注册操作成功之后的回调函数
	update_vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.update_vm = update_vm;
	return avalon;

});