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
    ],
    refferalCode:{
      type: String,
      unique: true,
      default: function () {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const randomCode = Array(8) // Generates an array of 8 random characters
          .fill(null)
          .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
          .join("");
        return `${randomCode}`.toUpperCase();
      },
    },
    refferalDetails:{
      isRefferedUser:{type:Boolean,default:false},
      friendName:{type:String,default:null},
      friendId:{type:mongoose.Schema.ObjectId,default:null}
    }
})

const UsersDB = mongoose.model('user',userSchema);

export default UsersDB;