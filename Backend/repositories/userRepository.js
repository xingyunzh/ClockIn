var User = require('../models/user.js');
var repositoryUtil = require('./repositoryUtil');

exports.findByUid = function(uid) {
	return User.findOne({uid:uid}).lean().exec();
};

exports.findById = function(id){
	return User.findById(id).lean().exec();
};

exports.create = function(data){
	data.alphabetName = repositoryUtil.alphabetize(data.nickname,{
		separator:'|'
	});

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
