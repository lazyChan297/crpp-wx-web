const app = getApp()
const service = app.globalData.service
const payment = app.payment
Page({
  data: {
  
  },
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getOrder({
      "id":options.id
    })
  },
  onShow: function () {
  
  },
  getOrder:function(opt){
    var that = this;
    service({
      url:'/rest/wx/apis/ord/get',
      data:opt,
      method:'GET'
    },res=>{
      that.setData({
        order:res
      })
    },error=>{
      console.log(error)
    })
  },
  makePhoneCall: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  ordPay:function(){
    var id = this.data.id
    payment(id,()=>{
      app.globalData.getOrdList.status = ""
      app.globalData.getOrdList.tab = "1"
      wx.switchTab({
        url:'list'
      })
    })
  },
  reminderOrd:function(){
    var id = this.data.id;
    service({
      url: '/rest/wx/apis/ord/reminder',
      data: {
        id: id
      },
      method: 'GET',
      hideLoading: true
    }, res => {
      wx.showToast({
        title: res.message,
        duration: 3000,
        icon: "none",
        mask: true
      })
    }, err => {
      wx.showToast({
        title: err,
        icon: "none",
        duration: 3000,
        mask: true
      })
    })
  }
})