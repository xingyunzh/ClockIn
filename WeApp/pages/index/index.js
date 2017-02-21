//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    scrollTop : 0,
    scrollHeight:0,
    events:[{
      description:'a'
    },{
      description:'a'
    },{
      description:'a'
    },{
      description:'a'
    }]
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })

    wx.getSystemInfo({
      success:function(res){
        console.info(res.windowHeight);
        that.setData({
          scrollHeight:res.windowHeight * 0.6
        });
      }
    });
  },
  //事件处理函数
  createEvent: function(event){
    wx.showToast({
      title:'test'
    })
  },
  scroll:function(){

  },
  refresh:function(){

  },
  getMore:function(){

  }
})
