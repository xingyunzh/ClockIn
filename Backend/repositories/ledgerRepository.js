var Ledger = require('../models/ledger.js');
var repositoryUtil = require('./repositoryUtil');


exports.create = function(){
	return Ledger.create({});
};


exports.query = function(options){


	var conditions = {};

	return repositoryUtil.paging(User,conditions,options,'');

};
