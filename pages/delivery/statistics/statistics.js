// pages/delivery/statistics/statistics.js
let app = getApp();
let service = app.globalData.service
Page({
  data: {
    date: ''
  },
  pickerDate: function (e) {
    let that = this;
    let value = e.detail.value;
    let specifiedDate = value;
    let ordMap = 'retMap.ordMap';
    value = value.split("-");
    this.setData({
      date: value[0] + '年' + value[1] + '月' + value[2] + '日'
    })
    service({
      url: '/rest/wx/apis/statistics/specificDateIncome',
      data: {
        markiUserId: app.globalData.marikInfo.id,
        specifiedDate: specifiedDate
      }
    }, function(){
      that.setData({
        [ordMap]: arguments[0]
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getTime: function () {
    let time = new Date(),
      year = time.getFullYear(),
      month = time.getMonth() + 1,
      date = time.getDate();


    this.setData({
      date: year + '年' + month + '月' + date + '日',
      endTime: year + '-' + month + '-' + date
    });
  },
  onLoad: function (options) {
    var that = this;
    this.getTime()
    service({
      url: '/rest/wx/apis/statistics/income',
      data: {
        markiUserId: app.globalData.marikInfo.id
      }
    }, function () {
      console.log(arguments[0]);
      that.setData({
        retMap: arguments[0]
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})