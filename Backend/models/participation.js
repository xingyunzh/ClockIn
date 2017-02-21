var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var participationSchema = Schema({
	
	user:{
		type:Schema.Types.ObjectId,
		ref:'User'
	},

	event:{
		type:Schema.Types.ObjectId,
		ref:'Event'
	},

	state:String,//normal, clockedIn
});

var User = mongoose.model("User", userSchema);

module.exports = User;