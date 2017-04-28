//index.js
//获取应用实例
var util = require('../../utils/util')
var app = getApp()
Page({
  data: {
    user:{},
    credits:0,
    scrollTop : 0,
    scrollHeight:0,
    events:[]
  },
  onShow: function (){
    this.refresh()
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    util.dataInit();
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        user:userInfo
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
    wx.navigateTo({
      url: '/pages/newEvent/newEvent',
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  viewEvent:function(event){
    var id = event.currentTarget.dataset.id

    wx.navigateTo({
      url: '/pages/event/event?id=' + id,
      success: function(res){
        // success
      }
    })
  },
  scroll:function(){

  },

  refresh:function(){
    console.log('refresh')
    var that = this
    

    wx.getStorage({
      key: 'credits',
      success: function(res){
        that.setData({
          credits:res.data
        })

        app.setCredits(res.data,function(){
          wx.getStorage({
            key: 'events',
            success: function(res){
              // success
              that.setData({
                events:res.data
              })
            }
          })
        })
      }
    })
  },
  loadMore:function(){
    console.log('load more')
  }
})
