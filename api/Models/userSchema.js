import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true,
    unique:true
   },
   phone:{
    type:Number,
   },
   password:{
    type:String,
   },
   isActive:{
    type:Boolean,
    required:true,
    default:true,
   },
   usedCoupons:[
    {
      couponCode:{type:String,},
      usedCount:{type:Number}
    }
    ]
})

const UsersDB = mongoose.model('user',userSchema);

export default UsersDB;