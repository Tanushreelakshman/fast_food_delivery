const { Console } = require('console')
const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const User=require('./models/User')
const bcrypt=require('bcryptjs')
const PORT=3000
const app=express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log('DB connected')
).catch(
    (err)=>console.log(err)
)

app.get('/',async(req,res)=>{
    try{
        res.send('wewlcome to the backend')

    }
    catch(err){
        console.log(err)
    }
})

app.post('/Register',async(req,res)=>{
    const {user,email,password}=req.body
    try{
        const hashPassword=await bcrypt.hash(password,10)
        const newUser=new User({user,email,password:hashPassword})
        await newUser.save()
        console.log("New user is registered successfully...")
        res.json({message:'User created....'})

    }
    catch(err){
        console.log(err)
    }
})

app.post('/Login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) 
            {
             return res.status(400).json({ message: "Invalid Credentials" });
            }
          res.json({ message: "Login Successful", username: user.username });
    }
    catch(err)
    {
        console.log(err)
    }
})

app.listen(PORT,(err)=>{
    if(err){
        console.log(err)

    }
    console.log("server i running in the port: "+PORT)
})