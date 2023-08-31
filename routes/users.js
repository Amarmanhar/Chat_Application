const express = require('express');
const router = express.Router();
const usersContoller = require('../controller/users');

router.post('/signUp', usersContoller.signUp);
router.post('/login', usersContoller.login);
router.get('/active-users', usersContoller.activeUsers);

module.exports = router;