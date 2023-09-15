const express = require('express');
const router = express.Router();
const usersContoller = require('../controller/users');
const AuthController = require('../middleware/auth');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
require('dotenv').config();

const multer = require('multer');

 const storage = multer.memoryStorage(); // Use memory storage
router.post('/signUp', usersContoller.signUp);
router.post('/login', usersContoller.login);
router.get('/get/logged-users', AuthController.Authenticate, usersContoller.LoggedUser);
router.get('/get-users',AuthController.Authenticate, usersContoller.getUsers);

AWS.config.update({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,    
  });
const s3 = new AWS.S3();

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); 
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const multerUpload = multer({ storage: multerStorage });
router.post('/upload-files', multerUpload.single('file'), async(req,res)=>{
    const file = req.file;

    const params = {
        Bucket: 'mychatbkt', 
        Key: file.originalname, 
        Body: file.path, 
        ACL: 'public-read', 
      };
 
    s3.upload(params, (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error uploading file to S3' });
        } 
        const fileUrl = data.Location;
        return res.status(200).json({ url: fileUrl });
      });
});


module.exports = router;