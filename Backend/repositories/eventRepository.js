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
	return Event.findById(id).populate('creator participations.user').lean().exec();
};

exports.updateById = function(id,data){
	return Event.findByIdAndUpdate(id,data,{
		new:true
	})
	.populate('creator participations.user')
	.lean()
	.exec();
}

exports.update = function(conditions,data){

	return Event
	.findOneAndUpdate(conditions,data,{
		new:true
	})
	.populate('creator participations.user')
	.lean()
	.exec();
};

exports.create = function(data){
	return Event.create(data);
};


exports.query = function(options){

	var conditions = {};

	if('related' in options){
		conditions.$or = [{
			creator:options.related
		},{
			'participations.user':options.related
		}]

	}

	if ('creator' in options) {
		conditions.creator = options.creator;
	}

	return repositoryUtil.paging(Event,conditions,options,'creator participations.user');

};
