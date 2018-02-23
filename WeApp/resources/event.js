
let config = require("/etc/config.js")

var util = require('./util')


function clockIn(id, callback) {
  sendReq({
    method: 'GET',
    url: baseUrl + '/api/event/in/' + id,
    success: function (res) {
      callback(null, res.data.body.event);
    }
    , fail: function (err) {
      callback(err)
    }
  })
}

function joinEvent(id, deposit, callback) {
  sendReq({
    method: 'POST',
    url: baseUrl + '/api/event/join/' + id,
    data: {
      deposit: deposit
    }
    , success: function (res) {
      callback(null, res.data.body.event)
    }
    , fail: function (err) {
      callback(err)
    }
  })
}

function createEvent(event, callback) {
  sendReq({
    method: 'POST',
    url: baseUrl + '/api/event/add',
    data: event,
    success: function (res) {
      console.log(res)
      callback(null, res.data.body.event)
    }
    , fail: function (err) {
      callback(err)
    }
  })
}

function getEventById(id, callback) {
  sendReq({
    method: 'GET'
    , url: baseUrl + '/api/event/id/' + id
    , success: function (res) {
      console.log(res)
      callback(null, res.data.body.event)
    }
    , fail: function (err) {
      callback(err)
    }
  })
}

function getEvents(page, callback) {
  console.log('getting event list')
  sendReq({
    url: baseUrl + '/api/event/list?pageNum=' + page,
    success: function (res) {
      var events = res.data.body.events
      for (var e of events) {
        e.displayCreateDate = util.formatDisplayDate(e.createDate)
      }
      callback(null, events);
      console.log('event list:', res);
    },
    fail: function (err) {
      console.log('event list fail:', err);
      callback(err)
    }
  })
}

function getCredit(cache, next) {
  sendReq({
    url: baseUrl + '/api/user/profile',
    success: function (res) {
      cache(null, res.data.body.user, next)
      console.log('profile:', res);
    },
    fail: function (err) {
      console.log('profile fail:', res);
      cache(err, null, next)
    }
  })
}

module.exports = {
  getEventById: getEventById,
  clockIn: clockIn,
  joinEvent: joinEvent,
  getCredit: getCredit,
  getEvents: getEvents,
  createEvent: createEvent
}