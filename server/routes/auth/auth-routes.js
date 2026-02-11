const express=require('express');
const { registerUser ,loginUser,logoutUser,authMiddleware} = require('../../controllers/auth/auth-controllers.js');


const router=express.Router();  //create router interface

router.post('/register',registerUser)  //with post API call with 'register' route we are calling registerUser controller
router.post('/login',loginUser)
router.post('/logout',logoutUser)
router.get('/check-auth',authMiddleware, (req,res)=>{
    const user=req.user;
    res.status(200).json({
        success:true, message: "Authenticated user!",
        user, //user we passed in loginUSer
    })
})

module.exports =router