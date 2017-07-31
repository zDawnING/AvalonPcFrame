define(['avalon',
	'text!com/developer/json/update/update.html',
	'toast',
	'myajax',
	'validate',
	'css!com/developer/json/update/update.css'
], function(avalon, template, Toast, MyAjax, validate) {
	var update_vm = {},
		URL = {},
		ue_request = {},
		ue_data = {},
		success_callback = avalon.noop,
		v = validate({});
	//定义为组件
	avalon.component("ms:updatemodal", {
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(vm, elem) {
			update_vm = vm;
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
		},
		//json文档的固定结构
		json_schema: {
			name: '',
			description: '',
			type: '',
			request: {
				type: 'object',
				//这里存放的是json格式
				proterties: '',
			},
			response: {
				type: 'object',
				proterties: {
					status: {
						type: 'integer',
						description: "状态码，这里都是全局错误码"
					},
					message: {
						type: "string",
						description: "后台返回的信息"
					},
					//这里存放的是json格式
					data: '',
				}
			},
		},

		//是否正在加载数据
		is_loading_data: false,
		/**
		 * 写完提交 
		 */
		submit: function() {
			var $this = $("#update_submit_btn");
			$this.button('loading');
			update_vm.submit_do('1', function() {
				$this.button('reset');
			});
		},
		/**
		 * 未写完 
		 */
		submit_no: function() {
			var $this = $("#update_submit_btn_no");
			$this.button('loading');
			update_vm.submit_do('0', function() {
				$this.button('reset');
			});
		},

		submit_do: function(write_status, callback) {
			//验证格式
			if(!update_vm.json_schema.name) {
				Toast.show('提醒信息', '请填写接口名称！', Toast.type.WARNING);
				callback ? callback() : null;
				return;
			}
			if(!update_vm.json_schema.description) {
				Toast.show('提醒信息', '请填写接口描述！', Toast.type.WARNING);
				callback ? callback() : null;
				return;
			}
			if(!update_vm.json_schema.type) {
				Toast.show('提醒信息', '请填写请求方式！', Toast.type.WARNING);
				callback ? callback() : null;
				return;
			}
			//这里可以做json的测试验证
			try {
				var param_array = [];
				param_array.push({
					key: 'id',
					value: update_vm.obj.id,
				});
				param_array.push({
					key: 'write_status',
					value: write_status,
				});
				//重新合并json_schema
				var json_schema = {
					name: update_vm.json_schema.name,
					description: update_vm.json_schema.description,
					type: update_vm.json_schema.type,
					request: {
						type: 'object',
						proterties: JSON.parse(update_vm.json_schema.request.proterties),
					},
					response: {
						type: 'object',
						proterties: {
							status: {
								type: 'integer',
								description: "状态码，这里都是全局错误码"
							},
							message: {
								type: "string",
								description: "后台返回的信息"
							},
							data: JSON.parse(update_vm.json_schema.response.proterties.data),
						}
					},
				};
				param_array.push({
					key: 'json_schema',
					value: JSON.stringify(json_schema, undefined, 2),
				});
				MyAjax(URL.update_json, param_array, function(data) {
					callback ? callback() : null;
					Toast.r(data, true, function() {
						success_callback(write_status)
					}, true);
				}, function() {
					callback ? callback() : null;
					Toast.net_error();
				});
			} catch(e) {
				//TODO handle the exception
				callback ? callback() : null;
				Toast.show('提醒信息', '又写错了？撸太多了！', Toast.type.WARNING);
			}
		},
		/**
		 *  
		 * @param {Object} type
		 */
		copy_param: function(type) {
			var obj = {};
			switch(type) {
				case '1':
					obj = {
						"cur_page": {
							"type": "integer",
							"description": "当前页",
							"is_null": false,
							"rule": "",
							"dbname": ""
						},
						"page_size": {
							"type": "integer",
							"description": "一页多少条",
							"is_null": false,
							"rule": "",
							"dbname": ""
						}
					}
					break;
				case '2':
					obj = {
						"name": {
							"type": "",
							"description": "",
							"is_null": false,
							"rule": "",
							"dbname": ""
						},
					}
					break;
				case '3':
					obj = {
						"items": {
							"type": "object",
							"description": "",
							"proterties": {
								"id": {
									"type": "",
									"description": "",
									"is_null": false,
									"rule": "",
									"dbname": ""
								}
							}
						}
					}
					break;
				case '4':
					obj = {
						"items": {
							"type": "",
							"description": "",
							"is_null": false,
							"rule": "",
							"dbname": ""
						}
					}
					break;
				case '21':
					obj = {
						"name": {
							"type": "",
							"description": "",
							"is_null": false,
							"rule": "",
						},
					}
					break;
				case '31':
					obj = {
						"items": {
							"type": "object",
							"description": "",
							"proterties": {
								"id": {
									"type": "",
									"description": "",
									"is_null": false,
									"rule": "",
								}
							}
						}
					}
					break;
				case '41':
					obj = {
						"items": {
							"type": "",
							"description": "",
							"is_null": false,
							"rule": "",
						}
					}
					break;					
				case '5':

					break;
				default:
					break;
			}
			var json = JSON.stringify(obj, undefined, 2);
			//这里要去掉第一个和最后一个括号
			update_vm.copy(json.substr(1, json.length - 2));
		},
		/**
		 * 执行复制 
		 * @param {Object} value 需要复制的值
		 */
		copy: function(value) {
			var copy_target = document.getElementById("copy_input_update_modal");
			copy_target.value = value;
			$(".update_json_modal_copy_textarea").val(value);
			copy_target.select(); // 选择对象
			document.execCommand("Copy");
			Toast.r({
				status: '100',
				message: '"已复制好，可贴粘。',
			}, true);
		},
		/**
		 * 使用模板
		 * @param {Object} type
		 */
		input_copy_json: function(type) {
			var obj = {};
			switch(type) {
				case '0':
					obj = {
						description: '',
						type: 'string',
					}
					break;
				case '1':
					obj = {
						description: '',
						type: 'object',
						proterties: {
							id: {
								type: "integer",
								description: "数据的ID",
								is_null: false,
								rule: 'integer',
							},
						},
					}
					break;
				case '2':
					obj = {
						description: '返回集合',
						type: 'array',
						items: {
							type: 'object',
							description: '',
							proterties: {
								id: {
									type: "integer",
									description: "数据的ID",
									is_null: false,
									rule: 'integer',
								},

								name: {
									type: 'string',
									description: '名称',
									is_null: false,
									rule: 'string',
								},
							}
						}
					}
					break;
				case '3':
					obj = {

						description: "返回的查询数据，带分页",

						type: 'object',

						proterties: {
							count: {
								description: '共有多少条数据',
								type: 'integer',
								is_null: false,
								rule: 'integer',
							},
							list: {
								description: '数据集合',

								type: "array",

								items: {

									type: 'object',

									description: '',

									proterties: {

										id: {
											type: "integer",
											description: "数据的ID",
											is_null: false,
											rule: 'integer',
										},

										name: {
											type: 'string',
											description: '名称',
											is_null: false,
											rule: 'string',
										},

									}

								}
							}
						}
					};
					break;
				default:
					break;
			}
			update_vm.json_schema.response.proterties.data = JSON.stringify(obj, undefined, 2);
			ue_data.setContent(update_vm.json_schema.response.proterties.data);
		},
		/**
		 * 格式化格式 
		 */
		clear_format_request: function() {
			try {
				//update_vm.json_schema.request.proterties
				var request = JSON.parse(ue_request.getContentTxt()),
					request_json = JSON.stringify(request, undefined, 2);
				ue_request.setContent(request_json);
			} catch(e) {
				//TODO handle the exception
				Toast.show('提醒信息', '又写错了？撸太多了！', Toast.type.WARNING);
			}
		},

		clear_format_response: function() {
			try {
				//update_vm.json_schema.response.proterties.data
				var data = JSON.parse(ue_data.getContentTxt()),
					data_json = JSON.stringify(data, undefined, 2);
				ue_data.setContent(data_json);
			} catch(e) {
				//TODO handle the exception
				Toast.show('提醒信息', '又写错了？撸太多了！', Toast.type.WARNING);
			}
		},
		//保存上次的键
		$last_key_code: '',
		$save_timer: '',
	});
	update_vm.$r = function(callback) {
			success_callback = callback;
		}
		//初始化操作，这个操作通常是指数据的初始化，同时，这个调用应该要交给外部调用
	update_vm.$init = function(param_url, obj) {
		update_vm.json_schema.name = '';
		update_vm.json_schema.description = '';
		update_vm.json_schema.type = '';
		//注册快速格式化功能
		//		$(".modal-backdrop").click(function() {
		//			update_vm.clear_format_request();
		//			update_vm.clear_format_response();
		//			alert(1);
		//		});
		//禁止浏览器的快捷键行为
		$("#update_modal").keydown(function(e) {
			//			console.log(e.keyCode);
			//兼容苹果和windows的快捷键
			if((update_vm.$last_key_code == 91 && e.keyCode == 83) || (e.ctrlKey == true && e.keyCode == 83)) {
				//				console.log('ctrl+s');
				// 截取返回false就不会保存网页了
				return false;
			}
			//快捷键格式化 219 221
			if((update_vm.$last_key_code == 91 && e.keyCode == 219) || (e.ctrlKey == true && e.keyCode == 219) || (update_vm.$last_key_code == 91 && e.keyCode == 221) || (e.ctrlKey == true && e.keyCode == 221)) {
				update_vm.clear_format_request();
				update_vm.clear_format_response();
			}
			update_vm.$last_key_code = e.keyCode;
		});
		URL = param_url;
		//回填数据！
		for(var pro in obj) {
			if(update_vm.obj.hasOwnProperty(pro)) {
				update_vm.obj[pro] = obj[pro];
			}
		}
		//远程加载数据
		update_vm.is_loading_data = true;
		var param_array = [];
		param_array.push({
			key: 'id',
			value: obj.id
		});
		MyAjax(URL.more, param_array, function(data) {
			update_vm.is_loading_data = false;
			Toast.r(data, false, function() {
				//					data.data.json_schema = JSON.stringify(JSON.parse(data.data.json_schema), undefined, 2);
				//回填数据
				for(var pro in data.data) {
					if(update_vm.obj.hasOwnProperty(pro)) {
						update_vm.obj[pro] = data.data[pro];
					}
				}
				if(data.data.json_schema) {
					//回填json文档的一些固定节点
					var json_obj = JSON.parse(data.data.json_schema);
					update_vm.json_schema.name = json_obj.name;
					update_vm.json_schema.description = json_obj.description;
					update_vm.json_schema.type = json_obj.type;
					update_vm.json_schema.request.proterties = JSON.stringify(json_obj.request.proterties, undefined, 2);
					update_vm.json_schema.response.proterties.data = JSON.stringify(json_obj.response.proterties.data, undefined, 2);
				} else {

				}
				//这里要设置接口名称和描述的默认值
				if(!update_vm.json_schema.name) {
					update_vm.json_schema.name = obj.name + '接口';
					update_vm.json_schema.description = obj.name + '描述';
				}
				require(['zeroclipboard'], function(ZeroClipboard) {
					window.ZeroClipboard = ZeroClipboard;
					ue_request = UE.getEditor('update_json_schema_request', {
						toolbars: [
							[]
						],
						//美化json展示
						initialStyle: 'p{white-space: pre; font-family: monospace; }',
					});
					ue_request.ready(function() {
						ue_request.addListener('contentchange', function(editor) {
							update_vm.json_schema.request.proterties = ue_request.getContentTxt();
						});
						if(data.data.json_schema) {
							ue_request.setContent(update_vm.json_schema.request.proterties);
						} else {
							//设置默认值
							var default_show_obj = {
								name: {
									type: '',
									description: '',
									is_null: false,
									rule: '',
									dbname: '',
								},
							};
							ue_request.setContent(JSON.stringify(default_show_obj, undefined, 2));
						}
					});
				});
				require(['zeroclipboard'], function(ZeroClipboard) {
					window.ZeroClipboard = ZeroClipboard;
					ue_data = UE.getEditor('update_json_schema_data', {
						toolbars: [
							[]
						],
						//美化json展示
						initialStyle: 'p{white-space: pre; font-family: monospace; }',
					});
					ue_data.ready(function() {
						ue_data.addListener('contentchange', function(editor) {
							update_vm.json_schema.response.proterties.data = ue_data.getContentTxt();
						});
						if(data.data.json_schema) {
							ue_data.setContent(update_vm.json_schema.response.proterties.data);
						} else {
							//设置默认值
							ue_data.setContent("{}");
						}
					});
				});
			}, true);
		}, function() {
			update_vm.is_loading_data = false;
			Toast.net_error();
		});
	};
	//可以在这里将vm传到外面
	avalon.vmodels.update_vm = update_vm;
	return avalon;

});