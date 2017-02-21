var ideaController = require('../controllers/ideaController');
var authenticator = require('../authenticate/authenticator');
var router = require('express').Router();


//body parameters
//	required:
// 		name:String
//	optional:
//		background:String
//		solution:String
//		painpoint:String
//		innovator:id (User)
//		consultant:id (User)
//		sector:String
//		deadline:Date
//		hrRequirement:String
//		relatedAssets:[id] (Asset)
//response:
//{idea:IdeaEntity}
router.post('/add',authenticator.authenticate,ideaController.createIdea);

//path parameters
//	required:
//		id:String (idea)
//response:
//{idea:IdeaEntity}
router.get('/id/:id',ideaController.getIdeaById);

//path parameters
//	required:
//		id:String (idea)
//body parameters
//	required:
//	optional:
//		name:String
//		background:String
//		solution:String
//		painpoint:String
//		innovator:String (User)
//		consultant:String (User)
//		sector:String
//		deadline:Date
//		hrRequirement:String
//		relatedAssets:[String] (Asset)
//response:
//{idea:IdeaEntity}
router.post('/update/:id',authenticator.authenticate,ideaController.updateIdea);

//path parameters
//	required:
//		id:String (idea)/Use string 'new' instead if createAndPublish
//body parameters
//	required:
//	optional:
//		name:String
//		background:String
//		solution:String
//		painpoint:String
//		innovator:String (User)
//		consultant:String (User)
//		sector:String
//		deadline:Date
//		hrRequirement:String
//		relatedAssets:[String] (Asset)
//response:
//{idea:IdeaEntity}
router.post('/publish/:id',authenticator.authenticate,ideaController.publishIdea);

//query parameters
//	required:
//		id:String (idea)
//	**********INCOMPLETE!*********
//router.get('/delete/:id',authenticator.authenticate,ideaController.deleteIdea);

//query parameters
//	required:
//	optional:
//		pageNum:Number
//		pageSize:Number
//		keyword:String (for name)
//		sector:String
//response:
//{total:TotalNumber,ideas:[IdeaEntities]}
router.get('/list',ideaController.listIdea);


//path parameters
//	required:
// 		id:String (innovator)
//body parameters
//	optional:
//		pageNum:Number
//		pageSize:Number
//		keyword:String (for name)
//		sector:String
//response:
//{total:TotalNumber,ideas:[IdeaEntities]}
router.get('/list/:id',ideaController.listIdeasByInnovator);

module.exports = router;