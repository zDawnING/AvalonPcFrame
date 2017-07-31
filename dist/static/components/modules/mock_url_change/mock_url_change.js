define('components/modules/mock_url_change/mock_url_change', ['require'], function(require){
	/**
	 * @param url url对象，{url:'',type:'type'}
	 */
	var fun = function(url){
		if(url.type == "post"){  //post请求
			return url.url;
		}else{    //get请求
			//转换  .=> \.
			//		/=>\/
			var regex = url.url.replace(/\./g,"\\.").replace(/\//g,"\\/");
			//url的字符串一定要匹配，同时尾巴只能有?param=value&...或者没有东西
			regex = "/^("+regex+"){1}?([?]+.*)*$/i";
			return eval(regex);			
		}
	}
	return fun;
});