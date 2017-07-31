require(['jquery', 'avalon'], function($, avalon) {
  require([
    'toast',
    'layer',
    'bootstrap',
    'myajax',
    'tool',
    'css!checkbox_css',
    // 'jq_datepicker',
    // 'css!jq_datepicker_css'
  ], function(Toast, layer, bootstrap, MyAjax, TOOL) {
    //引入URL
    __inline('url.js');

    var FIELD_STATUS = {
          HAVE: 1,
          NO: 2
        },
        SORT_TYPE = {
          APPLY: 1,
          CREATE: 2
        },
        GROUP_TYPE = {
          AUDIENCE_CENTER: 1,
          APPLY: 2
        };

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
      //选中的列表数据
      selected_list: [],

      //是否选中全部
      is_selected_all: false,

      query_param: {
        "exhibit_id": "",
        "name": "",
        "corporation": "",
        "phone": "",
        // "apply": "",
        // "source": "",
        "area1": "",
        "area2": "",
        "area3": "",
        "email": "",
        // "start_time": "",
        // "end_time": "",
        "is_checked": "",
        // "is_testify": "",
        // "is_pda": "",
        "is_english": "",
        "post_code": "",
        "effective_phone": "",
        "effective_address": "",
        "effective_email": "",
        "effective_linkman": "",
        "label_id": "",
        "sort": ""
      },

      show_query_param:{
        "name": true,
        "corporation": true,
        "phone": true,
        // "apply": false,
        // "source": false,
        "area1": false,
        "area2": false,
        "area3": false,
        "email": false,
        //这里共同控制开始时间和结束时间
        // "date": false,
        "is_checked": false,
        // "is_testify": false,
        // "is_pda": false,
        "is_english": false,
        "post_code": false,
        "effective_phone": false,
        "effective_address": false,
        "effective_email": false,
        "effective_linkman": false,
        "label_id": false,
      },

      year: new Date().getFullYear(),
      //年列表
      year_list:[],

      //根据年份筛选展会列表
      ex_list:[],

      //所有展会数据（未去除同名展会）
      ex_data:[],

      //所有展会列表（已去同名展会）
      all_ex_list: [],

      //筛选条件集合
      field_list: [],
      //已在添加中选中的筛选条件
      selected_field_list: [],

      //群组列表
      group_list: [],

      is_load_group_list: false,

      is_load_add_audience_group: false,

      //是否根据选择的条件对列表项进行选择
      is_fill_select: false,

      //是否正在加载列表
      is_load_list: false,

      is_load_ex_list: false,

      is_load_field_list: false,

      // download_template: function(){
      //   location.href = URL.download_template.url;
      // },

      /**
       * 加载展会列表数据
       * @return {[type]} [description]
       */
      load_ex_list: function(){
        queryvm.is_load_ex_list = true;
        MyAjax(URL.query_exhibit, [], function(data) {
          queryvm.is_load_ex_list = false;
          Toast.r(data, false, function() {
            queryvm.ex_data = data.data;
            var year_arr = [];
            var all_ex_arr = [];
            for(var i=0;i<data.data.length;i++){
              if(!queryvm.check_year_is_have(year_arr,data.data[i].year)){
                year_arr.push(data.data[i].year);
              }
              if(!queryvm.check_ex_name_is_have(all_ex_arr,data.data[i].name)){
                all_ex_arr.push(data.data[i]);
              }
            }
            queryvm.year_list = year_arr;
            queryvm.all_ex_list = all_ex_arr;
            queryvm.change_year();
            // queryvm.query_param.exhibit_id = queryvm.ex_list[0].id;
            queryvm.module.page.cur_page = 1;
            queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);
          }, true);
        }, function() {
          queryvm.is_load_ex_list = false;
          Toast.net_error();
        });
      },

      /**
       * 查看年份是否已经存在
       * @param  {[type]} arr  [description]
       * @param  {[type]} year [description]
       * @return {[type]}      [description]
       */
      check_year_is_have: function(arr,year){
        for(var i=0;i<arr.length;i++){
          if(arr[i] === year){
            return true;
          }
        }
        return false;
      },

      /**
       * 查看展会名是否已经存在
       * @param  {[type]} arr  [description]
       * @param  {[type]} year [description]
       * @return {[type]}      [description]
       */
      check_ex_name_is_have: function(arr,name){
        for(var i=0;i<arr.length;i++){
          if(arr[i].name === name){
            return true;
          }
        }
        return false;
      },

      /**
       * 获取所有展会列表
       * @return {[type]} [description]
       */
      get_all_ex_list: function(){
        queryvm.ex_list = queryvm.all_ex_list.$model;
      },

      /**
       * 更改年份获取当前年份的展会列表
       * @return {[type]} [description]
       */
      change_year: function(){
        if(queryvm.year == -1){
          queryvm.get_all_ex_list();
        }else{
          var ex_arr = [];
          queryvm.ex_data.forEach(function(item){
            if(item.year == queryvm.year){
              ex_arr.push(item);
            }
          })
          queryvm.ex_list = ex_arr;
        }
        queryvm.query_param.exhibit_id = queryvm.ex_list[0].id;
        queryvm.change_exhibit();
        
      },

      /**
       * 根据选择的展会查询列表
       * @return {[type]} [description]
       */
      change_exhibit: function(){
        queryvm.module.page.cur_page = 1;
        queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);
        queryvm.load_group_list();
      },

      /**
       * 查询数据
       * @return {[type]} [description]
       */
      search_list:function(){
        var $this = $("#search_btn");
        $this.button("loading");
        queryvm.module.page.cur_page = 1;
        queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size,function(){
          $this.button("reset");
        });
      },

      //加载列表数据
      load_list: function(cur_page, page_size, end_callback) {
        queryvm.is_load_list = true;
        var param_array = TOOL.create_array();
        for(var pro in queryvm.query_param){
          if(queryvm.query_param.hasOwnProperty(pro)){
            param_array.append(pro, queryvm.query_param[pro]);
          }
        }
        var field_arr = [];
        for(var i=0;i<queryvm.selected_field_list.size();i++){
          if(queryvm.selected_field_list[i].is_selected){
            var obj = {
              id: queryvm.selected_field_list[i].id,
              is_have: queryvm.selected_field_list[i].is_have
            }
            field_arr.push(obj);
          }
        }
        param_array.append('field_list', JSON.stringify(field_arr));
        param_array.append('cur_page', cur_page);
        param_array.append('page_size', page_size);
        MyAjax(URL.query, param_array.get_data(), function(data) {
          queryvm.is_load_list = false;
          Toast.r(data, false, function() {
            var array = data.data.list;
            for(var i = 0; i < array.length; i++) {
              array[i].is_selected = false;
            }
            queryvm.reset_selected_status(array);
            queryvm.list = array;
            queryvm.module.page.count = data.data.count;
            end_callback ? end_callback() : null;
            require(['page'], function() {
              avalon.page_module_vm.init(queryvm, queryvm.load_list);
            });
            //重置全选选项
          }, true);
        }, function() {
          queryvm.is_load_list = false;
          Toast.net_error();
        });
      },

      //标签列表
      label_list: [],

      is_load_label_list: false,

      /**
       * 加载标签列表
       * @param  {Function} callback [description]
       * @return {[type]}            [description]
       */
      load_label_list: function() {
        queryvm.is_load_label_list = true;
        var param_array = [];
        MyAjax(URL.query_label_list, param_array, function(data) {
          queryvm.is_load_label_list = false;
          Toast.r(data, false, function() {
            queryvm.label_list = data.data;
          }, true);
        }, function() {
          queryvm.is_load_label_list = false;
          Toast.net_error();
        });
      },

      /**
       * 加载展会分组
       * @return {[type]} [description]
       */
      load_group_list: function(){
        queryvm.is_load_group_list = true;
        var param_array = TOOL.create_array();
        param_array.append('exhibit_id', queryvm.query_param.exhibit_id);
        MyAjax(URL.query_group, param_array.get_data(), function(data) {
          queryvm.is_load_group_list = false;
          Toast.r(data, false, function() {
            queryvm.group_list = data.data;
          }, true);
        }, function() {
          queryvm.is_load_group_list = false;
          Toast.net_error();
        });
      },

      /**
       * 保存选中的观众至群组
       * @return {[type]} [description]
       */
      save_selected_to_group: function(index){
        if(queryvm.check_selected_num() == 0){
          Toast.show('提醒信息','请至少选择一位观众',Toast.type.WARNING);
          return;
        }
        var ids = [];
        for(var i=0;i<queryvm.selected_list.size();i++){
          ids.push(queryvm.selected_list[i].id);
        }
        queryvm.is_load_add_audience_group = true;
        var param_array = TOOL.create_array();
        param_array.append('group_id', queryvm.group_list[index].id);
        param_array.append('exhibit_id', queryvm.query_param.exhibit_id);
        param_array.append('ids', JSON.stringify(ids));
        MyAjax(URL.add_audience_group, param_array.get_data(), function(data) {
          queryvm.is_load_add_audience_group = false;
          Toast.r(data, true, function() {
            queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);
            queryvm.selected_list = [];
          }, true);
        }, function() {
          queryvm.is_load_add_audience_group = false;
          Toast.net_error();
        });
      },

      /**
       * 需要移除选中的对象
       * @param {Object} obj
       */
      remove_selected_item: function(obj) {
        for(var i = queryvm.selected_list.length - 1; i >= 0; i--) {
          if(queryvm.selected_list[i].id == obj.id) {
            queryvm.selected_list.splice(i, 1);
            return;
          }
        }
      },
      /**
       * 需要添加的id，这里需要做排重操作 
       * @param {Object} obj
       */
      push_selected_item: function(obj) {
        var is_have_same = false;
        for(var i = queryvm.selected_list.length - 1; i >= 0; i--) {
          if(queryvm.selected_list[i].id == obj.id) {
            is_have_same = true;
            break;
          }
        }
        if(is_have_same == false) {
          queryvm.selected_list.push(obj);
        }
        //有重复的不处理
      },
      /**
       * 根据selected_list里面的数据进行数据还原选中状态 
       * @param {Object} array
       */
      reset_selected_status: function(array) {
        var is_selected_all = true;
        if(array.length == 0) {
          is_selected_all = false;
        } else {
          // console.log(array);
          for(var i = 0; i < array.length; i++) {
            var is_selected = false;
            for(var j = 0; j < queryvm.selected_list.length; j++) {
              if(queryvm.selected_list[j].id == array[i].id) {
                is_selected = true;
                break;
              }
            }
            array[i].is_selected = is_selected;
            if(is_selected == false) {
              is_selected_all = false;
            }
          }
        }
        queryvm.is_selected_all = is_selected_all;
      },

      /**
       * 选中或取消一项 
       * @param {Object} index
       */
      checked_change: function(index) {
        var now_is_selected = queryvm.list[index].is_selected;
        if(now_is_selected == true) {
          queryvm.push_selected_item(queryvm.list[index]);
        } else {
          queryvm.remove_selected_item(queryvm.list[index]);
        }
        queryvm.reset_selected_status(queryvm.list.$model);
      },

      /**
       * 全选 
       */
      selected_all: function() {
        for(var i = 0; i < queryvm.list.length; i++) {
          queryvm.list[i].is_selected = queryvm.is_selected_all;
          if(queryvm.is_selected_all == true) {
            queryvm.push_selected_item(queryvm.list[i]);
          } else {
            queryvm.remove_selected_item(queryvm.list[i]);
          }
        }
      },

      /**
       * 加载筛选数据列表
       * @return {[type]} [description]
       */
      load_field_list: function() {
        queryvm.is_load_field_list = true;
        MyAjax(URL.query_field_list, [], function(data) {
          queryvm.is_load_field_list = false;
          Toast.r(data, false, function() {
            queryvm.field_list = data.data;
          }, true);
        }, function() {
          queryvm.is_load_field_list = false;
          Toast.net_error();
        });
      },

      select_field_item: function(index){
        queryvm.selected_field_list[index].is_selected = queryvm.selected_field_list[index].is_selected ? false : true;
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
        require(['com/demo/select/select'], function() {
          layer.close(load_flag);
          //初始化
          avalon.vmodels.select_vm.$init(URL, queryvm.field_list.$model,
             queryvm.selected_field_list.$model, queryvm.show_query_param.$model);
          avalon.vmodels.select_vm.$r(function(list, show_query_param) {
            $("#select_modal").modal('hide');
            for(var i=0;i<list.length;i++){
              //此处重置选择状态，这里选择的与之前选择的状态无关
              list[i].is_selected = false;
            }
            queryvm.selected_field_list = list;
            queryvm.show_query_param = show_query_param;
            queryvm.clear_query_param();
          });
          $("#select_modal").modal('show');
        });
      },

      /**
       * 清除查询参数上的数据
       * @return {[type]} [description]
       */
      clear_query_param: function(){
        for(var pro in queryvm.query_param){
          if(queryvm.query_param.hasOwnProperty(pro)){
            if( pro != 'exhibit_id' ){
              queryvm.query_param[pro] = '';
            }
          }
        }
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
        require(['com/demo/add_group/add_group'], function() {
          layer.close(load_flag);
          //初始化
          avalon.vmodels.add_group_vm.$init(URL, queryvm.query_param.exhibit_id);
          avalon.vmodels.add_group_vm.$r(function() {
            $("#add_group_modal").modal('hide');
            queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);
            queryvm.load_group_list();
          });
          $("#add_group_modal").modal('show');
        });
      },

      /**
       * 展示已选观众模态框
       * @return {[type]} [description]
       */
      show_checked_list_modal: function(){
        if(queryvm.check_selected_num() == 0){
          Toast.show('提醒信息','请至少选择一位观众',Toast.type.WARNING);
          return;
        }
        //每一次的远程加载都要添加动画交互来提醒用户，也就是处处有交互
        var load_flag = layer.load(0, {
          shade: false
        });
        require(['com/demo/checked_list/checked_list'], function() {
          layer.close(load_flag);
          //初始化
          avalon.vmodels.checked_list_vm.$init(URL, queryvm.selected_list.$model);
          avalon.vmodels.checked_list_vm.$r(function() {
            $("#checked_list_modal").modal('hide');
            queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);
          });
          $("#checked_list_modal").modal('show');
        });
      },

      /**
       * 展示删除确定框
       */
      show_delete_confirm: function(index) {
        if(queryvm.check_selected_num() == 0){
          Toast.show('提醒信息','请至少选择一位观众',Toast.type.WARNING);
          return;
        }
        var load_flag = layer.load(0, {
          shade: false
        });
        require(['swal', 'css!swal_css'], function() {
          layer.close(load_flag);
          swal({
              title: "您确定要删除已选的观众吗？",
              text: "删除后可在回收站还原",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "是的，我要删除！",
              cancelButtonText: "让我再考虑一下…",
              closeOnConfirm: false,
              closeOnCancel: false
            },
            function(isConfirm) {
              if(isConfirm) {
                queryvm.delete();
              } else {
                swal("已取消", "您取消了删除操作！", "error");
              }
            });
        });
      },
      /**
       * 执行删除
       */
      delete: function() {
        var param_array = TOOL.create_array();
        var ids = [];
        for(var i=0;i<queryvm.selected_list.size();i++){
          ids.push(queryvm.selected_list[i].id);
        }
        param_array.append('ids', JSON.stringify(ids));
        MyAjax(URL.delete_ids, param_array.get_data(), function(data) {
          Toast.r(data, false, function() {
            Toast.r(data, false, function() {
              swal("删除成功！", data.message, "success");
              queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);
              queryvm.selected_list = [];
            }, false, function() {
              swal("删除失败！", data.message, "error");
            });
          }, true);
        }, function() {
          Toast.net_error();
        });
      },

      /**
       * 检查已选数量
       * @return {[type]} [description]
       */
      check_selected_num: function(){
        var count = 0;
        for(var i=0;i<queryvm.list.size();i++){
          if(queryvm.list[i].is_selected == true){
            count++;
          }
        }
        return count;
      },

      /**
       * 展示添加标签模态框
       * @return {[type]} [description]
       */
      show_add_label_modal: function(){
        if(queryvm.check_selected_num() == 0){
          Toast.show('提醒信息','请至少选择一位观众',Toast.type.WARNING);
          return;
        }
        var ids = [];
        for(var i=0;i<queryvm.selected_list.size();i++){
          ids.push(queryvm.selected_list[i].id);
        }
        //每一次的远程加载都要添加动画交互来提醒用户，也就是处处有交互
        var load_flag = layer.load(0, {
          shade: false
        });
        require(['com/demo/add_label/add_label'], function() {
          layer.close(load_flag);
          //初始化
          avalon.vmodels.add_label_vm.$init(URL, ids);
          avalon.vmodels.add_label_vm.$r(function() {
            $("#add_label_modal").modal('hide');
            queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);
          });
          $("#add_label_modal").modal('show');
        });
      },

      /**
       * 展示导入模态框
       * @return {[type]} [description]
       */
      show_import_modal: function(){
        //每一次的远程加载都要添加动画交互来提醒用户，也就是处处有交互
        var load_flag = layer.load(0, {
          shade: false
        });
        require(['com/demo/import/import'], function() {
          layer.close(load_flag);
          //初始化
          avalon.vmodels.import_vm.$init(URL);
          avalon.vmodels.import_vm.$r(function() {
            $("#import_modal").modal('hide');
            queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);
          });
          $("#import_modal").modal('show');
        });
      },

      /**
       * 展示导入模态框
       * @return {[type]} [description]
       */
      show_qrcode_modal: function(index){
        //每一次的远程加载都要添加动画交互来提醒用户，也就是处处有交互
        var load_flag = layer.load(0, {
          shade: false
        });
        require(['com/demo/qrcode/qrcode'], function() {
          var obj = queryvm.list[index];
          layer.close(load_flag);
          //初始化
          avalon.vmodels.qrcode_vm.$init(URL, obj);
          $("#qrcode_modal").modal('show');
        });
      },

       /**
       * 展示群发邮件模态框
       * @return {[type]} [description]
       */
      show_email_modal: function(){
        if(queryvm.check_selected_num() == 0){
          Toast.show('提醒信息','请至少选择一位观众',Toast.type.WARNING);
          return;
        }
        var ids = [];
        for(var i=0;i<queryvm.selected_list.size();i++){
          ids.push(queryvm.selected_list[i].id);
        }
        //每一次的远程加载都要添加动画交互来提醒用户，也就是处处有交互
        var load_flag = layer.load(0, {
          shade: false
        });
        require(['com/demo/email/email'], function() {
          layer.close(load_flag);
          //初始化
          avalon.vmodels.email_vm.$init(URL, ids, queryvm.query_param.exhibit_id);
          avalon.vmodels.email_vm.$r(function() {
            $("#email_modal").modal('hide');
            queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);
          });
          $("#email_modal").modal('show');
        });
      },

       /**
       * 展示群发邮件模态框
       * @return {[type]} [description]
       */
      show_sms_modal: function(){
        if(queryvm.check_selected_num() == 0){
          Toast.show('提醒信息','请至少选择一位观众',Toast.type.WARNING);
          return;
        }
        var ids = [];
        for(var i=0;i<queryvm.selected_list.size();i++){
          ids.push(queryvm.selected_list[i].id);
        }
        //每一次的远程加载都要添加动画交互来提醒用户，也就是处处有交互
        var load_flag = layer.load(0, {
          shade: false
        });
        require(['com/demo/sms/sms'], function() {
          layer.close(load_flag);
          //初始化
          avalon.vmodels.sms_vm.$init(URL, ids, queryvm.query_param.exhibit_id);
          avalon.vmodels.sms_vm.$r(function() {
            $("#sms_modal").modal('hide');
            queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);
          });
          $("#sms_modal").modal('show');
        });
      },

       //是否显示列表页面
      page_show_active:false,
      //是否显示页面二
      page_two_show_active: false,

      show_audience_modal: function(index){
        var load_flag = layer.load(0, {
          shade: false
        });
        require(['com/demo/audience/audience'], function() {
          layer.close(load_flag);
          var obj = queryvm.list[index];
          //初始化
          avalon.vmodels.audience_vm.$init(URL, obj, queryvm.query_param.exhibit_id);
          avalon.vmodels.audience_vm.$r(function() {
            queryvm.page_two_show_active = false;
            queryvm.page_show_active = false;
            // queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);
          });
          avalon.vmodels.audience_vm.$back(function(){
            queryvm.page_two_show_active = false;
            queryvm.page_show_active = false;
            // queryvm.load_list(queryvm.module.page.cur_page, queryvm.module.page.page_size);       
          });
          queryvm.page_two_show_active = true;
          queryvm.page_show_active = true;
        });
      },

      /**
       * 导出全部
       * @return {[type]} [description]
       */
      export_all: function(){
        location.href = URL.export_all_data.url + "?exhibit_id=" + queryvm.query_param.exhibit_id;
      }

    });
    //引入debug.js
    __inline('debug.js');
    //引入测试器
    __inline('lib/inline/js/debug_function.js');
    DEBUG_FUNCTION(DEBUG, function() {
        queryvm.load_ex_list();
        queryvm.load_field_list();
        queryvm.load_label_list();
        avalon.scan();
        // $.datetimepicker.setLocale('zh');
        // $('#start_time').datetimepicker({
        //   format: 'Y-m-d H:i',
        //   mask: '2099-19-39 29:59',
        //   startDate: '+1971-05-01'
        // });
        // $('#end_time').datetimepicker({
        //   format: 'Y-m-d H:i',
        //   mask: '2099-19-39 29:59',
        //   startDate: '+1971-05-01'
        // });
        
    }, 1000);
  });
});
