var User = require('../models/user.js');
var repositoryUtil = require('./repositoryUtil');

exports.findByOpenid = function(openid) {
	return User.findOne({openid:openid}).populate('ledger').lean().exec();
};

exports.findById = function(id){
	return User.findById(id).populate('ledger').lean().exec();
};

exports.create = function(data){
	return User.create(data);
};

exports.updateById = function(id,data){

	return User.findByIdAndUpdate(id,data,{
		new:true,
		upsert:false
	}).exec();
};

exports.query = function(options){


	var conditions = {};

	return repositoryUtil.paging(User,conditions,options,'');

};
