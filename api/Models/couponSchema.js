import mongoose from "mongoose";

const couponSchema = mongoose.Schema({
    couponCode:{
        type:String,
        unique:true,
        required:true
    },
    couponValue:{
        type:Number,
        default:0,
        min:[0,"coupon Value cannot be negative"]
    },
    couponType:{
        type:String,
        default:"%"
    },
    description:{
        type:String,
    },
    maxRedeemable:{
        type:Number,
        default:0,
        min:[0,"max Redeemable cannot be negative"]
    },
    minimumOrderAmount:{
        type:Number,
        default:0,
        min:[0,"minimum order amount cannot be negative"]
    },
    maxUsableLimit:{
        isLimited:{
            type:Boolean,
            default:false,
        },
        limit:{
            type:Number,
            default:0,
            min:[0,"Limit cannot be negative"]
        }
    },
    perUserLimit:{
        type:Number,
        default:0,
        min:[0,"per User Limit cannot be negative"]
    }
})

const couponDB = mongoose.model('coupon',couponSchema);

export default couponDB;