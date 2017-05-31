var uuidv1 = require('../lib/uuid/we-uuidv1')

function calculateDistance(loc1,loc2){

    var dis = 0;
    var radLat1 = toRad(loc1.latitude)
    var radLat2 = toRad(loc2.latitude)
    var deltaLat = radLat1 - radLat2 
    var deltaLng = toRad(loc1.longitude) - toRad(loc2.longitude)
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)))
    return dis * 6378137
}

function toRad(d) { return d * Math.PI / 180; }

function formatDisplayDate(date){
  if (typeof date == 'string'){
    date = new Date(date)
  }

  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

function formatTime(date) {
  if (typeof date == 'string') {
    date = new Date(date)
  }

  console.log(typeof date)

  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  //var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


module.exports = {
  formatDisplayDate: formatDisplayDate,
  formatTime: formatTime,
  formatTimeNumber: formatNumber,
  calculateDistance: calculateDistance
}
