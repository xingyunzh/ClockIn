var eventRepository= require('../repositories/eventRepository');
var participationRepository =require('../repositories/participationRepository');
var util = require('../util/util');
var q = require('q');

exports.createEvent = function(req,res){

	var userId = req.token.userId;

	var event = req.body;

	event.creator = userId;
	event.state = 'normal';
	event.code = '1234';

	eventRepository.create(event).then(function(result){
		return eventRepostory.findById(result._id);
	}).then(function(newIdea){
		res.send(util.wrapBody({event:newIdea}));
	}).catch(function(err){
		console.log(err);
		res.send(util.wrapBody('Internal Error','E'));
	});

};

exports.cancelEvent = function(req,res){
	var userId = req.token.userId;
	var eventId = req.params.id;

	var data = {
		state:'cancelled'
	};

	eventRepository.update({
		_id:eventId,
		creator:userId
	},data).then(function(result){
		if (!result) {
			console.log('Invalid creator');
			res.send(util.wrapBody('Invalid creator','E'));
		}else{
			res.send(util.wrapBody({event:result}));
		}

	}).catch(function(err){
		console.log(err);
		res.send(util.wrapBody('Internal Error','E'));
		
	});
};

exports.joinEvent = function(req,res){
	var userId = req.token.userId;
	var eventId = req.params.id;

	var participation = {
		user:userId,
		event:eventId,
		state:'normal'
	};

	participationRepository.create(participation).then(function(result){
		res.send(util.wrapBody({success:true}));
	}).catch(function(err){
		if (typeof err == String) {
			res.send(util.wrapBody(err,'E'));
		} else {
			console.log(err);
			res.send(util.wrapBody('Internal Error','E'));
		}
	});
};

exports.updateEvent = function(req,res){

	var userId = req.token.userId;
	var eventId = req.params.id;

	var event = req.body;

	if ('_id' in event) delete event._id;
	if ('state' in event) delete event.state;

	eventRepository.update({
		_id:eventId,
		creator:userId
	},event).then(function(result){
		if (!result) {
			console.log('Invalid creator');
			res.send(util.wrapBody('Invalid innovator','E'));
		}else{
			res.send(util.wrapBody({event:result}));
		}

	}).catch(function(err){
		console.log(err);
		res.send(util.wrapBody('Internal Error','E'));
		
	});
};

exports.listEventsByUser = function(req,res){

	var userId = req.token.userId;

	var conditions = req.body;
	conditions.user = req.token.userId;
	conditions.sort = 'createDate';
	conditions.pageSize = 100;

	participationRepository.query(conditions).then(function(result){
		res.send(util.wrapBody({
			total:result.total,
			events:result.list
		}));
	}).catch(function(err){
		if (typeof err == String) {
			res.send(util.wrapBody(err,'E'));
		} else {
			console.log(err);
			res.send(util.wrapBody('Internal Error','E'));
		}
	});

};

exports.getEventById = function(req,res){
	var eventId = req.params.id;

	var event = {};

	eventRepostory.findById(eventId).then(function(result){
		event = result;

		var conditions = {
			event:result._id,
			pageSize:100
		};

		return participationRepository.query(conditions);
	}).then(function(result){
		event.participants = result;
		res.send(util.wrapBody({event:event}));
		
	}).catch(function(err){
		if (typeof err == String) {
			res.send(util.wrapBody(err,'E'));
		} else {
			console.log(err);
			res.send(util.wrapBody('Internal Error','E'));
		}
	});
};
