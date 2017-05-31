var eventRepository= require('../repositories/eventRepository');
var userRepository = require('../repositories/userRepository');
var util = require('../util/util');
var q = require('q');

exports.createEvent = function(req,res){

	var userId = req.token.userId;

	if(!util.checkParam(req.body,['location','time'])){
		res.send(util.wrapBody('Invalid Parameters'),'E');

	}else{
		var event = {
			description:req.body.description,
			location:req.body.location,
			theTime:req.body.time,
			creator : userId
		}

		eventRepository.create(event).then(function(result){
			return eventRepository.findById(result._id);
		}).then(function(newIdea){
			res.send(util.wrapBody({event:newIdea}));
		}).catch(function(err){
			console.log(err);
			res.send(util.wrapBody('Internal Error','E'));
		});
	}
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

		throw new Exception();
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

	eventRepository.findById(eventId).then(function getEvent(event) {
		for (p of event.participations) {
			if (p.user._id == userId) {
				p.state = 'clocked-in';
				return eventRepository.updateById(eventId,{
					participations:event.participations
				});
				break;
			}
		}
	}).then(reCaculateRefundForEvent)
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

	eventRepository.findById(eventId)
	.then(function checkEventState(event) {
		if (event.theTime < new Date()) {
			res.send(util.wrapBody('Event Expiried','E'));
		}else {

			return userRepository.updateById(userId,{
				$inc:{
					credits: -deposit
				}
			}).then(function() {
				return eventRepository.updateById(eventId,{
					$push:{
						participations:participation
					}
				})
			})
			// .then(reCaculateRefundForEvent)
			.then(function(result){
				res.send(util.wrapBody({event:result}));
			})
		}

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

	var depositForRefund = event.initialDeposit;
	var winnersDeposit = 0;

	for (p of event.participations) {
		if (p.state == 'normal') {
			depositForRefund = depositForRefund + p.deposit;
		}else if (p.state == 'clocked-in') {
			winnersDeposit = winnersDeposit + p.deposit;
		}
	}

	if(winnersDeposit == 0){
		return eventRepository.findById(event._id);
	}else{
		for (p of event.participations) {

			if (p.state == 'normal') {
				p.refund = 0;

			}else if (p.state == 'clocked-in') {
				p.refund = depositForRefund * p.deposit / winnersDeposit

			}
		}

		return eventRepository.update(event._id,{
			participations:event.participations
		})
	}

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
	var pageNum = req.query.pageNum;

	var conditions = {
		related : req.token.userId,
		sort : '-createDate',
		pageSize : 10,
		pageNum : pageNum
	}


	eventRepository.query(conditions).then(function(result){
		return checkEvents(result.list).then(function(){
			res.send(util.wrapBody({
				total:result.total,
				events:result.list
			}));
		});

	}).catch(function(err){
		if (typeof err == String) {
			res.send(util.wrapBody(err,'E'));
		} else {
			console.log(err);
			res.send(util.wrapBody('Internal Error','E'));
		}
	});
};

function checkEvents(events){
	var changedCount = 0;
	var promises = [];

	for (var event of events) {

		if(event.state == 'in-progress' && event.theTime <= new Date()){
			event.state = 'over'
			promises.push(eventRepository.updateById(event._id,event));
		}
	}

	return q.all(promises);
}


exports.getEventById = function(req,res){
	var eventId = req.params.id;

	var event = {};

	eventRepository.findById(eventId).then(function(event){

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
