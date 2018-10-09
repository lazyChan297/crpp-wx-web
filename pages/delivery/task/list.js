
const app = getApp()
const service = app.globalData.service
const switchworkStatus = app.switchworkStatus


Page({
  data: {
    num: 10,
    currentIndex: 1,
    pageIndex:1,
    modal:false
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      currentIndex: options.currentIndex || 1,
      isChecked:app.globalData.marikInfo.work_status==1?true:false,
      status: options.status,
      marikInfo:app.globalData.marikInfo
    })
    this.getlist({
      status: options.status
    })
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          windowHeight: res.screenHeight
        })
      },
    })
  },
  switchTab: function (e) {
    let index = e.currentTarget.dataset.index,
        status = e.currentTarget.dataset.status;
    console.log(status)
    this.setData({
      currentIndex: index,
      pageIndex: 1,
      status: status
    });
    this.getlist({
      status: status
    });
  },
  checkChange: function (e) {
    var isChecked = false,
        status = e.detail.value.length,
        that = this;
    status==1?'0':1;
    switchworkStatus(status,res=>{
      app.globalData.marikInfo = res;
      console.log(app.globalData.marikInfo)
      that.setData({
        isChecked: app.globalData.marikInfo.work_status == 1 ? true : false
      })
    })
  },
  getlist: function (data) {
    var that = this,
        currentIndex = this.data.currentIndex,
        pageIndex = this.data.pageIndex,
        height = this.data.windowHeight;
    service({
      url: '/rest/wx/apis/ord/pslist',
      data:data,
      method: 'GET'
    }, res => {
      for(var i=0;i<res.result.length;i++){
        if (res.result[i].remain_time <0){
          res.result[i].remain_time = Math.abs(res.result[i].remain_time)
          res.result[i].isLate = true;
        }
      }
      that.setData({
        taskList: res.result,
        pageIndex: Number(pageIndex)+1,
        hasNext: res.hasNext
      })
      if (res.totalCount >= 15){
          that.setData({
            height: height
          })
      }
    })
  },
  getHeight:function(){
    var query = wx.createSelectorQuery(),
        that = this,
        windowHeight = this.data.windowHeight;
    query.select('#list').boundingClientRect()
    query.exec(function (res) {
      
      if (res[0].bottom < windowHeight){
        return false;
      }
      that.setData({
        height: res[0].height
      })
      
    })
  },
  onShow: function () {
    this.setData({
      marikInfo: app.globalData.marikInfo
    })
  },
  makePhoneCall:function(e){
    var phone = e.currentTarget.dataset.phone
    console.log(phone)
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  openModal:function(e){
    this.setData({
      modal:true,
      currentTaskId: e.currentTarget.dataset.id
    })
  },
  // goTap:function(){
  //   var amountDF = this.data.amountDF,
  //       id = this.data.currentTaskId;
  //   if (!patternCode.test(amountDF)) {
  //     wx.showToast({
  //       title: '请输入数字',
  //       icon: "none"
  //     })
  //     return false;
  //   }
  //   if(amountDF<=0){
  //     wx.showToast({
  //       title: '金额不能小于0',
  //       icon: "none"
  //     })
  //     return false;
  //   }
  //   service({
  //     url: '/rest/wx/apis/ord/post_finishget',
  //     data: {
  //       oid: id,
  //       amountReal: amountDF
  //     },
  //     method: 'POST'
  //   }, res => {
  //     wx.navigateTo({
  //       url: 'detail?id=' + id + '&amountDF=' + amountDF
  //     })
  //   })
  //   return true
  // },
  getGoods:function(e){
    var info = e.currentTarget.dataset.info;
      wx.navigateTo({
        url: 'detail?id='+info.id
      })
    
  },
  closeModal:function(){
    this.setData({
      modal: false
    })
  },
  // delivering:function(e){
  //   var info = e.currentTarget.dataset.info,
  //       id = this.data.currentTaskId,
  //       amountDF = this.data.amountDF,
  //       valid = this.goTap();
  //   if(!valid){
  //     return false;
  //   }
    
  // },
  loadMore:function(){
    var status = this.data.status,
        pageIndex = this.data.pageIndex,
        taskList = this.data.taskList,
        that = this,
        hasNext = this.data.hasNext;
    if (!hasNext){
      return false;
    }
    service({
      url: '/rest/wx/apis/ord/pslist',
      data: {
        status: status,
        pageNo: pageIndex
      },
      method: 'GET'
    }, res => {
      for (var i = 0; i < res.result.length; i++) {
        if (res.result[i].remain_time < 0) {
          res.result[i].remain_time = Math.abs(res.result[i].remain_time)
          res.result[i].isLate = true;
        }
      }
      that.setData({
        taskList: taskList.concat(res.result),
        pageIndex: Number(pageIndex) +1,
        hasNext: res.hasNext
      })
    })
  }
})