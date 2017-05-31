var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = Schema({

	state:{
		type:String,
		default:'in-progress' //normal, cancelled
	},

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

	participations:[{
		user:{
			type:Schema.Types.ObjectId,
			ref:'User'
		},

		state:String,//normal, clockedIn

		deposit:Number,

		refund:{
			type:Number,
			default:0
		}
	}],

	initialDeposit:{
		type:Number,
		default:0
	},

	theTime:Date,

	location:{
		address:String,
		name:String,
		longitude:Number,
		latitude:Number,
	}

	// checkInCode:String,

	// checkType:String //'LBS','QR'
});

var Event = mongoose.model('Event', eventSchema);


module.exports = Event;
