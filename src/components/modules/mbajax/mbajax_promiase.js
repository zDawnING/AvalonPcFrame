define(['fetch'], function(fetch) {
	/**
	 * 执行自定义的移动端ajax
	 * @param {Object} url_object 		url对象，{type:'',url:'',debug:''}
	 * @param {Object} param_array 		参数对象,如{ username:'',password:'' }，不需要旧版那样用key和value属性来标识数据
	 * @param {Object} success_callback	成功的回调函数，这里默认会将data作为参数传入
	 * @param {Object} error_callback	处理错误的回调函数
	 * @param {Object} dataType 			默认是json，可选值有json、text、arrayBuffer、blob
	 */
	var mbajax = function(url_object, param_obj, success_callback, error_callback, dataType) {
		/**
		 * 检查状态 
		 * @param {Object} response
		 */
		function checkStatus(response) {
			console.log(response);
			if(response.status >= 200 && response.status < 300) {
				return response;
			} else {
				var error = new Error(response.statusText);
				error.response = response;
				throw error;
			}
		}
		/**
		 * 处理返回结果为自定义数据格式 
		 * @param {Object} response
		 */
		function parseData(response) {
			//这里判断一下是否需要执行数据返回的json化，默认是json化
			switch(dataType) {
				case 'json':
					return response.json();
				case 'text':
					return response.text();
				case 'blod':
					return response.blod();
				case 'arrayBuffer':
					return response.arrayBuffer();
				default:
					return response.json();
			}
		}
		/**
		 * 处理返回结果为接送格式
		 * @param {Object} response
		 */
		function parseJSON(response) {
			return response.json();
		}

		/**
		 * 真正的执行结果 
		 */
		function end_callback() {
			console.log('end_callbac');
			var fetch_result = null;
			//重新拼装参数，现在暂时只支持两种请求方式
			switch(url_object.type) {
				case 'get':
					var param_str = '';
					for(var pro in param_obj) {
						if(param_obj.hasOwnProperty(pro)) {
							param_str += (pro + "=" + param_obj[pro] + "&");
						}
					}
					fetch_result = fetch(url_object.url+"?"+param_str);					
					break;
				case 'post':
					var fd = new FormData();
					for(var pro in param_obj) {
						if(param_obj.hasOwnProperty(pro)) {
							fd.append(pro, param_obj[pro]);
						}
					}
					fetch_result = fetch(url_object.url, {
						method: url_object.type,
						body: fd,
					});
					break;
				default:
					body = '';
					break;
			}

			fetch_result
				.then(checkStatus)
				.then(parseData)
				.then(function(data) {
					success_callback ? success_callback(data) : null;
				}).catch(function(error) {
					error_callback ? error_callback(error) : null;
				});
		}
		//对请求参数进行验证
		if(url_object.debug && url_object.debug == true) {
			var validate_url = __inline('lib/inline/js/validate_url.js'),
				fd = new FormData(),
				domain = __inline('lib/inline/js/domain.js') + '/', //这里的链接要去掉域名
				url_array = url_object.url.split(domain);
			if( url_array.length == 1 ){
				fd.append('target_url', url_object.url);
			}else{
				fd.append('target_url', url_array[1]);
			}
			fd.append('request_type', url_object.type);
			//这里要重新构建param_array
			var param_array = [];
			for(var pro in param_obj) {
				if(param_obj.hasOwnProperty(pro)) {
					param_array.push({
						key: pro,
						value: param_obj[pro]
					});
				}
			}
			fd.append('param_array', JSON.stringify(param_array));
			var fetch_result = fetch(validate_url, {
				method: 'POST',
				body: fd,
			});
			fetch_result
				.then(checkStatus)
				.then(parseJSON)
				.then(function(data) {
					console.log('request succeeded with JSON response', data);
					if(data.status == 100 || data.status == '100') {
						end_callback();
					} else {
						alert(data.message);
					}
				}).catch(function(error) {
					alert("请求参数验证方法报网络错误");
					console.log('request failed', error);
				});
		} else {
			end_callback();
		}
	}
	return mbajax;
});