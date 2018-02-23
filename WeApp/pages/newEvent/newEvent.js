var app = getApp()
var util = require('../../utils/util')
var network = require('../../utils/network')

Page({
  data: {
    description: "",
    location: null,
    markers: [],
    date: "2017-01-01",
    time: "00:00",
    shouldWarningTime: false,
    shouldWarningLocation: false,
    errMsg: '',
    shouldShowTopTips: false
  },
  onShow: function () {
    var date = new Date()
    var dateString = date.getFullYear() + "-" + util.formatTimeNumber(date.getMonth() + 1) + "-" + util.formatTimeNumber(date.getDate())

    var timeString = util.formatTimeNumber(date.getHours()) + ":" + util.formatTimeNumber(date.getMinutes())

    this.setData({
      date: dateString,
      time: timeString,
      credits: app.globalData.credits
    })
  },
  onLoad: function (options) {

  },
  submit: function () {
    if (!this.isTimeValid()) {
      this.setData({
        errMsg: "这个时刻已经过去了",
        shouldWarningTime: true
      })
      this.showTopTips()
      return
    }

    if (!this.isLocationValid()) {
      this.setData({
        errMsg: "请填写一个目的地",
        shouldWarningLocation: true
      })
      this.showTopTips()
      return
    }

    this.createEvent()
  },
  createEvent: function () {
    console.log('created');
    var newEvent = {
      deposit:1,
      description: this.data.description,
      location: this.data.location,
      time: this.data.date + " " + this.data.time,
    }

    network.createEvent(newEvent, function (err, event) {
      wx.redirectTo({
        url: '/pages/event/event?id=' + event._id,
      })
    });
  },
  showTopTips: function () {
    var that = this;
    this.setData({
      shouldShowTopTips: true
    });
    setTimeout(function () {
      that.setData({
        shouldShowTopTips: false
      });
    }, 3000);
  },
  isLocationValid: function (location) {
    return !!this.data.location
  },
  isTimeValid: function () {
    var theTime = new Date(this.data.date)
    theTime.setHours(parseInt(this.data.time.split(':')[0]))
    theTime.setMinutes(this.data.time.split(':')[1])
    console.log(theTime)
    return theTime > new Date()
  },
  editLocation: function (event) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          location: {
            name: res.name,
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          },
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude
          }],
          shouldWarningLocation: false
        })
      }
    })
  },
  dateInput: function (event) {
    console.log(event)
    this.setData({
      date: event.detail.value
    })
  },
  timeInput: function (event) {
    this.setData({
      time: event.detail.value
    })

    this.setData({
      shouldWarningTime: !this.isTimeValid()
    })
  },
  descriptionInput: function (event) {
    this.setData({
      description: event.detail.value
    })
  },
  depositInput: function (event) {
    var depositValue = event.detail.value
    var numberValue = parseInt(depositValue)

    this.setData({
      shouldWarningDeposit: numberValue > this.data.credits,
      deposit: numberValue
    })
  }
})