var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = Schema({

	state:String, //preparing, finish, cancelled 

	description:String,

	creator:{
		type:Schema.Types.ObjectId,
		ref:'User',
		required:true,
		index:true
	},

	createDate:{
		type:Date,
		default:new Date()
	},

	startTime:Date,

	endTime:Date,

	longitude:String,

	latitude:String,

	checkInCode:String,

	checkType:String
	
});

var Event = mongoose.model('Event', eventSchema);


module.exports = Event;