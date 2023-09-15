const Users = require('../models/users');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res)=>{
    try{

    const {name, email, password} = req.body;
    const hashPassword = await bcrypt.hash(password , 10);
    const existingUser = await Users.findOne({where: {email}});

    if(existingUser){
      return  res.status(400).json({err: "Email already exists"});
    }

    const user = await Users.create({name, email, password:hashPassword});
    res.status(200).json(user);

    }catch(err){
        res.status(500).json('internal Server err');
    }
}

exports.generateToken= (id) => {
    return jwt.sign({userId: id}, 'secretKey');
}

const activeUsers = new Set();

exports.login = async(req, res)=>{
    try{
        
        const {email, password} = req.body;
        const user = await Users.findOne({where:{email: email}});

        if (!user) {
            return res.status(400).json("User not found");
          }
      
          const isValidPassword = await bcrypt.compare(password, user.password);
      
          if (!isValidPassword) {
            return res.status(400).json('Email or password is not correct');
          } 
         
          activeUsers.add(user.name);
       
          res.status(200).json({ message: 'Logged in successfully', token: exports.generateToken(user.id)});

    }catch(err){
        console.log(err);
    }
}

exports.LoggedUser = async(req, res)=>{
   try{
      const user = await Users.findOne({where: {id:req.user.id}});
      res.status(200).json({name: user.name});
   }catch(err){
    console.log(err);
   }
}

exports.getUsers = async(req, res)=>{
    try{
        const userId = req.user.id;
         const users = await Users.findAll({
            attributes:['id', 'name'],
            where: {
                id: {
                    [Op.not]: userId // Exclude the user with the given userId
                }
            }
         });
         res.status(200).json(users);
    }catch(err){
        console.log(err);
    }
}
