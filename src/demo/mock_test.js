require(['component_modules/mock/mock', 'components/modules/mock_url_change/mock_url_change'], function(Mock, c) {
	//引入URL.js
	__inline('url.js');
	//使用mockjs来模拟数据,注意这里的URL都要不一样！
	var mock_test = {
			//测试查询
			query: function() {
				Mock.mock(c(URL.query), {
					"status": 100,
				  "message": "操作成功",
				  "data": {
				    "count": "@natural(10, 100000)",
				    "list|1-10": [
				      {
				        "id": "@natural(10, 100000)",
				        "phone": "@string",
				        "corporation": "@natural(10, 100000)",
				        "name": "@natural(10, 100000)",
				        "email": "@natural(10, 100000)",
				        "is_english": "@natural(10, 100000)"
				      }
				    ]
				  }
				})
			},
			//查询搜索字段
			query_field_list: function() {
				Mock.mock(c(URL.query_field_list), {
					"status": 100,
				  "message": "操作成功",
				  "data|1-10": [
				    {
				      "id": "@natural(10, 100000)",
				      "name": "@string"
				    }
				  ]
				})
			},
			//观众详情
			more: function() {
				Mock.mock(c(URL.more), {
					'status': '100',
					'message': ''
				})
			},
			//修改观众用户信息
			save: function() {
				Mock.mock(c(URL.save), {
					"status": 100,
				  "message": "操作成功",
				  "data": "@string"
				})
			},
			//修改观众用户信息 （国外）
			en_save: function() {
				Mock.mock(c(URL.en_save), {
					"status": 100,
				  "message": "操作成功",
				  "data": "@string"
				})
			},
			query_exhibit: function() {
				Mock.mock(c(URL.query_exhibit), {
					"data|1-10": [
				    {
				      "id": "@natural(10, 100000)",
				      "name": "@string",
				      "year": "@string"
				    }
				  ]
				})
			},
			//批量删除观众
			delete_ids: function() {
				Mock.mock(c(URL.delete_ids), {
					"status": 100,
				  "message": "操作成功",
				  "data": "@string"
				})
			},
			//标签列表查询
			query_label_list: function() {
				Mock.mock(c(URL.query_label_list), {
					"status": 100,
				  "message": "操作成功",
				  "data|1-10": [
				    {
				      "id": "@natural(10, 100000)",
				      "name": "@string"
				    }
				  ]
				})
			},
			//添加标签
			add_label: function() {
				Mock.mock(c(URL.add_label), {
					"status": 100,
				  "message": "操作成功",
				  "data": "@string"
				})
			},
			//模板查询
			query_email_template: function() {
				Mock.mock(c(URL.query_email_template), {
					'status': '100',
					'message': ''
				})
			},
			//群发邮件
			send_email: function() {
				Mock.mock(c(URL.send_email), {
					"status": 100,
				  "message": "操作成功",
				  "data": "@string"
				})
			},
			//群发短信
			send_sms: function() {
				Mock.mock(c(URL.send_sms), {
					"status": 100,
				  "message": "操作成功",
				  "data": "@string"
				})
			},
			//所有用户数据字段
			query_group_list: function() {
				Mock.mock(c(URL.query_group_list), {
					"status": 100,
				  "message": "操作成功",
				  "data|1-10": [
				    {
				      "id": "@natural(10, 100000)",
				      "name": "@string",
				      "sort": "@string"
				    }
				  ]
				})
			},
			//查询群组
			query_group: function() {
				Mock.mock(c(URL.query_group), {
					"status": 100,
				  "message": "操作成功",
				  "data|1-10": [
				    {
				      "id": "@natural(10, 100000)",
				      "name": "@string",
				      "source": "@string",
				      "num": "@string"
				    }
				  ]
				})
			},
			//新增观众群组
			add_group: function() {
				Mock.mock(c(URL.add_group), {
					"status": 100,
				  "message": "操作成功",
				  "data": "@string"
				})
			},
			//添加用户进群组
			add_audience_group: function() {
				Mock.mock(c(URL.add_audience_group), {
					"status": 100,
				  "message": "操作成功",
				  "data": "@string"
				})
			},
			//观众详情
			load_audience: function() {
				Mock.mock(c(URL.load_audience), {
					"status": 100,
				  "message": "操作成功",
				  "data": {
				    "id": "@natural(10, 100000)",
				    "phone_pre": "@natural(10, 100000)",
				    "phone": "@string",
				    "country": "@string",
				    "corporation": "@string",
				    "name": "@string",
				    "post": "@string",
				    "job_function": "@string",
				    "email": "@string",
				    "area1": "@string",
				    "area2": "@string",
				    "area3": "@string",
				    "detailed": "@string",
				    "url": "@string",
				    "fax": "@string",
				    "sex": "@string",
				    "address": "@string",
				    "is_checked": "@string",
				    "phone_zone": "@string",
				    "post_code": "@string",
				    "linkman": "@string",
				    "effective_phone": "@string",
				    "effective_address": "@string",
				    "effective_email": "@string",
				    "effective_linkman": "@string",
				    "label_list|1-10": [
				      {
				        "label_id": "@natural(10, 100000)",
				        "label": "@string",
				        "is_self": "@natural(10, 100000)"
				      }
				    ],
				    "audience_group_list|1-10": [
				      {
				        "id": "@string",
				        "name": "@string"
				      }
				    ]
				  }
				})
			},
			//国外观众详情
			en_load_audience: function() {
				Mock.mock(c(URL.en_load_audience), {
					"status": 100,
				  "message": "操作成功",
				  "data": {
				    "id": "@natural(10, 100000)",
				    "phone_pre": "@natural(10, 100000)",
				    "phone": "@string",
				    "country": "@string",
				    "corporation": "@string",
				    "first_name": "@string",
				    "last_name": "@string",
				    "post": "@string",
				    "job_function": "@string",
				    "email": "@string",
				    "area1": "@string",
				    "area2": "@string",
				    "area3": "@string",
				    "detailed": "@string",
				    "url": "@string",
				    "fax": "@string",
				    "sex": "@string",
				    "address": "@string",
				    "is_checked": "@string",
				    "phone_zone": "@string",
				    "post_code": "@string",
				    "linkman": "@string",
				    "effective_phone": "@string",
				    "effective_address": "@string",
				    "effective_email": "@string",
				    "effective_linkman": "@string",
				    "label_list|1-10": [
				      {
				        "label_id": "@natural(10, 100000)",
				        "label": "@string",
				        "is_self": "@natural(10, 100000)"
				      }
				    ],
				    "audience_group_list|1-10": [
				      {
				        "id": "@string",
				        "name": "@string"
				      }
				    ]
				  }
				})
			},
			//观众中心导入
			import_excel: function() {
				Mock.mock(c(URL.import_excel), {
					"status": 100,
				  "message": "操作成功",
				  "data": "@string"
				})
			},
			//导入模板下载
			download_template: function() {
				Mock.mock(c(URL.download_template), {
					"status": 100,
				  "message": "操作成功",
				  "data": "@string"
				})
			},
			//下载错误的观众中心导入数据
			download_error_list: function() {
				Mock.mock(c(URL.download_error_list), {
					"status": 100,
				  "message": "操作成功",
				  "data": "@string"
				})
			},
			//查询观众笔记
			query_note_list: function() {
				Mock.mock(c(URL.query_note_list), {
					"status": 100,
				  "message": "操作成功",
				  "data|1-10": [
				    {
				      "id": "@natural(10, 100000)",
				      "time": "@string",
				      "note": "@string"
				    }
				  ]
				})
			},
			//添加观众笔记
			add_note: function() {
				Mock.mock(c(URL.add_note), {
					"status": 100,
				  "message": "操作成功",
				  "data": "@string"
				})
			},
			//查询观众详情（观众与展会的关系列表）
			query_audience_to_ex: function() {
				Mock.mock(c(URL.query_audience_to_ex), {
					"status": 100,
				  "message": "操作成功",
				  "data|1-10": [
				    {
				      "year": "@string",
				      "add_time": "@string",
				      "source": "@string",
				      "testify": "@string",
				      "pda": "@string",
				      "hall_name": "@string"
				    }
				  ]
				})
			},
			//已过期允许导入的展会
			load_import_ex: function() {
				Mock.mock(c(URL.load_import_ex), {
					"status": 100,
				  "message": "操作成功",
				  "data|1-10": [
				    {
				      "id": "@natural(10, 100000)",
				      "name": "@string",
				      "year": "@string",
				      "date": "@string"
				    }
				  ]
				})
			},
			//导出展会所有观众详情
			export_all_data: function() {
				Mock.mock(c(URL.export_all_data), {
					"status": 100,
				  "message": "操作成功",
				  "data": "@string"
				})
			},
		}
	//引入debug.js
	__inline('debug.js');
	//默认全部调用
	for (var pro in mock_test) {
		//这里要对应执行，只有开了debug的方法才会执行mock测试
		if( DEBUG[pro] == true ){
			mock_test[pro]();
		}
	}
});