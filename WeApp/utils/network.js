
function sendReq(options, needToken) {
  options.success = (res) => {
    if (res.data.status == "S") {
      console.log(res.header)
      getApp().activityOn = !!res.header.activityOn
      options.callback(null, res.data.body)
    } else {
      options.callback(res.data.body)
    }
  }

  options.fail = (err) => {
    console.log(err)
    options.callback(err)
  }

  console.log('sending request')
  var nt = true
  if (!!needToken) {
    nt = needToken
  }
  if (nt) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        // console.log('token', res)
        options.header = {
          'content-type': 'application/json',
          'x-access-token': res.data
        },
          wx.request(options)
      },
      fail: function (err) {
        options.fail(err)
      }
    })
  } else {
    wx.request(options)
  }
}

module.exports = {
  sendReq: sendReq
}