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
	return Participation.findById(id).populate('creator').lean().exec();
};

exports.update = function(conditions,data){

	return Participation
	.findOneAndUpdate(conditions,data,{
		new:true
	})
	.populate('creator')
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

	if ('event' in options) {
		conditions.event = options.event;
	}


	return repositoryUtil.paging(Participation,conditions,options,'user event');

};

