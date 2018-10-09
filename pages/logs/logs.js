//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      }),
      service: util.service
    })
    this.data.service('/rest/wx/apis/post_mapsitting', res => {
      console.log(res)
    })
  }
  
})
