var Participation = require('../models/participation');
var repositoryUtil = require('./repositoryUtil');

exports.deleteById = function(id){

	return Participation
	.findByIdAndRemove(id)
	.exec();
};

exports.count = function(conditions){
	return Participation.count(conditions).exec();
};

exports.findById = function(id){
	return Participation.findById(id).populate('user').lean().exec();
};

exports.update = function(conditions,data){

	return Participation
	.findOneAndUpdate(conditions,data,{
		new:true
	})
	.populate('user')
	.exec();
};

exports.updateById = function(id,data){

	return Participation
	.findByIdAndUpdate(id,data,{
		new:true
	})
	.populate('user')
	.exec();
};

exports.create = function(data){
	return Participation.create(data);
};


exports.query = function(options){

	var conditions = {};

	if ('user' in options) {
		conditions.user = options.user;
	}

	return repositoryUtil.paging(Participation,conditions,options,'user');

};
