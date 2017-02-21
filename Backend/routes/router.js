var assetAPI = require('./assetAPI');
var userAPI = require('./userAPI');
var taskAPI = require('./taskAPI');
var ideaAPI = require('./ideaAPI');
var teamAPI = require('./teamAPI');
var imageAPI = require('./imageAPI');
var projectAPI = require('./projectAPI');
var sprintAPI = require('./sprintAPI');
var userStoryAPI = require('./userStoryAPI');

var rootRouter = require("express").Router();
var messageRouter = require("./messageRouter");
var systemConfigRouter = require("./systemConfigRouter");

module.exports = function(app, contextRoot) {
    app.use(contextRoot, rootRouter);

    //Please make any business router under the rootRouter, so that it will be easy for contextRoot config.

    rootRouter.use('/message', messageRouter);

    rootRouter.use('/system', systemConfigRouter);
    
    //rootRouter.use('/api',authenticator.authenticate);

    rootRouter.use('/api/asset',assetAPI);

	rootRouter.use('/api/user',userAPI);

	rootRouter.use('/api/idea',ideaAPI);

	rootRouter.use('/api/team',teamAPI);

	rootRouter.use('/api/project',projectAPI);

    rootRouter.use('/api/story',userStoryAPI);

    rootRouter.use('/api/task',taskAPI);

    rootRouter.use('/api/sprint',sprintAPI);

    rootRouter.use('/api/image',imageAPI);

};
