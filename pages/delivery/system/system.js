const app = getApp()
Page({
  data: {
  },

  designData: function() {
    let that = this;
    let retObj = arguments[0];
    let bean = retObj.bean;
    app.globalData.voicePrompt = bean.yuyinStatus
    that.setData({
      voicePrompt: bean.yuyinStatus,
      newTask: bean.getOrdStatus,
      changeTask: bean.ordUpdateStatus,
      turnTask: bean.getDxOrdStatus,
      turnTaskRes: bean.dxOrdStatus
    });
  },

  //展示用户的配置
  show: function(){
    var that = this;
    var options = {};
    var userId = this.data.userId
    options.url = '/rest/wx/apis/userConfig/show';
    options.data = { userId: userId};
    getApp().globalData.service(options, that.designData);
  },

  //更新
  update: function(data){
    var that = this;
    var options = {};
    options.url = '/rest/wx/apis/userConfig/update';
    options.method = 'POST';
    options.data = data;
    getApp().globalData.service(options, that.show);
  },

  voiceSwitch: function (e) {
    let value = e.detail.value;
    var userId = this.data.userId
    this.setData({
      voicePrompt: value
    });
    var data = {
      userId: userId,
      yuyinStatus: value
    }
    this.update(data);
  },
  newTaskSwitch: function (e) {
    let value = e.detail.value;
    var userId = this.data.userId
    this.setData({
      newTask: value
    })
    var data = {
      userId: userId,
      getOrdStatus: value
    }
    this.update(data);
  },
  changeTaskSwitch: function (e) {
    let value = e.detail.value;
    var userId = this.data.userId
    this.setData({
      changeTask: value
    });
    var data = {
      userId: userId,
      ordUpdateStatus: value
    }
    this.update(data);
  },
  turnTaskSwitch: function (e) {
    let value = e.detail.value;
    var userId = this.data.userId
    this.setData({
      turnTask: value
    });
    var data = {
      userId: userId,
      getDxOrdStatus: value
    }
    this.update(data);
  },
  turnTaskResSwitch: function (e) {
    let value = e.detail.value;
    var userId = this.data.userId
    this.setData({
      turnTaskRes: value
    });
    var data = {
      userId: userId,
      dxOrdStatus: value
    }
    this.update(data);
  },

  onLoad: function (options) {
    this.setData({
      userId: app.globalData.marikInfo.id
    })
    this.show();
  }
})