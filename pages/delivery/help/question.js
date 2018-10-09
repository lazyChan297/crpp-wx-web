// pages/delivery/help/question.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: ['收费标准', '如何下单', '如何退款', '联系客服', '建议与投诉', '赔付规则']
  },

  list: function(){
    let that = this;
    var service = getApp().globalData.service;
    let options = {
      url: '/rest/wx/apis/help/list',
    };
    service(options, function(){
      that.setData({
        lists: arguments[0]
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.list();
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