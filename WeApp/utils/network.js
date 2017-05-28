
var baseUrl = 'http://localhost:8003';
var util = require('./util')


function clockIn(id,callback){
  sendReq({
    method:'GET',
    url:baseUrl + '/api/event/in/' + id,
    success:function(res){
      callback(null,res.data.body.event);
    }
    ,fail:function(err){
      callback(err)
    }
  })
}

function joinEvent(id,deposit,callback){
  sendReq({
    method:'POST',
    url:baseUrl + '/api/event/join/' + id,
    data:{
      deposit:deposit
    }
    ,success:function(res){
      callback(null,res.data.body.event)
    }
    ,fail:function(err){
      callback(err)
    }
  })
}

function createEvent(event,callback){
  sendReq({
    method:'POST',
    url:baseUrl + '/api/event/add',
    data:event,
    success:function(res){
      console.log(res)
      callback(null)
    }
    ,fail:function(err){
      callback(err)
    }
  })
}

function getEventById(id,callback){
  sendReq({
    method:'GET'
    ,url:baseUrl + '/api/event/id/' + id
    ,success:function(res){
      console.log(res)
      callback(null,res.data.body.event)
    }
    ,fail:function(err){
      callback(err)
    }
  })
}

function getEvents(page,callback){
  console.log('getting event list')
  sendReq({
    url: baseUrl + '/api/event/list?pageNum=' + page,
    success: function (res) {
      var events = res.data.body.events
      for(var e of events){
        e.displayCreateDate = util.formatDisplayDate(e.createDate)
      }
      callback(null,events);
      console.log('event list:', res);
    },
    fail: function (err) {
      console.log('event list fail:', err);
      callback(err)
    }
  })
}

function getCredit(cache,next){
  sendReq({
    url: baseUrl + '/api/user/profile',
    success: function (res) {
      cache(null,res.data.body.user,next)
      console.log('profile:', res);
    },
    fail: function (err) {
      console.log('profile fail:', res);
      cache(err,null,next)
    }
  })
}


function login(cache,next){
  console.log('login')
  wx.login({
    success: function (codeRes) {
      console.log(codeRes);
      wx.request({
        method:'POST',
        url: baseUrl + '/api/user/login/weapp',
        data: {
          code: codeRes.code,
        },
        success: function (res) {
          console.log(res)
          if (res.data.body.shouldGetPrivateUserInfo){
            var sessionId = res.data.body.sessionId;
            wx.getUserInfo({
              withCredentials:true,
              success:function(res){
                console.log(res)
                register(sessionId,res,function(err,response){
                  if(err){
                    cache(err,null,next)
                  }else{
                    var token = response.header['set-token']
                    wx.setStorageSync('token', token)
                    cache(null, response.data.body.user,next)
                  }
                });
              },
              fail:function(err){
                console.log(err)
                cache(err,null,next)
              }
            })
          }else{
            console.log('should not')
            var token = res.header['set-token']
            wx.setStorageSync('token', token)
            cache(null,res.data.body.user,next)
          }
        },
        fail: function (err) {
          console.log(err)
          cache(err,null,next)
        },
        header: {
          'content-type': 'application/json'
        }
      })
    }
  })
}

function register(sessionId,options,callback){
  console.log(options)
  wx.request({
    method:'POST',
    url: baseUrl + '/api/user/login/weapp/register',
    data:{
      sessionId:sessionId,
      encryptedData:options.encryptedData,
      iv:options.iv
    },
    success:function(res){
      callback(null,res)
    },
    fail: function (err) {
      console.log(err)
      callback(err)
    },
    header: {
      'content-type': 'application/json'
    }
  })
}

function sendReq(options,needToken){
  var nt = true
  if(needToken !== 'undefined' && needToken != null){
    nt = needToken
  }
  if(nt){
    wx.getStorage({
      key: 'token',
      success: function (res) {
        console.log('token', res)
        options.header = {
          'x-access-token': res.data
        },
        wx.request(options)
      },
      fail: function (err) {
        options.fail(err)
      }
    })
  }else{
    wx.request(options)
  }
}

module.exports = {
  getEventById:getEventById,
  login:login,
  clockIn: clockIn,
  joinEvent:joinEvent,
  getCredit:getCredit,
  getEvents:getEvents,
  createEvent:createEvent
}