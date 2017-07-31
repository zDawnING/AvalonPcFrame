require(['jquery', 'avalon'], function($, avalon) {
  require([
    'toast',
    'layer',
    'bootstrap',
    'myajax',
    'tool',
  ], function(Toast, layer, bootstrap, MyAjax, TOOL) {
    //引入URL
    __inline('url.js');

    var rootvm = avalon.define({
      $id: 'root',
      //只要avalon解析完，也就代码页面可以展示了
      is_ready: true,
    });

    //表格查询的vm
    var queryvm = avalon.define({
      $id: 'query',

      //page组件需要的数据结构
      module: {
        page: {
          cur_page: 0,
          page_size: 10,
          count: 0,
          page_sizes: [10, 20, 50, 100, 200, 500, 1000, 2000]
        }
      },
      //列表数据
      list: [],

      query_param: {
        name: '',
        corporation: '',
        phone: '',
        email: '',
        source: '',
        code: '',
      },

      //是否正在加载列表
      is_load_list: false,

      //加载列表数据
      load_list: function(cur_page, page_size, end_callback) {
        queryvm.is_load_list = true;
        var param_array = TOOL.create_array();
        param_array.append('cur_page', cur_page);
        param_array.append('page_size', page_size);
        MyAjax(URL.query, param_array.get_data(), function(data) {
          queryvm.is_load_list = false;
          Toast.r(data, false, function() {
            var array = data.data.list;
            queryvm.list = array;
            queryvm.module.page.count = data.data.count;
            end_callback ? end_callback() : null;
            require(['page'], function() {
              avalon.page_module_vm.init(queryvm, queryvm.load_list);
            });
          }, true);
        }, function() {
          queryvm.is_load_list = false;
          Toast.net_error();
        });
      },

      /**
       * 该弹窗暂时不采用
       * @return {[type]} [description]
       */
      show_select_modal: function(){
        //每一次的远程加载都要添加动画交互来提醒用户，也就是处处有交互
        var load_flag = layer.load(0, {
          shade: false
        });
        require(['com/adminman/audience_list/select/select'], function() {
          layer.close(load_flag);
          //初始化
          avalon.vmodels.select_vm.$init(URL);
          avalon.vmodels.select_vm.$r(function() {
            $("#select_modal").modal('hide');
            queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);
          });
          $("#select_modal").modal('show');
        });
      },

      /**
       * 展示添加群组模态框
       * @return {[type]} [description]
       */
      show_add_group_modal: function(){
        //每一次的远程加载都要添加动画交互来提醒用户，也就是处处有交互
        var load_flag = layer.load(0, {
          shade: false
        });
        require(['com/adminman/audience_list/add_group/add_group'], function() {
          layer.close(load_flag);
          //初始化
          avalon.vmodels.add_group_vm.$init(URL);
          avalon.vmodels.add_group_vm.$r(function() {
            $("#add_group_modal").modal('hide');
            queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);
          });
          $("#add_group_modal").modal('show');
        });
      }

    });
    //引入debug.js
    __inline('debug.js');
    //引入测试器
    __inline('lib/inline/js/debug_function.js');
    DEBUG_FUNCTION(DEBUG, function() {
        
        avalon.scan();
    }, 1000);
  });
});
