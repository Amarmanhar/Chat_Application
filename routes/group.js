const express = require('express');
const router = express.Router();

const groupController = require('../controller/group');
const AuthController = require('../middleware/auth');

router.get('/get-groups', AuthController.Authenticate, groupController.getGroups );
router.post('/create-group',AuthController.Authenticate, groupController.addGroup);
router.post('/add-members',groupController.addMembersToGroup );
router.get('/get-members/:groupName', groupController.GroupMembers );
router.get('/get-otherMembers/:groupName',groupController.OtherMembers );
router.post('/add-newMembers/:groupName',  AuthController.Authenticate,groupController.isAdmin, 
                               groupController.AddNewMembersToGroup);
                            
router.delete('/remove-Members/:groupName/:removeUserIds', AuthController.Authenticate, groupController.isAdmin, 
                                groupController.removeMembers)
router.put('/make-admin/:groupName', AuthController.Authenticate, groupController.isAdmin, groupController.MakeAdmin);

module.exports = router;