import mongoose from "mongoose";

const couponSchema = mongoose.Schema({
    couponCode:{
        type:String,
        unique:true,
        required:true
    },
    couponValue:{
        type:Number,
        default:0
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
        default:0
    },
    minimumOrderAmount:{
        type:Number,
        default:0
    },
    maxUsableLimit:{
        isLimited:{
            type:Boolean,
            default:false,
        },
        limit:{
            type:Number,
            default:0
        }
    },
    perUserLimit:{
        type:Number,
        default:0
    }
})

const couponDB = mongoose.model('coupon',couponSchema);

export default couponDB;