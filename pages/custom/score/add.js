const app = getApp()
const service = app.globalData.service;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoreContent: '',
    currentIndex:'',
    tagIndex:-1,
    label:[],
    score: [
      {
        title: '非常不满意', index: 1, _class: 'star1', tag: [
          { txt: '严重超时', heightLight:false}, 
          { txt: '外包装破损', heightLight:false}, 
          { txt: '不送货上门', heightLight:false},
          { txt: '乱丢包裹', heightLight:false}, 
          { txt: '态度恶劣', heightLight:false}
        ]
      },
      {
        title: '不满意', index: 2, _class: 'star2', tag: [
          { txt: '送货慢', heightLight: false }, 
          { txt: '外包装破损', heightLight: false }, 
          { txt: '不送货上门', heightLight: false }, 
          { txt: '着装不规范', heightLight: false }, 
          { txt: '态度恶劣', heightLight: false },
        ]
      },
      {
        title: '服务一般', index: 3, _class: 'star3', tag: [
          { txt: '速度一般', heightLight: false },
          { txt: '外包装破损', heightLight: false },
          { txt: '不送货上门', heightLight: false },
          { txt: '态度差', heightLight: false }
        ]
      },
      {
        title: '比较满意', index: 4, _class: 'star4', tag: [
          { txt: '速度快', heightLight: false },
          { txt: '外包装完好', heightLight: false },
          { txt: '态度好', heightLight: false },
          { txt: '着装规范', heightLight: false },
          { txt: '小鲜肉', heightLight: false }
        ]
      },
      {
        title: '非常满意', index: 5, _class: 'star5', tag: [
          {
            txt:'外包装完好',
            heightLight:false
          }, {
            txt:'很专业',
            heightLight:false
          },{ 
            txt:'态度好',
            heightLight:false
          },{
            txt:'非常热情', 
            heightLight:false
          },{
              txt:'小鲜肉', 
              heightLight:false
            },{
              txt:"很帅",
              heightLight:false
            }
        ]
      },
    ],
    scoreText: "请点亮星星",
    scoreTag: [],
    focus:false
  },
  onLoad:function(opt){
    this.getOrder(opt)
  },
  onShow:function(){
  },
  score: function (e) {
    let data = e.currentTarget.dataset;
    this.setData({
      scoreText:data.title,
      currentIndex:data.index,
      tagIndex: -1,
      scoreTag: data.tag,
      grade:data.index,
      label:[]
    });
  },
  inputchange:function(e){
    this.setData({
      scoreContent:e.detail.value
    })
  },
  addTag: function (e) {
    let data = e.currentTarget.dataset,
        scoreTag = this.data.scoreTag;
        scoreTag[data.index].heightLight = data.heightlight?false:true;
    var label = this.data.label;
  if (scoreTag[data.index].heightLight){
    label.push(scoreTag[data.index].txt)
    // 获得标签内容
    this.setData({
      label: label
    })
  }
   this.setData({
     scoreTag:scoreTag
   })
  },
  getOrder:function(opt){
    var that = this;
    service({
      url: '/rest/wx/apis/ord/get',
      data: opt,
      method: 'GET'
    },res=>{
      that.setData({
        orderInfo:res
      })
    })
  },
  getContent: function (e) {
    let value = e.detail.value
    this.setData({
      scoreContent: value
    })
  },
  save:function(){
    var data = this.data
    var _data = {
      ordId:data.orderInfo.order.id,
      score: data.grade,
      label: JSON.stringify(data.label), 
      content:data.scoreContent
    }
    service({
      url:'/rest/wx/apis/evaluation/add',
      data:_data,
      method:'POST'
    },res=>{
      app.globalData.getOrdList.status = "finish";
      app.globalData.getOrdList.tab = 5;
      wx.switchTab({
        url: '../order/list'
      })
    })
  }
})