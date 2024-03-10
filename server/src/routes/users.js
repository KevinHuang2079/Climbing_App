const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();


router.get('/find/:userID', usersController.getUser);

module.exports = router;
