var domain = 'http://127.0.0.1:8008';
//var domain = 'http://192.168.3.118/JASP/test';

// 配置按需编译：设置编译范围为 html 文件，不过 html 文件中使用到的资源也会参与编译。
fis.set('project.files', ['*.html', '*.shtml']);
// npm install [-g] fis3-hook-module
fis.hook('amd', {
	paths: {
		'c': 'component_modules',
		'common': 'components/common',
		'hcommon': 'components/modules/h+common',
		'com': 'components',
		'text': 'lib/text.js',
		'css': 'lib/css.js',
		'domReady': 'lib/domReady',
		'jquery': 'component_modules/jquery2.1.4/jquery.min',
		'jquery1.8.3': 'component_modules/jquery1.8.3/jquery-1.8.3.min',
		'avalon': "component_modules/avalon/avalon.modern.shim",
		'avalon_mb': "component_modules/avalon/avalon.mobile.shim",
		'avalon_pc': "component_modules/avalon/avalon.shim",
		'bootstrap': 'component_modules/bootstrap3.3.5/bootstrap.min',
		'bootstrap3.0.3': 'component_modules/bootstrap3.0.3/js/bootstrap.min',
		'toastr': 'component_modules/toastr/toastr',
		'toastr_ie8': 'component_modules/toastr/toastr_ie8',
		'mock': 'component_modules/mock/mock',
		'swal': 'component_modules/sweetalert/sweetalert.min',
		'swal_css': 'component_modules/sweetalert/sweetalert.css',
		'layer': 'component_modules/layer/layer.min',
		'metisMenu': 'component_modules/metisMenu/jquery.metisMenu',
		'slimscroll': 'component_modules/slimscroll/jquery.slimscroll.min',
		'pace': 'component_modules/pace/pace.min',
		'layer': 'component_modules/layer/layer.min',
		'toast': 'components/modules/toast/toast',
		'toast_ie8': 'components/modules/toast/toast_ie8',
		'validate': 'components/modules/validate_mvvm/validate_mvvm',
		'domain': 'components/common/js/domain',
		'mock_url_change': 'components/modules/mock_url_change/mock_url_change',
		'checkbox_css': 'components/modules/checkbox/checkbox.css',
		'page': 'components/modules/page/page',
		//IE8兼容版
		'page_ie8': 'components/modules/page_ie8_inline/page',
		'datepicker': 'component_modules/datepicker/bootstrap-datepicker',
		'datepicker_css': 'component_modules/datepicker/datepicker3.css',
		'bootstrap_datetimepicker': 'component_modules/bootstrap-datetimepicker/bootstrap-datetimepicker',
		'bootstrap_datetimepicker_css': 'component_modules/bootstrap-datetimepicker/bootstrap-datetimepicker.css',
		'flot': 'component_modules/flot/jquery.flot',
		'flot_tooltip': 'component_modules/flot/jquery.flot.tooltip.min',
		'flot_resize': 'component_modules/flot/jquery.flot.resize',
		'jquery-mousewheel': 'component_modules/jquery-mousewheel/jquery.mousewheel',
		'date-functions': 'component_modules/jquery-datetimepicker/date-functions',
		'jq_datepicker': 'component_modules/jquery-datetimepicker/jquery.datetimepicker.full',
		'jq_datepicker_css': 'component_modules/jquery-datetimepicker/jquery.datetimepicker.css',
		'countup': 'component_modules/countUp/countUp',
		'modal': 'components/modules/modal/modal',
		'zeroclipboard': 'component_modules/zeroclipboard/ZeroClipboard',
		'iscroll': 'component_modules/iscroll/iscroll',
		//公共小工具
		'tool': 'components/common/js/tool',
		//下拉选择（百度的效果）
		'chosen': 'component_modules/chosen/chosen.jquery.js',
		'chosen_css': 'component_modules/chosen/chosen.css',

		'my_chosen': 'components/modules/my_chosen/v1/my_chosen',
		'my_chosen_v2': 'components/modules/my_chosen/v2/my_chosen',
		'myformdata': 'components/modules/myformdata/myformdata',

		'echarts': 'component_modules/echarts3/echarts',
		'echarts3.6': 'component_modules/echarts3.6/echarts3.6.min',
		'cookie': 'component_modules/jquery.cookie/jquery.cookie',
		'qrcode': 'component_modules/jquery-qrcode/jquery.qrcode.min',

		//手机toast
		'phone_toast': 'components/modules/phone_toast/phone_toast',
		//手机toastv2
		'phone_toast_v2': 'components/modules/phone_toast/phone_toast_v2',
		
		//城市三级联动
		'city_three_select': 'components/modules/city_three_select/city_three_select',
		'city_three_select_pc': 'components/modules/city_three_select_pc/city_three_select_pc',
		'city_three_select_ie8': 'components/modules/city_three_select/city_three_select_ie8',
		'city_three_select_vue': 'components/modules/city_three_select_vue/city_three_select_vue',

		'jquery_pseudo':'component_modules/jquery.pseudo/jquery.pseudo',
		'jquery_qrcode':'component_modules/jquery.qrcode/jquery.qrcode.min',
		'is_close':'components/common/js/is_close',
		'is_close_ie8':'components/common/js/is_close_ie8',
		
		//monoevent
		'monoevent':'component_modules/monoevent/monoevent',
		
		//微信api
		'jweixin': 'component_modules/weixin_jssdk/jweixin',
		//封装的ajax函数
		'myajax': 'components/modules/myajax/myajax',
		'myajax_ie8': 'components/modules/myajax/myajax_ie8',
		//mui
		'mui': 'component_modules/mui/js/mui',
		//引入vue
		'vue': 'component_modules/vue/vue',
		//touch事件
		'hammerjs': 'component_modules/hammer/hammer',
		//touch事件
		'vue-touch-amd': 'component_modules/vue-touch-amd/vue-touch-amd',
		//vue的ajax插件
		'vue-resource': 'component_modules/vue-ajax/vue-resource',
		//类似于jquery的ajax插件
		'ajax': 'component_modules/ajax/ajax',
		//移动端专用的ajax函数
		'mbajax': 'components/modules/mbajax/mbajax',
		//fetch promise API的ajax请求
		'fetch': 'component_modules/fetch/fetch',
		//用mui的ajax
		'mui_ajax': 'components/modules/mui_ajax/mui_ajax',
		//用mui的toast
		'mui_toast': 'components/modules/mui_toast/mui_toast',
		//城市数据
		'citydata': 'components/common/js/citydata',
		//城市数据//新//
		'citydata_n': 'components/common/js/city_data_n',
		//swiper插件
		'swiper': 'component_modules/swiper/swiper-3.3.1.jquery.min',
		'swiper_css': 'component_modules/swiper/swiper.min.css',
		//七牛云上传插件
		'moxie': 'component_modules/plupload/js/moxie',
		'plupload': 'component_modules/plupload/js/plupload.dev',
		'qiniu': 'component_modules/qiniu/dist/qiniu',
		//上传插件ui和js
		'highlight_css': 'component_modules/qiniu/css/highlight.css',
		'main_css': 'component_modules/qiniu/css/main.css',
		'qiniu_ui': 'component_modules/qiniu/js/ui',
		//简易移动端时间插件
		'mb_calendar':'component_modules/calendar/calendar.min.js',
		'mb_calendar_css':'component_modules/calendar/calendar.min.css',
		'lcalendar':'component_modules/lcalendar/LCalendar.js',
		'lcalendar_css': 'component_modules/lcalendar/LCalendar.css',
		'mobiscroll_animation_css':'component_modules/mobiscroll/css/mobiscroll.animation.css',
    'mobiscroll_frame_css':'component_modules/mobiscroll/css/mobiscroll.frame.css',
    'mobiscroll_icons_css':'component_modules/mobiscroll/css/mobiscroll.icons.css',
    'mobiscroll_image_css':'component_modules/mobiscroll/css/mobiscroll.image.css',
    'mobiscroll_scroller_css':'component_modules/mobiscroll/css/mobiscroll.scroller.css',
    'mobiscroll_core':'component_modules/mobiscroll/js/mobiscroll.core',
    'mobiscroll_datetime':'component_modules/mobiscroll/js/mobiscroll.datetime',
    'mobiscroll_datetimebase':'component_modules/mobiscroll/js/mobiscroll.datetimebase',
    'mobiscroll_frame':'component_modules/mobiscroll/js/mobiscroll.frame',
    'mobiscroll_image':'component_modules/mobiscroll/js/mobiscroll.image',
    'mobiscroll_listbase':'component_modules/mobiscroll/js/mobiscroll.listbase',
    'mobiscroll_scroller':'component_modules/mobiscroll/js/mobiscroll.scroller',
    'mobiscroll_select':'component_modules/mobiscroll/js/mobiscroll.select',
    'mobiscroll_treelist':'component_modules/mobiscroll/js/mobiscroll.treelist',
    'mobiscroll_util-datetime':'component_modules/mobiscroll/js/mobiscroll.util.datetime',
    'mobiscroll_zh':'component_modules/mobiscroll/i18n/mobiscroll.i18n.zh',
    //可拖动插件
		'sortable': 'component_modules/sortable/Sortable.js',    
	},
	//声明依赖，H+有一堆的插件，最好就是全部的依赖都写进去 这个都不知道有没有用的....
	shim: {},
});
// 设置组件库里面的 js 都是模块化 js.
fis.match('/components/**.js', {
	isMod: true
});
fis.match('/component_modules/**.js', {
	isMod: true
});
//规范发布目录
fis.match('/components/**', {
	release: '/static/$0'
}).match('/component_modules/**', {
	release: '/static/$0'
}).match('/lib/**', {
	release: '/static/$0'
}).match('/404/**', {
	release: '/static/$0'
});
/**
 * 这样子设置会有一个问题，left_navbar.html里面的href会有问题，所有的href链接最好改为从根目录写起的,
 * 如components/，而不是有相对路径的../../../components
 */
//设置所有文件的域名，如果只是发布到fis3只带的服务器的话就不用设置了
fis.match('*', {
	domain: domain,
});
// 因为是纯前段项目，依赖不能自断被加载进来，所以这里需要借助一个 loader 来完成，
// 注意：与后端结合的项目不需要此插件!!!
fis.match('::package', {
	// npm install [-g] fis3-postpackager-loader
	// 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
	postpackager: fis.plugin('loader', {
		resourceType: 'amd',
		useInlineMap: true, // 资源映射表内嵌
		//allInOne:true
	})
});

// fis3 release prod 产品发布，进行合并
fis.media('prod').match('*.{js,css,png}', {
	useHash: true
}).match('*.js', {
	optimizer: fis.plugin('uglify-js')
}).match('echarts3.6.min.js', {
	optimizer: null
}).match('*.css', {
	useSprite: true,
	optimizer: fis.plugin('clean-css')
}).match('*.png', {
	optimizer: fis.plugin('png-compressor')
});