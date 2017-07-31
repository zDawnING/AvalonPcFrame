define('components/demo/add_group/add_group', ['component_modules/avalon/avalon.modern.shim', 'lib/text!http://127.0.0.1:8008/static/components/demo/add_group/add_group.html', 'components/modules/validate_mvvm/validate_mvvm', 'components/modules/toast/toast', 'components/modules/myajax/myajax', 'components/common/js/tool', 'component_modules/sortable/Sortable', 'lib/css!http://127.0.0.1:8008/static/components/demo/add_group/add_group.css'], function(avalon, template, validate, Toast, MyAjax, TOOL, Sortable) {
	var vm = {},
		v = validate({}),
		success_callback = function() {},
		URL = {};
	var LANGUAGE_TYPE = {
				CHINESE: 1,
				ENGLISH: 2
			};
	var sort_obj = '';		
	//定义为组件
	avalon.component("ms:addgroupmodal", {
		
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(init_vm, elem) {
			vm = init_vm;
			avalon.scan(elem, vm);
		},

		$ready: function() {},


		//单项数据
		obj: {
			type: '',
			name: '',
			group_id: '',
			exhibition_id: ''
		},

		exhibit_id: '',

		//分组列表
		group_list: [],

		//选中的分组列表
		selected_group_list: [],

		is_load_group_list: false,

		is_load_save: false,

		//加载列表数据
		load_group_list: function() {
			vm.is_load_group_list = true;
			MyAjax(URL.query_group_list, [], function(data) {
				vm.is_load_group_list = false;
				Toast.r(data, false, function() {
					for(var i=0;i<data.data.length;i++){
						data.data[i].is_selected = false;
						data.data[i].sort = Number(data.data[i].sort);
					}
					var sort_list = vm.list_sort(data.data);
					vm.group_list = sort_list;
				}, true);
			}, function() {
				vm.is_load_group_list = false;
				Toast.net_error();
			});
		},

		/**
		 * 对集合进行排序，根据排序因子sort进行排序 
		 * @param {Object} list
		 */
		list_sort: function(list) {
			//排序
			var sortFun = function(a, b) {
				return a.sort > b.sort ? 1 : -1;
			}
			list.sort(sortFun);
			return list;
		},

		/**
		 * 选中分组项
		 * @param  {[type]} index [description]
		 */
		select_group_item: function(index){
			// if(vm.selected_group_list.size() >= 7){
			// 	Toast.show('提醒信息','选择的列项必须小于7列',Toast.type.WARNING);
			// 	return;
			// }
			if(vm.group_list[index].is_selected){
				for(var i=0;i<vm.selected_group_list.size();i++){
					if(vm.selected_group_list[i].id == vm.group_list[index].id){
						vm.selected_group_list.splice(i, 1);
					}
				}
			}else{
				vm.selected_group_list.push(vm.group_list[index]);
			}
			vm.group_list[index].is_selected = vm.group_list[index].is_selected ? false : true;
			vm.reset_sort_selected_list();
		},

		reset_sort_selected_list: function(){
			var arr = vm.selected_group_list.$model;
			vm.selected_group_list = vm.list_sort(arr);
		},

		/**
		 * 初始化之后要进行处理 暂时不处理拖动
		 */
		view_end: function() {
			sort_obj = Sortable.create(document.getElementById('add_group_drag_div'), {
				animation: 150,
				onEnd: function(evt) { //拖拽完毕之后发生该事件
					//这里的拖动并没有对数组数据进行移动，需要手动处理
					console.log(evt.oldIndex, evt.newIndex);
					// sort.destroy();
					// if( evt.oldIndex !==  evt.newIndex){
					// 	vm.selected_group_list = TOOL.moveArray(vm.selected_group_list.$model, evt.oldIndex, evt.newIndex);

						// if(vm.active_index === evt.oldIndex){
						// 	vm.editor(evt.newIndex);
						// }
						// if(evt.newIndex == (vm.obj.title_list.size()-1)){
						// 	alert(1)
						// }
					// }
					
				},
			});
		},


		validate_data: function(){
			if( v.d('required',vm.obj.name) == false ){
				Toast.show('提醒信息','请填写群组名！',Toast.type.WARNING);
				return false;
			}
			if(vm.selected_group_list.size() <= 0 || vm.selected_group_list.size() > 7){
				Toast.show('提醒信息','选择的列项必须小于7列',Toast.type.WARNING);
				return false;
			}
			return true;
		},


		/**
		 *  保存提交
		 */
		submit: function(){
			if(!vm.validate_data()){
				return;
			}
			var list = [];
			for(var i=0;i<vm.group_list.size();i++){
				if(vm.group_list[i].is_selected){
					list.push(vm.group_list[i].id);
				}
			}
			var $this = $("#save_btn");
			$this.button('loading');
			vm.is_load_save = true;
			var param_array = TOOL.create_array();
			param_array.append('name', vm.obj.name);
			param_array.append('exhibit_id', vm.exhibit_id);
			param_array.append('ids', JSON.stringify(list));
			MyAjax(URL.add_group, param_array.get_data(), function(data) {
				$this.button('reset');
				vm.is_load_save = false;
				Toast.r(data, true, success_callback(), true);
			}, function() {
				$this.button('reset');
				vm.is_load_save = false;
				Toast.net_error();
			});
		}


	});
	//初始化验证
	v = validate({});

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 */
	vm.$init = function(param_url, exhibit_id) {
		URL = param_url;
		vm.exhibit_id = exhibit_id;
		vm.obj.name = '';
		vm.selected_group_list = [];
		vm.load_group_list();
		
	};

	//注册操作成功之后的回调函数
	vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.add_group_vm = vm;
	return avalon;

});