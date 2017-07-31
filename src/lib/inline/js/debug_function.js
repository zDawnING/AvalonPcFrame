/**
 * 判断debug.js里面的属性是否都为false，如果有一个是true的，那就引入mock_test.js 
 * @param {Object} debug
 * @param {Object} callback
 */
var DEBUG_FUNCTION = function(debug, callback,delay) {
	var is_have_debug = false;
	for (var pro in debug) {
		if (debug[pro] == true) {
			is_have_debug = true;
		}
	}
	if (is_have_debug) {
		var href = location.href;
		var array = href.split('/');
		array[array.length - 1] = 'mock_test.js';
		//合并
		var mock_test_url = '';
		for (var i = 0; i < array.length; i++) {
			if (i == array.length - 1) {
				mock_test_url += array[i];
			} else {
				mock_test_url += (array[i] + '/');
			}
		}
		var head = document.head || document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = mock_test_url;
		head.appendChild(script);
		//真正的方法都延时执行
		setTimeout(function() {
			callback ? callback() : null;
		}, delay?delay:200);
		var is_do = false;
		if (is_do) {
			//下面这个东西也是做一个引子，让fis3进行处理
			require(['mock', 'mock_url_change'], function(Mock, c) {});
		}
	} else {
		//如果没有debug，就直接执行函数
		callback ? callback() : null;
	}
}