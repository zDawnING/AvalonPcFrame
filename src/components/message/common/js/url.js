define(['domain'],function(domain){
	return {
		//查询报名情况
		query:{
			url:domain+"/Exhibition/Message/get_message_list",
			type:'get'
		}
	}
});