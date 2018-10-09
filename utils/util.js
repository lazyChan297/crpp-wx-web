// const path = 'http://localhost:8080/crpp-admin-web';
const path = 'https://crpp.yeahmall.cn';
const wxLogin = (callback) => {
  wx.login({
    success: res => {
      if (res.code) {
        // 服务器登录
        wx.request({
          url: path + '/rest/wx/apis/user/login',
          data: {
            code: res.code
          },
          method : "post",
          header: {
            'content-type':  'application/x-www-form-urlencoded' , // 默认值
          },success: function (res) {
            
            if (res.data.retCode == 1) {
              wx.setStorage({
                key: "token",
                data: res.data.retObj.token
              });
              callback && callback(res.data.retObj);
            }
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}

const service = (options,callback,error) => {
  let token = wx.getStorageSync('token')
  if (!options.hideLoading){
      wx.showLoading({
      title: '加载中',
      mask:true
    })
  }
  wx.request({
    url: path+options.url,
    data:options.data || '',
    method: options.method || 'GET',
    header: {
      'content-type': options.method == 'POST' ?'application/x-www-form-urlencoded':'application/json', // 默认值
      token: token
    },
    success:(res) => {
      // wx.hideLoading();
      if (!options.hideLoading) {
        wx.hideLoading()
      }
      if (res.data.retCode === 1 || res.data.retCode === 3){
        callback(res.data.retObj, res.data.retCode);
      } else if (res.data.retCode === 2){
        // 重新登录
        wxLogin();
        service(options,callback);
      } else if (res.data.retCode === -1) {
        // error

        typeof error == "function" && error(res.data.retObj);
      }
    },
    complete:function(){

    }
  })
}
module.exports = {
  service: service,
  wxLogin: wxLogin
}
