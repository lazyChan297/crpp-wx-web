const app = getApp()
Page({
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
        wx.redirectTo({
          url: 'canvas?tempImagePath=' + res.tempImagePath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  onLoad: function (option) {
    option && option.tempImagePath && this.setData({
      src: option.tempImagePath
    })
    app.globalData.indexTab = option.currentIndex
  },
  data:{
    camera_width: wx.getSystemInfoSync().windowWidth,
    camera_height: wx.getSystemInfoSync().windowHeight,
  }
})