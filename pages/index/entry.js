//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
const service = util.service
const wxLogin = util.wxLogin 
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
  },
  getUserInfo: function (e) {
    wx.showLoading({
      title: '登陆中',
      mask:true
    })
    app.getUserInfo(function(data){
      console.log("data",data)
      wxLogin(function (res) {
        var userInfo = res.userInfo
        // 用户信息不存在 更新到数据库
        if (!userInfo.nickName || !userInfo.headUrl) {
          console.log(data)
          service({
            url: '/rest/wx/apis/user/update',
            data: {
              nickName: userInfo.nickName || data.nickName,
              headUrl: userInfo.headUrl || data.avatarUrl,
              mobile: userInfo.mobile
            },
            method: 'POST'
          }, res => {
            app.globalData.userInfo = userInfo;
          })
        } else if (userInfo.nickName&&userInfo.headUrl) {
          app.globalData.userInfo = userInfo;
        }
        wx.hideLoading()
      })      
    });
    wx.switchTab({
      url: 'index',
      success:function(){
        app.loadMap(res=>{
          
        })
      }  
    })
  }
})
