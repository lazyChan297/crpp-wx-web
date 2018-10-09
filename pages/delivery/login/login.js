
const app = getApp()
const aes =require('../../../libs/aes.js');
const CryptoJS = aes.CryptoJS
const secret = require('../../../libs/jandar-secret.js');
const hex_md5 = secret.hex_md5;
const service = app.globalData.service
Page({
  data: {
    getCodeTxt: "获取验证码",
    time: 5,
    phone: "",
    code: "",
    disable: false
  },
  getPhone: function (e) {
    var key = this.data.key,
        iv = this.data.iv;
    var phone = CryptoJS.AES.encrypt(e.detail.value, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }).toString()
    this.setData({
      phone: phone
    })
    
  },
  getPassword:function(e){
    var key = this.data.key,
        iv = this.data.iv;
    var passwd = CryptoJS.AES.encrypt(hex_md5(e.detail.value), key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }).toString()
    this.setData({
      password: passwd
    })
  },
  login: function () {
    var data = {
      username: this.data.phone,
      password: this.data.password
    }
    service({
      url:'/rest/wx/apis/user/union/marki',
      data:{
        username: data.username,
        password:data.password
      },
      method:'POST'
    },res=>{
      wx.setStorage({
        key: "token",
        data: res.token
      });
      app.globalData.marikInfo = res.markiUser
      wx.redirectTo({
        url: '../center/center'
      })
    },err=>{
      wx.showToast({
        title: err,
        icon:"none",
        delay:2000
      })
    })
  },
  examPhone: function () {
    var pattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    var phone = this.data.phone;
    if (!phone) {
      wx.showToast({
        title: '请输入手机号码',
        icon:"none",
        delay:2000
      })
      return false;
    }
    if (!pattern.test(phone)) {
      wx.showToast({
        title: '请正确输入手机号码',
        icon: "none",
        delay: 2000
      })
      return false;
    }
    return true;
  },
  examCode: function () {
    var patternCode = /\d{4}/;
    var code = this.data.code;
    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: "none",
        delay: 2000
      })
      return false;
    }
    if (!patternCode.test(code)) {
      wx.showToast({
        title: '验证码错误',
        icon: "none",
        delay: 2000
      })
      return false;
    }
    return true;
  },
  examAgree: function () {
    var agree = this.data.agree;
    console.log(agree)
    if (!agree) {
      console.log("请勾选同意");
      return false;
    }
    return true;
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        var re = /[^\u4e00-\u9fa5a-zA-Z0-9]/g;
        token = token.replace(re, "").toLocaleLowerCase();
        var length = token.length,
            key = token.substr(0,16),
            iv = token.substring(length-16)
        that.setData({
          key: CryptoJS.enc.Latin1.parse(key),
          iv: CryptoJS.enc.Latin1.parse(iv)
        })
      }
    })
  }
})