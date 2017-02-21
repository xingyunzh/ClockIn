var Event = require('../models/event');
var repositoryUtil = require('./repositoryUtil');

exports.deleteById = function(id){

	return Event
	.findByIdAndRemove(id)
	.exec();
};

exports.count = function(conditions){
	return Event.count(conditions).exec();
};

exports.findById = function(id){
	return Event.findById(id).populate('creator').lean().exec();
};

exports.update = function(conditions,data){

	return Event
	.findOneAndUpdate(conditions,data,{
		new:true
	})
	.populate('creator')
	.exec();
};

exports.create = function(data){
	return Event.create(data);
};


exports.query = function(options){

	var conditions = {};

	if ('creator' in options) {
		conditions.creator = options.creator;
	}

	return repositoryUtil.paging(Event,conditions,options,'creator');

};

