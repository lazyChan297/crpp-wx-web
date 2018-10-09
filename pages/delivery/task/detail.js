const app = getApp()
const service = app.globalData.service
const switchworkStatus = app.switchworkStatus
const patternCode = /\d/;
Page({
  data: {
    isChecked:true
  },
  onLoad: function (options) {
    console.log(options)
    this.getTask(options.id)
    this.setData({
      isComplete:false,
      taskId:options.id,
      amountDF: options.amountDF || Number(" ")
    })
  },
  checkChange: function (e) {
    var isChecked = false,
      status = e.detail.value.length,
      that = this;
    status == 1 ? '0' : 1;
    switchworkStatus(status, res => {
      app.globalData.marikInfo = res;
      that.setData({
        isChecked: app.globalData.marikInfo.work_status == 1 ? true : false
      })
    })
  },
  getTask:function(id){
    var that = this;
    service({
      url:'/rest/wx/apis/ord/markiget',
      data:{
        id:id
      },
      method:'POST'
    },res=>{
      that.setData({
        taskInfo:res
      })
    })
  },
  getGoods:function(){
    var id = this.data.taskId,
        that = this,
        amountDF = this.data.amountDF || 0,
        valid = this.examAmount();
    
    if (this.data.taskInfo.order.type === 'buy'){
      if(!valid){
        this.setData({
          modal:true
        })
        return false;
      }
    }
    service({
      url: '/rest/wx/apis/ord/post_finishget',
      data: {
        oid: id,
        amountReal: amountDF
      },
      method: 'POST'
    }, res => {
      that.getPsInfo(()=>{
        wx.navigateTo({
          url: 'list?currentIndex=2&status=delivering'
        })
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
      typeof cb =="function"&&cb();
    })
  },
  makePhoneCall:function(){
    var taskInfo = this.data.taskInfo,
        phone = null;
    if(taskInfo.order.status=='wait_get'){
      phone = taskInfo.fromAddr.phone
    } else if (taskInfo.order.status == 'delivering'){
      phone = taskInfo.toAddr.phone
    }
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  completeTask:function(){
    var id = this.data.taskId,
      that = this;
    service({
      url:'/rest/wx/apis/ord/post_finishord',
      data:{
        oid:id
      },
      method:'POST'
    },res=>{
      that.getPsInfo(() => {
        wx.navigateTo({
          url: 'list?currentIndex=3&status=finish'
        })
      })
    })
  },
  openModal:function(){
    this.setData({
      modal:true
    })
  },
  amountInput:function(e){
    var val = e.detail.value;
    this.setData({
      amountDF:val
    })
  },
  examAmount:function(){
    var amountDF = this.data.amountDF;
    if (!patternCode.test(amountDF)) {
      wx.showToast({
        title: '请输入数字',
        icon: "none"
      })
      return false;
    }
    if (amountDF <= 0) {
      wx.showToast({
        title: '金额不能小于0',
        icon: "none"
      })
      return false;
    }
    return true;
  },
  goTap:function(){
    var valid = this.examAmount();
    if(!valid){
      return false;
    }
    this.setData({
      modal:false
    })
    return true
  },
  inputAmount:function(){
    this.setData({
      modal:true
    })
  },
  closeModal: function () {
    this.setData({
      modal: false
    })
  }
})