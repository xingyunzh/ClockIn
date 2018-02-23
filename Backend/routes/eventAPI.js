var eventController = require('../controllers/eventController');
var authenticator = require('../authenticate/authenticator');
var router = require('express').Router();

// router.post('/add',authenticator.authenticate,eventController.createEvent);
//
// router.get('/id/:id',eventController.getEventById);
//
// router.post('/join/:id',authenticator.authenticate,eventController.joinEvent);
//
// router.post('/update/:id',authenticator.authenticate,eventController.updateEvent);

router.get('/list/:id',authenticator.authenticate,eventController.listById);

module.exports = router;
