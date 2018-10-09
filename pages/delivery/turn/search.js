const app = getApp();
const service = app.globalData.service;
Page({
  data: {
    searchResult: [],
    isEmpty: false
  },
  clearInput: function () {
    this.setData({
      input: "",
      isEmpty: false
    })
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      oid: options.oid
    })
    this.getlist()
  },
  getlist:function(){
    var that = this;
    service({
      url: '/rest/wx/apis/ord/psylist',
      method: 'GET'
    }, res => {
      that.setData({
        list:res
      })
    })
  },
  search: function (e) {
    let isEmpty,that = this;
    if (e.detail.value) {
      isEmpty = true;
    } else {
      isEmpty = false;
    }
    that.setData({
      input: e.detail.value,
      isEmpty: isEmpty
    })
  },
  getMarikId:function(e){
    var reciverId = e.currentTarget.dataset.id,
      oid = this.data.oid
    console.log(reciverId);
    service({
      url:"/rest/wx/apis/ord/post_turnord",
      data:{
        oid: oid,
        reciverId: reciverId
      },
      method:'POST'
    },res=>{
      wx.navigateTo({
        url: 'list'
      })
    })
  }
})