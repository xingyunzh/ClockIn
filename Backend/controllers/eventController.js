var eventRepository= require('../repositories/eventRepository');
var userRepository = require('../repositories/userRepository');
var participationRepository =require('../repositories/participationRepository');
var util = require('../util/shared/util');
var q = require('q');

exports.createEvent = function(req,res){

	var userId = req.token.userId;

	var event = req.body;

	if(!util.checkParam(event,['checkType','theTime'])){
		res.send(util.wrapBody('Invalid Parameters'),'E');
		return;
	}

	event.creator = userId;
	event.state = 'inProgress';
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

exports.getRefund = function(req,res) {
	var userId = req.token.userId;
	var eventId = req.params.id;

	eventRepository.findById(eventId).then(function(event) {
		for (p of event.participations) {
			if (p.user._id == userId) {
				return userRepository.updateById(userId,{
					$inc:{
						credits:p.refund
					}
				});
				break;
			}
		}
	}).then(function(user){
		res.send(util.wrapBody({user:user}));
	}).catch(function(err){
		if (typeof err == String) {
			res.send(util.wrapBody(err,'E'));
		} else {
			console.log(err);
			res.send(util.wrapBody('Internal Error','E'));
		}
	});
}

exports.clockIn = function(req,res){
	var userId = req.token.userId;
	var eventId = req.params.id;
	var code = req.params.code;

	eventRepository.findById(eventId).then(function getEvent(event) {
		if (code != '1234') {
			res.send(util.wrapBody('Clock In Fail','E'));
		}else {
			for (p of event.participations) {
				if (p.user._id == userId) {
					return participationRepository.updateById(p._id,{
						state:'clockedIn'
					});
					break;
				}
			}
		}
	}).then(function() {
		return eventRepository.findById(eventId).then(reCaculateRefundForEvent);
	}).then(function(result){
		res.send(util.wrapBody({event:result}));
	}).catch(function(err){
		if (typeof err == String) {
			res.send(util.wrapBody(err,'E'));
		} else {
			console.log(err);
			res.send(util.wrapBody('Internal Error','E'));
		}
	});

}

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

	var deposit = req.body.deposit;

	var participation = {
		user:userId,
		state:'normal',
		deposit:deposit
	};

	eventRepository.findByid(eventId)
	.then(function checkEventState(event) {
		if (event.theTime < Date.now()) {
			res.send(util.wrapBody('Event Expiried','E'));
		}else {
			return participationRepository.create(participation);
		}
	}).then(function addParticipationToEvent(participation) {
		return eventRepository.updateById(eventId,{
			$push:{
				participations:participation._id
			}
		});
	})
	// .then(reCaculateRefundForEvent)
	.then(function(result){
		res.send(util.wrapBody({event:result}));
	}).catch(function(err){
		if (typeof err == String) {
			res.send(util.wrapBody(err,'E'));
		} else {
			console.log(err);
			res.send(util.wrapBody('Internal Error','E'));
		}
	});
};

var reCaculateRefundForEvent = function(event) {
	var promises = [];

	var losersDeposit = event.initialDeposit;
	var winnersDeposit = event.initialDeposit;

	for (p of event.participations) {
		if (p.state == 'normal') {
			losersDeposit = losersDeposit + p.deposit;
		}else if (p.state == 'clockedIn') {
			winnersDeposit = winnersDeposit + p.deposit;
		}
	}

	for (p of event.participations) {

		var promise = participationRepository.updateById(p._id,{
			refund:losersDeposit * p.deposit / winnersDeposit;
		});

		promises.push(promise);
	}

	return q.all(promises).then(function(){
		return eventRepository.findById(event._id);
	});
}

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
