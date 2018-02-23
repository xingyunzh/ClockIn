var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var actionSchema = Schema({

  user:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
    index:true
  },

  state:String,//in_progress,success,fail,cancelled

	time:Date,

	type:String,//paid,gained,recharged

  amount:Number
});

var Action = mongoose.model("Action", actionSchema);

module.exports = Action;
