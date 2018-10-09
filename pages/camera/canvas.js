const app = getApp()
const ctx = wx.createCanvasContext('cover-preview');

var start_position = {};//移动图片时手指起始坐标
var tempFilePath;//图片路径
var tempWidth;//图片初始宽度
var tempHeight;//图片初始高度
var new_tempWidth;//图片新宽度
var new_tempHeight;//图片新高度
var old_x = 0;//图片初始x坐标
var old_y = 0;//图片初始y坐标
var new_x = 0;//图片新x坐标
var new_y = 0;//图片新y坐标
var _touches = 1;//触屏的手指数
var scale = 1;//放大倍数
var is_move = false;//是否移动
var bg_url;
var screenWidth = wx.getSystemInfoSync().windowWidth;
var screenHeight = wx.getSystemInfoSync().windowHeight;
var is_scope = false;
var scope_min_width = 40;//最小裁剪宽度
var scope_min_height = 40;//最小裁剪高度
var scope_bgc = "rgba(0,0,0,0.5)";
var scope = {
  x: old_x,
  y: old_y,
  width: tempWidth,
  height: tempHeight,
};
var temp_scope = {
  x: old_x,
  y: old_y,
  width: tempWidth,
  height: tempHeight,
  isTop: false,
  isBottom: false,
  isLeft: false,
  isRight: false,
  isMove: false,
};
Page({
  data: {
    hide_canvas: true,//绘图层显示控制变量
    scope_top: 0,
    scope_left: 0,
    scope_width: 0,
    scope_height: 0,
    scope_bgc: scope_bgc,
  },
  onLoad: function (option) {
    var that = this;
    tempFilePath = option.tempImagePath;
    this.setData({
      edit_url: tempFilePath,
      hide_canvas: false
    });
    wx.getImageInfo({
      src: tempFilePath,
      success: function (res) {
        // console.log(res.width)
        // console.log(res.height)
        tempWidth = screenWidth;
        tempHeight = res.height / res.width * tempWidth;
        
        old_y = screenHeight - tempHeight > 0 ? (screenHeight - tempHeight) / 2 : 0;
        scope = {
          x: old_x + tempWidth * 0.2,
          y: old_y + tempHeight * 0.2,
          width: tempWidth * 0.6,
          height: tempHeight * 0.6,
        };
        temp_scope = {
          x: scope.x,
          y: scope.y,
          width: scope.width,
          height: scope.height,
        };
        that.draw_canvas();
      }
    })
  },
  //监听手指触摸事件，并判断是移动还是缩放，并记录初始状态
  canvas_start: function (e) {
    // console.log(e);
    if (Math.abs(2 * e.touches[0].x - 2 * scope.x - scope.width) < Math.abs(scope.width) && Math.abs(2 * e.touches[0].y - 2 * scope.y - scope.height) < Math.abs(scope.height)) {
      is_scope = true;
      this.scope_start(e);
    } else {
      // is_scope = false;
      var touches = e.touches.length;
      if (touches == 1) {
        _touches = 1;
        start_position = { x: e.touches[0].x, y: e.touches[0].y, timeStamp: e.timeStamp }
      } else if (touches == 2) {
        _touches = 2;
        start_position = { x: e.touches[0].x, y: e.touches[0].y, x1: e.touches[1].x, y1: e.touches[1].y, timeStamp: e.timeStamp }
      } else {
        _touches = 1;
      }
    }
  },
  //监听图片手指移动事件，并做出相应调整
  canvas_move: function (e) {
    // console.log(e);
    var _img = {};
    if (is_scope) {
      this.scope_move(e);
    } else {
      var touches = e.touches.length;
      if (_touches == 1 && e.timeStamp - start_position.timeStamp > 150) {
        new_x = old_x + e.touches[0].x - start_position.x;
        new_y = old_y + e.touches[0].y - start_position.y;
        _img = {
          x: new_x,
          y: new_y,
          width: tempWidth,
          height: tempHeight,
          src: tempFilePath,
        }
        // ctx.drawImage(tempFilePath, new_x, new_y, tempWidth, tempHeight);
        // ctx.draw();
        is_move = true;
      } else if (_touches == 2 && e.timeStamp - start_position.timeStamp > 150) {
        var change_x = Math.abs(Math.abs(e.touches[0].x - e.touches[1].x) - Math.abs(start_position.x - start_position.x1));
        var change_y = Math.abs(Math.abs(e.touches[0].y - e.touches[1].y) - Math.abs(start_position.y - start_position.y1));
        if (change_x - change_y > 10) {
          scale = Math.abs(e.touches[0].x - e.touches[1].x) / Math.abs(start_position.x - start_position.x1);
        } else {
          scale = Math.abs(e.touches[0].y - e.touches[1].y) / Math.abs(start_position.y - start_position.y1);
        }
        new_tempWidth = tempWidth * scale;
        new_tempHeight = tempHeight * scale;
        _img = {
          x: old_x,
          y: old_y,
          width: new_tempWidth,
          height: new_tempHeight,
          src: tempFilePath,
        }

        // ctx.drawImage(tempFilePath, old_x, old_y, new_tempWidth, new_tempHeight);
        // ctx.draw();
        is_move = true;
      } else {
        is_move = false;
      }
    }
    this.draw_canvas({ img: _img, scope: temp_scope });
  },
  //监听手指离开动作，并保存当前状态数据
  canvas_end: function (e) {
    
    // console.log(e);
    if (is_scope) {
      this.scope_end(e);
    } else {
      if (_touches == 1 && is_move) {
        if (new_x > 0) {
          new_x = 0;
        }
        if (new_x < screenWidth - tempWidth) {
          new_x = screenWidth - tempWidth;
        }
        if (tempHeight < screenHeight) {
          new_y = (screenHeight - tempHeight) / 2;
        } else if (new_y > 0) {
          new_y = 0;
        } else if (new_y < screenHeight - tempHeight) {
          new_y = screenHeight - tempHeight;
        }
        old_x = new_x;
        old_y = new_y;
      } else if (_touches == 2 && is_move) {
        tempWidth = new_tempWidth < screenWidth ? screenWidth : new_tempWidth;
        tempHeight = new_tempHeight / new_tempWidth * tempWidth;
      }
    }
    // ctx.drawImage(tempFilePath, old_x, old_y, tempWidth, tempHeight);
    // ctx.draw();
    this.draw_canvas();
  },
  //监听裁剪范围手指触摸事件，并判断是移动还是缩放
  scope_start: function (e) {
    temp_scope.isLeft = Math.abs(scope.x - e.touches[0].x) < scope_min_width / 2;
    temp_scope.isTop = Math.abs(scope.y - e.touches[0].y) < scope_min_height / 2;
    temp_scope.isRight = Math.abs(scope.x + scope.width - e.touches[0].x) < scope_min_width / 2 && !scope.isLeft;
    temp_scope.isBottom = Math.abs(scope.y + scope.height - e.touches[0].y) < scope_min_height / 2 && !scope.isTop;
    temp_scope.isMove = !temp_scope.isLeft && !temp_scope.isTop && !temp_scope.isRight && !temp_scope.isBottom;
    start_position = {
      x: e.touches[0].x,
      y: e.touches[0].y,
    }
  },
  //监听裁剪范围手指移动事件，并做出相应调整
  scope_move: function (e) {
    var _x, _y, _width, _height;
    if (temp_scope.isLeft) {
      //左界
      _x = e.touches[0].x < 0 ? 0 : e.touches[0].x;
      _width = scope.width + scope.x - _x;
      if (_width < scope_min_width) {
        _width = scope_min_width;
        _x = scope.width + scope.x - _width;
      }
      temp_scope.width = _width;
      temp_scope.x = _x;
    }
    if (temp_scope.isTop) {
      //上界
      _y = e.touches[0].y < 0 ? 0 : e.touches[0].y;
      _height = scope.height + scope.y - _y;
      if (_height < scope_min_height) {
        _height = scope_min_height;
        _y = scope.height + scope.y - _height;
      }
      temp_scope.height = _height;
      temp_scope.y = _y;
    }
    if (temp_scope.isRight) {
      //右界
      _width = e.touches[0].x > screenWidth ? screenWidth - scope.x : e.touches[0].x - scope.x;
      if (_width < scope_min_width) {
        _width = scope_min_width;
      }
      temp_scope.width = _width;
    }
    if (temp_scope.isBottom) {
      //下界
      _height = e.touches[0].y > screenHeight ? screenHeight - scope.y : scope.height + e.touches[0].y - start_position.y;
      if (_height < scope_min_height) {
        _height = scope_min_height;
      }
      temp_scope.height = _height;
    }
    if (temp_scope.isMove) {
      //移动
      var _x = scope.x + e.touches[0].x - start_position.x;
      var _y = scope.y + e.touches[0].y - start_position.y;
      if (_x < 0) {
        _x = 0;
      }
      if (_x + temp_scope.width > screenWidth) {
        _x = screenWidth - temp_scope.width;
      }
      if (_y < 0) {
        _y = 0;
      }
      if (_y + temp_scope.height > screenHeight) {
        _y = screenHeight - temp_scope.height;
      }
      temp_scope.x = _x;
      temp_scope.y = _y;
    }
    this.draw_canvas({ scope: temp_scope });
  },
  //监听裁剪范围手指离开动作，并保存当前状态数据
  scope_end: function () {
    scope.x = temp_scope.x;
    scope.y = temp_scope.y;
    scope.height = temp_scope.height;
    scope.width = temp_scope.width;
  },
  //确定并上传背景图
  upload_bg: function () {
    var that = this;
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    // console.log(screenWidth);
    ctx.drawImage(tempFilePath, old_x, old_y, tempWidth, tempHeight);
    ctx.draw();
    wx.canvasToTempFilePath({
      x: scope.x,
      y: scope.y,
      width: scope.width,
      height: scope.height,
      quality: 1,
      canvasId: 'cover-preview',
      success: function (res) {
        that.setData({
          hide_canvas: true,
        })
        //res.tempFilePath即为生成的图片路径
        wx.showLoading({
          title: '识别中',
        })
        wx.uploadFile({
          url: 'https://crpp.yeahmall.cn' + "/rest/wx/apis/ocr/scan",
          filePath: res.tempFilePath,
          header: {
            token: wx.getStorageSync('token')
          },
          name: "image",
          success: function (ret) {
            var data = JSON.parse(ret.data)
            if (data.retCode === -1) {
              wx.hideLoading();
              wx.showToast({
                title: '识别失败',
                icon: 'none'
              })
              wx.navigateBack();
              return false;
            }
            var data = JSON.parse(ret.data),
              items = data.retObj.data.items,
              str = '';
            for (let i = 0; i < items.length; i++) {
              str += items[i].itemstring;
            }
            app.globalData.scanStr = str;
            wx.navigateBack();
            wx.hideLoading()

          }
        });
      }
    })
  },
  //取消图片预览编辑
  cancel_croper: function () {
    ctx.clearActions();
    wx.navigateBack()
  },
  //绘制画布
  draw_canvas: function (option) {
    var
      _scope_x = option && option.scope && option.scope.x !== undefined ? option.scope.x : scope.x,
      _scope_y = option && option.scope && option.scope.y !== undefined ? option.scope.y : scope.y,
      _scope_width = option && option.scope && option.scope.width !== undefined ? option.scope.width : scope.width,
      _scope_height = option && option.scope && option.scope.height !== undefined ? option.scope.height : scope.height,
      _scope_bgc = option && option.scope && option.scope.bgc !== undefined ? option.scope.bgc : scope_bgc,
      _x = option && option.img && option.img.x !== undefined ? option.img.x : old_x,
      _y = option && option.img && option.img.y !== undefined ? option.img.y : old_y,
      _width = option && option.img && option.img.width !== undefined ? option.img.width : tempWidth,
      _height = option && option.img && option.img.height !== undefined ? option.img.height : tempHeight,
      _src = option && option.img && option.img.bgc !== undefined ? option.img.bgc : tempFilePath;
    ctx.strokeStyle = "#fff";
    ctx.setLineWidth(3)
    // // 左上角竖线
    ctx.beginPath()
    ctx.moveTo(_scope_x, _scope_y )
    ctx.lineTo(_scope_x, _scope_y + 20)
    ctx.stroke()
    // // 左上角横线
    ctx.beginPath()
    ctx.moveTo(_scope_x, _scope_y)
    ctx.lineTo(_scope_x + 20, _scope_y)
    ctx.stroke()
    // // 左下角竖线
    ctx.beginPath()
    ctx.moveTo(_scope_x, _scope_y + _scope_height - 20)
    ctx.lineTo(_scope_x, _scope_y + _scope_height)
    ctx.stroke()
    // // 左下角横线
    ctx.beginPath()
    ctx.moveTo(_scope_x, _scope_y + _scope_height)
    ctx.lineTo(_scope_x + 20, _scope_y + _scope_height)
    ctx.stroke()
    // // 右上角竖线
    ctx.beginPath()
    ctx.moveTo(_scope_x + _scope_width, _scope_y)
    ctx.lineTo(_scope_x + _scope_width, _scope_y + 20)
    ctx.stroke()
    // // 右上角横线
    ctx.beginPath()
    ctx.moveTo(_scope_x + _scope_width - 20, _scope_y)
    ctx.lineTo(_scope_x + _scope_width, _scope_y)
    ctx.stroke()
    // // 右下角横线
    ctx.beginPath()
    ctx.moveTo(_scope_x + _scope_width - 20, _scope_y + _scope_height)
    ctx.lineTo(_scope_x + _scope_width, _scope_y + _scope_height)
    ctx.stroke()
    // // 右下角竖线
    ctx.beginPath()
    ctx.moveTo(_scope_x + _scope_width, _scope_y + _scope_height - 20)
    ctx.lineTo(_scope_x + _scope_width, _scope_y + _scope_height)
    ctx.stroke()
    ctx.globalCompositeOperation = "overlay";

    // 遮罩
    ctx.setFillStyle(_scope_bgc);
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    // 镂空
    ctx.clearRect(_scope_x, _scope_y, _scope_width, _scope_height);
    ctx.setFillStyle("rgba(0,0,0,1)");// 透明度设置为1，颜色无所谓

    ctx.drawImage(_src, _x, _y, _width, _height);
    
    
    
   
    ctx.draw();
  },
})