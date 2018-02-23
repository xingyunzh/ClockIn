var jwt = require('jsonwebtoken');
var q = require('q');
var config = require('../config')

var secret = null;

function getSecret(){
	return "xingyunzh-clockin-secret"
}

module.exports.verify = function(tokenString){
	var deferred = q.defer();

	jwt.verify(tokenString,getSecret(),function(err,tokenObject){
		if (err) {
			deferred.reject(err);
		}else{
			deferred.resolve(tokenObject);
		}
	});

	return deferred.promise;
};

module.exports.create = function(userId){
	return generate(userId);
};

function generate(id){
	var deferred = q.defer();
	console.log('secret',getSecret())
	jwt.sign({
		userId:id
	},getSecret(),{
		expiresIn:60 * 60 * 24 * 30
	},function(err,token){
		if (err) {
			deferred.reject(err);
		}else{
			deferred.resolve(token);
		}
	});

	return deferred.promise;
}

module.exports.authenticate = function(req, res, next) {

	var tokenString = req.get('x-access-token');

	if (!tokenString) {
		res.json({status:'E', body:'Invalid Token'})
	}else{
		exports.verify(tokenString).then(function(tokenObject){
			req.token = tokenObject;

			if (tokenObject.exp - Math.floor(Date.now() / 1000) < 6 * 24 * 60 * 60) {
				generate(tokenObject.userId).then(function(newTokenString){
					res.setHeader('set-token',newTokenString);
					next();
				}).fail(function(err){
					console.log(err);
					res.json({status:'E', body:'Invalid Token'})
				});
			}else{
				next();
			}
		}).fail(function(err){
			console.log(err);
			res.json({status:'E', body:'Invalid Token'})
		});
	}
};
