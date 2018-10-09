const app = getApp()
const service = app.globalData.service
Page({
  data: {
    currentPage:1
  },
  onLoad: function (options) {
    this.getList()
  },
  onShow: function () {

  },
  getList:function(){
    var that = this;
    service({
      url:'/rest/wx/apis/evaluation/list',
      method:'GET'
    },res=>{
      if(!res.result.length){
        that.setData({
          score:null
        })
        return false;
      }
      that.setData({
        score:res.result
      })
    })
  },
  loadMore:function(){
    var that = this,
      currentPage = this.data.currentPage,
      list = this.data.score || [];
    service({
      url: '/rest/wx/apis/evaluation/list',
      method: 'GET',
      data:{
        pageNo: currentPage,
        pageSize:15
      }
    },res=>{
      if (!res.hasNext){
        return false;
      }
      list = list.concat(res.result);
      currentPage++;
      that.setData({
        currentPage:currentPage,
        score: list
      })
    })
  }
})