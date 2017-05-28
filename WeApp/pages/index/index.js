//index.js
//获取应用实例
var util = require('../../utils/util')
var network = require('../../utils/network')
var app = getApp()
Page({
  data: {
    user:{},
    userInfo:{},
    scrollTop : 0,
    scrollHeight:0,
    events:[],
    currentPage:0,
    isLoadingData:true
  },
  onShow: function (){
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      console.log(userInfo)
      that.setData({
        userInfo: userInfo
      })
    })

    this.init(function () {
      network.getEvents(0, function (err, events) {
        if (err) {
          console.log(err)
        } else {
          that.setData({
            events: events,
            currentPage: 0
          })
        }
      })
    })
  },
  onLoad: function () {
    console.log('onLoad')
    
  },
  cacheUser:function(err,user,callback){
    if (err) {
      callback(err)
    } else {
      app.globalData.user = user
      this.setData({
        user:user
      })
      console.log(app.globalData)
      callback(null)
    }
  },
  init:function(callback){
    var that  = this
    wx.checkSession({
      success:function(){
        wx.getStorageInfo({
          success: function(res) {
            console.log(res)
            if(res.keys.indexOf('token') > -1){
              network.getCredit(that.cacheUser,callback)
            }else{
              network.login(that.cacheUser,callback)
            }
          },
        })
      },
      fail:function(){
        network.login(that.cacheUser,callback)
      }
    })
  },
  //事件处理函数
  createEvent: function(event){
    wx.navigateTo({
      url: '/pages/newEvent/newEvent',
      success: function(res){
        // success
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
  loadMore:function(){
    console.log('load more')
    if(!this.data.isLoadingData){
      var that = this
      this.setData({
        currentPage: this.data.currentPage + 1,
        isLoadingMore: true
      })
      network.getEvents(this.data.currentPage, function (err, events) {
        if (events.length == 0) {
          console.log('no more')
          that.setData({
            currentPage: this.data.currentPage - 1,
            isLoadingMore:false
          })
        } else {
          that.setData({
            events: that.data.events.concat(events),
            isLoadingMore: false
          })
        }
      })
    }
    
  }
})
