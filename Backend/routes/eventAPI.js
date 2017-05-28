var eventController = require('../controllers/eventController');
var authenticator = require('../authenticate/authenticator');
var router = require('express').Router();

router.post('/add',authenticator.authenticate,eventController.createEvent);

router.get('/id/:id',eventController.getEventById);

router.get('/in/:id',authenticator.authenticate,eventController.clockIn);

router.post('/join/:id',authenticator.authenticate,eventController.joinEvent);

router.post('/update/:id',authenticator.authenticate,eventController.updateEvent);

router.get('/list',authenticator.authenticate,eventController.listEventsByUser);

module.exports = router;
