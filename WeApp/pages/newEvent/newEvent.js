var app = getApp()
var util = require('../../utils/util')

Page({
    data:{
        location:"",
        date:"2017-01-01",
        time:"00:00",
        deposit:0,
        credits:0,
        shouldWarningDeposit:false,
        shouldWarningTime:false,
        shouldWarningLocation:false,
        errMsg:'',
        shouldShowTopTips:false
    },
    onShow:function(){
        var date = new Date()
        var dateString = date.getFullYear() + "-" + util.formatTimeNumber(date.getMonth() + 1) + "-" + util.formatTimeNumber(date.getDate())

        var timeString = util.formatTimeNumber(date.getHours()) + ":" + util.formatTimeNumber(date.getMinutes())

        this.setData({
            date:dateString,
            time:timeString,
            credits:app.globalData.credits
        })
    },
    onLoad:function(options){
        
    },
    submit:function(){
        if(!this.isTimeValid()){
            this.setData({
                errMsg:"这个时刻已经过去了",
                shouldWarningTime:true
            })
            this.showTopTips()
            return
        }

        if(!this.isLocationValid()){
            this.setData({
                errMsg:"请填写一个目的地",
                shouldWarningLocation:true
            })
            this.showTopTips()
            return
        }

        this.createEvent()
    },
    createEvent:function(){
        console.log('created');
        var event = {
            location:this.data.location,
            time:this.data.date + " " + this.data.time,
            description:this.data.description,
            deposit:this.data.deposit
        }
        util.createEvent(event,function(){
            wx.navigateBack()
        })
    },
    showTopTips: function(){
        var that = this;
        this.setData({
            shouldShowTopTips: true
        });
        setTimeout(function(){
            that.setData({
                shouldShowTopTips: false
            });
        }, 3000);
    },
    isLocationValid:function(location){
        if(location !== undefined){
            return location.length > 0
        }else{
            return this.data.location.length > 0
        }
    },
    isTimeValid:function(){
        var theTime = new Date(this.data.date)
        theTime.setHours(parseInt(this.data.time.split(':')[0]))
        theTime.setMinutes(this.data.time.split(':')[1])
        console.log(theTime)
        return theTime > new Date()
    },
    locationInput:function(event){
        this.setData({
            location:event.detail.value,
            shouldWarningLocation:!this.isLocationValid(event.detail.value)
        })
    },
    dateInput:function(event){
        console.log(event)
        this.setData({
            date:event.detail.value
        })
    },
    timeInput:function(event){
        this.setData({
            time:event.detail.value
        })

        this.setData({
            shouldWarningTime:!this.isTimeValid()
        })
    },
    descriptionInput:function(event){
        this.setData({
            description:event.detail.value
        })
    },
    depositInput:function(event){
        var depositValue = event.detail.value
        var numberValue = parseInt(depositValue)

        this.setData({
            shouldWarningDeposit:numberValue > this.data.credits,
            deposit:numberValue
        })
    }
})