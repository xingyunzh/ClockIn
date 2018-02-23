//index.js
//获取应用实例
let util = require('../../utils/util')
let app = getApp()
Page({
  data: {
    user:{},
    userInfo:{},
    balance:0,
    scrollTop : 0,
    scrollHeight:0,
    events:[],
    currentPage:0,
    isLoadingData:true
  },

  onLoad: function () {
    app.auth((user) => {
      console.log(user)
      this.setData({
        user:user,
        balance:0
      })

    })
  },

  onShow: function () {
    var that = this
    //调用应用实例的方法获取全局数据

  },


  //事件处理函数
  goCreate: function(event){
    wx.navigateTo({
      url: '/pages/newEvent/index',
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
