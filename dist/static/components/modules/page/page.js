define('components/modules/page/page', ['component_modules/avalon/avalon.modern.shim', 'lib/text!http://127.0.0.1:8008/static/components/modules/page/page.html', 'lib/css!http://127.0.0.1:8008/static/components/modules/page/page.css'], function(avalon, template) {
	/**
	 * requirejs加载的js只执行一次，所以该vm变量是所有分页组件共有的，所以我们要动态切换vm的指向 
	 */
	var vm = {},
		STATIC_VM_NAME = "page_module_vm",
		vm_array = [],  //保存所有的引用，防止引用冲突问题
		get_vm = function(){
			
		};

	//定义为组件
	avalon.component("ms:page", {
		$template: template,
		/**
		 * @param component_vm 我们可以定义变量来接收这个vm
		 */
		$init: function(component_vm, elem) {
			vm = component_vm;
			avalon.scan(elem, component_vm);
			//设置引用名
			vm.vm_name = vm.vm_id ? (vm.vm_name + '_' + vm.vm_id) : vm.vm_name;
			avalon[vm.vm_name] = vm;
		},
		$ready: function() {
		},
		
		/**
		 * 根据vm_id来动态指向vm
		 * @param vm_id 使用者给vm标识的ID
		 */
		to_vm:function(vm_id){
			//重新构成vm的名称
			var vm_name = vm_id ? (STATIC_VM_NAME + '_' + vm_id) : STATIC_VM_NAME;
			vm = avalon[vm_name];
		},
		
		/**
		 * 下面每个vm行为都要调用的方法 
		 * @param {Object} $this 指向dom节点
		 */
		filter:function($this){
			var vm_id = $this.getAttribute('data-id');
			//动态指向
			vm.to_vm(vm_id);
		},
		
		//------------------------VM自己的行为-------------------------begin
		//分页器	
		page: {
			//当前页 已知
			cur_page: -1,
			//一页多少条 已知
			page_size: -1,
			//共有多少条 已知
			count: -1,
			//共有多少页
			total_page: -1,
			//构建一个从1到n的数组用于循环
			pages: [],
			//是否打开选择一页多少条
			is_open: false,
			//一页有多少条的数组,默认数值如下，可以通过create_page方法进行配置
			page_sizes: [10, 20, 50, 100, 200],
			//用户输入的跳转页
			user_input_cur_page: ''
		},
		/**
		 * 构建分页器
		 * @param {Object} page_size 一页多少条
		 * @param {Object} count 总有多少条
		 * @param {Array}  page_sizes 一页有多少条的配置数组，用于覆盖默认配置
		 */
		create_page: function(page_size, count, page_sizes) {
			var page = {
				cur_page: vm.page.cur_page,
				page_size: page_size,
				count: count,
				total_page: 0,
				pages: [],
			}
			if (page.count > 0) {
				page.total_page = Math.ceil(page.count / page.page_size);
			} else {
				page.total_page = 0;
			}
			vm.page.cur_page = page.cur_page;
			vm.page.page_size = page.page_size;
			vm.page.count = page.count;
			vm.page.total_page = page.total_page;
			vm.page.pages = page.pages;
			page_sizes ? vm.page.page_sizes = page_sizes : null;
			vm.change_cur_page_pages();
		},
		//第一页
		home_page: function() {
			vm.filter(this);
			if (vm.page.cur_page == 1) {
				return;
			}
			vm.page.cur_page = 1;
		},
		//最后一页
		end_page: function() {
			vm.filter(this);
			if (vm.page.cur_page == vm.page.total_page || vm.page.total_page == 0) {
				return;
			}
			vm.page.cur_page = vm.page.total_page;
		},
		//上一页
		last_page: function() {
			vm.filter(this);
			if (vm.page.cur_page == 1) {
				return;
			}
			vm.page.cur_page--;
			//判断越界
			if (vm.page.cur_page < 1) {
				vm.page.cur_page = 1;
			}
		},
		//下一页
		next_page: function() {
			vm.filter(this);
			if (vm.page.cur_page == vm.page.total_page || vm.page.total_page == 0) {
				return;
			}
			vm.page.cur_page++;
			//判断越界
			if (vm.page.cur_page > vm.page.total_page) {
				vm.page.cur_page = vm.page.total_page;
			}
		},
		/**
		 * 跳转到第几页 
		 * @param {Object} cur_page
		 * @param {Object} $other_this 修正this的指向
		 */
		go_page: function(cur_page,$other_this) {
			if($other_this){
				vm.filter($other_this);
			}else{
				vm.filter(this);	
			}
			//不是整型数字直接忽略
			if (/\d/.test(cur_page) == false) {
				return;
			}
			if (vm.page.cur_page == cur_page) {
				return;
			}
			//判断越界
			if (cur_page < 1) {
				cur_page = 1;
			}
			if (cur_page > vm.page.total_page) {
				cur_page = vm.page.total_page;
			}
			vm.page.cur_page = cur_page;
		},
		/**
		 * 当前页页数跳转 
		 */
		go_to_page: function($other_this) {
			if (vm.page.user_input_cur_page) {
				vm.go_page(new Number(vm.page.user_input_cur_page),$other_this);
			}
		},
		/**
		 * enter键提交 
		 * @param {Object} event
		 */
		go_to_enter_page: function(event) {
			if (event.keyCode == 13) {
				vm.go_to_page(this);
			}
		},
		/**
		 * 修改page_size的值 
		 * @param {Object} index修改page_sizes的下标
		 */
		change_page_size: function(index) {
			vm.filter(this);
			vm.page.page_size = vm.page.page_sizes[index];
		},
		/**
		 * http://esimakin.github.io/twbs-pagination/ 
		 * 实现效果：pages的数组元素个数最多只有7个，cur_page尽量处于pages的第四个值
		 * 情况：
		 * 1、cur_page<=4，那么pages就1-7
		 * 2、total_page-cur_page<=3，那么(total_page-7) - total_page
		 * 3、pages的7个值以cur_page为中心重新构建
		 */
		change_cur_page_pages: function() {
			var cur_page = vm.page.cur_page,
				total_page = vm.page.total_page,
				begin = 0,
				end = 0,
				pages = [];
			if (cur_page <= 4) {
				begin = 1;
				end = 7;
				//修正
				if (end > total_page) {
					end = total_page;
				}
			} else if (total_page - cur_page <= 3) {
				begin = total_page - 7;
				//修正
				if (begin < 1) {
					begin = 1;
				}
				end = total_page;
			} else {
				begin = cur_page - 3;
				end = cur_page + 3;
			}
			for (var i = begin; i <= end; i++) {
				pages.push(i);
			}
			vm.page.pages = pages;
		},
		//打开select
		open: function() {
			vm.filter(this);
			vm.page.is_open = !vm.page.is_open;
		},
		//------------------------VM自己的行为-------------------------end
		
		//标记是否已经初始化过了
		is_inited: false,
		/**
		 * 初始化，整合外部提供的数据源 
		 * @param {Object} caller_vm 调用者的vm
		 * @param {Object} load 查询方法，外部定义如：load:function(cur_page,page_size){} 
		 * 注意：不要在load方法里面对cur_page进行处理，会引起死循环
		 */
		init: function(caller_vm, load) {
			//控制只执行一次
			if (vm.is_inited == false) {
				vm.is_inited = true;
			} else {
				return;
			}
			//获取引用
			vm.caller_vm_static = caller_vm;
			//获取查询方法引用
			vm.query_fun = load;
			
			/**
			 * 监听当前页的变化，同步pages的变化 
			 * cur_page的变化一开始是来与于外部的，后面主要是来自于page组件的事件响应，这里很容易死循环
			 * 如果它的变化是来自于外部，那它就不能调用查询方法，会引起死循环
			 * 如果它的变化是来自于内部，那就需要调用查询方法
			 */
			vm.$watch("page.cur_page", function(newValue, oldValue) {
				if (vm.is_watch_first.cur_page == true) {
					vm.is_watch_first.cur_page = false;
					return;
				}
				//判断越界 如果越界了进行赋值的话就会page组件就会以为这个变化是内部的，就会触发查询，这里我们应该让它觉得是外部变化
				if (newValue <= 0) {
					vm.page.cur_page = 1;
				} else if (newValue > vm.page.total_page) {
					vm.page.cur_page = vm.page.total_page;
				} else {
					vm.change_cur_page_pages();
					//同步变化
					vm.caller_vm_static.module.page.cur_page = vm.page.cur_page;
					//来自外部变化，不调用查询方法
					if (vm.flag.cur_page == true) {
						vm.flag.cur_page = false;
					} else {
						//调用查询方法
						vm.query_fun(vm.page.cur_page, vm.page.page_size);
					}
				}
			});
			/**
			 * 监听page_size的变化，同步其他值的变化
			 * page_size的变化是来与于page组件的事件响应，所以它的变化要调用查询方法
			 * 如果page_size的变化是来自于外部的话，就不要调用查询方法
			 */
			vm.$watch("page.page_size", function() {
				if (vm.is_watch_first.page_size == true) {
					vm.is_watch_first.page_size = false;
					return;
				}
				//这里同步page_size的变化，要注意死循环
				vm.caller_vm_static.module.page.page_size = vm.page.page_size;
				vm.create_page(vm.page.page_size, vm.page.count);
				vm.page.is_open = false;
				if (vm.flag.page_size == true) {
					vm.flag.page_size = false;
				} else {
					//调用查询方法
					vm.query_fun(vm.page.cur_page, vm.page.page_size);
				}
			});
			/**
			 * 监听count的变化，同步其他值的变化
			 * count的变化是来自于外部的数据提供，所以它的变化不能调用查询方法，否则就会死循环
			 */
			vm.$watch('page.count', function() {
				if (vm.is_watch_first.count == true) {
					vm.is_watch_first.count = false;
					return;
				}
				vm.create_page(vm.page.page_size, vm.page.count);
			});
			//将外部的数据变化映射到page组件的数据里面
			caller_vm.$watch('module.page.cur_page', function(newValue, oldValue) {
				//防止死循环
				if (vm.page.cur_page != newValue) {
					//标记是来自于外部变化
					vm.flag.cur_page = true;
					vm.page.cur_page = new Number(newValue);
				}
			});
			caller_vm.$watch('module.page.count', function(newValue, oldValue) {
				//防止死循环
				if (vm.page.count != newValue) {
					vm.page.count = new Number(newValue);
				}
			});
			caller_vm.$watch('module.page.page_size', function(newValue, oldValue) {
				//防止死循环
				if (vm.page.page_size != newValue) {
					//标记是来自于外部变化
					vm.flag.page_size = true;
					vm.page.page_size = new Number(newValue);
				}
			});	
			
			//数据赋值 注意，要进行监听之后再执行数据赋值
			vm.page.cur_page = caller_vm.module.page.cur_page;
			vm.page.count = caller_vm.module.page.count;
			vm.create_page(caller_vm.module.page.page_size, caller_vm.module.page.count, caller_vm.module.page.page_sizes);
		
		},
		//一些特殊处理
		flag: {
			//true代表数据变化来自于外部 false代表数据变化来自于内部
			cur_page: false,
			page_size: false,
		},
		//记录是否是第一次监听，第一次监听是因为初始化的原因，所以要忽略
		is_watch_first : { 
			cur_page: true,
			page_size: true,
			count: true
		},		
		//外部提供的查询方法
		query_fun : avalon.noop,
		//调用者vm的引用
		caller_vm_static : {},
		//对外导出的引用名
		vm_name : STATIC_VM_NAME, 
		//用于多例
		vm_id: '',
	});
	return avalon;
});