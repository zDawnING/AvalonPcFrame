define(['avalon',
	'text!com/developer/json/more/more.html',
	'toast',
	'myajax',
	'css!com/developer/json/more/more.css'
], function(avalon, template, Toast, MyAjax) {
	var more_vm = {},
		URL = {};
	//定义为组件
	avalon.component("ms:moremodal", {
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(vm, elem) {
			more_vm = vm;
			avalon.scan(elem, vm);
		},
		$ready: function() {

		},

		//单项数据
		obj: {
			id: '',
			name: '',
			url: '',
			test_status: '',
			use_status: '',
			super_module_name: '',
			json_schema: '',
			status: '',
			add_time: '',
			author: '',
			mock_test: '',
			response_obj_str: '',
			request_obj_str: '',
		},
		//是否正在加载数据
		is_loading_data: false,
		/**
		 * 根据json_schema生成对应的对象 
		 * @param {Object} json_schema  这里要注意一点，通常只用到response和request里面的属性
		 * @param {Object} is_mock_test 标记是否是生成mock_test的代码，默认属性赋值为空，mock_test的话赋值会比较特殊
		 */
		create_obj_by_json_schema: function(json_schema,is_mock_test) {
			var obj = {};
			/**
			 * 确定语法结构
			 * type=object->proterties
			 * type=array->items->type
			 * 		type=object->proterties
			 * 		type=array->items->type
			 * 		type=string、integer、datetime、float
			 * type=string、integer、datetime、float等 
			 */
			/**
			 * 将json_schema里面的描述转换为obj
			 * @param {Object} cur_json_schema_node 当前json_schema的对象节点
			 * @param {Object} cur_obj_node         当前的需要转换的对象节点
			 */
			var fun = function(cur_json_schema_node, cur_obj_node) {
				switch(cur_json_schema_node.type) {
					case 'object':
						//对象的话需要找到对应属性
						var proterties = cur_json_schema_node.proterties;
						//收集属性
						for(var pro in proterties) {
							//赋值
							cur_obj_node[pro] = {};
							//继续深入处理
							cur_obj_node[pro] = fun(proterties[pro], cur_obj_node[pro]);
						}
						return cur_obj_node;
					case 'array':
						//两种情况，一种是属性，一种是对象
						var items = cur_json_schema_node.items;
						cur_obj_node = [];
						cur_obj_node.push({});
						cur_obj_node[0] = fun(items, cur_obj_node[0]);
						return cur_obj_node;
					case 'string':
						return is_mock_test?'@string':'';
					case 'integer':
						return is_mock_test?'@natural(10, 100000)':'';
					case 'datetime':
						return is_mock_test?'@datetime':'';
					case 'float':
						return is_mock_test?'@natural(10, 100000)':'';
					default:
						return is_mock_test?'@string':'';
				}
			}
			obj = fun(json_schema, obj);
			return JSON.stringify(obj, undefined, 2);
		},
		/**
		 * 通过json_schema生成mock_test 
		 */
		create_mock_test: function(json_schema) {
			var proterties = json_schema.response.proterties,
				obj = {
					status: '100',
					message: '操作成功',
					data: {},
				};
			//这里主要是处理里面的data
			if(proterties.data) {
				obj.data = JSON.parse(more_vm.create_obj_by_json_schema(proterties.data,true)); 
			}
			//.replace(eval('/": \[/g'),'"1-10: ['));  .replace(eval('/|1|1-10/g'),'|1-10');
			//			more_vm.obj.mock_test = JSON.stringify(obj, undefined, 2).replace(eval("/"+OBJ_STR+"/g"),'|1').replace(eval('/": \\[/g'),'|1-10": [').replace(eval('/\\|1\\|1-10/g'),'|1-10');
			more_vm.obj.mock_test = JSON.stringify(obj, undefined, 2).replace(eval('/": \\[/g'), '|1-10": [');
		},
		/**
		 * 根据object 
		 * @param {Object} json_schema
		 */
		create_request_obj_str: function(json_schema) {
			more_vm.obj.request_obj_str = more_vm.create_obj_by_json_schema(json_schema.request);
		},
		/**
		 * 根据object 
		 * @param {Object} json_schema
		 */
		create_response_obj_str: function(json_schema) {
			more_vm.obj.response_obj_str = more_vm.create_obj_by_json_schema(json_schema.response.proterties.data);
		},
		//标记前端领域是否展示
		is_show:false,
		show:function(){
			more_vm.is_show = true;
		},
		hide:function(){
			more_vm.is_show = false;
		},
	});

	//初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	more_vm.$init = function(param_url, obj) {
		URL = param_url;
		//回填数据！
		for(var pro in obj) {
			if(more_vm.obj.hasOwnProperty(pro)) {
				more_vm.obj[pro] = obj[pro];
			}
		}
		//远程加载数据
		more_vm.is_loading_data = true;
		var param_array = [];
		param_array.push({
			key: 'id',
			value: obj.id
		});
		MyAjax(URL.more, param_array, function(data) {
			more_vm.is_loading_data = false;
			Toast.r(data, false, function() {
				data.data.json_schema = JSON.stringify(JSON.parse(data.data.json_schema), undefined, 2);
				//回填数据
				for(var pro in data.data) {
					if(more_vm.obj.hasOwnProperty(pro)) {
						more_vm.obj[pro] = data.data[pro];
					}
				}
				more_vm.create_mock_test(JSON.parse(data.data.json_schema));
				more_vm.create_request_obj_str(JSON.parse(data.data.json_schema));
				more_vm.create_response_obj_str(JSON.parse(data.data.json_schema));
			}, true);
		}, function() {
			more_vm.is_loading_data = false;
			Toast.net_error();
		});
	};
	//可以在这里将vm传到外面
	avalon.vmodels.more_vm = more_vm;
	return avalon;

});