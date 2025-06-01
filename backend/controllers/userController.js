import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/User.js"
import bcrypt from 'bcryptjs'

// Sign Up 
const signUp=async(req,res)=>{
    const {fullName , email ,password , bio}=req.body
    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success:false, message:"Missing Details"})
        }
        const user=await User.findOne({email});
        if(user){
            return res.json({success:false , message:"Account already exists"})
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=await User.create({
            fullName,email , password:hashedPassword , bio
        })
        const token=generateToken(newUser._id);
        res.json({success:true,userData:newUser, token, message:"Account created successfully"})
    } catch (error) {
        console.log("Error in Signing Up", error.message)
        res.json({success:false, message:error.message})

    }
}

// Login Function
const login=async(req,res)=>{
    try {
        const {email,password}=req.body
        const userData=await User.findOne({email});
        if(!userData){
            return res.json({success:false , message:"No user with this email found"})
        }
        const isPasswordCorrect=await bcrypt.compare(password,userData.password)
        if(!isPasswordCorrect){
            return res.json({success:false , message:"Invalid Credentials"})
        }
        const token=generateToken(userData._id);
        res.json({success:true,userData, token, message:" Login successfully"})
    } catch (error) {
        console.log("Error in Logining ", error.message)
        res.json({success:false, message:error.message})

    }
}

// Controller to check if user is authenticated or not
const checkAuth=(req,res)=>{
    res.json({success:true, user:req.user})
}

// Controller to update user profile details
const updateProfile=async(req,res)=>{
    try {
        const {profilePic,fullName,bio}=req.body;
        const userId=req.user._id
        let updatedUser;
        if(!profilePic){
            updatedUser=await User.findByIdAndUpdate(userId,{bio,fullName},{new:true})
        }
        else{
            const upload=await cloudinary.uploader.upload(profilePic);
            updatedUser=await User.findByIdAndUpdate(userId,{profilePic : upload.secure_url , bio,fullName},{new:true})

        }
        res.json({success:true, user:updatedUser})
    } catch (error) {
        console.log("Error in updating user profile" , error.message)
        res.json({success:false, message:error.message})
        
    }
}
export {signUp,login,checkAuth,updateProfile}