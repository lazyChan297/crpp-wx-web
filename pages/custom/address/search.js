const app = getApp();
// 引入地图实例
const map = require('../../../utils/map.js');
const QQmap = map.QQmap;
Page({
  data: {
    searchResult: [],
    isEmpty: false,
    title: null,
    orderType: null,
    addressType: null
  },
  clearInput: function () {
    this.setData({
      input: "",
      isEmpty: false,
      canCamera:true
    })
  },
  onLoad: function (options) {
    if(options.id){
      console.log("search id",options.id)
      this.setData({
        id:options.id,
        name:options.name,
        areaName:options.area_name,
        address:options.address,
        phone:options.phone
      })
    }
    if(options.orderType){
      this.setData({
        orderType: options.orderType,
        addressType: options.addressType,
        title: options.title
      })
    }
    if(options.master !== undefined){
      console.log("search",options);
      this.setData({
        master:options.master
      })
    } else{
      this.setData({
        master: null
      })
    }
  },
  onShow:function(){
    var that = this;
    if (app.globalData.scanStr) {
      this.setData({
        input: app.globalData.scanStr,
        canCamera: false
      })
      var scanStr = app.globalData.scanStr;
      QQmap.getSuggestion({
        keyword: scanStr,
        region: '南宁',
        policy: 1,
        success: function (res) {
          that.setData({
            searchResult: res.data,
            isEmpty:true
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
      app.globalData.scanStr = null
    } else {
      that.setData({
        canCamera: true
      })
    }
  },
  chooseAddress:function(e){
    
    var info = e.currentTarget.dataset.info,
        data = this.data,
        url = 'add?lat=' + info.location.lat + '&lng=' + info.location.lng + '&master=' + data.master + '&title=' + data.title + '&orderType=' + data.orderType + '&addressType='+data.addressType+'&adcode='+info.adcode;
    
    if(data.id){
      url = 'add?id=' + data.id + '&lat=' + info.location.lat + '&lng=' + info.location.lng + '&address=' + data.address + '&name=' + data.name + '&phone=' + data.phone + '&master=' + data.master + '&areaName=' + data.area_name + '&adcode=' + info.adcode;
    }
    wx.redirectTo({
      url: url
    })
  },
  searchLocation: function (e) {
    var that = this,
       isEmpty = undefined;
    if (e.detail.value){
      isEmpty = true;
    } else {
      isEmpty = false;
    }
    that.setData({
      input: e.detail.value,
      isEmpty:isEmpty
    })
    QQmap.getSuggestion({
      keyword: e.detail.value,
      region: '南宁',
      policy:1,
      success: function (res) {
        that.setData({
          searchResult: res.data
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  camera:function(){
    wx.navigateTo({
      url: '../../camera/camera'
    })
  }
})