require(['jquery1.8.3', 'avalon_pc'], function($, avalon) {
	require([
		'toast_ie8',
		'layer',
		'bootstrap3.0.3',
		'myajax_ie8',
	], function(Toast, layer, bootstrap, MyAjax) {
		//引入URL
		__inline('url.js');
		var rootvm = avalon.define({
			$id: 'root',
			//只要avalon解析完，也就代码页面可以展示了
			is_ready: true,

		});
		//表格查询的vm
		var queryvm = avalon.define({
			$id: 'query',

			//列表数据
			list: [],

			//加载列表数据
			load_list: function() {
				queryvm.is_load_list = true;
				MyAjax(URL.query, [], function(data) {
					queryvm.is_load_list = false;
					Toast.r(data, false, function() {
						queryvm.list = data.data;
					}, true);
				}, function() {
					queryvm.is_load_list = false;
					Toast.net_error();
				});
			},

			//是否正在加载列表
			is_load_list: false,

		});
		//引入debug.js
		__inline('debug.js');
		//引入测试器
		__inline('lib/inline/js/debug_function.js');
		//所有的初始方法都放在这里面执行
		DEBUG_FUNCTION(DEBUG, function() {
			//执行查询
			queryvm.load_list();
			avalon.scan();
		});
	});
});