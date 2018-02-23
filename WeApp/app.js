//app.js
let User = require('/resources/user')

App({
  onLaunch: function () {

  },

  onShow: (options) => {
    console.log(options)
  },
  
  auth: (callback) => {
    let cacheUser = (err, res) => {
      if (err) {
        console.log("login fail:", err);
        wx.showToast({
          title: '登录失败',
        })
        callback(null)
      } else {
        let user = res
        // Logger.addLog('login', 'userId:' + user.id)
        wx.setStorage({
          key: 'user',
          data: user,
          success: (res) => {
            console.log("store success:", res);
            console.log('user stored in auth')
            callback(user)
          },
          fail: (err) => {
            console.log("store fail:", err);
            wx.showToast({
              title: '登录失败',
            })
            callback(null)
          }
        })
      }
    }

    wx.checkSession({
      success: () => {
        wx.getStorageInfo({
          success: (res) => {
            // console.log(res)
            if (res.keys.indexOf('token') > -1 && res.keys.indexOf('user') > -1) {
              wx.getStorage({
                key: 'user',
                success: (res) => {
                  callback(res.data);
                },
                fail: () => {
                  wx.hideLoading()
                  wx.showLoading({
                    title: '正在登陆',
                  })
                  User.login(cacheUser)
                }
              })
            } else {
              User.login(cacheUser)
            }
          },
        })
      },
      fail: () => {
        User.login(cacheUser)
      }
    })
  },


})