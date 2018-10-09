const app = getApp()
const service = app.globalData.service
const switchworkStatus = app.switchworkStatus
const backgroundAudioManager = wx.getBackgroundAudioManager()
const path = 'https://crpp.yeahmall.cn'
var timer = {}
const GDmap = require('../../../libs/amap-wx.js');
const patternCode = /\d/;
Page({
  data: {
    mapHeight: '780rpx',
    mapMinHeight: '780rpx',
    isExpand: true,
    scrollViewHeight: '',
    modal: false,
    isRefuse: false,
    isChecked: true,
    currentPage: 1
  },
  onLoad: function (options) {
    let that = this;
    this.setData({
      marikInfo: app.globalData.marikInfo
    })
    this.setData({
      turnOrd: app.globalData.marikInfo.turn_finish_ord,
      waitGet: app.globalData.marikInfo.wait_get_ord,
      delivering: app.globalData.marikInfo.delivering_ord
    })
    var id = this.data.marikInfo.id, page = this.data.currentPage;
    app.getLocation(res => {
      that.setData({
        markers: [{
          latitude: res.latitude,
          longitude: res.longitude,
          iconPath: '/images/task/current.png',
          width: 56,
          height: 56
        }],
        points: [{
          latitude: res.latitude,
          longitude: res.longitude
        }]
      })
      that.getlist(page)
    })
    if (app.globalData.voiceBean.yuyinStatus) {
      timer = setInterval(() => {
        that.getAudio(id)
      }, 20000)
    }
    app.loadMap(() => {
      that.mapCtx = wx.createMapContext('map')
      that.mapCtx.moveToLocation();
    })
    // 定义列表高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          mapMaxHeight: res.windowHeight - res.windowWidth / 750 * 88,
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 868 + 'px',
          scrollViewHeight: res.windowHeight - res.windowWidth / 750 * 868 + 'px'
        })
      }
    })
    this.animation = app.globalData.animation;
  },
  onUnload: function () {
    clearInterval(timer);
  },
  // 规划路线
  route(obj){
    let that = this;
    let myAmapFun = new GDmap.AMapWX({ key: '1d005fe07d3303a9d10e56da8c7cae06' });
    myAmapFun.getDrivingRoute({
      origin: obj.origin,
      destination: obj.destination,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
      },
      fail: function (info) {

      }
    })
  },
  // 打开modal
  openModal: function (e) {
    var info = e.currentTarget.dataset.info,
      index = e.currentTarget.dataset.index;
    this.setData({
      taskIndex: index,
      modal: true,
      taskInfo: {
        id: info.id,
        ord_num: info.ord_num,
        from_address: info.from_address,
        from_user_name: info.from_user_name,
        from_user_phone: info.from_user_phone,
        to_address: info.to_address,
        to_user_name: info.to_user_name,
        to_user_phone: info.to_user_phone,
        status: info.status,
        note: info.note || null,
        "type": info.type,
        to_latitude: info.to_latitude,
        to_longitude: info.to_longitude,
        from_latitude: info.from_latitude,
        from_longitude: info.from_longitude
      }
    })
  },
  // 关闭modal
  closeModal: function () {
    this.setData({
      modal: false,
      isRefuse: false
    })
  },
  getlist: function (currentPage, isOper) {
    var that = this, taskList = this.data.taskList || []
    service({
      url: '/rest/wx/apis/ord/taskmap',
      method: 'GET',
      data: {
        pageNo: currentPage || 1
      }
    }, res => {
      if (!res.result.length && isOper) {
        that.setData({
          taskList: [],
          hasNext: res.hasNext
        })
        that.getDelivery()
        return false;
      } else if (isOper && res.result) {
        that.setData({
          taskList: res.result,
          hasNext: res.hasNext
        });
        let first = res.result[0]
        // 规划路线
        that.route({
          origin: first.from_longitude + "," + first.from_latitude,
          destination: first.to_longitude + "," + first.to_latitude
        })
        that.getDelivery()
      } else {
        that.setData({
          taskList: taskList.concat(res.result),
          hasNext: res.hasNext
        })
        let first = taskList.concat(res.result)[0]
        that.route({
          origin: first.from_longitude + "," + first.from_latitude,
          destination: first.to_longitude + "," + first.to_latitude
        })
        that.getDelivery()
      }
      var markers = that.data.markers, points = that.data.points,
        result = res.result;
      for (let i = 0; i < result.length; i++) {
        points.push({
          latitude: result[i].to_latitude,
          longitude: result[i].to_longitude
        })

        var icon = result[i].status == 'delivering' ? 'lan' : 'huang';
        if (result[i].reminder_flag) {
          icon = 'hong'
        }
        markers.push({
          latitude: result[i].to_latitude,
          longitude: result[i].to_longitude,
          iconPath: '/images/task/' + icon + Number(i + 1) + '.png',
          width: 44,
          height: 44
        })
      }
      that.setData({
        markers: markers,
        points: points,
        currentPage: currentPage + 1
      })
    })
  },
  getDelivery: function () {
    service({
      url: '/rest/wx/apis/marki/get/info',
      method: 'GET'
    }, (res, code) => {
      app.globalData.marikInfo = res
      console.log(res)
      this.setData({
        turnOrd: res.turn_finish_ord,
        waitGet: res.wait_get_ord,
        delivering: res.delivering_ord
      })
    })
  },
  // 下拉列表
  slide: function (e) {
    let isExpand = this.data.isExpand,
      height = '',
      animation = this.animation,
      scrollHeight = '';
    if (isExpand) {
      height = this.data.mapMaxHeight + 'px';
      scrollHeight = 0 + 'px';
    } else {
      height = this.data.mapMinHeight
      scrollHeight = this.data.scrollHeight
    }
    isExpand = isExpand === true ? false : true;
    animation.top(height).step();
    this.setData({
      isExpand: isExpand,
      mapHeight: height,
      animationData: animation.export(),
      scrollViewHeight: scrollHeight
    })
  },
  chooseReason: function () {
    this.setData({
      isRefuse: true
    })
  },
  getGoods: function (e) {
    var info = this.data.taskInfo,
      amountReal = this.data.amountReal,
      index = this.data.taskIndex,
      that = this;
    if (info.type == 'buy' && !amountReal) {
      this.setData({
        isRefuse: true,
        isAmount: true
      })
      return false
    }
    service({
      url: '/rest/wx/apis/ord/post_finishget',
      data: {
        oid: info.id,
        amountReal: amountReal || Number(" ")
      },
      method: 'POST'
    }, res => {
      that.setData({
        modal: false,
        isRefuse: false
      })
      that.getlist(1, true);
    })
  },
  complete: function () {
    var info = this.data.taskInfo,
      that = this;
    service({
      url: '/rest/wx/apis/ord/post_finishord',
      data: {
        oid: info.id
      },
      method: 'POST'
    }, res => {
      that.getlist(1, true);
    })
    this.setData({
      modal: false,
      isRefuse: false
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
  playAudio: function (url) {
    wx.playBackgroundAudio({
      dataUrl: url,
      success: function () {
        console.log("播放完成")
      }
    });
  },
  getAudio: function (id) {
    var that = this;
    service({
      url: '/rest/wx/apis/ord/voice/list',
      data: {
        id: id
      },
      method: 'GET',
      hideLoading: true
    }, res => {
      if (!res.length) {
        return false;
      }
      clearInterval(timer);
      that.setData({
        audioList: res
      })
      that.playAudio()
    })
  },
  playAudio: function () {
    var that = this,
      audioList = this.data.audioList,
      len = audioList.length,
      current = audioList.shift();
    backgroundAudioManager.src = path + current.voiceUrl;
    backgroundAudioManager.onEnded(function () {
      that.deleteAudio(current.id, audioList);
    })
  },
  deleteAudio: function (id, arr) {
    var that = this;
    service({
      url: '/rest/wx/apis/ord/voice/del',
      data: {
        id: id
      },
      method: 'POST'
    }, res => {
      if (!arr.length) {
        var id = that.data.marikInfo.id;
        that.getlist();
        timer = setInterval(() => {
          that.getAudio(id)
        }, 5000)
        return false;
      }
      that.setData({
        audioList: arr
      })
      that.playAudio();
    })
  },
  amountTap: function () {
    this.setData({
      isRefuse: true,
      isAmount: true
    })
  },
  amountInput: function (e) {
    var value = e.detail.value
    this.setData({
      amountReal: value
    })
  },
  getAmount: function () {
    var value = this.data.amountReal
    if (!patternCode.test(value)) {
      wx.showToast({
        title: '请输入数字',
        icon: "none"
      })
      return false;
    }
    this.setData({
      isRefuse: false,
      isAmount: false
    })
    console.log(this.data.amountReal)
  },
  makePhoneCall: function () {
    console.log(this.data.taskInfo)
    var info = this.data.taskInfo,
      phone = info.from_user_phone
    if (info.status == 'delivering') {
      phone = info.to_user_phone
    }
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  openMap: function (e) {
    var latIng = {},
      taskInfo = this.data.taskInfo;
    if (e.currentTarget.dataset.type === 'from') {
      latIng = {
        latitude: taskInfo.from_latitude,
        longitude: taskInfo.from_longitude
      }
    } else {
      latIng = {
        latitude: taskInfo.to_latitude,
        longitude: taskInfo.to_longitude
      }
    }
    wx.getLocation({
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latIng.latitude,
          longitude: latIng.longitude,
          scale: 28
        })
      }
    })
  },
  loadMore: function () {
    var currentPage = this.data.currentPage,
      that = this, hasNext = this.data.hasNext;
    if (hasNext) {
      this.getlist(currentPage);

    }

  }
})