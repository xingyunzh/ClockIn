
var util = require('../../utils/util')
var network = require('../../utils/network')
var app = getApp()
var clockInDistance = 300;
Page({
  data: {
    markers: [],
    event: {},
    latitude: 0,
    longitude: 0,
    displayTime: '',
    status: 0,
    participation: {}
  },
  onShow: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          listHeight: res.windowHeight / res.windowWidth * 750 - 150 - 420 - 110
        });
      }
    });
  },
  refreshData: function (event) {
    var status = -1
    var tookPartIn = false
    for (var p of event.participations) {
      if (p.user._id == app.globalData.user._id) {
        tookPartIn = true
        this.setData({
          participation: p
        })
        break
      }
    }

    if (event.state == 'in-progress') {
      if (tookPartIn) {
        status = 1
      } else {
        status = 0
      }
    } else if (event.state == 'over') {
      if (tookPartIn) {
        if (this.data.participation.state == 'clocked-in') {
          status = 2
        } else if (this.data.participation.state == 'normal') {
          status = 3
        }
      } else {
        status = 4
      }
    }

    this.setData({
      event: event,
      displayTime: util.formatTime(event.theTime),
      markers: [{
        latitude: event.location.latitude,
        longitude: event.location.longitude
      }],
      status: status
    })

    if (event.state == 'in-progress') {
      this.showMyLocation()
    } else {
      this.setData({
        latitude: event.location.latitude,
        longitude: event.location.longitude
      })
    }
  },
  onLoad: function (options) {

    var that = this
    network.getEventById(options.id, function (err, event) {
      if (err) {
        console.log(err)
      } else {
        that.refreshData(event);
      }
    })
  },
  showMyLocation: function () {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },
  joinEvent: function () {
    var that = this
    console.log('join tapped')
    network.joinEvent(this.data.event._id, 1, function (err, event) {
      if (err) {
        console.log(err)
      } else {
        that.refreshData(event)
      }
    })
  },
  clockIn: function () {
    var that = this

    wx.getLocation({
      type: 'gcj02',
      success: function (res) {

        var distance = util.calculateDistance(res, that.data.event.location)

        if (clockInDistance > distance) {
          network.clockIn(that.data.event._id, function (err, event) {
            that.refreshData(event)
          })
        } else {
          wx.showToast({
            title: '你还没到呢！'
          })
        }
      }
    })
  }
})