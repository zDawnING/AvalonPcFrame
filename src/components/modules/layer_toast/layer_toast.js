define([
	'components/modules/layer_toast/layer',
	'css!components/modules/layer_toast/layer.css'
], function(layer) {

	var OK = 100
	var OK_TITLE = '操作成功'
	var ERROR_TITLE = '操作失败'

	var Toast = function(){
		/**
		 * 信息展示
		 * @param  {[type]} message [description]
		 * @return {[type]}         [description]
		 */
		this.show = function (message) {
		  layer.open({
		    content: message,
		    skin: 'msg',
		    time: 2 // 2秒后自动关闭
		  })
		}
		/**
		 * [response description]
		 * @param  {[type]}  data            [description]
		 * @param  {Boolean} isShowOk        [description]
		 * @param  {[type]}  successCallback [description]
		 * @param  {Boolean} isShowError     [description]
		 * @param  {[type]}  errorCallback   [description]
		 * @return {[type]}                  [description]
		 */
		this.response = function (data, isShowOk, successCallback, isShowError, errorCallback) {
		  if (!data) {
		    errorCallback ? errorCallback() : null
		  }
		  var status = data.status
		  var message = data.message
		  if (status === OK || status === (OK + '')) {
		    if (isShowOk) {
		      if (!message) {
		        message = OK_TITLE
		      }
		      this.show(message)
		    }
		    successCallback ? successCallback() : null
		    return
		  } else {
		    if (isShowError) {
		      if (!message) {
		        message = ERROR_TITLE
		      }
		      this.show(message)
		    }
		    errorCallback ? errorCallback() : null
		  }
		}
		/**
		 * 获取layer对象
		 * @return {[type]} [description]
		 */
		this.getLayer = function () {
		  return layer
		}
		/**
		 * 提示网络错误
		 * @return {[type]} [description]
		 */
		this.netError = function () {
		  this.show('网络错误')
		}
		/**
		 * 展示一个加载的信息
		 * @param  {[type]} content 展示的提醒信息，如果没有传入就没有提醒信息
		 * @return {[type]}         [description]
		 */
		this.load = function (content) {
		  if (content) {
		    return layer.open({type: 2, shadeClose: false, content: content})
		  } else {
		    return layer.open({type: 2, shadeClose: false})
		  }
		}
		/**
		 * 清除所有layer层
		 * @return {[type]} [description]
		 */
		this.closeAll = function () {
		  return layer.closeAll()
		}
		/**
		 * 用于关闭特定层，index为该特定层的索引
		 * @param  {[type]} index [description]
		 * @return {[type]}       [description]
		 */
		this.close = function (index) {
		  return layer.close(index)
		}
		/**
		 * 调用layer的open
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		this.open = function (options) {
		  return layer.open(options)
		}
	}

	return new Toast();
});