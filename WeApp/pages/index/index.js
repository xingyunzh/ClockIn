//index.js
//获取应用实例
let User = require('../../resources/user.js')
let app = getApp()
Page({
  data: {
    user:{},
    balance:0,
    scrollTop : 0,
    scrollHeight:0,
    events:[],
    currentPage:0,
    isLoadingData:true
  },

  onLoad: function () {
    app.auth((user) => {
      this.handleUserData(user)
    })
  },

  onShow: function () {
    var that = this
    //调用应用实例的方法获取全局数据

  },

  onPullDownRefresh:function(){
    User.getUserById(this.data.user.id,function(err,user){
      if(err){
        console.log(err)
      }else{
        this.handleUserData(user)
      }
    })
  },

  handleUserData:function(user){
    let ledger = user.ledger
    this.setData({
      user: user,
      balance: ledger.gained + ledger.paid - ledger.recharged - ledger.lost
    })
  },

  //事件处理函数
  goCreate: function(event){
    wx.navigateTo({
      url: '/pages/create/index',
      success: function(res){
        // success
      }
    })
  }

})
