import User from '../models/user.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'




export const signup=async(req,res,next)=>{
  const {username, email,password}=req.body
  const hashedPassword=bcryptjs.hashSync(password,10)
  const newUser= new User({username,email,password:hashedPassword})
try {
  await newUser.save()

  res.status(200).json("user created successfully")
} catch (error) {
  next(error)
}
}
export const login=async(req,res,next)=>{
try {
  const {email, password}=req.body
const validUser=await User.findOne({email})
if(!validUser) return next(errorHandler(404, "User not found"))

const validPassword= await bcryptjs.compareSync(password, validUser.password)
if(!validPassword) return next(errorHandler(402,"wrong credentials!"))

const token =jwt.sign({id:validUser._id}, process.env.JWT_SECRET)

const {password:pass,...rest}=validUser._doc
res.cookie("access_token", token, {httpOnly:true, expires: new Date(Date.now()+24*60*60*1000)}).status(200).json(rest)
} catch (error) {
  next(error)
}
}

export const google=async(req,res,next)=>{
  try{
   const user= await User.findOne({email:req.body.email})

   if(user){
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
    const {password:pass,...rest}=user._doc

    res
      .cookie("access_token",token,{httpOnly:true})
      .status(200)
      .json(rest)
   }else{
    const generatedPassword=Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

    const hashPassword=bcryptjs.hashSync(generatedPassword,10)
    const newUser=new User({username:req.body.name.split(" ").join("").toLowerCase()+ Math.random().toString(36).slice(-4), email:req.body.email, password:hashPassword, avatar:req.body.photo})

    await newUser.save()

    const token=jwt.sign({id:newUser._id}, process.env.JWT_SECRET)
    console.log(token);
    const {password:pass, ...rest}=newUser._doc

    res
      .cookie("access_token",token,{httpOnly:true})
      .status(200)
      .json(rest)
   }
  }catch(error){
    next(error)
  }


}
export const update= async(req,res,next)=>{
  if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account"))

  try {
    if(req.body.password){
      req.body.password=bcryptjs.hashSync(req.body.password, 10)
    }

    const updateUser= await User.findByIdAndUpdate(req.params.id,{
      $set:{
        username:req.body.username,
        email:req.body.email,
        password: req.body.password,
        avatar: req.body.avatar
      }
    }, {new:true})

    const {password, ...rest}=updateUser._doc
    res
    .status(200)
    .json(rest)
  } catch (error) {
    next(error)
  }

}

export const deleteUser=async(req, res,next)=>{
  if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account"))
  try {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie("access_token")
    res
      .status(200)
      .json("User has been deleted")
  } catch (error) {
    next(error)
  }


}

export const signOut=(req,res,next)=>{
  try {
    res.clearCookie("access_token")

    res.status(200).json("user has been logged out")
  } catch (error) {
    next(error)
  }
}

export const getUser= async(req,res,next)=>{
  try {
    const user =await User.findById(req.params.id)
    if(!user) return next(errorHandler(404, "User not found"))

    const {password:pass, ...rest}=user._doc
    res.status(200).json(rest)
  } catch (error) {
    next(error )
  }
}