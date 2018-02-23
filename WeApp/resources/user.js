let network = require('../utils/network')
let config = require('../etc/config')

function decryptData(encryptedData, callback) {
  let options = {
    method: 'POST',
    url: config.baseUrl + '/user/decryptdata',
    data: encryptedData,
    callback: callback
  }
  network.sendReq(options, true);
}

function findById(id, callback) {
  let options = {
    method: 'GET',
    url: config.baseUrl + '/user?id=' + id,
    callback: callback
  }
  network.sendReq(options, true);
}

function bindingTel(userid, telNo, callback) {

  let options = {
    method: 'POST',
    url: config.baseUrl + '/user/update',
    data: {
      id: userid,
      tel: telNo
    },
    callback: callback
  }
  network.sendReq(options, true);
}


function login(callback) {
  console.log('login')
  wx.login({
    success: function (codeRes) {
      console.log(codeRes);
      wx.request({
        method: 'POST',
        url: config.baseUrl + '/user/login/weapp',
        data: {
          code: codeRes.code,
        },
        success: function (res) {
          console.log(res)
          if (res.data.body.shouldGetPrivateUserInfo) {
            var sessionId = res.data.body.sessionId;
            wx.getUserInfo({
              withCredentials: true,
              success: function (res) {
                console.log(res)
                register(sessionId, res, function (err, response) {
                  if (err) {
                    callback(err, null)
                  } else {
                    var token = response.header['set-token']
                    wx.setStorageSync('token', token)
                    callback(null, response.data.body.user)
                  }
                });
              },
              fail: function (err) {
                console.log(err)
                callback(err, null)
              }
            })
          } else {
            console.log('should not')
            var token = res.header['set-token']
            wx.setStorageSync('token', token)
            callback(null, res.data.body.user)
          }
        },
        fail: function (err) {
          console.log(err)
          callback(err, null)
        },
        header: {
          'content-type': 'application/json'
        }
      })
    }
  })
}

function register(sessionId, options, callback) {
  console.log(options)
  wx.request({
    method: 'POST',
    url: config.baseUrl + '/user/login/weapp/register',
    data: {
      sessionId: sessionId,
      encryptedData: options.encryptedData,
      iv: options.iv
    },
    success: (res) => {
      callback(null, res)
    },
    fail: (err) => {
      console.log(err)
      callback(err)
    },
    header: {
      'content-type': 'application/json'
    }
  })
}

module.exports = {
  login: login,
  bindingTel: bindingTel,
  // findById: findById,
  decryptData: decryptData
}