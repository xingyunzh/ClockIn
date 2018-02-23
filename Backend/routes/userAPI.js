var userController = require('../controllers/userController');
var auth = require('../authenticate/authenticator');
var router = require('express').Router();

router.post('/decryptdata',auth.authenticate,userController.decryptData);

//body parameters
//	required:
//		code:String
//response:
//{user:UserEntity}
router.post('/login/weapp',userController.loginByWeApp);

router.post('/login/weapp/register',userController.registerUserByWeApp);

router.get('/:id',userController.getUserById);

router.post('/update',userController.update);

module.exports = router;
