const express = require('express');
const router = express.Router();

const chatMessageConroller = require('../controller/chatMessage');
const AuthController = require('../middleware/auth');

router.post('/chat',AuthController.Authenticate, chatMessageConroller.addMessage);
router.get('/get-chats/:groupName',chatMessageConroller.getMessages );

module.exports=router;