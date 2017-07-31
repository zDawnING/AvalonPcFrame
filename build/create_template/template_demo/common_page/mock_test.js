require(['component_modules/mock/mock', 'components/modules/mock_url_change/mock_url_change'], function(Mock, c) {
	//引入URL.js
	__inline('url.js');
	//使用mockjs来模拟数据,注意这里的URL都要不一样！
	var mock_test = {
			query_member: function() {
				Mock.mock(c(URL.query_member), {
					"status": "100",
					"message": "操作成功",
					"data": {
						"count": "@natural(10, 100000)",
						"list|10-100": [{
							"id|1": [54, 84, 74, 19, 51, 87, 64, 24, 31, 20, 46, 17, 88, 90],
							"group_id": "@natural(10, 100000)",
							"name": "@string",
							"post": "@string",
							"job_function": "@string",
							"email": "@string",
							"fax": "@string",
							"phone_pre": "@string",
							"phone": "@string",
							"linkman": "@string",
							"country": "@string",
							"corporation": "@string",
							"url": "@string",
							"area1": "@string",
							"area2": "@string",
							"area3": "@string",
							"detailed": "@string"
						}]
					}
				})
			},
			query_group: function() {
				Mock.mock(c(URL.query_group), {
					"status": "100",
					"message": "操作成功",
					"data": {
						"count": "@natural(10, 100000)",
						"list|10-100": [{
							"group_id": "@natural(10, 100000)",
							"group_name": "@string",
							"member_no|1": "@natural(10, 100000)",
						}]
					}
				})
			},
			more_member: function() {
				Mock.mock(c(URL.more_member), {
					"status": "100",
					"message": "操作成功",
					"data": {
						"id": "@natural(10, 100000)",
						"name": "@string",
						"post": "@string",
						"job_function": "@string",
						"email": "@string",
						"fax": "@string",
						"phone_pre": "@string",
						"phone": "@string",
						"linkman": "@string",
						"country": "@string",
						"corporation": "@string",
						"url": "@string",
						"area1": "@string",
						"area2": "@string",
						"area3": "@string",
						"detailed": "@string",
						"extra_nums": "@natural(10, 100)",
						"group_ids|1-10": ["@natural(10, 100000)"]
					}
				})
			},
			update_record: function() {
				Mock.mock(c(URL.update_record), {
					'status': '100',
					'message': '操作成功'
				})
			},
			init_record: function() {
				Mock.mock(c(URL.init_record), {
					'status': '100',
					'message': '操作成功'
				})
			},
		}
		//引入debug.js
	__inline('debug.js');
	//默认全部调用
	for(var pro in mock_test) {
		//这里要对应执行，只有开了debug的方法才会执行mock测试
		if(DEBUG[pro] == true) {
			mock_test[pro]();
		}
	}
});