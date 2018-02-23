// pages/list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  viewEvent: function (event) {
    var id = event.currentTarget.dataset.id

    wx.navigateTo({
      url: '/pages/event/event?id=' + id,
      success: function (res) {
        // success
      }
    })
  },

  loadMore: function () {
    console.log('load more')
    if (!this.data.isLoadingData) {
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
            isLoadingMore: false
          })
        } else {
          that.setData({
            events: that.data.events.concat(events),
            isLoadingMore: false
          })
        }
      })
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})