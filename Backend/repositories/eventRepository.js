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
	return Event.findById(id).populate({
		path:'creator participations',
		populate:{
			path:'user'
		}
	}).lean().exec();
};

exports.update = function(conditions,data){

	return Event
	.findOneAndUpdate(conditions,data,{
		new:true
	})
	.populate({
		path:'creator participations',
		populate:{
			path:'user'
		}
	})
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

	if ('participations' in options) {
		conditions.participants = options.participants;
	}

	return repositoryUtil.paging(Event,conditions,options,{
		path:'creator participations',
		populate:{
			path:'user'
		}
	});

};
