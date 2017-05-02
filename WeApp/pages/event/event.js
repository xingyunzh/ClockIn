
var util = require('../../utils/util')
var app = getApp()
Page({
    data:{
        markers:[],
        event:{},
        latitude:0,
        longitude:0
    },
    onLoad:function(options){
        var that = this
        util.getEventById(options.id,function(event){
            that.setData({
                event:event
            })

            if(event.status == 0){
                that.showMyLocation()
            }else{
                that.setData({
                    markers:[{
                        latitude:event.latitude,
                        longitude:event.longitude
                    }],
                    latitude:event.latitude,
                    longitude:event.longitude
              })
            }
        })
        
    },
    showMyLocation:function(){
        var that = this
        wx.getLocation({
          type: 'gcj02', 
          success: function(res){
              that.setData({
                  latitude:res.latitude,
                  longitude:res.longitude
              })
          }
        })
    },
    clockin:function(){
        var that = this
    
        wx.getLocation({
          type: 'gcj02', 
          success: function(res){
              util.updateEvent(that.data.event.id,{
                  status:1,
                  latitude:res.latitude,
                  longitude:res.longitude
              },function(){
                  app.setCredits(app.globalData.credits + 2 * that.data.event.deposit,function(){
                      wx.navigateBack()
                  })
                  
              })
          }
        })
    },
    fail:function(){
        var that = this
        wx.getLocation({
          type: 'gcj02', 
          success: function(res){
              util.updateEvent(that.data.event.id,{
                  status:2,
                  latitude:res.latitude,
                  longitude:res.longitude
              },function(){
                  wx.navigateBack()
              })
          }
        })
    }
})