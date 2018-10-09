const app = getApp()
const service = app.globalData.service
Page({
  data: {
  
  },
  onLoad: function (options) {
    var that = this;
    this.getScore({
      "ordId":options.id
    })
  },
  onShow:function(){
  },
  getScore:function(opt){
    var that = this;
    service({
      url:'/rest/wx/apis/evaluation/get',
      data:opt
    },res=>{
      var label = JSON.parse(res.label)
      that.setData({
        order: res,
        label: label
      })
    })
  }
})