define('components/demo/select/select', ['component_modules/avalon/avalon.modern.shim', 'lib/text!http://127.0.0.1:8008/static/components/demo/select/select.html', 'components/modules/validate_mvvm/validate_mvvm', 'components/modules/toast/toast', 'components/modules/myajax/myajax', 'components/common/js/tool'], function(avalon, template, validate, Toast, MyAjax, TOOL) {
	var vm = {},
		v = validate({}),
		success_callback = function() {},
		URL = {};
	var LANGUAGE_TYPE = {
				CHINESE: 1,
				ENGLISH: 2
			},
			FIELD_STATUS = {
	      HAVE: 1,
	      NO: 2
	    };
	//定义为组件
	avalon.component("ms:selectmodal", {
		
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

		show_query_param:{
      "name": true,
      "corporation": true,
      "phone": true,
      // "apply": false,
      // "source": false,
      "area1": false,
      "area2": false,
      "area3": false,
      "email": false,
      //这里共同控制开始时间和结束时间
      // "date": false,
      "is_checked": false,
      // "is_testify": false,
      // "is_pda": false,
      "is_english": false,
      "post_code": false,
     	"effective_phone": false,
      "effective_address": false,
      "effective_email": false,
      "effective_linkman": false,
      "label_id": false
    },
		
		//’有‘标识条件列表
		have_select_list: [],
		//'无'标识条件列表
		no_select_list: [],

		is_load_list: false,

		create_select_list: function(list, selected_list){
			var have_arr = [],
          no_arr = [];
      for(var i=0;i<list.length;i++){
        var have_obj = {
          id: list[i].id,
          name: '有'+ list[i].name,
          is_selected: false,
          is_have: FIELD_STATUS.HAVE
        }
        var no_obj = {
          id: list[i].id,
          name: '无'+ list[i].name,
          is_selected: false,
          is_have: FIELD_STATUS.NO
        }
        for(var j=0;j<selected_list.length;j++){
        	if(selected_list[j].name == have_obj.name){
        		have_obj.is_selected = true;
        	}
        	if(selected_list[j].name == no_obj.name){
        		no_obj.is_selected = true;
        	}
        }
        have_arr.push(have_obj);
        no_arr.push(no_obj);
      }
      vm.have_select_list = have_arr;
      vm.no_select_list = no_arr;
		},

		/**
		 * 选择已有条件项
		 * @param  {[type]} index [description]
		 * @return {[type]}       [description]
		 */
		select_have_item: function(index){
			vm.have_select_list[index].is_selected = vm.have_select_list[index].is_selected ? false : true;
		},

		select_no_item: function(index){
			vm.no_select_list[index].is_selected = vm.no_select_list[index].is_selected ? false : true;
		},

		/**
		 * 选择查询参数
		 * @param  {[type]} key [description]
		 */
		select_query_param: function(key){
			vm.show_query_param[key] = vm.show_query_param[key] ? false : true;
		},

		submit: function(){
			var list = [];
			vm.have_select_list.forEach(function(item){
				if(item.is_selected){
					list.push(item);
				}
			});
			vm.no_select_list.forEach(function(item){
				if(item.is_selected){
					list.push(item);
				}
			})
			success_callback(list, vm.show_query_param.$model);
		}

	});
	//初始化验证
	v = validate({});

	/**
	 * 初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	 */
	vm.$init = function(param_url, list, selected_list, show_query_param) {
		URL = param_url;
		vm.show_query_param = show_query_param;
		//初始化数据状态！
		for (var pro in vm.obj) {
			if (vm.obj.hasOwnProperty(pro)) {
				vm.obj[pro] = '';
			}
		}

		vm.create_select_list(list, selected_list);
		
	};

	//注册操作成功之后的回调函数
	vm.$r = function(callback) {
		success_callback = callback;
	};

	//可以在这里将vm传到外面
	avalon.vmodels.select_vm = vm;
	return avalon;

});