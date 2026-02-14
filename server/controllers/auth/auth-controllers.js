const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const User=require('../../models/User.js')

//register - to store user into your database
const registerUser=async(req,res)=>{
    const{username,email,password}=req.body;
         
    try{
        const checkUser = await User.findOne({email});
        if(checkUser)
             return res.json({success:false, message:"User already exists with the same email. Please try again"})
        
        const hashPassword = await bcrypt.hash(password, 12)   //salt number=12
        const newUser=new User({
            username,
            email,
            password:hashPassword   //this will create new user
        })

        await newUser.save()  //SAVE NEW USER TO MONGODB
        res.status(200).json({
            success:true,message:"Registration successful"
        })
    }
    catch(e){
        console.log(e);
        res.status(500).json({success:false,message:"Some error occured"})
    }
}

//login
const loginUser=async(req,res)=>{

    const{email,password}=req.body;
    try{
        const checkUser = await User.findOne({email});
        if(!checkUser) return res.json({
            success:false,
            message:"User doesn't exists! Please register first."
        })

        const checkPasswordMatch=await bcrypt.compare(password,checkUser.password)
        if(!checkPasswordMatch) //if it is false means the password we renderd is false
        return res.json({
            success:false,
            message:"Incorrect password! Please try again"
        })

        //if both conditions are correct , then create token
        const token=jwt.sign({
            id:checkUser._id, role:checkUser.role, email:checkUser.email, username: checkUser.username
        },process.env.CLIENT_SECRET_KEY,{expiresIn:'60mins'}) //max should be --15 or 30 min

        res.cookie('token',token,{httpOnly:true,secure:true,sameSite:"None"}).json({
            success:true,message:"Logged In successfully",
            user:{
                email:checkUser.email,
                role:checkUser.role,
                id:checkUser._id,
                username: checkUser.username
            }
        })
        // res.status(200).json({
        //     success:true, message:"Logged in successfully!", token,
        //     user:{
        //         email:checkUser.email,
        //         role:checkUser.role,
        //         id:checkUser._id,
        //         username: checkUser.username
        //     }
        // })
    }
    catch(e){
        console.log(e);
        res.status(500).json({success:false,message:"Some error occured"})
    }
}

//logout

const logoutUser= (req,res)=>{

    res.clearCookie('token',{
            httpOnly: true,
            secure: true,
            sameSite: "None"
            }
    ).json({
        success:true, message:"Logged out successfully"
    })

    // res.json({
    //     success: true,
    //     message: "Logged out successfully"
    // });
}

//auth middleware

const authMiddleware= async(req,res,next)=>{
    const token = req.cookies.token

    if(!token)    //if token is not present -->return 401
        return res.status(401).json({success:false, message:"Unauthorized user!"})
      
    try{
        const decoded=jwt.verify(token,'CLIENT_SECRET_KEY')
        req.user=decoded  //this will return user info -- req.user
        next()
    }catch(error){
        return res.status(401).json({success:false, message:"Unauthorized user!"})
    }
}

// const authMiddleware= async(req,res,next)=>{
//     const authHeader=req.headers['authorization']  //get cookies from header instead of cookies
//     const token=authHeader && authHeader.split(' ')[1]

//     if(!token)    //if token is not present -->return 401
//         return res.status(401).json({success:false, message:"Unauthorized user!"})
      
//     try{
//         const decoded=jwt.verify(token,'CLIENT_SECRET_KEY')
//         req.user=decoded  //this will return user info -- req.user
//         next()
//     }catch(error){
//         return res.status(401).json({success:false, message:"Unauthorized user!"})
//     }
// }


module.exports={registerUser,loginUser,logoutUser,authMiddleware};