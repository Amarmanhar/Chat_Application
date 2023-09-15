const Users = require('../models/users');
const jwt = require('jsonwebtoken');

exports.Authenticate = async(req, res, next)=>{
    try{
       
        const token = req.header("Authorization");
        
        if (!token) {
            return res.status(401).json({ message: "Authorization token is missing" });
          }

        const Id = jwt.verify(token, 'secretKey');
        const userId = await Users.findByPk(Id.userId);
        req.user = userId;
        next();

    }catch(err){
        console.log(err);
    }
}