// pages/create/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noDeposit:false,
    date:null,
    time:null,
    start:null,
    eventType:'LBS',
    max:1,
    deposit:1,
    location:{
      name:'点击定位'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initFormData()
  },

  initFormData:function(){
    let today = new Date()
    this.setData({
      date: today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate(),
      start: today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(),
      time: today.getHours() + ":" + today.getMinutes()
    })
  },

  dateChange:function(event){
    this.setData({
      date: event.detail.value.replace(new RegExp('-', 'g'),'/')
    })
  },

  timeChange:function(event){
    this.setData({
      time: event.detail.value
    })
  },

  maxChange:function(event){
    this.setData({
      max: event.detail.value
    })
  },

  amountChange:function(event){
    this.setData({
      deposit: event.detail.value
    })
  },

  changeTypeNormal:function(){
    this.setData({
      eventType:'normal'
    })
  },

  changeTypeLBS: function () {
    this.setData({
      eventType: 'LBS'
    })
  },

  locate:function(){
    wx.chooseLocation({
      success: (res)=> {
        console.log(res)
        let location = {
          latitude: res.latitude,
          longitude: res.longitude,
          address:res.address,
          name:res.name
        }
        this.setData({
          location:location
        })
      },fail:function(res){
        console.log('fail',res)
        if(res.errMsg.indexOf('auth deny') > -1){
          wx.showModal({
            title: '未授权',
            content: '用户未授权，现在授权？',
            success: function (res) {
              console.log('modal success',res)
              if(!!res.confirm){
                wx.openSetting({})
              }
              
            },fail:function(res){
              console.log('modal fail', res)
            }
          })
        }
      }
    })

  },

  redPacketSwitch:function(){
    this.setData({
      noDeposit:!this.data.noDeposit
    })
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