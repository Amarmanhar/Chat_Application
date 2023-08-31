const express = require('express');
const router = express.Router();

const chatMessageConroller = require('../controller/chatMessage');

router.post('/chat', chatMessageConroller.addMessage);

module.exports=router;