var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = Schema({

  user:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
    index:true
  },

  state:String,//in_progress,success,fail,cancelled

	time:Date
});

var Log = mongoose.model("Log", logSchema);

module.exports = Log;
