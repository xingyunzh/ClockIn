var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
	name:String,

	uid:String,

	headImgUrl:String,

	credits:{
		type:Number,
		default:0
	}
});

var User = mongoose.model("User", userSchema);

module.exports = User;
