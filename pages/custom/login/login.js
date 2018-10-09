const app = getApp()
Page({
  data: {
    getCodeTxt: "获取验证码",
    time: 5,
    phone: "",
    code: "",
    agree: true,
    disable:false
  },
  sendCode: function () {
    let that = this;
    if (this.data.time < 5) {
      
      return false;
    }
    
    var time = this.data.time;
    let timer = setInterval(() => {
      time--;
      that.setData({
        getCodeTxt: time + "后重新获取",
        time: time,
        disable:true
      });
      if (time <= 0) {
        clearInterval(timer);
        that.setData({
          getCodeTxt: "重新获取",
          time: 5,
          disable:false
        });
      }
    }, 1000);
  },
  checkboxChange: function (e) {
    this.setData({
      agree: e.detail.value.length
    })
  },
  getPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })

  },
  getCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  login: function () {
    var data = {
      phone: this.data.phone,
      code: this.data.code,
      agree: this.data.agree
    }
    var valid = this.examPhone() && this.examCode() && this.examAgree();
    if (valid) {
      // 登录
      wx.switchTab({
        url: '../../index/index'
      })
    }
  },
  examPhone: function () {
    var pattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    var phone = this.data.phone;
    if (!phone) {
      wx.showToast({
        title:"请输入手机号码!",
        icon:"none",
        duration:2000
      })
      return false;
    }
    if (!pattern.test(phone)) {
      console.log("请正确输入手机号码");
      return false;
    }
    return true;
  },
  examCode: function () {
    var patternCode = /\d{4}/;
    var code = this.data.code;
    if (!code) {
      wx.showToast({
        title: "请输入四位短信验证码!",
        icon: "none",
        duration: 2000
      })
      return false;
    }
    if (!patternCode.test(code)) {
      wx.showToast({
        title: "验证码错误,请核实后重新输入!",
        icon: "none",
        duration: 2000
      })
      return false;
    }
    return true;
  },
  examAgree: function () {
    var agree = this.data.agree;
    if (!agree) {
      wx.showToast({
        title: "请您阅读并同意协议后才能继续操作!",
        icon: "none",
        duration: 2000
      })
      return false;
    }
    return true;
  },
  onLoad: function (options) {
    
  }
})