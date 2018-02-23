

exports.buildSearchRegExp = function(string){
	var alphabet = exports.alphabetize(string,{
		separator:'|'
	});

	var exp = "";

	if (alphabet.indexOf('|') == -1) {
		for(var i in alphabet){
			exp = exp + alphabet[i] + "[A-Za-z0-9\\|]*";
		}
	}else{
		exp = alphabet.replace('|','\\|');
	}

	return RegExp(exp,'i');
};


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
