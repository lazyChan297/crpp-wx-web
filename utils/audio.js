const util = require('util.js')
const service = util.service
const getAudio = (id)=>{
  service({
    url:'/rest/wx/apis/ord/voice/list',
    data:{
      id:id
    },
    method:'GET'
  },res=>{
    console.log(res)
  })
}
const playAudio = (url)=>{
  wx.playBackgroundAudio({
    dataUrl: url
  });
}
const listenerAudio = () =>{
  let n = 0;
  let timer = setInterval(() => {
    n++;
    if (n%2===0 && n<=10) {
      playAudio('http://yss.yisell.com/yisell/ycys2018050819052088/sound/yisell_sound_2014072215535376565_66366.mp3')
    }

  }, 10000)
}
module.exports = {
  listenerAudio: listenerAudio,
  getAudio: getAudio
}