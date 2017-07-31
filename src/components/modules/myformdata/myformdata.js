define('',function(){
	/**
	 * 简化参数的拼接的操作，改为FormData的方式 
	 * @param {Object} type get就返回普通字符串 post就返回FormData
	 */
	var MyFormData = function(type){
		//拼接字符串的最终结果
		if(type == 'get'){
			this.data = '';
			this.name_value_list = [];
		}else{
			this.data = new FormData();
		}
		/**
		 * 
		 */
		this.append = function(name,value){
			if(type == 'get'){
				this.name_value_list.push({
					name:name,
					value:value
				});
			}else{   //POST请求就直接调用FormData
				this.data.append(name,value);
			}
		}
		/**
	 	 * 获取最终数据 
		 */
		this.get_data = function(){
			if(type == 'get'){
				if(this.name_value_list.length>0){
					for(var i=0;i<this.name_value_list.length;i++){
						var name = this.name_value_list[i].name;
						var value = this.name_value_list[i].value;
						if(i == 0){
							this.data = (name+"="+value);
						}else{
							this.data += ("&"+name+"="+value);
						}
					}
				}
			}
			return this.data;
		}
	}
	return MyFormData;
});
