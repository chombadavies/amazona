import express from "express"
import User from "../models/userModel";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { getToken, isAuth } from '../util';



const router = express.Router();

router.post('/signup', (req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user =>{
        if(user.length >= 1){
            return res.status(409).json({
        message:'this email is reserved,please use another '
    }) ;
        }else{
            bcrypt.hash(req.body.password,10,(err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    })
                    
                }else{
                    const user = new User({
                    _id :new mongoose.Types.ObjectId,
                    email:req.body.email,
                        password: hash,
                        phonenumber: req.body.phonenumber,
                    name:req.body.name
                    });
                  
                user.save()
                .then(result =>{
                    console.log(result)
                    res.status(201).json({
                        message: 'user created'
                    })
                })
                .catch(err =>{
                    console.log(err)
                    res.status(200).json({
                        error:err
                    });
                });
                }
            });
        }
    });
    });
    
    router.post('/signin',(req,res,next)=>{
        User.find({email:req.body.email})
        .exec()
        .then(user=>{
            if(user.length <1){
                return res.status(401).json({
                    message:'meme'
                })
            }
            bcrypt.compare(req.body.password,user[0].password,(err, result)=>{
                if (err){
                    return res.status(401).json({
                        message:'wrong email or password'
                    }) ;
                }
                
                if (result) {
                    res.send({
                        email:user[0].email, 
                        userId: user[0]._id,
                        name: user[0].name,
                        phonenumber: user[0].phonenumber,
                        isAdmin: user[0].isAdmin,
                        token: getToken(result)
                    });
                
                // if(result){
                //     const token = jwt.sign({
                //         email:user[0].email, 
                //         userId: user[0]._id,
                //         name: user[0].name,
                //         phonenumber: user[0].phonenumber,
                //         isAdmin: user[0].isAdmin,
                //     },config.JWT_SECRET,
                //     {
                //         expiresIn:'1h'
                //     }
                //     )
                    return res.status(200).json({
                        message: 'authentication successful',
                        
                    })
                }
                res.status(401).json({
                    message:'wrong email or password'
                }) ;
            })
        })
        .catch()
    })

module.exports = router;
