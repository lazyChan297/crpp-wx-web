
const app = getApp()
const service = app.globalData.service;
Page({
  data: {
    delivery:""
  },
  onLoad: function (options) {
    this.getOrderNum()
  },
  getOrderNum:function(){
    var that = this;
    service({
      url:'/rest/wx/apis/ord/get/orderCount'
    },res=>{
      that.setData({
        dsh: res[0].delivering_count,
        dqh: res[0].wait_get_count,
        dfk: res[0].wait_pay_count,
        dpj: res[0].wait_evaluation_count
      })
    })
  },
  onShow:function(){
    var that = this;
    this.setData({
      userInfo:app.globalData.userInfo
    })
    console.log(app.globalData.userInfo)
  },
  switchTab:function(e){
    var tab = Number(e.currentTarget.dataset.index)
    var status = ""
    switch (tab){
      case 1 :
        status = " ";
        break;
      case 2 :
        status = "wait_pay";
        break;
      case 3:
        status = "wait_get";
        break;
      case 4:
        status = "delivering";
        break;
      case 5:
        status = "finish"
        break;
    }
    app.globalData.getOrdList = {
      tab:tab,
      status: status
    }
    wx.switchTab({
      url: '../order/list'
    })
  },
  switchIndex:function(e){
    if(!app.globalData.isLogin){
      wx.navigateTo({
        url: '../bindPhone/bindPhone?isLogin=1'
      });
      return false;
    }
    if (!this.data.userInfo.mobile) {
      wx.navigateTo({
        url: '../bindPhone/bindPhone'
      });
      return false;
    }
    app.globalData.indexTab = e.currentTarget.dataset.index;
    wx.switchTab({
      url: '../../index/index'
    })
  },
  isDelivery:function(){
    service({
      url: '/rest/wx/apis/marki/get/info',
      method: 'GET'
    }, (res, code) => {
      if (code === 3) {
        wx.navigateTo({
          url: '../../delivery/login/login'
        })
      } else {
        app.globalData.marikInfo = res
        wx.navigateTo({
          url: '../../delivery/center/center'
        })
      }
    },err=>{
      wx.navigateTo({
        url: '../../delivery/login/login'
      })
    })
  }
})