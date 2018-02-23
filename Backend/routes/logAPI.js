var logController = require('../controllers/logController');
var authenticator = require('../authenticate/authenticator');
var router = require('express').Router();

// router.post('/add',authenticator.authenticate,logController.add);

module.exports = router;
