const Group = require('../models/groups');
const Users  = require('../models/users') ;
const GroupMembers = require('../models/groupMembers');
const { Op } = require('sequelize');

exports.addGroup = async(req, res)=>{
   
    const {groupName } = req.body;
    try{
      
        const group = await Group.create({group_name: groupName});
        const userId = req.user.id;
        await GroupMembers.create({ groupId: group.id, userId, isAdmin: true });
        res.status(201).json({ message: 'Group created successfully',group });

    }catch(err){
        console.log(err);
    }

}

exports.getGroups = async(req, res)=>{
     try{
      
        const user = req.user;
       const groups = await user.getGroups();
       res.status(200).json(groups);
     }catch(err){
        console.log(err);
     }
}

exports.addMembersToGroup= async(req, res)=>{
     try{
        
      const { groupId, selectedUserIds } = req.body;
            for (const userId of selectedUserIds) {
               await GroupMembers.create({ groupId, userId });
         }
        res.status(200).json({ message: 'Users added to the group successfully.' });
     }catch(err){
        console.log(err);
     }
}

exports.GroupMembers = async(req, res)=>{

   const{groupName} = req.params;

   try{ 
         const group = await Group.findOne({where:{group_name:groupName}})
          const groupMembers= await GroupMembers.findAll({
            where:{
                groupId:group.id
            },
            include:[
               {
                     model: Users,
                     attributes: ['id', 'name'],
               }
            ]
          });

          res.status(200).json(groupMembers);

   }catch(err){
      console.log(err);   }
}

exports.OtherMembers = async(req, res)=>{
   const {groupName} = req.params;
   try{
      const group = await Group.findOne({where:{group_name:groupName}});

      const memberIds = await GroupMembers.findAll({
         where: {
             groupId: group.id,
         },
         attributes: ['userId'],
     });

     const memberUserIds = memberIds.map((member) => member.userId);

      const otherMembers = await Users.findAll({
         where: {
            id: {
                [Op.notIn]: memberUserIds,
            },
        },
      })
      res.status(200).json(otherMembers);
   }catch(err){
      console.log(err);
   }
}

exports.isAdmin = async(req, res, next)=>{
   try{
       
      const gropName = req.params.groupName;
      const group = await Group.findOne({where:{group_name:gropName}});
      const admin = await GroupMembers.findOne({
         where:{
            groupId : group.id ,  userId  : req.user.id, isAdmin:true
         }
      })

      if(!admin){
         res.status(403).json({mesage: 'only admin can perform this action'});
      }
     next();
   }catch(err){
      console.log(err);
   }
}
exports.AddNewMembersToGroup= async(req, res)=>{
      
   try{
      const gropName = req.params.groupName;
      const {newMembersIds}= req.body;
      const group = await Group.findOne({where:{group_name: gropName }});

       for (const userId of newMembersIds) {
         await GroupMembers.create({ groupId:group.id, userId });
    }
   res.status(200).json({ message: 'Users added to the group successfully.' });

   }catch(err){
      console.log(err);
   }

}

exports.removeMembers = async(req, res)=>{
   try {
      const groupName = req.params.groupName;
      const removeUserIds = req.params.removeUserIds.split(',');
      const group = await Group.findOne({where:{group_name:groupName}})
      await GroupMembers.destroy({
         where: {
            groupId: group.id,
            id: {
               [Op.in]: removeUserIds,
            },
         },
      });

      res.status(200).json({ message: 'Members removed successfully.' });
   } catch (err) {
      console.log(err);
      // Handle errors appropriately
   }
}

exports.MakeAdmin = async(req, res)=>{
   try{
      const adminIds = req.body.adminUserIds; 
         await GroupMembers.update({isAdmin:true}, {
            where:{
               id:{
                  [Op.in] :adminIds
               }
            }
         })

         res.status(200).json({message:'promoted to admin succesfully'})
   }catch(err){
      console.log(err);
   }
}