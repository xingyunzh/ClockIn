var ledgerController = require('../controllers/ledgerController');
var authenticator = require('../authenticate/authenticator');
var router = require('express').Router();

router.post('/add',authenticator.authenticate,ledgerController.add);

module.exports = router;
