define('components/modules/city_three_select_pc/city_three_select_pc', ['component_modules/avalon/avalon.modern.shim', 'lib/text!http://127.0.0.1:8008/static/components/modules/city_three_select_pc/city_three_select_pc.html', 'components/modules/city_three_select_pc/china', 'lib/css!http://127.0.0.1:8008/static/components/modules/city_three_select_pc/city_three_select_pc.css'], function(avalon, template, chinaArea) {
	var vm = {}; 
	//定义为组件
	avalon.component("ms:citythreeselect", {
		$template: template,
		/**
		 * @param vm 我们可以定义变量来接收这个vm
		 */
		$init: function(component_vm, elem) {
			vm = component_vm;
			avalon.scan(elem, component_vm);
		},
		$ready: function() {},
		//一级城市列表
		one_city:[],
		//选中的一级城市
		one_city_result:'',
		//一级城市的下标
		one_city_index:'',
		//选择一级城市之后要修改二级城市
		one_city_change:function(){
			vm.one_city_index = this.selectedIndex-1;
			if(vm.one_city_index>=0){
				vm.one_city_result = vm.one_city[vm.one_city_index].name;
				vm.two_city = chinaArea.china.province[vm.one_city_index].city;
				document.getElementById("two_city_select").selectedIndex = 0;
				document.getElementById("three_city_select").selectedIndex = 0;
			}
		},
		//二级城市列表
		two_city:[],
		//选中的二级城市
		two_city_result:'',	
		//二级城市的下标
		two_city_index:'',		
		//选择二级城市之后要修改三级城市
		two_city_change:function(){
			vm.two_city_index = this.selectedIndex-1;
			if(vm.two_city_index>=0){
				vm.two_city_result = vm.two_city[vm.two_city_index].name;
				vm.three_city = vm.two_city[vm.two_city_index].county;
				document.getElementById("three_city_select").selectedIndex = 0;
			}
		},
		//三级城市
		three_city:[],
		//选中的三级城市
		three_city_result:'',
		//三级城市的下标
		three_city_index:'',				
		three_city_change:function(){
			vm.three_city_index = this.selectedIndex-1;
			if(vm.three_city_index>=0){
				vm.three_city_result = vm.three_city[vm.three_city_index].name;
			}
		},
		//获取选择结果
		get_result:function(){
			return vm.one_city_result+vm.two_city_result+vm.three_city_result;
		},
		/**
		 * 获取省 
		 */
		get_area1:function(){
			return vm.one_city_result;
		},
		/**
		 * 设置省 
		 * @param {Object} area1
		 */
		set_area1:function(area1){
			vm.one_city_result = area1;
			if( !area1 ){
				document.getElementById("one_city_select").selectedIndex = 0;
				document.getElementById("two_city_select").selectedIndex = 0;
				document.getElementById("three_city_select").selectedIndex = 0;
				return ;
			}
			//循环确定一级的index vm.one_city[vm.one_city_index].name;
			for(var i = 0;i<vm.one_city.size();i++){
				if( vm.one_city[i].name == area1 ){
					vm.one_city_index = i;
//					document.getElementById("one_city_select").options[i+1].selected = true;
					document.getElementById("one_city_select").selectedIndex = i+1;
					vm.two_city = chinaArea.china.province[vm.one_city_index].city;
					return ;
				}
			}
		},
		/**
		 * 获取市 
		 */
		get_area2:function(){
			return vm.two_city_result;
		},
		/**
		 * 设置市 
		 * @param {Object} area2
		 */
		set_area2:function(area2){
			vm.two_city_result = area2;
			if( !area2 ){
				document.getElementById("two_city_select").selectedIndex = 0;
				return ;
			}			
			/**
			 * 	vm.two_city_result = vm.two_city[vm.two_city_index].name;
			 *	vm.three_city = vm.two_city[vm.two_city_index].county; 
			 */
			for(var i=0;i<vm.two_city.size();i++){
				if( vm.two_city[i].name == area2 ){
					vm.two_city_index = i;
//					document.getElementById("two_city_select").options[i+1].selected = true;
					document.getElementById("two_city_select").selectedIndex = i+1;
					vm.three_city = vm.two_city[vm.two_city_index].county; 
					return ;
				}
			}
		},	
		/**
		 * 获取区
		 */
		get_area3:function(){
			return vm.three_city_result;
		},
		/**
		 * 设置区
		 * @param {Object} area3
		 */
		set_area3:function(area3){
			vm.three_city_result = area3;
			if( !area3 ){
				document.getElementById("three_city_select").selectedIndex = 0;
				return ;
			}
			for(var i=0;i<vm.three_city.size();i++){
				if( vm.three_city[i].name == area3 ){
 					vm.three_city_index = i;
// 					document.getElementById("three_city_select").options[i+1].selected = true;
					document.getElementById("three_city_select").selectedIndex = i+1;
					return ;
				}
			}
		},	
	});
	chinaArea = JSON.parse(chinaArea);
	vm.one_city = chinaArea.china.province;
	avalon.citythreeselect_module_vm = vm;
	return avalon;
});