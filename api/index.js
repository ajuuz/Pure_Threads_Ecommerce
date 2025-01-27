import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose';

import express from 'express'
const app=express();

import cors from 'cors';
import cookieParser from "cookie-parser"

import UserRouter from './Routes/userRouter.js'
import AdminRouter from './Routes/adminRouter.js'

// Enabling cors for all routes
app.use(cors({
    origin: ["http://localhost:5173", "http://purethreads.webhop.me"],
    credentials: true,
}));


app.use(cookieParser())


// configuring the port
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log("server is running"));

// configuring mongodb databade
mongoose.connect(process.env.mongo_URI)
.then(()=>console.log("mongodb connected"))
.catch((error)=>console.log(error))


// to parse the data coming from the url
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api/users',UserRouter);
app.use('/api/admin',AdminRouter);


app.use((err,req,res,next)=>{
    const statusCode = err.statusCode||500;
    const message = err.message||'Internal Server Error';
    return res.status(statusCode).json({success:false,message})
})


