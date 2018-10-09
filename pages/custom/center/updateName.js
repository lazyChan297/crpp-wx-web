const app = getApp()
const service = app.globalData.service
Page({
  data: {
  
  },
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        username: app.globalData.userInfo.nickName
      })
    }
  },
  inputChange:function(e){
    
    if(e.detail.value&&e.detail.value!==''){
      this.setData({
        name:e.detail.value
      })
    } else {
      this.setData({
        name: null
      })
    }
  },
  save:function(){
    let name = this.data.name
    if(!name){
        wx.showToast({
          icon:"none",
          title: '请输入昵称'
        })
        return false;
    }
    service({
      url:'/rest/wx/apis/user/update',
      data:{
        nickName: name
      },
      method:'POST',
    },res =>{
      app.globalData.userInfo.nickName = name
      wx.switchTab({
        url: '../center/center'
      })
    })
  }
})