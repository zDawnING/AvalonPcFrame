/**
 * 对ajax进行封装 
 */
define(['jquery1.8.3'], function($) {
	/**
	 * 简化参数的拼接的操作，改为FormData的方式 
	 * @param {Object} type get就返回普通字符串 post就返回FormData
	 */
	var MyFormData = function(type) {
			//拼接字符串的最终结果
			this.data = '';
			this.name_value_list = [];
			/**
			 * 
			 */
			this.append = function(name, value) {
					this.name_value_list.push({
						name: name,
						value: value
					});
				}
				/**
				 * 获取最终数据 
				 */
			this.get_data = function() {
				if(this.name_value_list.length > 0) {
					for(var i = 0; i < this.name_value_list.length; i++) {
						var name = this.name_value_list[i].name;
						var value = this.name_value_list[i].value;
						if(i == 0) {
							this.data = (name + "=" + value);
						} else {
							this.data += ("&" + name + "=" + value);
						}
					}
				}
				return this.data;
			}
		}
		/**
		 * 
		 * @param {Object} url_object 		url对象，{type:'',url:'',debug:''}
		 * @param {Object} param_array 		参数集合
		 * @param {Object} success_callback	成功的回调函数，这里默认会将data作为参数传入
		 * @param {Object} error_callback	处理错误的回调函数
		 * @param {Object} dataType 			默认是json
		 */
	var myajax = function(url_object, param_array, success_callback, error_callback, dataType) {
		//最后执行的真正的ajax方法
		var end_callback = function() {
				var fd = new MyFormData(url_object.type);
				//重新拼装参数
				for(var i = 0; i < param_array.length; i++) {
					fd.append(param_array[i].key, param_array[i].value);
				}
				$.ajax({
					type: url_object.type,
					url: url_object.url,
					data: fd.get_data(),
					dataType: dataType ? dataType : 'json',
					processData: false,
					contentType: false,
					success: function(data) {
						success_callback ? success_callback(data) : null;
					},
					error: function() {
						error_callback ? error_callback() : null;
					},
				});
			}
			//对请求参数进行验证
		if(url_object.debug && url_object.debug == true) {
			var validate_url = __inline('lib/inline/js/validate_url.js');
			var fd = new MyFormData('post');
			//这里的链接要去掉域名
			var domain = __inline('lib/inline/js/domain.js') + '/';
			var url_array = url_object.url.split(domain);
			fd.append('target_url', url_array[1]);
			fd.append('request_type', url_object.type);
			fd.append('param_array', JSON.stringify(param_array));
			$.ajax({
				type: 'post',
				url: validate_url,
				data: fd.get_data(),
				dataType: 'json',
				processData: false,
				contentType: false,
				success: function(data) {
					if(data.status == 100 || data.status == '100') {
						end_callback();
					} else {
						alert(data.message);
					}
				},
				error: function() {
					alert("请求参数验证方法报网络错误");
				},
			});
		} else {
			end_callback();
		}
	}
	return myajax;
});