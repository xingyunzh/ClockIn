var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = Schema({

	state:{
		type:String,
		default:'normal' //normal, cancelled
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
		type:Schema.Types.ObjectId,
		ref:'Participation'
	}],

	initialDeposit:{
		type:Number,
		default:0
	},

	theTime:Date,

	longitude:Number,

	latitude:Number,

	checkInCode:String,

	checkType:String //'LBS','QR'
});

var Event = mongoose.model('Event', eventSchema);


module.exports = Event;
