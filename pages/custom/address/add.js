const app = getApp();
const map = require('../../../utils/map.js');
const QQmap = map.QQmap;
const service = app.globalData.service;
Page({
  data: {
    url:'pick'
  },
  onLoad: function (options) {
    // 经纬度存在
    if (options.lat && options.lng) {
      this.setData({
        latitude: options.lat,
        longitude: options.lng,
        adcode:options.adcode
      });
      var latIng = {
        latitude: options.lat,
        longitude: options.lng
      }
      this.reverseGeocoder(latIng)
    } else {
      this.setData({
        isNull: true
      });
    }
    // 编辑
    if(options.id){
        this.setData({
          isEdit:true,
          id:options.id,
          areaName: options.areaName||null,
          address:options.address,
          name:options.name,
          phone:options.phone,
          orderType:options.orderType,
          addressType:options.addressType,
          title:options.title,
          adcode:options.adcode
        });
        wx.setNavigationBarTitle({
          title:'编辑地址'
        })
    }
    if (options.orderType !== undefined){
      if(options.orderType>0&&options.addressType>0&&options.title){
        app.globalData.indexTab = options.orderType;
        app.globalData.addressType = options.addressType;
        this.setData({
          returnIndex:true
        })
      } else {
        this.setData({
          url: 'pick?orderType=' + options.orderType + '&addressType=' + options.addressType + '&title=' + options.title + '&master=' + options.master
        })
      }
    }
    if(options.master == 1){
      this.setData({
        master:options.master
      })
    }
    
  },
  onShow:function(){
    
    if(app.globalData.scanStr){
      this.setData({
        address: app.globalData.scanStr
      })
      app.globalData.scanStr = undefined
    }
  },
  reverseGeocoder: function (latIng) {
    let that = this;
    QQmap.reverseGeocoder({
      location: {
        latitude: latIng.latitude,
        longitude: latIng.longitude
      },
      success: function (res) {
        var data = res.result
        that.setData({
          areaName: data.formatted_addresses.recommend
        });

      }
    })
  },
  getAddress:function(e){
    let location = this.data.location;
    if(e.detail.value){
      this.setData({
        address: e.detail.value
      })
    }
  },
  getName: function (e) {
    if (e.detail.value) {
      this.setData({
        name: e.detail.value
      })
    }
  },
  getPhone: function (e) {
    if (e.detail.value) {
      this.setData({
        phone: e.detail.value
      })
    }
  },
  examName:function(){
    let data = this.data;
    if (!data.name){
      wx.showToast({
        icon: "none",
        title: '请输入联系人姓名',
      })
      return false;
    }
    return true;
  },
  examPhone:function(){
    let data = this.data,
        pattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    if (!data.phone) {
      wx.showToast({
        icon: "none",
        title: '请输入联系人手机',
      })
      return false;
    }
    if (!pattern.test(data.phone)) {
      wx.showToast({
        icon: "none",
        title: '请正确输入联系人手机',
      })
      return false;
    }
    return true;
  },
  examAddress:function(){
    let data = this.data;
    if (!data.latitude){
      wx.showToast({
        icon: "none",
        title: '请选择街道/小区',
      });
      return false;
    }
    return true;
  },
  searchAddress:function(e){
    var data = this.data,
        url = 'search?name=' + data.name + '&phone=' + data.phone + '&address=' + data.address +'&areaName=' + data.area_name;
    if(data.id){
      url += '&id='+data.id
    }
    wx.redirectTo({
      url: url
    })
  },
  save:function(){
    var valid = this.examAddress(),
        data = this.data,
        isEdit = data.isEdit,
        that = this;
    
    var _data = {
      adcode:data.adcode,
      name: data.name || " ", 
      phone: data.phone || " ",
      master:data.master || null,
      areaName:data.areaName,
      address: data.address || " ",
      longitude: data.longitude,
      latitude: data.latitude,
      id:data.id
    }
    service({
            url: isEdit ?'/rest/wx/apis/user/address/update':'/rest/wx/apis/user/address/add',
            data: _data,
            method:'POST'
      }, res =>{
        if (that.data.returnIndex){
          app.globalData.addressId = res.id
          wx.switchTab({
            url: '../../index/index'
          })
        } else {
          wx.redirectTo({
            url: data.url
          })
        }
      })
  }
  
})