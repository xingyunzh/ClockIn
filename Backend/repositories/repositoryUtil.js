var CamproError = require('../models/CamproError');

exports.paging = function(model,conditions,options,population) {
	var totalCount = null;

	return model.count(conditions).then(function(result){
		totalCount = result;

		var pageNum = 0;
		var pageSize = 10;

		if ('pageNum' in options) {
			pageNum = options.pageNum;
		}

		if ('pageSize' in options) {
			pageSize = options.pageSize;
		}

		var skipped = pageNum * pageSize;

		if (totalCount > 0 && skipped >= totalCount) {
			throw new CamproError('Invalid Parameter: pageNum=' + pageNum);
		}

		if (!('sort' in options)) {
			options.sort = '';
		}

		return model
			.find(conditions)
			.sort(options.sort)
			.skip(skipped)
			.limit(pageSize)
			.populate(population)
			.lean()
			.exec();

	}).then(function(result){
		return {
			total:totalCount,list:result
		};
	});
};
