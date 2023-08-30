const Message = require('../models/chatMessage');
const Users = require('../models/users');
const jwt = require('jsonwebtoken');

exports.addMessage = async(req, res)=>{
    try{
        const token = req.header("Authorization");
        const Id = jwt.verify(token, 'secretKey');
        const userId = await Users.findByPk(Id.userId);

        const { message } = req.body;
        const newMessage = await Message.create({
            message,
            userId:userId.id
        });
        res.status(200).json(newMessage);
    }catch(err){
        console.log(err);
    }
}