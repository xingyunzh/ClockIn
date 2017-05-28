var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var participationSchema = Schema({

	user:{
		type:Schema.Types.ObjectId,
		ref:'User'
	},

	// event:{
	// 	type:Schema.Types.ObjectId,
	// 	ref:'Event'
	// },

	state:String,//normal, clockedIn

	deposit:Number,

	refund:{
		type:Number,
		default:0
	}
});

var User = mongoose.model("Participation", participationSchema);

module.exports = User;
