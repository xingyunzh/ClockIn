var uuidv1 = require('../lib/uuid/we-uuidv1')

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  //var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function dataInit(){
  var storageInfo = wx.getStorageInfoSync()
  if(storageInfo.keys.indexOf('credits') < 0){
    wx.setStorage({
      key: 'credits',
      data: "200",
      success: function(res){
        // success
        console.log('credits init succeed')
      },
      fail:function(res){
        console.log('credits init fail')
      }
    })
  }

  if(storageInfo.keys.indexOf('events') < 0){
    var events = []
    // for(var i = 0; i< 3;i++){
    //   events.push({
    //     id:uuidv1(),
    //     description:'a',
    //     location:'b',
    //     time:formatTime(new Date()),
    //     status:1
    //   })
    // }

    wx.setStorage({
      key: 'events',
      data: events,
      success: function(res){
        // success
        console.log('events init succeed')
      }
    })
  }
}

function createEvent(event,callback){
  event.id = uuidv1()
  event.status = 0

  wx.getStorage({
    key: 'events',
    success: function(res){
      var events = res.data;
      events.push(event);
      // success
      wx.setStorage({
        key: 'events',
        data: events,
        success: function(res){
          // success
        },
        fail: function(res) {
          // fail
        },
        complete:callback
      })
    },
    fail: function(res) {
      // fail
    },
    complete: function(res) {
      // complete
    }
  })
}

function getEventList(options,callback){

}

function updateEvent(id,updates,callback){

}

module.exports = {
  formatTime: formatTime,
  formatTimeNumber: formatNumber,
  dataInit:dataInit,
  createEvent:createEvent,
  getEventList:getEventList,
  updateEvent:updateEvent
}
