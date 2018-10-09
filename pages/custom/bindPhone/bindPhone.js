const app = getApp();
const pattern = app.globalData.pattern;
const service = app.globalData.service;
Page({
  data: {
    placeholder:"请输入手机号码",
    codeTxt:"获取短信验证码",
    time:60,
    buttonTxt:'提交',
    hidden:true,
    agree:1
  },
  onLoad: function (options) {
    if (options.isLogin) {
      wx.setNavigationBarTitle({
        title: "登录"
      });
    }
    app.getUserInfo(res=>{
      var that = this;
      if(res.mobile){
        that.setData({
          phone:res.mobile,
          agree:1,
          hidden:false
        })
        that.setData({
          isNext:true
        })
        wx.setNavigationBarTitle({
          title: '修改绑定手机'
        })
      } 
    })
    this.setData({
      options:options
    })
  },
  phoneChange:function(e){
    var phone = '';
    if(e.detail.value&&e.detail.value !== ''){
      phone = e.detail.value;
      this.setData({
        phone: phone
      })
    }
  },
  codeChange:function(e){
    if(e.detail.value&&e.detail.value !==''){
      this.setData({
        code:e.detail.value
      })
    }
  },
  examPhone:function(){
    var phone = this.data.phone;
    if (!phone) {
      wx.showToast({
        icon: "none",
        title: '手机号码不能为空'
      });
      return false;
    }
    if (!pattern.test(phone)) {
      wx.showToast({
        icon: "none",
        title: '手机号码格式错误'
      });
      return false;
    }
    return true;
  },
  examCode:function(){
    var code = this.data.code
    var patternCode = /\d{4}/;
    if (!code) {
      wx.showToast({
        icon: "none",
        title: '请输入验证码'
      });
      return false;
    }
    if (!patternCode.test(code)) {
      wx.showToast({
        icon: "none",
        title: '验证码格式错误'
      });
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
  checkboxChange: function (e) {
    this.setData({
      agree: e.detail.value.length
    })
  },
  getCode:function(){
    if(!this.examPhone()){
      return false;
    }
    
    var that = this,
        time = this.data.time;
    console.log(that.data.isNext)
    if (this.data.time < 60) {
      return false;
    }
    var url = that.data.isNext ? '/rest/wx/apis/user/mobile/verify' : '/rest/wx/apis/user/get/verificationCode';
    
    // 获取smsId
    service({
      url: that.data.isNext ?'/rest/wx/apis/user/mobile/verify':'/rest/wx/apis/user/get/verificationCode',
      data:{
        mobile:that.data.phone,
        ciphertext: that.data.ciphertext
      },
      method:'GET'
    },res =>{
      that.setData({
        smsId:res.smsId
      })
      var timer = setInterval(() => {
        time--;
        that.setData({
          codeTxt: time + "s后重新获取",
          time: time,
          disable: true
        });
        if (time <= 0) {
          clearInterval(timer);
          that.setData({
            codeTxt: "重新获取",
            time: 60,
            disable: false
          });
        }
      }, 1000);
      that.setData({
        timer: timer
      })
    },error=>{
        wx.showToast({
          title: error,
          icon:"none"
        })
      
    })
    
  },
  goAgreement:function(){
    wx.navigateTo({
      url: '../login/agreement'
    })
  },
  save: function () {
    var valid = this.examPhone() && this.examCode() && this.examAgree(),
        data = {
          mobile:this.data.phone,
          code:this.data.code,
          smsId:this.data.smsId
        },
        that = this;

    if(!valid){
      return false;
    }
    if(!that.data.inNext){
      var timer = that.data.timer;
      clearInterval(timer);
    }
    service({
      url: that.data.isNext ?'/rest/wx/apis/user/mobile/verify':'/rest/wx/apis/user/bind/mobile',
      data: data,
      method:'POST'
    },res =>{
      if (res.ciphertext){
        that.setData({
          ciphertext: res.ciphertext,
          isNext:false,
          buttonTxt:"提交",
          code:'',
          phone:'',
          time:60,
          codeTxt:"获取短信验证码",
          disable:false
        })
        return false;
      } else {
        app.globalData.userInfo.mobile = data.mobile;
        console.log(res)
        if (this.data.options.orderType) {
          app.globalData.indexTab = this.data.options.orderType
          wx.switchTab({
            url: '../../index/index'
          })
        } else {
          wx.switchTab({
            url: '../center/center'
          })
        }
      }
      
    },e=>{
      if(e.data.retCode==-1){
        wx.showToast({
          icon:"none",
          title: e.data.retObj
        })
        return false;
      }
    })
  }
})
