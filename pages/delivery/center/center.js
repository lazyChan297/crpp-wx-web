const app = getApp()
const service = app.globalData.service
const switchworkStatus = app.switchworkStatus
Page({
  data: {
    userId:''
  },
  onLoad: function (options) {
    this.setData({
      marikInfo: app.globalData.marikInfo,
      head_url: app.globalData.userInfo.headUrl
    })
    const getLocationTimer = setInterval(()=>{
      app.getLocation(function(res){
        service({
          url:'/rest/wx/apis/marki/update/postion',
          data:{
            latitude: res.latitude,
            longitude:res.longitude
          },
          method:'POST',
          hideLoading:true
        },res=>{
          app.globalData.latIng = {
            latitude: res.latitude,
            longitude:res.longitude
          }
        })
      })
    },60000)
    service({
      url:'/rest/wx/apis/userConfig/show',
      data:{
        userId: app.globalData.marikInfo.id
      },
      method:'GET'
    },res=>{
      app.globalData.voiceBean = res.bean
    })
  },
  onShow:function(){
    typeof timer !=="undefined" && clearInterval(timer);
    this.getPsInfo()
  },
  switchStatus:function(e){
    var status = e.currentTarget.dataset.status,
        that = this;
    switchworkStatus(status,res=>{
      app.globalData.marikInfo = res;
      that.setData({
        marikInfo:res
      })
    })
  },
  getPsInfo: function (cb) {
    var that = this;
    service({
      url: '/rest/wx/apis/marki/get/info',
      method: 'GET'
    }, res => {
      app.globalData.marikInfo = res
      this.setData({
        marikInfo: app.globalData.marikInfo
      })
      typeof cb == "function" && cb();
    })
  },
  inputAmount:function(){
    this.setData({
      modal:true
    })
  }
})