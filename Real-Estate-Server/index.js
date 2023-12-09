import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import auth from './routes/auth.js'
import listing from './routes/listing.js'
import cookieParser from 'cookie-parser'
import path from 'path'


dotenv.config()
mongoose.connect(process.env.MONGO).then(()=>{
  console.log("connection was successful");
}).catch(err=>console.log(err))
const app=express(); 

const __dirname=path.resolve()

app.use(express.json())
app.use(cookieParser())
app.use("/api/user", auth)
app.use("/api/listing", listing)
app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname, 'client','dist', 'index.html'))
})


app.use((err,req,res,next)=>{
  const statusCode=err.statuscode || 500
  const message=err.message || "Internal Server Error"
  return res.status(statusCode).json({
    success:false,
    message,
    statusCode
  })
})




app.listen(5000,()=>{
  console.log("server started at port 5000...");
})