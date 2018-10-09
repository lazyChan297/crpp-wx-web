//app.js
const QQMapWX = require('libs/qqmap-wx-jssdk.js');
const util = require('/utils/util.js');
const service = util.service;
const wxLogin = util.wxLogin;
App({
  onLaunch: function () {
    var that = this;
    // 动画实例
    const animation = wx.createAnimation({
      duration: 10,
      timingFunction: 'ease'
    })
    that.globalData.animation = animation;
    // service
    that.globalData.service = service;
  },
  globalData: {
    QQmap: new QQMapWX({
      key: 'WAWBZ-VA63U-YCZVX-BS7XU-5V3W2-ZLBNU'
    }),
    pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,3,6,7,8])|(19[7]))\d{8}$/,
    latIng: {
      latitude: '',
      longitude: ''
    }
  },
  getUserInfo: function (callback,error) {
    var that = this;
    if (that.globalData.userInfo){
      typeof callback == "function" && callback(that.globalData.userInfo)
    } else {
      // 获取用户信息
      wx.getSetting({
      success: res => {
        // 没有授权
        if (!res.authSetting['scope.userInfo']) {
          typeof error == "function" && error();
        }
        // 已经授权
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              console.log("已授权,并获取到用户微信信息")
              wx.showLoading({
                title: '登陆中',
                mask: true
              })
              typeof callback == "function" && callback(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    }
  },
  payment(id,callback,cancel){
    service({
      url:'/rest/wx/apis/pay/sendPrepay',
      data:{
        ordId:id
      },
      method:'POST'
    }, res=>{
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.timeStamp,
          'nonceStr': res.nonceStr,
          'package': res.package,
          'signType': res.signType,
          'paySign': res.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功'
            })
            typeof callback == "function"&&callback()
          },
          'fail': function (res) {
            service({
              url: '/rest/wx/apis/pay/cancel',
              data: {
                ordId: id
              },
              method: 'POST'
            }, data => {
              wx.showToast({
                title: data,
                icon: 'none'
              })
              typeof cancel == "function" && cancel(res)
            })
          }
        })
      })
  },
  loadMap: function (callback) {
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function (res) {
        typeof callback == "function" && callback(res);
      },
      complete: function () {

      }
    });
  },
  switchworkStatus: function (status,callback){
    var that = this;
    service({
      url:'/rest/wx/apis/marki/update/status',
      data:{
        workStatus:status
      },
      method:'POST'
    },res=>{
      service({
        url:'/rest/wx/apis/marki/get/info',
        method:'get'
      },res=>{
        that.globalData.marikInfo = res;
        typeof callback == "function" && callback(res);
        if (res.work_status){
          wx.showToast({
            title: '开工中',
            icon:"none"
          })
        } else {
          wx.showToast({
            title: '休息中',
            icon: "none"
          })
        }
      })
      
    })
  },
  getLocation:function(cb){
    var that = this;
    // 获取地理位置
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        that.globalData.latIng = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        typeof cb == "function"&&cb(that.globalData.latIng)
      }
    });
  }
})