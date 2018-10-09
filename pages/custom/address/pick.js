const app = getApp()
const service = app.globalData.service;
Page({
  data: {
    isEmpty: false,
    input: '',
    react: false,
    title:null,
    orderType:null,
    addressType:null,
    sortMode:'last_use_time',
    currentPage:1
  },
  clearInput: function () {
    this.setData({
      input: "",
      isEmpty: false
    })
    this.getlist()
  },
  searchInput: function (e) {
    let value = e.detail.value;
    if (value) {
      this.setData({
        isEmpty: true,
        input: value
      })
      this.getlist()
    } else {
      this.setData({
        isEmpty: false,
        input:''
      })
      this.getlist()
    }
  },
  onLoad: function (options) {
    let that = this;
    // 选择地址
    if (options.orderType !== undefined &&options.orderType !== "null") {
      wx.setNavigationBarTitle({
        title: options.title || "地址管理"
      });
      var masterAddressIsNull = true;
      if(options.orderType==1){
        if(options.addressType ==2){
          masterAddressIsNull = false;
        }
      }
      if(options.orderType==2){
        if(options.addressType==1){
          masterAddressIsNull = false;
        }
      }
      if(options.master){
        this.setData({
          master:1,
          sortMode:'master'
        })
      }
      that.setData({
        orderType: options.orderType,
        addressType: options.addressType,
        title:options.title,
        react:true,
        masterAddressIsNull: masterAddressIsNull
      })
      
    } else {
      wx.setNavigationBarTitle({
        title: "地址管理",
        masterAddressIsNull:false
      });
    }
    this.setData({
      setMasterUrl:'search?master=1&title='+options.title+'&orderType='+options.orderType+'&addressType='+options.addressType
    })
    this.getlist()

  },
  onShow:function(){
    
  },
  getlist: function (opt) {
    var that = this,
        key = that.data.input,
        data = that.data,
        orderType = data.orderType,
        addressType = data.addressType,
        latIng = app.globalData.latIng,
        master = data.master,
        sortMode = data.sortMode,
        currentPage = data.currentPage;

    service({
      url: '/rest/wx/apis/user/address/list',
      data:{
        name:key,
        orderBy: sortMode + ' desc'
      }
    }, res => {
      if (!res.result.length) {
        that.setData({
          listIsNull: true,
          addressList: null
        })
        console.log(that.data.addressList)
        return false;
      }
      that.setData({
        addressList: res.result,
        listIsNull:false
      });
      if(orderType==2&&addressType==2){
        for (let i = 0; i < res.result.length; i++) {   
          if (res.result[i].latitude == latIng.latitude && res.result[i].longitude == latIng.longitude) {
            that.setData({
              currentAddress: res.result[i]
            })
          }
        }
      }
    });
  },
  chooseAddress: function (e) {
    let data = e.currentTarget.dataset.info
    if (!this.data.react) {
      return false;
    }
    app.globalData.indexTab = this.data.orderType;
    app.globalData.addressType = this.data.addressType;
    app.globalData.addressId = data.id;
    wx.switchTab({
      url: '../../index/index'
    })
  },
  deleteAddress: function (e) {
    let that = this;
    wx.showModal({
      content: '地址删除后将无法恢复，您确定要删除吗？',
      success: res => {
        if(res.cancel){
          return false;
        }
        service({
          url: '/rest/wx/apis/user/address/delete',
          method: 'POST',
          data: {
            id: e.currentTarget.dataset.id
          }
        }, res => {
          service({
            url: '/rest/wx/apis/user/address/list'
          }, res => {
            if (!res.result.length) {
              that.setData({
                listIsNull: true,
                addressList:null
              })
              return false;
            }
            that.setData({
              addressList: res.result
            })
          });
        })
      }
    })
  },
  editAddress:function(e){
    var info = e.currentTarget.dataset.info,
        data = this.data;
    wx.redirectTo({
      url: 'add?id=' + info.id + '&lat=' + info.latitude + '&lng=' + info.longitude + '&address=' + info.address + '&name=' + info.name + '&phone=' + info.phone + '&areaName=' + info.area_name + '&addressType=' + data.addressType +'&orderType=' +data.orderType + '&title='+data.title
    })
  }
})