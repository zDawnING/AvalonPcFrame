define([], function() {
	var TOOL = {};
	/**
	 * 将base64转为blod对象
	 * @param {Object} data
	 */
	TOOL.get_file = function(data) {
			//dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
			data = data.split(',')[1];
			data = window.atob(data);
			var ia = new Uint8Array(data.length);
			for(var i = 0; i < data.length; i++) {
				ia[i] = data.charCodeAt(i);
			};
			// canvas.toDataURL 返回的默认格式就是 image/png
			var blob = new Blob([ia], {
				type: "image/png"
			});
			return blob;
		}
		/**
		 * 获取地址中的参数
		 */
	TOOL.getUrlParam = function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) {
				return unescape(r[2]);
			} else {
				return '';
			}
		}
		/**
		 * 对中文进行编码
		 */
	TOOL.encodeURIChina = function(param) {
			return encodeURI(encodeURI(param))
		}
		/**
		 * 对中文进行解码
		 * @param {Object} param
		 */
	TOOL.decodeURIChina = function(param) {
			return decodeURI(param);
		}
		/**
		 * 通过一个类似于2015-07-09 12:12:12的字符串转换成Date类，目标是用于兼容 
		 * @param {Object} value
		 */
	TOOL.build_date = function(value) {
			var array = value.split(' '),
				year = '',
				month = '',
				date = '',
				hours = '',
				minutes = '',
				seconds = '';
			if(array.length == 2) {
				var date_str = array[0],
					time = array[1];
				var date_arr = date_str.split("-"); //可以被-切成3份，并且第1个是4个字符 这里先判断日期
				if(date_arr.length === 3 && date_arr[0].length === 4) {
					year = ~~date_arr[0]; //全部转换为非负整数
					month = ~~date_arr[1];
					date = ~~date_arr[2];
					//追加判断时间
					var time_arr = time.split(':');
					if(time_arr.length === 3) {
						hours = ~~time_arr[0];
						minutes = ~~time_arr[1];
						seconds = ~~time_arr[2];
					}
				}
			}
			return new Date(year, month, date, hours, minutes, seconds);
		}
		/**
		 * 获取现在的日期，主要是用于比较 
		 */
	TOOL.get_now_date = function(format) {
			var now = new Date();
			var o = {
				"M+": now.getMonth() + 1, //month
				"d+": now.getDate(), //day
				"h+": now.getHours(), //hour
				"m+": now.getMinutes(), //minute
				"s+": now.getSeconds(), //second
				"q+": Math.floor((now.getMonth() + 3) / 3), //quarter
				"S": now.getMilliseconds() //millisecond
			}
			if(/(y+)/.test(format))
				format = format.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
			for(var k in o)
				if(new RegExp("(" + k + ")").test(format))
					format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return format;
			// now = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
			// return now;
		}
		/**
		 * 对两个日期进行比较，日期格式为字符串2016-03-01
		 * @param  {string}  start  '2016-08-03'开始时间
		 * @param  {string}  end  '2016-08-05'结束时间
		 * @return {boolean}  结束时间大于开始时间时返回true
		 */
	TOOL.compare_date = function(start, end) {
			var arr1 = start.split("-");
			var starttime = new Date(arr1[0], arr1[1], arr1[2]);
			var starttimes = starttime.getTime();

			var arr2 = end.split("-");
			var endtime = new Date(arr2[0], arr2[1], arr2[2]);
			var endtimes = endtime.getTime();

			if(starttimes >= endtimes) {
				return false;
			}
			return true;
		}
		/**
		 * 将数组进行分组和分等级，要求数组里面的结构如下：
		 * {
		 * 	 superid:'',  //父级id，如果没有父级id，就默认为0
		 *   id:'',		  //自身id
		 * }
		 * 处理之后
		 * {
		 * 	lvl:'', //所在等级
		 *  super_index:'',//父级的所在索引
		 *  next_index_array:[],//下级节点集合
		 *  index:'',//本身索引
		 *  is_show:'',//标记帅选之后的结果
		 * }
		 * @param {Object} array
		 * @param {Object} superid 默认的superid标准是0，如果传入该参数，将以该superid为标准
		 */
	TOOL.handle_lvl_array = function(array, superid) {
			//superid默认是0
			if(!superid) {
				superid = 0;
			}
			for(var i = 0; i < array.length; i++) {
				//对sort字段进行处理，如果没有sort字段，就让id作为排序因子
				if(!array[i].sort) {
					array[i].sort = array[i].id;
				}
			}
			for(var i = 0; i < array.length; i++) {
				//进行pid和superid的兼容处理
				if(array[i].superid) {
					break;
				}
				array[i].superid = array[i].pid;
			}
			/**
			 * 处理数组里面的lvl 
			 * @param {Object} array
			 */
			var rebuild_array_lvl = function(array) {
				var no_lvl = -1;
				//初始化数据
				for(var i = 0; i < array.length; i++) {
					array[i].lvl = no_lvl;
					//随便记录下标
					array[i].index = i;
					//super_index为-1的话就代表是没有上级
					array[i].super_index = -1;
					//这里保存的是下级节点的下标集合
					array[i].next_index_array = [];
					//标记是否要进行显示
					array[i].is_show = false;
				}
				//有序区
				var sort_array = [],
					//无序区
					no_sort_array = [];
				//首先处理顶级，分到有序区里面，其他都分为无序区
				for(var i = 0; i < array.length; i++) {
					if(array[i].superid == superid) {
						sort_array.push(array[i].index);
						array[i].lvl = 1;
						array[i].is_show = true;
					} else {
						no_sort_array.push(array[i].index);
					}
				}
				//默认是-1，都还没有处理
				var position = -1;
				//从有序区里面不断地找到子节点，让无序区的长度不断减少，有序区会不断变长，为了避免重复判断，用变量来标记已处理的位置
				while(no_sort_array.length > 0) {
					position++;
					//判断越界
					if(position > sort_array.length - 1) {
						break;
					}
					//获取有序的节点
					var item = array[sort_array[position]];
					//通过循环一次性处理和该节点相关的下级节点
					var length = no_sort_array.length;
					for(var i = length - 1; i >= 0; i--) {
						//找到了，就加入到有序区，并从无序区里面删除
						if(array[no_sort_array[i]].superid == item.id) {
							sort_array.push(no_sort_array[i]);
							array[no_sort_array[i]].lvl = item.lvl + 1;
							array[no_sort_array[i]].is_show = true;
							//同时记录对应的上级下标，构建成树
							array[no_sort_array[i]].super_index = item.index;
							item.next_index_array.push(array[no_sort_array[i]].index);
							no_sort_array.splice(i, 1);
						}
					}
				}
				return array;
			};
			/**
			 * 根据排序因子sort来获取对应的号码
			 * 改进方案：
			 * 以前一个字母只有62种位置，但是如果是两个字母排列就有62*62种位置，普通前端不会出现超过3k的数据，所以可通用
			 * 这里要确保排序因子的数字不能超过62*62
			 * 实现思路，把62个字母看成62进制
			 * @param {Object} sort
			 */
			var get_code = function(sort) {
					//1<A<a  3843刚好没有越界
					var code_str = "0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z",
						code_array = code_str.split(' '),
						code_length = code_array.length;
					//需要判断是否越界了
					var is_over = sort / code_length / code_length > 1,
						//第一位的对应数字
						first_index = '',
						//第二位的对应数字
						last_index = '';
					//如果是越界了
					if(is_over) {
						console.log("越界了");
					} else {
						//普通情况
						//~~是取值为非负整数
						//取个位数
						last_index = sort % code_length;
						//取十位数
						first_index = ~~(~~(sort - last_index) / code_length);
					}
					//两位合并成一个新数字
					return code_array[first_index] + code_array[last_index];
				}
				/**
				 * 根据顶级进行分组然后排序 
				 * @param {Object} array
				 */
			var rebuild_group_sort = function(array) {
				for(var i = 0; i < array.length; i++) {
					array[i].sort_code = 'A';
				}
				var fun = function(item, index) {
					//顶级节点
					if(item.superid == superid) {
						//a>A>1
						//						item.sort_code = item.sort_code + get_code(index);
						item.sort_code = item.sort_code + get_code(item.sort);
					} else {
						//						item.sort_code = array[item.super_index].sort_code + get_code(index);
						item.sort_code = array[item.super_index].sort_code + get_code(item.sort);
					}
					for(var i = 0; i < item.next_index_array.length; i++) {
						fun(array[item.next_index_array[i]], i);
					}
				}
				for(var i = 0; i < array.length; i++) {
					if(array[i].superid == superid) {
						fun(array[i], i);
					}
				}
				//排序
				var sortFun = function(a, b) {
					return a.sort_code > b.sort_code ? 1 : -1;
				}
				array.sort(sortFun);
				return array;
			};
			return rebuild_array_lvl(rebuild_group_sort(rebuild_array_lvl(array)));
		}
		/**
		 * 同步index节点的子节点的值 
		 * @param {Object} array 目标数组
		 * @param {Object} field 希望同步的值的属性名
		 * @param {Object} index 目标数组的索引，指向需要同步的节点
		 */
	TOOL.synchro_lvl_array = function(array, field, index) {
			var value = array[index][field];
			var fun = function(target_index) {
				var next_index_array = array[target_index].next_index_array;
				for(var i = 0; i < next_index_array.length; i++) {
					array[next_index_array[i]][field] = value;
					fun(next_index_array[i]);
				}
			}
			fun(index);
		}
		/**
		 * 将颜色变为16进制
		 * @param {color}
		 */
	TOOL.colorHex = function(color) {
			//给个位数的数字补零
			var str_fun = function(number) {
				var number_str = number + '';
				if(number_str.length == 1) {
					return '0' + number;
				} else {
					return number;
				}
			}
			var that = color;
			var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
			if(/^(rgb|RGB)/.test(that)) {
				var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
				var strHex = "#";
				for(var i = 0; i < aColor.length; i++) {
					var hex = Number(aColor[i]).toString(16);
					if(hex === "0") {
						hex += hex;
					}
					hex = str_fun(hex);
					strHex += hex;
				}
				return strHex;
			} else if(reg.test(that)) {
				var aNum = that.replace(/#/, "").split("");
				if(aNum.length === 6) {
					return that;
				} else if(aNum.length === 3) {
					var numHex = "#";
					for(var i = 0; i < aNum.length; i += 1) {
						numHex += (aNum[i] + aNum[i]);
					}
					return numHex;
				}
			} else {
				return that;
			}
		}
		/**
		 *将颜色变成rgb形式 
		 * @param {Object} color
		 */
	TOOL.colorRgb = function(color) {
		var sColor = color.toLowerCase();
		var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
		if(sColor && reg.test(sColor)) {
			if(sColor.length === 4) {
				var sColorNew = "#";
				for(var i = 1; i < 4; i += 1) {
					sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
				}
				sColor = sColorNew;
			}
			var sColorChange = [];
			for(var i = 1; i < 7; i += 2) {
				sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
			}
			return "RGB(" + sColorChange.join(",") + ")";
		} else {
			return sColor;
		}
	};
	/**
	 * 累觉不爱，懒的写注释了。
	 * @param  {object} obj         
	 * @param  {object} replacement 
	 * @return {object}             
	 */
	TOOL.replace_value = function(obj, replacement) {
		for(n in replacement) {
			obj[replacement[n][0]] = replacement[n][1][obj[n]];
		}
		return obj;
	};
	/**
	 * 把json对象转化为json字符串，解决MVVM中对数据进行循环引用的问题
	 * @param  {object} obj 需要转化的json对象
	 * @return {string}     转化后的字符串
	 */
	TOOL.jsonStringify = function(obj) {
		var temp = [];
		var json = JSON.stringify(obj, function(key, val) {
			if(typeof val == "object") {
				if(/^\$/.test(key)) return
				if(temp.indexOf(val) >= 0) return;
				temp.push(val)
			}
			return val;
		});
		return json;
	};
	/**
	 * 下面是对param_array进行封装和简化 
	 */
	TOOL.create_array = function() {
		var fun = function() {
			this.data = [];
			/**
			 * 加入数据 
			 */
			this.append = function(key, value) {
					this.data.push({
						key: key,
						value: value
					});
				}
				/**
				 * 获取数据
				 */
			this.get_data = function() {
				return this.data;
			}
		};
		return new fun();
	};
	/**
	 * 将oldArray和newArray合并，然后返回一个新数组
	 * @param  {[type]} oldArray [description]
	 * @param  {[type]} newArray [description]
	 * @return {[type]}          [description]
	 */
	TOOL.mergeArray = function(oldArray, newArray) {
		var resultArray = [];
		for(var i = 0; i < oldArray.length; i++) {
			resultArray.push(oldArray[i]);
		}
		for(var i = 0; i < newArray.length; i++) {
			resultArray.push(newArray[i]);
		}
		return resultArray;
	};
	/**
	 * 移动数组
	 * @param  {[Array]} arr      [源数组]
	 * @param  {[Integer]} oldIndex [旧位置索引]
	 * @param  {[Integer]} newIndex [新位置索引]
	 * @return {[Array]}          [原数组]
	 */
	TOOL.moveArray = function(arr, oldIndex, newIndex){
		arr[oldIndex] = arr.splice(newIndex, 1, arr[oldIndex])[0];
		return arr;
	};
	/**
	 * 将一个时间类转换成yyyy-MM-dd hh:mm:ss格式 
	 * @param {Object} date
	 */
	TOOL.formatDateTime = function(date) {
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var h = date.getHours();
		var minute = date.getMinutes();
		var s = date.getSeconds();
		m = m < 10 ? ('0' + m) : m;
		d = d < 10 ? ('0' + d) : d;
		h = h < 10 ? ('0' + h) : h;
		minute = minute < 10 ? ('0' + minute) : minute;
		s = s < 10 ? ('0' + s) : s;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s;
	};
	/**
	 * 下面这个方法是针对赛程列表的处理的，这里后期可能需要做分组功能
	 * @param {Object} list
	 */
	TOOL.sch_list_handle = function(array) {
		var date_fun = {
				get_date: function(time) {
					if(!time) {
						return;
					}
					return time.split(' ')[0];
				},
				get_hour: function(time) {
					if(!time) {
						return;
					}
					var str = time.split(' ')[1],
						str_array = str.split(':');
					return str_array[0] + ":" + str_array[1];
				},
			}
			//处理时间
		for(var i = 0; i < array.length; i++) {
			array[i].date = date_fun.get_date(array[i].time);
			array[i].hour = date_fun.get_hour(array[i].time);
		}
		return array;
	};
	/**
	 * 对赛程过多的列表进行分页优化处理
	 * @param {Object} list
	 * @param {Object} cur_page
	 * @param {Object} page_size
	 */
	TOOL.sch_list_page = function(list, cur_page, page_size) {
		var begin_index = (cur_page - 1) * page_size,
			end_index = cur_page * page_size - 1,
			result = [],
			max_index = (list.length - 1);
		//判断越界，取边界和最后index最小的那个就行了
		end_index = max_index > end_index ? end_index : max_index;
		for(var i = begin_index; i <= end_index; i++) {
			result.push(list[i]);
		}
		return result;
	};
	//由TOOL来托管timeout对象
	TOOL.scroll_load_timerout = '';
	/**
	 * 滚动加载封装 
	 * @param {Object} judge_fun 判断是否结束执行滚动加载，需要返回一个true false来代表是否继续执行，true为继续
	 * @param {Object} query_fun 对应执行的查询方法
	 * @param {Object} delay		setTimeout对应的延时时间
	 * @param {Object} height	距离底部多少高度执行方法
	 */
	TOOL.scroll_load = function(judge_fun, query_fun, delay, height) {
		if(!delay) {
			delay = 100;
		}
		if(!height) {
			height = 0;
		}

		function scrollTop() {
			return Math.max(
				//chrome
				document.body.scrollTop,
				//firefox/IE
				document.documentElement.scrollTop);
		}
		//获取页面文档的总高度
		function documentHeight() {
			//现代浏览器（IE9+和其他浏览器）和IE8的document.body.scrollHeight和document.documentElement.scrollHeight都可以
			return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
		}

		function windowHeight() {
			return(document.compatMode == "CSS1Compat") ?
				document.documentElement.clientHeight :
				document.body.clientHeight;
		}
		window.onscroll = function() {
			if(TOOL.scroll_load_timerout) {
				clearTimeout(TOOL.scroll_load_timerout);
			}
			TOOL.scroll_load_timerout = setTimeout(function() {
				//根据判断函数来决定是否不再加载
				if(judge_fun() == false) {
					return;
				}
				/*滚动响应区域高度取50px*/
				if(scrollTop() + windowHeight() >= (documentHeight() - height)) {
					//执行查询函数
					query_fun();
				}
			}, delay);
		}
	};
	TOOL.$btn_list = {};
	/**
	 * 初始化按钮 
	 * @param {Object} key 为了区分多个按钮的key
	 * @param {Object} $this 按钮对象
	 */
	TOOL.init_button = function(key, $this) {
			var data_loading_text = $this.getAttribute('data-loading-text'),
				o_text = $this.innerHTML;
			var obj = {
				data_loading_text: data_loading_text,
				o_text: o_text,
				$this: $this,
			};
			TOOL.$btn_list[key + '_key'] = obj;
		}
		/**
		 * 设置为正在加载状态 
		 * @param {Object} key
		 */
	TOOL.load_button = function(key) {
			var obj = TOOL.$btn_list[key + '_key'];
			obj.$this.setAttribute('disabled', 'disabled');
			obj.$this.innerHTML = obj.data_loading_text;
		}
		/**
		 * 还原按钮状态
		 * @param {Object} key
		 */
	TOOL.reset_button = function(key) {
		var obj = TOOL.$btn_list[key + '_key'];
		obj.$this.removeAttribute('disabled');
		obj.$this.innerHTML = obj.o_text;
	}

	/**
	 * 获取三级地址的公共方法 
	 * @param {Object} cityData3 三级城市数据
	 * @param {Object} countyId	需要展示的城市id
	 */
	TOOL.get_address = function(cityData3, countyId) {
		var province_name = '',
			city_name = '',
			district_name = '';
		for(var a = 0; a < cityData3.length; a++) {
			var flag1 = false;
			for(var b = 0; b < cityData3[a].children.length; b++) {
				var flag2 = false;
				if(cityData3[a].children[b].children instanceof Array) {
					for(var c = 0; c < cityData3[a].children[b].children.length; c++) {
						if(countyId == cityData3[a].children[b].children[c].value) {
							district_name = cityData3[a].children[b].children[c].text;
							flag2 = true;
							break;
						}
					}
				}
				if(flag2) {
					city_name = cityData3[a].children[b].text;
					flag1 = true;
					break;
				}
			}
			if(flag1) {
				province_name = cityData3[a].text;
				break;
			}
		}
		return province_name + ' ' + city_name + ' ' + district_name;
	};
	/**
	 * 根据二级地区获取 countyId
	 * @param {Object} cityData3
	 * @param {Object} district
	 */
	TOOL.get_countyid_by_text_two = function(cityData3, city) {
		var countyId = '';
		for(var a = 0; a < cityData3.length; a++) {
			for(var b = 0; b < cityData3[a].children.length; b++) {
				for(var c = 0; c < cityData3[a].children.length; c++) {
					if(city == cityData3[a].children[c].text) {
						countyId = cityData3[a].children[c].value;
						break;
					}
				}
			}
		}
		return countyId;
	};
	/**
	 * 根据三级地区获取 countyId
	 * @param {Object} cityData3
	 * @param {Object} district
	 */
	TOOL.get_countyid_by_text_three = function(cityData3, district) {
		var countyId = '';
		for(var a = 0; a < cityData3.length; a++) {
			for(var b = 0; b < cityData3[a].children.length; b++) {
				if(cityData3[a].children[b].children instanceof Array) {
					for(var c = 0; c < cityData3[a].children[b].children.length; c++) {
						if(district == cityData3[a].children[b].children[c].text) {
							countyId = cityData3[a].children[b].children[c].value;
							break;
						}
					}
				}
			}
		}
		return countyId;
	};
	/**
	 * 设置title 
	 * @param {Object} title
	 */
	TOOL.set_title = function(title) {
		document.title = title;
		//以下代码可以解决以上问题，不依赖jq
//		setTimeout(function() {
//			//利用iframe的onload事件刷新页面
//			document.title = title;
//			var iframe = document.createElement('iframe');
//			iframe.style.visibility = 'hidden';
//			iframe.style.width = '1px';
//			iframe.style.height = '1px';
//			iframe.onload = function() {
//				setTimeout(function() {
//					document.body.removeChild(iframe);
//				}, 0);
//			};
//			document.body.appendChild(iframe);
//		}, 0);
	};
	
	TOOL.is_weixin_brower = function() {
			var sUserAgent = navigator.userAgent.toLowerCase();
			var bIsWeixin = sUserAgent.match(/MicroMessenger/i);
			return bIsWeixin;
		};
	return TOOL;
});