const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require("./UserModel");
const jwt = require('jsonwebtoken');

function isAuthenticated(req,res,next) {
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,'secret',(err,user) => {
            if(!user) return res.json({message:'User not authenticated'});
            else next();
        });
    }
}

router.get('/protected', isAuthenticated, async(req,res) => {
    return res.json({message:'this is a protected route'});
});

router.post('/login', async (req,res) => {
    const {mail, password} = req.body.data;
    if(!mail || !password) return res.json({message: "Invalid Credentials"});
    const user = await UserModel.findOne({ mail: mail});
    if(user){
        if(await bcrypt.compare(password,user.password)){
            const payload =  {mail};
            jwt.sign(payload,"secret",{expiresIn:"1d"}, (err,token) => {
                if (err) console.log(err);
                else{
                    return res.json({
                        message: "User Logged In!",
                        token:token
                    });
                }
            });
        }else{
            return res.json({message: "Incorrect Password"});
        }
    }else{
        return res.json({message:"Incorrect Credentials"});
    }
});

router.post('/signup', async (req,res) => {
    const { mail, password, confirmPassword } = req.body.data;
    if(!mail || !password) return res.json({message: "Invalid Credentials"});
    if(password !== confirmPassword) return res.json({message: "Password Mismatch"});
    const userExists = await UserModel.findOne({ mail: mail});
    if(userExists)
        return res.json({message:"User already exists"});
    else{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new UserModel({
            mail: mail,
            password: hashedPassword});
        newUser
            .save()
            .then(userData => {
                return res.json({message:"User created", userData});
            })
            .catch(err => {
                return res.json({message:err});
            })
    }
});



module.exports = router;
