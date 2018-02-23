var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = Schema({

	state:{
		type:String,
		default:'in_progress' //in_progress, cancelled, success, fail
	},

	condition:String,

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

	deposit:{
		type:Number,
		default:0
	},

	witnesses:[{
		type:Schema.Types.ObjectId,
		ref:'User'
	}],

	followers:[{
		type:Schema.Types.ObjectId,
		ref:'User'
	}],

	theTime:Date,

	longitude:Number,

	latitude:Number,

	checkType:String //'LBS','normal'
});

var Event = mongoose.model('Event', eventSchema);


module.exports = Event;
