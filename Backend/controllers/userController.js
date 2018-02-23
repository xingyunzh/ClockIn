var uuidv1 = require('uuid/v1')
var util = require('../util/util');
var http = require('http');
var crypto = require('crypto');
const authenticator = require('../authenticate/authenticator');
const WXBizDataCrypt = require('../util/WXBizDataCrypt');
const userRepository = require('../repositories/userRepository');
const ledgerRepository = require('../repositories/ledgerRepository');
const wechatLoginAdapter = require('./wechatLoginAdapter');
const config = require('../config');

var q = require('q');

exports.loginByWeApp = function(req,res){
  // console.log("inside login by weapp")
	if (!util.checkParam(req.body,['code'])) {
		res.send(util.wrapBody('Invalid Parameter','E'));
	}else{

		var uid = uuidv1();
    // console.log("have code",req.body)
    // console.log(wechatLoginAdapter.viaWeapp)
		wechatLoginAdapter
		.viaWeapp(req.body.code)
		.then(function(session){
      console.log("session:",session)
			return userRepository.findByOpenid(session.openid)
      .then(function(user){
				if(!!user){
          console.log('user',user);
					sessionKeyCache[user.id] = session;
					authenticator.create(user._id)
					.then(function sendResponse(token){
						res.setHeader('set-token',token);

						var responseBody = {
							token:token,
							user:user
						};

						res.send(util.wrapBody(responseBody));
					})
				}else{
					sessionKeyCache[uid] = session;
					res.send(util.wrapBody({
						shouldGetPrivateUserInfo:true,
						sessionId:uid
					}))
				}
			});
		}).catch(function(err){
      console.log(err);
      res.send(util.wrapBody('Internal Error','E'));
    });
	}
};

//TODO use redis to instead
var sessionKeyCache = {}

function decryptData(encryptedData,iv,sessionKey){
	var pc = new WXBizDataCrypt(config.appID, sessionKey);
	var data = pc.decryptData(encryptedData,iv);
	return data;
}

exports.decryptData = function(req,res){
	console.log('inside decrypt data',req.body)
	if(!util.checkParam(req.body,['userId','encryptedData','iv'])){
		res.send(util.wrapBody('Invalid Parameter','E'));
	}else{
		var session = sessionKeyCache[req.body.userId]
		console.log(session)
		if('undefined' === typeof session){
			res.send(util.wrapBody('Invalid Parameter','E'));
		}else{
			var data = decryptData(req.body.encryptedData,req.body.iv,session.session_key)

			res.send(util.wrapBody(data))
		}
	}
}

exports.registerUserByWeApp = function(req,res){

	if(!util.checkParam(req.body,['sessionId','encryptedData','iv'])){
		res.send(util.wrapBody('Invalid Parameter','E'));
	}else{
		var session = sessionKeyCache[req.body.sessionId];
		if('undefined' === typeof session){
			res.send(util.wrapBody('Invalid Parameter','E'));
		}else{
			var u;
			var data = decryptData(req.body.encryptedData,req.body.iv,session.session_key)
      console.log("decrypted data:",data);
			if(!data.openId){
        res.send(util.wrapBody('Decrypt fail','E'));
			}else{
        ledgerRepository.create()
        .then(function(ledger){
          console.log('ledger',ledger);
          var newUser = {
            nickname:data.nickName,
            openid:session.openid,
            headImgUrl:data.avatarUrl,
            ledger:ledger
          }
          return userRepository.create(newUser)
        }).then(function(user){
          return userRepository.findById(user.id)
        }).then(function createToken(user){
				   u = user;
					 sessionKeyCache[user.id] = session;
					 // delete session
				   return authenticator.create(user.id);
			  }).then(function sendResponse(token){

          res.setHeader('set-token',token);

  				var responseBody = {
  					token:token,
  					user:u
  				};

  				res.send(util.wrapBody(responseBody));
  			}).catch(function(err){
  				console.log(err);
  				res.send(util.wrapBody('Internal Error','E'));
  			});
      }
		}
	}
}

exports.update = function(req,res){
  if(!util.checkParam(req.body,['id','updates'])){
		res.send(util.wrapBody('Invalid Parameter','E'));
	}else{
    let id = req.body.id;
    let updates = req.body.updates;
    userRepository.updateById(id,updates).then(function(user){
      res.send(util.wrapBody({user:user}));
    }).catch(function(err){
      console.log(err)
      res.send(util.wrapBody('Internal Error','E'));
    })
  }

}

exports.getUserById = function(req,res){
  let id = req.params.id;
  userRepository.findById(id).then(function(user){
    res.send(util.wrapBody({user:user}));
  }).catch(function(err){
    console.log(err)
    res.send(util.wrapBody('Internal Error','E'));
  })
}
