var DOMAIN = __inline('lib/inline/js/domain.js');
var URL = {
	//查询问卷列表
	query: {
		url: DOMAIN + "/Admin/Form/form_list_search",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
}