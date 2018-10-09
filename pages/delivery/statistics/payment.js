let app = getApp();
let service = app.globalData.service
Page({
  data: {
    date: ''
  },
  pickerDate: function (e) {
    let that = this;
    let value = e.detail.value
    let specifiedDate = value;
    let ordMap = 'retMap.ordMap';
    value = value.split("-");
    this.setData({
      date: value[0] + '年' + value[1] + '月' + value[2] + '日'
    });
    service({
      url: '/rest/wx/apis/statistics/specificDateGoods',
      data: {
        markiUserId: app.globalData.marikInfo.id,
        specifiedDate: specifiedDate
      }
    }, function(){
      console.log(arguments[0]);
      that.setData({
        [ordMap]: arguments[0]
      });
    })
  },
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
    this.getTime();
    service({
      url: '/rest/wx/apis/statistics/aidPay',
      data: {
        markiUserId: app.globalData.marikInfo.id
      }
    }, function(){
      console.log(arguments[0]);
      that.setData({
        retMap: arguments[0]
      })
    });
  }
})