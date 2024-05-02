const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();


router.get('/find/:userID', usersController.getUser);
router.post('/friends/addFriend/:userID/:friendID', usersController.userAddFriend);

module.exports = router;
