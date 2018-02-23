var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ledgerSchema = Schema({

	gained:{
		type:Number,
		default:0
	},

	recharged:{
		type:Number,
		default:0
	},

	paid:{
		type:Number,
		default:0
	},

	lost:{
		type:Number,
		default:0
	},

  actions:[{
		type:Schema.Types.ObjectId,
		ref:'Action'
	}],
});

var Ledger = mongoose.model("Ledger", ledgerSchema);

module.exports = Ledger;
