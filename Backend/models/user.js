var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
	nickname:String,

	openid:String,

	headImgUrl:String,

	tel:String,

	ledger:{
		type:Schema.Types.ObjectId,
		ref:'Ledger'
	}
});

var User = mongoose.model("User", userSchema);

module.exports = User;
