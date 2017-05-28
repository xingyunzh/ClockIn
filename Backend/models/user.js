var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
	nickname:String,

	uid:String,

	headImgUrl:String,

	credits:{
		type:Number,
		default:206
	}
});

var User = mongoose.model("User", userSchema);

module.exports = User;
