var wechat = require('../authenticate/wechat/oauth');
var util = require('../util/util');
var q = require('q');
const config = require('../config');

exports.viaWeapp = function(code){
  console.log("inside via weapp:",code)
	var client = new wechat(config.appID,config.appsecret);

	var deferred = q.defer();

	client.getOpenIdByCode(code,function(err,session){
		if (err) {
      console.log('err',err);
			deferred.reject(err);
		}else{
			deferred.resolve(session);
		}
	});

	return deferred.promise;
};

exports.viaWechat = function(code) {

	var client = new wechat("wx5ce7696222e79ca5","f9b1976f789b15a56adc6775353cecab");

	var deferred = q.defer();

	client.getUserByCode(code,function(err,userInfo){

		if (err) {
			deferred.reject(err);
		}else{
			deferred.resolve(userInfo);
		}
	});

	return deferred.promise;
};
