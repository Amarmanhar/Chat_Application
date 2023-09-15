const { Op } = require('sequelize');
const Message = require('../models/chatMessage');
const Users = require('../models/users');
const Group = require('../models/groups');


exports.addMessage = async(req, res)=>{
    try{

        const { message , groupName} = req.body.data;
        const group = await Group.findOne({ where: {group_name: groupName}});
        const newMessage = await Message.create({
            message,
            userId:req.user.id,
            groupId:group.id,
        });
        res.status(200).json(newMessage);
    }catch(err){
        console.log(err);
    }
}

exports.getMessages = async(req,res)=>{
     
    try{    
        
        const groupName = req.params.groupName;
        const  group = await Group.findOne({where: {group_name:groupName }})

          const  messages = await Message.findAll({
                where: { groupId:group.id },
                include: [{ model: Users, attributes: ['name'] },
                { model: Group, attributes: ['group_name'] }
            ],
                order: [['createdAt', 'ASC']],
            });
            
            const simplifiedMessages = messages.map((message) => ({
                groupName:message.group.group_name,
                name: message.user.name,
                message: message.message,
            }));
            console.log(simplifiedMessages)
            console.log('all messages are sent');
            res.status(200).json(simplifiedMessages);
     
    }catch(err){
        console.log(err);
    }
}