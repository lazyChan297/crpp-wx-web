const app = getApp()
const service = app.globalData.service
Page({
  data: {
    currentIndex:1,
    modal:false,
    isRefuse:false
  },
  onLoad: function (options) {
    this.getlist("can")
  },
  switchTab:function(e){
    let index = Number(e.currentTarget.dataset.index),
        status = "";
    switch(index){
      case 1:
        status="can";
        break;
      case 2:
        status="out";
        break;
      case 3:
        status="in";
        break;
    }
    this.setData({
      currentIndex:index,
      status:status
    })
    this.getlist(status)
  },
  getlist:function(status){
    var that = this;
    service({
      url:'/rest/wx/apis/ord/turnlist',
      data:{
        turnStatus: status
      },
      method:'POST'
    },res=>{
      for (var i = 0; i < res.result.length; i++) {
        if (res.result[i].remain_time < 0) {
          res.result[i].remain_time = Math.abs(res.result[i].remain_time)
          res.result[i].isLate = true;
        }
      }
      that.setData({
        list: res.result
      })
      
    })
  },
  turnOrd:function(e){
    var turnStatus = e.currentTarget.dataset.turnstatus;
    if (turnStatus === 'close'){
      wx.showToast({
        title: '订单已关闭',
        icon:'none'
      })
      return false;
    }
    if (turnStatus === 'finish'){
      wx.showToast({
        title: '订单已完成',
        icon: 'none'
      })
      return false;
    }
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'search?oid='+id
    })
  },
  openModal:function(e){
    var info = e.currentTarget.dataset.info;
    if (info.status_turn == 'close' || info.status_turn == 'finish'){
      return false;
    }
    this.setData({
      modal:true,
      ord:{
        ord_num: info.ord_num,
        "type": info.type,
        status_turn: info.status_turn,
        from_address: info.from_address,
        from_user_name: info.from_user_name,
        from_user_phone:info.from_user_phone,
        to_address: info.to_address,
        to_user_name: info.to_user_name,
        id:info.id,
        note:info.note
      }
    })
  },
  receive:function(e){
    var oid = this.data.ord.id,
        that = this;
    service({
      url: '/rest/wx/apis/ord/post_updateTurn',
      data: {
        turnType: 1,
        oid: oid
      },
      method: 'POST'
    }, res => {
      console.log(res)
      that.setData({
        modal: false,
        isRefuse: false
      })
      wx.showToast({
        title: '接收成功',
        icon:"none"
      })
      that.getlist("in")
    })
  },
  refuse:function(){
    this.setData({
      isRefuse:true
    })
  },
  closeModal:function(){
    this.setData({
      modal:false,
      isRefuse:false
    })
  },
  refuseOrd:function(e){
    var reason = e.currentTarget.dataset.reason,
        oid = this.data.ord.id,
        that = this;
    service({
      url:'/rest/wx/apis/ord/post_updateTurn',
      data:{
        turnType:0,
        ungets:reason,
        oid: oid
      },
      method:'POST'
    },res=>{
      that.setData({
        modal:false,
        isRefuse:false
      })
      wx.showToast({
        title: "接收成功",
        icon: "none",
        delay: 2000
      })
      that.getlist("in")
    },err=>{
      wx.showToast({
        title: err,
        icon:"none",
        delay:2000
      })
      that.setData({
        modal: false,
        isRefuse: false
      })
    })
  }
})