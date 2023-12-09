import mongoose from 'mongoose'

const userSchema=mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  },
  avatar:{
    type:String,
    default:"https://picsum.photos/id/237/536/354"
  }, 
}, {timestamps:true})

const User=mongoose.model("User", userSchema)

export default User;