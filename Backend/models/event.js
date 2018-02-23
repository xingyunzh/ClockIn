var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = Schema({

	state:{
		type:String,
		default:'in_progress' //in_progress, cancelled, success, fail
	},

	condition:String,

	location:{},

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

	max:{
		type:Number,
		default:1
	}

	witnesses:[{
		type:Schema.Types.ObjectId,
		ref:'User'
	}],

	followers:[{
		type:Schema.Types.ObjectId,
		ref:'User'
	}],

	theTime:{
		type:Date,
		required:true
	},

	checkType:String //'LBS','normal'
});

var Event = mongoose.model('Event', eventSchema);


module.exports = Event;
