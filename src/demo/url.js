var DOMAIN = __inline('lib/inline/js/domain.js');
var URL = {
	//查询观众列表
	query: {
		url: DOMAIN + "/Admin/Audience/select_audience_list",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//查询搜索字段
	query_field_list: {
		url: DOMAIN + "/Admin/Audience/select_field",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//观众详情
	more: {
		url: DOMAIN + "/Admin/Audience/audience_detail",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//修改观众用户信息
	save: {
		url: DOMAIN + "/Admin/Audience/save_audience_detail",
		type: 'post',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//修改观众用户信息 （国外）
	en_save: {
		url: DOMAIN + "/Admin/Audience/save_audience_detail_abroad",
		type: 'post',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	query_exhibit: {
		url: DOMAIN + "/Admin/Audience/select_exhibit",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//批量删除观众
	delete_ids: {
		url: DOMAIN + "/Admin/Audience/del_audience",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//标签列表查询
	query_label_list: {
		url: DOMAIN + "/Admin/Audience/label_list",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//添加标签
	add_label: {
		url: DOMAIN + "/Admin/Audience/add_label",
		type: 'post',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//模板查询
	query_email_template: {
		url: DOMAIN + "/Admin/Email/get_email_temp",
		type: 'post',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//群发邮件
	send_email: {
		url: DOMAIN + "/Admin/Audience/send_audience_list_email",
		type: 'post',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//群发短信
	send_sms: {
		url: DOMAIN + "/Admin/Audience/send_audience_list_sms",
		type: 'post',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//所有用户数据字段
	query_group_list: {
		url: DOMAIN + "/Admin/AudienceGroup/field_audience_group",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//查询群组
	query_group: {
		url: DOMAIN + "/Admin/Audience/select_exhibit_group_list",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//新增观众群组
	add_group: {
		url: DOMAIN + "/Admin/AudienceGroup/add_audience_group",
		type: 'post',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//添加用户进群组
	add_audience_group: {
		url: DOMAIN + "/Admin/Audience/add_audience_group",
		type: 'post',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//观众详情
	load_audience: {
		url: DOMAIN + "/Admin/Audience/audience_detail",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//国外观众详情
	en_load_audience: {
		url: DOMAIN + "/Admin/Audience/audience_detail_abroad",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false
	},
	//观众中心导入
	import_excel: {
		url: DOMAIN + "/Admin/Audience/import_audience_data",
		type: 'post',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//导入模板下载
	download_template: {
		url: DOMAIN + "/观众中心导入模板.xlsx",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//下载错误的观众中心导入数据
	download_error_list: {
		url: DOMAIN + "/Admin/Audience/admin_export_error_audience",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//查询观众笔记
	query_note_list: {
		url: DOMAIN + "/Admin/Audience/select_audience_note_list",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//添加观众笔记
	add_note: {
		url: DOMAIN + "/Admin/Audience/add_audience_note",
		type: 'post',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//查询观众详情（观众与展会的关系列表）
	query_audience_to_ex: {
		url: DOMAIN + "/Admin/Audience/audience_exhibit_list",
		type: 'get',
		//debug代表是否要对请求参数进行验证
		debug: false,
	},
	//已过期允许导入的展会
	load_import_ex: {
		url: DOMAIN + "/Admin/Audience/expire_exhibit_list",
		type: 'get',
		debug: false,
	},
	//导出展会所有观众详情
	export_all_data: {
		url: DOMAIN + "/Admin/Audience/export_audience_data",
		type: 'get',
		debug: false,
	}
}