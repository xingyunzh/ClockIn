//app.js
var network = require('./utils/network')
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // this.init()
  },
  init: function (callback) {
    if (!!this.globalData.user) {
      callback(null, this.globalData.user)
    } else {
      var that = this
      wx.checkSession({
        success: function () {
          wx.getStorageInfo({
            success: function (res) {
              console.log(res)
              if (res.keys.indexOf('token') > -1) {
                network.getCredit(that.cacheUser, callback)
              } else {
                network.login(that.cacheUser, callback)
              }
            },
          })
        },
        fail: function () {
          network.login(that.cacheUser, callback)
        }
      })
    }
  },
  cacheUser: function (err, user, callback) {
    if (err) {
      callback(err)
    } else {
      this.globalData.user = user
      callback(null, user)
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          console.log(res);
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        },
        fail: function (err) {
          console.log(err)
        }
      })

    }
  },
  globalData: {
    userInfo: null,
    user: null
  }
})