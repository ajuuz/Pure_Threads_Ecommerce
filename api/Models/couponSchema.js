import mongoose from "mongoose";

const couponSchema = mongoose.Schema({
    couponValue:{
        type:Number,
        default:0
    },
    couponType:{
        type:String,
        default:"%"
    },
    maxRedeemable:{
        type:Number,
        default:0
    },
    couponCode:{
        type:String,
        unique:true,
        required:true
    },
    minimumAmount:{
        type:Number,
        default:0
    }
})

const couponDB = mongoose.model('coupon',couponSchema);

export default couponDB;